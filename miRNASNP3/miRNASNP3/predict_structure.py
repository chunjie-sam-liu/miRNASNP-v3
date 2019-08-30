from miRNASNP3 import app, api
import os,re
import subprocess
import string
import tempfile
import shlex
from flask_restful import Resource, fields, marshal_with, reqparse, marshal
import multiprocessing

def get_tempfile_name():
    temp = tempfile.NamedTemporaryFile()
    temp.close()
    return temp.name

def rnafold_format(seq,seq_prefix,rnafold_fasta):
    temp_file=open(rnafold_fasta,"a")
    temp_file.write('>'+seq_prefix+'\n')
    temp_file.write(seq+'\n')

def result_parser_wild(rnafold_result):
    temp_id=0
    result_list=[]
    with open(rnafold_result) as infile:
        line=infile.readline()
        while line:
            temp={}
            if line.startswith('>'):
                temp_id+=1
                temp['query']=line.strip()[1:]
                temp['seq']=infile.readline().strip()
                infoline=infile.readline().strip()
                temp['dotfold']=infoline.split()[0]
                t=re.findall(r'(\(.*?\))',infoline)
                temp['mfe']=re.split(r'\(|\)',t[-1])[1]
                result_list.append(temp)
                temp={}
            line=infile.readline()
    return result_list

def predict_structure_wild(seq,seq_prefix):
    seq_fold_file=get_tempfile_name()
    seq_fold_result=get_tempfile_name()
    rnafold_format(seq,seq_prefix,seq_fold_file)
    cmd_rnafold="/home/fux/tools/ViennaRNA-2.4.13/src/bin/RNAfold <"+seq_fold_file+">"+seq_fold_result
    os.popen(cmd_rnafold)
    result_list=result_parser_wild(seq_fold_result)
    print(result_list)
    return result_list

def result_parser_alt(rnafold_result):
    temp_id=0
    result_list=[]
    with open(rnafold_result) as infile:
        line=infile.readline()
        while line:
            temp={}
            if line.startswith('>'):
                temp_id+=1
                temp['query']=line.strip()[1:]
                end_point=len(temp['query'])-1
                temp['position']=int(temp['query'][1:end_point])
                temp['seq']=infile.readline().strip()
                infoline=infile.readline().strip()
                temp['dotfold']=infoline.split()[0]
                t=re.findall(r'(\(.*?\))',infoline)
                temp['mfe']=re.split(r'\(|\)',t[-1])[1]
                result_list.append(temp)
                temp={}
            line=infile.readline()
    return result_list

def predict_structure_alt(snps,seq):
    snp_list=snps.split('\n')
    result_list=[]
    for s in snp_list:
        print(s)
        ref=s[0]
        alt=s[-1]
        end_point=int(len(s)-1)
        position=int(s[1:end_point])-1
        print("position:"+s[1:end_point])
        curseq=list(seq)
        if curseq[position]==ref:
            curseq[position]=alt
            newseq=''.join(curseq)
        else:
            return -1  
        seq_fold_file=get_tempfile_name()
        seq_fold_result=get_tempfile_name()
        rnafold_format(newseq,s,seq_fold_file)
        cmd_rnafold="/home/fux/tools/ViennaRNA-2.4.13/src/bin/RNAfold <"+seq_fold_file+">"+seq_fold_result
        os.popen(cmd_rnafold)
        result_list=result_list+result_parser_alt(seq_fold_result)
    print(result_list)
    return result_list

class PredictionStructure(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('wild_seq')
        parser.add_argument('snps')
        parser.add_argument('wild_prefix')
        args = parser.parse_args()
        wild_seq = args['wild_seq']
        snps=args['snps'].replace('|||','\n')
        print("snps:"+snps)
        if args['wild_prefix']:
            wild_prefix=args['wild_prefix']
        else:
            wild_prefix='wildseq'
        if wild_seq and snps:
            result_wild=predict_structure_wild(wild_seq,wild_prefix)
            result_alt=predict_structure_alt(snps,wild_seq)
        elif wild_seq:
            result_wild = predict_structure_wild(wild_seq,wild_prefix)
            result_alt = []
        else:
            result={}
        result={'result_wild':result_wild,'result_alt':result_alt}
        return {'result_structure':result}
    
api.add_resource(PredictionStructure,'/api/prediction_structure')

from miRNASNP3 import app, api
import os
import subprocess
import string
import tempfile
import shlex
from flask_restful import Resource, fields, marshal_with, reqparse, marshal
import multiprocessing

import sys
sys.path.append('/home/fux/tools/miRmap-1.1/src')


import mirmap

#altutr prediction

def get_tempfile_name():
    temp = tempfile.NamedTemporaryFile()
    temp.close()
    return temp.name

def target_scan_format(seq, file_name, prefix):
    seq = prefix+"	"+'9606'+"	"+ seq
    temp_file = open(file_name, 'w')
    temp_file.write(seq)

def command_excute(command):
    args = shlex.split(command)
    #subprocess.check_call(args)
    with open(os.devnull, 'w') as devnull:
        subprocess.check_call(args, stdout=devnull, stderr=devnull)

def targetscan_predict(seq_file,result_file):
    print("tgs predict...")
    t_mirna_file = "/home/fux/refdata/miRNASNP3/mir_2652.tgs.txt"
    command = "/home/fux/tools/TargetScan/targetscan_70.pl {t_mirna_file} {t_fasta_file} {result_file}".format(t_mirna_file=t_mirna_file, t_fasta_file = seq_file, result_file = result_file)
    command_excute(command)
    

def mirmap_predict(tarseq,result_file):
    print("mirmap predict ...")
    conmand="python2 /home/fux/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/scr/run_mirmap_altutr.py {tarseq} {result_file}".format(tarseq=tarseq,result_file=result_file)
    command_excute(conmand)
    

def result_parser(wm_result,wt_result,sm_result,st_result):
    print("result parser ...")
    wm_mir_list=[]
    wm_bed_file=get_tempfile_name() #c
    wm_bed_json={}
    print("wm tables...")
    with open(wm_bed_file,"a") as wm_bed:
        with open(wm_result) as infile:
            line = infile.readline()
            item = {}
            while line:
                if line.startswith(">"):
                    mir_info=line.strip()[1:]
                    site_count = 0
               #    out.write(line)
                else:
                    #print(wm_bed_json)
                    site_count+=1
                    item['mir_info']=mir_info
                    line01 = infile.readline().strip()
                    line02 = infile.readline().strip()
                    line03 = infile.readline().strip()
                    line04 = infile.readline().strip()
                    line05 = infile.readline().strip()
                    line06 = infile.readline().strip()
                    line07 = infile.readline().strip()
                    line08 = infile.readline().strip()
                    line09 = infile.readline().strip()
                    line10 = infile.readline().strip()
                    line11 = infile.readline().strip()
                    line12 = infile.readline().strip()
                    item['site_count'] =site_count
                    item['site_end'] = line.split()[1]
                    item['seed_length'] = len(line03)-1
                    item['site_start']=str(int(item['site_end'])-int(item['seed_length']))
                    item['dg_duplex'] = line05.split()[3]
                    item['dg_binding'] = line06.split()[3]
                    item['dg_open']= line07.split()[3]
                    item['tgs_au'] = line08.split()[2]
                    item['tgs_position'] = line09.split()[2]
                    item['tgs_pairing3p'] = line10.split()[2]
                    item['tgs_score'] = line11.split()[2]
                    item['prob_exac'] = line12.split()[2]
                    item['align1'] = line.strip()
                    item['align2']=line01
                    item['align3']=line02
                    item['align4']=' '*(len(line01)-len(line03))+line03
                    item['align5']=' '*(len(line01)-len(line04))+line04
                    item['align6']="5' "+line02
                    item['align7']=' '*9+' '*(len(line01)-len(line03))+line03
                    item['align8']="3' "+' '*(len(line01)-len(line04))+line04
                    #site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                    wm_mir_list.append(item['mir_info'])
                    bed_line=item['mir_info']+'\t'+item['site_start']+'\t'+item['site_end']
                    lkey=item['mir_info']+'#'+item['site_start']+'#'+item['site_end']
                    wm_bed_json[lkey]=item #when item change,all values of wm_bed_json changed
                    item={}
                    #print("wm_bed_line:"+bed_line) wm_bed_json[lkey]=item--> set all values of the dict to item, why?
                    wm_bed.write(bed_line+'\n')
                line=infile.readline()
            
    #gettable
    #gene/mir list
    #bed file
    
    wm_bed_sort=get_tempfile_name()
    sort_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools sort -i "+wm_bed_file+" >"+wm_bed_sort
    os.popen(sort_cmd)
    os.remove(wm_bed_file)

    print("wt format ...")
    wt_mir_list=[]
    wt_bed_file=get_tempfile_name() #c
    with open(wt_bed_file,"a") as wt_bed:
        with open(wt_result) as infile:
            head=infile.readline()
            for line in infile:
                nline=line.strip().split()
                wt_mir_list.append(nline[1])
                #print("wt_bed_line:"+bed_line)
                bed_line=nline[1]+'\t'+nline[3]+'\t'+nline[4]
                wt_bed.write(bed_line+'\n')
    #gene_mir_list
    #bed file
    wt_bed_sort=get_tempfile_name()
    sort_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools sort -i "+wt_bed_file+" >"+wt_bed_sort
    os.popen(sort_cmd)
    os.remove(wt_bed_file)

    print("w_instersect ...")


    w_insect_file=get_tempfile_name()
    insec_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools intersect -sorted -f 0.5 -a "+wm_bed_sort+" -b "+wt_bed_sort+" -u >"+w_insect_file
    #print(insec_cmd)
    os.popen(insec_cmd)
    
    print("sm format ...")

    sm_mir_list=[]
    sm_bed_file=get_tempfile_name()
    sm_bed_json={}
    with open(sm_bed_file,"a") as sm_bed:
        with open(sm_result) as infile:
            line = infile.readline()
            item = {}
            while line:
                if line.startswith(">"):
                    mir_info=line.strip()[1:]
                    site_count = 0
               #    out.write(line)
                else:
                    site_count +=1
                    item['mir_info']=mir_info
                    line01 = infile.readline().strip()
                    line02 = infile.readline().strip()
                    line03 = infile.readline().strip()
                    line04 = infile.readline().strip()
                    line05 = infile.readline().strip()
                    line06 = infile.readline().strip()
                    line07 = infile.readline().strip()
                    line08 = infile.readline().strip()
                    line09 = infile.readline().strip()
                    line10 = infile.readline().strip()
                    line11 = infile.readline().strip()
                    line12 = infile.readline().strip()
                    item['site_count'] =site_count
                    item['site_end'] = line.split()[1]
                    item['seed_length'] = len(line03)-1
                    item['site_start']=str(int(item['site_end'])-int(item['seed_length']))
                    item['dg_duplex'] = line05.split()[3]
                    item['dg_binding'] = line06.split()[3]
                    item['dg_open']= line07.split()[3]
                    item['tgs_au'] = line08.split()[2]
                    item['tgs_position'] = line09.split()[2]
                    item['tgs_pairing3p'] = line10.split()[2]
                    item['tgs_score'] = line11.split()[2]
                    item['prob_exac'] = line12.split()[2]
                    item['align1'] = line.strip()
                    item['align2']=line01
                    item['align3']=line02
                    item['align4']=' '*(len(line01)-len(line03))+line03
                    item['align5']=' '*(len(line01)-len(line04))+line04
                    item['align6']="5' "+line02
                    item['align7']=' '*9+' '*(len(line01)-len(line03))+line03
                    item['align8']="3' "+' '*(len(line01)-len(line04))+line04
                    #site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                    sm_mir_list.append(item['mir_info'])
                    bed_line=item['mir_info']+'\t'+item['site_start']+'\t'+item['site_end']
                    lkey=item['mir_info']+'#'+item['site_start']+'#'+item['site_end']
                    sm_bed_json[lkey]=item
                    item={}
                    sm_bed.write(bed_line+'\n')
                line=infile.readline()
    #gettable
    #gene/mir list
    #bed file
    sm_bed_sort=get_tempfile_name()
    sort_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools sort -i "+sm_bed_file+" >"+sm_bed_sort
    os.popen(sort_cmd)
    os.remove(sm_bed_file)

    print("st format ...")
    st_mir_list=[]
    st_bed_file=get_tempfile_name()
    with open(st_bed_file,"a") as st_bed:
        with open(st_result) as infile:
            head=infile.readline()
            for line in infile:
                nline=line.strip().split()
                st_mir_list.append(nline[1])
                bed_line=nline[1]+'\t'+nline[3]+'\t'+nline[4]
                st_bed.write(bed_line+'\n')
    #gene_mir_list
    #bed file
    st_bed_sort=get_tempfile_name()
    sort_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools sort -i "+st_bed_file+" >"+st_bed_sort
    os.popen(sort_cmd)
    os.remove(st_bed_file)

    print("s intersect ...")
    s_insect_file=get_tempfile_name()
    insec_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools intersect -sorted -f 0.5 -a "+sm_bed_sort+" -b "+st_bed_sort+" -u >"+s_insect_file
    os.popen(insec_cmd)

    print("unin tar ...")
    w_unin=list(set(wm_mir_list).union(set(wt_mir_list)))
    s_unin=list(set(sm_mir_list).union(set(st_mir_list)))

    print("caculate loss ...")
    loss=[]
    wild_result=[]
    with open(w_insect_file) as infile:
        for line in infile:
            nline=line.strip().split()
            if nline[0] not in s_unin:
                loss.append(wm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
            wild_result.append(wm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
    
    print("caculate gain ...")
    gain=[]
    alt_result=[]
    with open(s_insect_file) as infile:
        for line in infile:
            #print(line)
            nline=line.strip().split()
            if nline[0] not in w_unin:
                gain.append(sm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
            alt_result.append(sm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
    result={'loss':loss,'gain':gain,'wild_result':wild_result,'alt_result':alt_result}
    os.remove(wm_bed_sort)
    os.remove(wt_bed_sort)
    os.remove(sm_bed_sort)
    os.remove(st_bed_sort)
    os.remove(s_insect_file)
    os.remove(w_insect_file)
    return result

def predict_start(wild_seq, wild_prefix,alt_seq,alt_prefix):
    wild_tgs_file = get_tempfile_name()
    alt_tgs_file = get_tempfile_name()
    target_scan_format(wild_seq, wild_tgs_file, wild_prefix)
    target_scan_format(alt_seq,alt_tgs_file,alt_prefix)
    wm_result = get_tempfile_name()
    wt_result = get_tempfile_name()
    sm_result = get_tempfile_name()
    st_result = get_tempfile_name()
    pool = multiprocessing.Pool(processes=20)
    pool.apply_async(targetscan_predict, (wild_tgs_file, wt_result, ))
    pool.apply_async(mirmap_predict, (wild_seq, wm_result, ))
    pool.apply_async(targetscan_predict, (alt_tgs_file, st_result, ))
    pool.apply_async(mirmap_predict, (alt_seq, sm_result, ))
    pool.close()
    pool.join()
    os.remove(wild_tgs_file)
    os.remove(alt_tgs_file)
    result = result_parser(wm_result, wt_result, sm_result, st_result)
    return result

def wild_result_parser(wm_result,wt_result):
    print("result parser ...")
    wm_mir_list=[]
    wm_bed_file=get_tempfile_name() #c
    wm_bed_json={}
    print("wm tables...")
    with open(wm_bed_file,"a") as wm_bed:
        with open(wm_result) as infile:
            line = infile.readline()
            item = {}
            while line:
                if line.startswith(">"):
                    mir_info=line.strip()[1:]
                    site_count = 0
               #    out.write(line)
                else:
                    #print(wm_bed_json)
                    site_count+=1
                    item['mir_info']=mir_info
                    line01 = infile.readline().strip()
                    line02 = infile.readline().strip()
                    line03 = infile.readline().strip()
                    line04 = infile.readline().strip()
                    line05 = infile.readline().strip()
                    line06 = infile.readline().strip()
                    line07 = infile.readline().strip()
                    line08 = infile.readline().strip()
                    line09 = infile.readline().strip()
                    line10 = infile.readline().strip()
                    line11 = infile.readline().strip()
                    line12 = infile.readline().strip()
                    item['site_count'] =site_count
                    item['site_end'] = line.split()[1]
                    item['seed_length'] = len(line03)-1
                    item['site_start']=str(int(item['site_end'])-int(item['seed_length']))
                    item['dg_duplex'] = line05.split()[3]
                    item['dg_binding'] = line06.split()[3]
                    item['dg_open']= line07.split()[3]
                    item['tgs_au'] = line08.split()[2]
                    item['tgs_position'] = line09.split()[2]
                    item['tgs_pairing3p'] = line10.split()[2]
                    item['tgs_score'] = line11.split()[2]
                    item['prob_exac'] = line12.split()[2]
                    item['align1'] = line.strip()
                    item['align2']=line01
                    item['align3']=line02
                    item['align4']=' '*(len(line01)-len(line03))+line03
                    item['align5']=' '*(len(line01)-len(line04))+line04
                    item['align6']="5' "+line02
                    item['align7']=' '*9+' '*(len(line01)-len(line03))+line03
                    item['align8']="3' "+' '*(len(line01)-len(line04))+line04
                    #site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                    wm_mir_list.append(item['mir_info'])
                    bed_line=item['mir_info']+'\t'+item['site_start']+'\t'+item['site_end']
                    lkey=item['mir_info']+'#'+item['site_start']+'#'+item['site_end']
                    wm_bed_json[lkey]=item #when item change,all values of wm_bed_json changed
                    item={}
                    #print("wm_bed_line:"+bed_line) wm_bed_json[lkey]=item--> set all values of the dict to item, why?
                    wm_bed.write(bed_line+'\n')
                line=infile.readline()
            
    #gettable
    #gene/mir list
    #bed file
    
    wm_bed_sort=get_tempfile_name()
    sort_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools sort -i "+wm_bed_file+" >"+wm_bed_sort
    os.popen(sort_cmd)
    os.remove(wm_bed_file)

    print("wt format ...")
    wt_mir_list=[]
    wt_bed_file=get_tempfile_name() #c
    with open(wt_bed_file,"a") as wt_bed:
        with open(wt_result) as infile:
            head=infile.readline()
            for line in infile:
                nline=line.strip().split()
                wt_mir_list.append(nline[1])
                #print("wt_bed_line:"+bed_line)
                bed_line=nline[1]+'\t'+nline[3]+'\t'+nline[4]
                wt_bed.write(bed_line+'\n')
    #gene_mir_list
    #bed file
    wt_bed_sort=get_tempfile_name()
    sort_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools sort -i "+wt_bed_file+" >"+wt_bed_sort
    os.popen(sort_cmd)
    os.remove(wt_bed_file)

    print("w_instersect ...")


    w_insect_file=get_tempfile_name()
    insec_cmd="/home/fux/tools/bedtools/bedtools2-2.25.0/bin/bedtools intersect -sorted -f 0.5 -a "+wm_bed_sort+" -b "+wt_bed_sort+" -u >"+w_insect_file
    #print(insec_cmd)
    os.popen(insec_cmd)

    wild_result=[]
    with open(w_insect_file) as infile:
        for line in infile:
            nline=line.strip().split()
            wild_result.append(wm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
    result={'wild_result':wild_result,'alt_result':[]}
    os.remove(wm_bed_sort)
    os.remove(wt_bed_sort)
    os.remove(w_insect_file)
    return result

def predict_wild(wild_seq, wild_prefix):
    wild_tgs_file = get_tempfile_name()
    target_scan_format(wild_seq, wild_tgs_file, wild_prefix)
    wm_result = get_tempfile_name()
    wt_result = get_tempfile_name()
    pool = multiprocessing.Pool(processes=3)
    pool.apply_async(targetscan_predict, (wild_tgs_file, wt_result, ))
    pool.apply_async(mirmap_predict, (wild_seq, wm_result, ))
    pool.close()
    pool.join()
    os.remove(wild_tgs_file)
    result = wild_result_parser(wm_result, wt_result)
    return result

class PredictionAltutr(Resource):
    def post(self):
        wild_result = []
        snp_target = []
        gain = []
        loss = []
        effect_result = []
        parser = reqparse.RequestParser()
        parser.add_argument('wild_seq')
        parser.add_argument('alt_seq')
        parser.add_argument('wild_prefix')
        parser.add_argument('alt_prefix')
        args = parser.parse_args()
        wild_seq = args['wild_seq']
        alt_seq = args['alt_seq']
        if args['wild_prefix']:
            wild_prefix=args['wild_prefix']
        else:
            wild_prefix='wildseq'
        if args['alt_prefix']:
            alt_prefix=args['alt_prefix']
        else:
            alt_prefix='altseq'
        if wild_seq and alt_seq:
            result = predict_start(wild_seq,wild_prefix,alt_seq,alt_prefix)
        elif wild_seq:
            result=predict_wild(wild_seq,wild_prefix)
            
        return {'result_altutr':result}

api.add_resource(PredictionAltutr, '/api/prediction')

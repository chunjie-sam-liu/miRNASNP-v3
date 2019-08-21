from miRNASNP3 import app, api
import os,re
import subprocess
import string
import tempfile
import shlex
from flask_restful import Resource, fields, marshal_with, reqparse, marshal
import multiprocessing
import mirmap

#altutr prediction

def get_tempfile_name():
    temp = tempfile.NamedTemporaryFile()
    temp.close()
    return temp.name

def target_scan_format(seq, file_name, prefix):
    seq = prefix+"\t"+seq[1:8]+"\t9606"
    temp_file = open(file_name, 'w')
    temp_file.write(seq)

def command_excute(command):
    args = shlex.split(command)
    #subprocess.check_call(args)
    with open(os.devnull, 'w') as devnull:
        subprocess.check_call(args, stdout=devnull, stderr=devnull)

def targetscan_predict(seq_file,result_file):
    print("tgs predict...")
    t_utr_file = "/home/fux/pro-fu/db-mir-snp/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/local_file/total_grch38_over6.autosome.longest.tgs.txt"
    command = "/home/fux/pro-fu/db-mir-snp/TargetScan/targetscan_70.pl {t_querymir_file} {t_utr_file} {result_file}".format(t_querymir_file=seq_file, t_utr_file = t_utr_file, result_file = result_file)
    command_excute(command)
    

def mirmap_predict(mirseq,result_file):
    print("mirmap predict ...")
    conmand="python2 /home/fux/pro-fu/db-mir-snp/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/scr/run_mirmap.py {mirseq} {result_file}".format(mirseq=mirseq,result_file=result_file)
    #print(conmand)
    command_excute(conmand)

def result_parser(wm_result,wt_result,sm_result,st_result):
    print("result parser ...")
    wm_utr_list=[]
    wm_bed_file=get_tempfile_name() #c
    wm_bed_json={}
    print("wm tables...")

    with open(wm_bed_file,"a") as wm_bed:
        with open(wm_result) as infile:
            line = infile.readline()
            item = {}
            while line:
                if line.startswith(">"):
                    #print(line)
                    utr_info=line.strip()[1:]
                    site_count = 0
               #    out.write(line)
                else:
                    #print(wm_bed_json)
                    site_count+=1
                    nline=re.split(r':|#|\t',utr_info)
                    item['utr_chr']=nline[0]
                    item['utr_coordinate']=nline[0]+':'+nline[1]
                    item['enst_id']=nline[2]
                    item['gene']=nline[3]
                    item['accession']=nline[4]
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
                    item['site_chr']=nline[0]
                    item['strand']=re.split(r'\(|\)',nline[1])[1]
                    position=re.split(r'\(|\)',nline[1])[0].split('-')
                    if item['strand']=='-':
                        item['site_genome_start']=str(int(position[1])-int(item['site_end']))
                        item['site_genome_end']=str(int(item['site_genome_start'])+int(item['seed_length']))
                    else:
                        item['site_genome_end']=str(int(position[0])+int(item['site_end']))
                        item['site_genome_start']=str(int(item['site_genome_end'])-int(item['seed_length']))
                    #site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                    wm_utr_list.append(utr_info)
                    bed_line=utr_info+'\t'+item['site_start']+'\t'+item['site_end']
                    lkey=utr_info+'#'+item['site_start']+'#'+item['site_end']
                    wm_bed_json[lkey]=item #when item change,all values of wm_bed_json changed
                    item={}
                    #print("wm_utr_list:")
                    #print(wm_utr_list)
                    #print(bed_line)
                    #print(wm_bed_json)
                    #print("wm_bed_line:"+bed_line) wm_bed_json[lkey]=item--> set all values of the dict to item, why?
                    wm_bed.write(bed_line+'\n')
                    #break
                line=infile.readline()
            
    #gettable
    #gene/mir list
    #bed file
    
    wm_bed_sort=get_tempfile_name()
    sort_cmd="bedtools sort -i "+wm_bed_file+" >"+wm_bed_sort
    os.popen(sort_cmd)
    os.remove(wm_bed_file)

    print("wt format ...")
    wt_utr_list=[]
    wt_bed_file=get_tempfile_name() #c
    with open(wt_bed_file,"a") as wt_bed:
        with open(wt_result) as infile:
            head=infile.readline()
            for line in infile:
                #print(line)
                nline=line.strip().split()
                wt_utr_list.append(nline[0])
                #print("wt_bed_line:"+bed_line)
                bed_line=nline[0]+'\t'+nline[3]+'\t'+nline[4]
                #print("wt_utr_list:")
                #print(wt_utr_list)
                #print(bed_line)
                wt_bed.write(bed_line+'\n')
    #gene_mir_list
    #bed file
    wt_bed_sort=get_tempfile_name()
    sort_cmd="bedtools sort -i "+wt_bed_file+" >"+wt_bed_sort
    os.popen(sort_cmd)
    os.remove(wt_bed_file)

    print("w_instersect ...")
    w_insect_file=get_tempfile_name()


    print("wt bed sort:")
    t=open(wt_bed_sort)
    print(t.readline())
    print(t.readline())
    t.close()

    insec_cmd="bedtools intersect -sorted -f 0.5 -a "+wm_bed_sort+" -b "+wt_bed_sort+" -u >"+w_insect_file
    #print(insec_cmd)
    os.popen(insec_cmd)
    wif=open(w_insect_file)
    print(wif.readline())
    print(wif.readline())
    wif.close()
    
    print("sm format ...")

    sm_utr_list=[]
    sm_bed_file=get_tempfile_name()
    sm_bed_json={}
    with open(sm_bed_file,"a") as sm_bed:
        with open(sm_result) as infile:
            line = infile.readline()
            item = {}
            while line:
                if line.startswith(">"):
                    utr_info=line.strip()[1:]
                    site_count = 0
               #    out.write(line)
                else:
                    site_count+=1
                    nline=re.split(r':|#|\t',utr_info)
                    item['utr_chr']=nline[0]
                    item['utr_coordinate']=nline[0]+':'+nline[1]
                    item['enst_id']=nline[2]
                    item['gene']=nline[3]
                    item['accession']=nline[4]
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
                    item['site_chr']=nline[0]
                    item['strand']=re.split(r'\(|\)',nline[1])[1]
                    position=re.split(r'\(|\)',nline[1])[0].split('-')
                    if item['strand']=='-':
                        item['site_genome_start']=str(int(position[1])-int(item['site_end']))
                        item['site_genome_end']=str(int(item['site_genome_start'])+int(item['seed_length']))
                    else:
                        item['site_genome_end']=str(int(position[0])+int(item['site_end']))
                        item['site_genome_start']=str(int(item['site_genome_end'])-int(item['seed_length']))
                    #site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                    sm_utr_list.append(utr_info)
                    bed_line=utr_info+'\t'+item['site_start']+'\t'+item['site_end']
                    lkey=utr_info+'#'+item['site_start']+'#'+item['site_end']
                    sm_bed_json[lkey]=item #when item change,all values of wm_bed_json changed
                    item={}
                    #print("wm_bed_line:"+bed_line) wm_bed_json[lkey]=item--> set all values of the dict to item, why?
                    sm_bed.write(bed_line+'\n')
                line=infile.readline()
    #gettable
    #gene/mir list
    #bed file
    sm_bed_sort=get_tempfile_name()
    sort_cmd="bedtools sort -i "+sm_bed_file+" >"+sm_bed_sort
    os.popen(sort_cmd)
    os.remove(sm_bed_file)

    print("st format ...")
    st_utr_list=[]
    st_bed_file=get_tempfile_name()
    with open(st_bed_file,"a") as st_bed:
        with open(st_result) as infile:
            head=infile.readline()
            for line in infile:
                nline=line.strip().split()
                st_utr_list.append(nline[0])
                bed_line=nline[0]+'\t'+nline[3]+'\t'+nline[4]
                st_bed.write(bed_line+'\n')
    #gene_mir_list
    #bed file
    st_bed_sort=get_tempfile_name()
    sort_cmd="bedtools sort -i "+st_bed_file+" >"+st_bed_sort
    os.popen(sort_cmd)
    os.remove(st_bed_file)

    print("s intersect ...")
    s_insect_file=get_tempfile_name()
    insec_cmd="bedtools intersect -sorted -f 0.5 -a "+sm_bed_sort+" -b "+st_bed_sort+" -u >"+s_insect_file
    os.popen(insec_cmd)
    sif=open(s_insect_file)
    print(sif.readline())
    print(sif.readline())
    sif.close()

    print("unin tar ...")    
    w_unin=list(set(wm_utr_list).union(set(wt_utr_list)))
    s_unin=list(set(sm_utr_list).union(set(st_utr_list)))

    print("caculate loss ...")
    #print(s_unin)
    loss=[]
    wild_result=[]
    with open(w_insect_file) as infile:
        for line in infile:
            nline=line.strip().split()
            if nline[0] not in s_unin:
                loss.append(wm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
            wild_result.append(wm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
    
    print("caculate gain ...")
    #print(w_unin)
    gain=[]
    alt_result=[]
    with open(s_insect_file) as infile:
        for line in infile:
            #print(line)
            nline=line.strip().split()
            if nline[0] not in w_unin:
                gain.append(sm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
            alt_result.append(sm_bed_json[nline[0]+'#'+nline[1]+'#'+nline[2]])
    #print(gain)
    #print(loss)
    result={'loss':loss,'gain':gain,'wild_result':wild_result,'alt_result':alt_result}
    os.remove(wm_bed_sort)
    os.remove(wt_bed_sort)
    os.remove(sm_bed_sort)
    os.remove(st_bed_sort)
    os.remove(s_insect_file)
    os.remove(w_insect_file)
    return result

def predict_start(wild_seq, wild_prefix,alt_seq,alt_prefix):
    #wt_result="/home/fux/pro-fu/db-mir-snp/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/local_file/wild_tgs_result.txt"
    #wm_result="/home/fux/pro-fu/db-mir-snp/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/local_file/wild_mirmap_result.txt"
    #st_result="/home/fux/pro-fu/db-mir-snp/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/local_file/alt_tgs_result.txt"
    #sm_result="/home/fux/pro-fu/db-mir-snp/web/miRNASNP3/miRNASNP3/miRNASNP3/online_predict/local_file/alt_mirmap_result.txt"
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

def result_parser_wild(wm_result,wt_result,sm_result,st_result):
    print("result parser ...")
    wm_utr_list=[]
    wm_bed_file=get_tempfile_name() #c
    wm_bed_json={}
    print("wm tables...")

    with open(wm_bed_file,"a") as wm_bed:
        with open(wm_result) as infile:
            line = infile.readline()
            item = {}
            while line:
                if line.startswith(">"):
                    #print(line)
                    utr_info=line.strip()[1:]
                    site_count = 0
               #    out.write(line)
                else:
                    #print(wm_bed_json)
                    site_count+=1
                    nline=re.split(r':|#|\t',utr_info)
                    item['utr_chr']=nline[0]
                    item['utr_coordinate']=nline[0]+':'+nline[1]
                    item['enst_id']=nline[2]
                    item['gene']=nline[3]
                    item['accession']=nline[4]
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
                    item['site_chr']=nline[0]
                    item['strand']=re.split(r'\(|\)',nline[1])[1]
                    position=re.split(r'\(|\)',nline[1])[0].split('-')
                    if item['strand']=='-':
                        item['site_genome_start']=str(int(position[1])-int(item['site_end']))
                        item['site_genome_end']=str(int(item['site_genome_start'])+int(item['seed_length']))
                    else:
                        item['site_genome_end']=str(int(position[0])+int(item['site_end']))
                        item['site_genome_start']=str(int(item['site_genome_end'])-int(item['seed_length']))
                    #site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                    wm_utr_list.append(utr_info)
                    bed_line=utr_info+'\t'+item['site_start']+'\t'+item['site_end']
                    lkey=utr_info+'#'+item['site_start']+'#'+item['site_end']
                    wm_bed_json[lkey]=item #when item change,all values of wm_bed_json changed
                    item={}
                    #print("wm_utr_list:")
                    #print(wm_utr_list)
                    #print(bed_line)
                    #print(wm_bed_json)
                    #print("wm_bed_line:"+bed_line) wm_bed_json[lkey]=item--> set all values of the dict to item, why?
                    wm_bed.write(bed_line+'\n')
                    #break
                line=infile.readline()
            
    #gettable
    #gene/mir list
    #bed file
    
    wm_bed_sort=get_tempfile_name()
    sort_cmd="bedtools sort -i "+wm_bed_file+" >"+wm_bed_sort
    os.popen(sort_cmd)
    os.remove(wm_bed_file)

    print("wt format ...")
    wt_utr_list=[]
    wt_bed_file=get_tempfile_name() #c
    with open(wt_bed_file,"a") as wt_bed:
        with open(wt_result) as infile:
            head=infile.readline()
            for line in infile:
                #print(line)
                nline=line.strip().split()
                wt_utr_list.append(nline[0])
                #print("wt_bed_line:"+bed_line)
                bed_line=nline[0]+'\t'+nline[3]+'\t'+nline[4]
                #print("wt_utr_list:")
                #print(wt_utr_list)
                #print(bed_line)
                wt_bed.write(bed_line+'\n')
    #gene_mir_list
    #bed file
    wt_bed_sort=get_tempfile_name()
    sort_cmd="bedtools sort -i "+wt_bed_file+" >"+wt_bed_sort
    os.popen(sort_cmd)
    os.remove(wt_bed_file)

    print("w_instersect ...")
    w_insect_file=get_tempfile_name()


    print("wt bed sort:")
    t=open(wt_bed_sort)
    print(t.readline())
    print(t.readline())
    t.close()

    insec_cmd="bedtools intersect -sorted -f 0.5 -a "+wm_bed_sort+" -b "+wt_bed_sort+" -u >"+w_insect_file
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
    pool = multiprocessing.Pool(processes=20)
    pool.apply_async(targetscan_predict, (wild_tgs_file, wt_result, ))
    pool.apply_async(mirmap_predict, (wild_seq, wm_result, ))
    pool.close()
    pool.join()
    os.remove(wild_tgs_file)
    result = result_parser_wild(wm_result, wt_result)
    return result

class PredictionAltmir(Resource):
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
            
        return {'result_altmir':result}

api.add_resource(PredictionAltmir, '/api/prediction_altmir')
import sys,json,re

stat_seed_2_7={}
with open("/home/fux/fux/miRNASNP3/Fix/Indel/map_dbsnp2seed_2_7") as infile:
    for line in infile:
        nline=line.strip().split()
        lk=nline[8]+':'+nline[11]+':'+nline[12]+':'+nline[14]+':'+nline[16]
        if lk in stat_seed_2_7.keys():
            stat_seed_2_7[lk]['total'].append(nline[2])
            if re.search("COMMON",nline[7]):
                stat_seed_2_7[lk]['common'].append(nline[2])
            else:
                stat_seed_2_7[lk]['rare'].append(nline[2])
        else:
            stat_seed_2_7[lk]={}
            stat_seed_2_7[lk]['total']=[nline[2]]
            if re.search("COMMON",nline[7]):
                stat_seed_2_7[lk]['common']=[nline[2]]
                stat_seed_2_7[lk]['rare']=[]
            else:
                stat_seed_2_7[lk]['common']=[]
                stat_seed_2_7[lk]['rare']=[nline[2]]

stat_seed_2_8={}
with open("/home/fux/fux/miRNASNP3/Fix/Indel/map_dbsnp2seed_2_8") as infile:
    for line in infile:
        nline=line.strip().split()
        lk=nline[8]+':'+nline[11]+':'+nline[12]+':'+nline[14]+':'+nline[16]
        if lk in stat_seed_2_8.keys():
            stat_seed_2_8[lk]['total'].append(nline[2])
            if re.search("COMMON",nline[7]):
                stat_seed_2_8[lk]['common'].append(nline[2])
            else:
                stat_seed_2_8[lk]['rare'].append(nline[2])
        else:
            stat_seed_2_8[lk]={}
            stat_seed_2_8[lk]['total']=[nline[2]]
            if re.search("COMMON",nline[7]):
                stat_seed_2_8[lk]['common']=[nline[2]]
                stat_seed_2_8[lk]['rare']=[]
            else:
                stat_seed_2_8[lk]['common']=[]
                stat_seed_2_8[lk]['rare']=[nline[2]]
stat_mature={}
with open("/home/fux/fux/miRNASNP3/Fix/Indel/indel_in_mature") as infile:
    for line in infile:
        nline=line.strip().split()
        mature_mirna=re.search(";Name=(.*?);",nline[16])[1]
        lk=nline[8]+':'+nline[11]+':'+nline[12]+':'+nline[14]+':'+mature_mirna
        if lk in stat_mature.keys():
            stat_mature[lk]['total'].append(nline[2])
            if re.search("COMMON",nline[7]):
                stat_mature[lk]['common'].append(nline[2])
            else:
                stat_mature[lk]['rare'].append(nline[2])
        else:
            stat_mature[lk]={}
            stat_mature[lk]['total']=[nline[2]]
            if re.search("COMMON",nline[7]):
                stat_mature[lk]['common']=[nline[2]]
                stat_mature[lk]['rare']=[]
            else:
                stat_mature[lk]['common']=[]
                stat_mature[lk]['rare']=[nline[2]]

stat_premir={}
with open("/home/fux/fux/miRNASNP3/Fix/Indel/map_dbsnp2premir") as infile:
    for line in infile:
        nline=line.strip().split()
        premir=nline[16].split(':')[0]
        lk=nline[8]+':'+nline[11]+':'+nline[12]+':'+nline[14]+':'+premir
        if lk in stat_premir.keys():
            stat_premir[lk]['total'].append(nline[2])
            if re.search("COMMON",nline[7]):
                stat_premir[lk]['common'].append(nline[2])
            else:
                stat_premir[lk]['rare'].append(nline[2])
        else:
            stat_premir[lk]={}
            stat_premir[lk]['total']=[nline[2]]
            if re.search("COMMON",nline[7]):
                stat_premir[lk]['common']=[nline[2]]
                stat_premir[lk]['rare']=[]
            else:
                stat_premir[lk]['common']=[]
                stat_premir[lk]['rare']=[nline[2]]

mature2seed_2_7={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/hsa.mature.gff3") as infile:
    for line in infile:
        if line.startswith('chr'):
            nline=line.strip().split()
            mir=re.search(';Name=(.*?);',nline[8])[1]
            if nline[6]=='+':
                seed_start=int(nline[3])+1
                seed_end=seed_start+5
            else:
                seed_end=int(nline[4])-1
                seed_start=seed_end-5
            maturek=nline[0]+':'+nline[3]+':'+nline[4]+':'+nline[6]+':'+mir
            seedk=nline[0]+':'+str(seed_start)+':'+str(seed_end)+':'+nline[6]+':'+mir
            mature2seed_2_7[maturek]=seedk

mature2seed_2_8={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/hsa.mature.gff3") as infile:
    for line in infile:
        if line.startswith('chr'):
            nline=line.strip().split()
            mir=re.search(';Name=(.*?);',nline[8])[1]
            if nline[6]=='+':
                seed_start=int(nline[3])+1
                seed_end=seed_start+6
            else:
                seed_end=int(nline[4])-1
                seed_start=seed_end-6
            maturek=nline[0]+':'+nline[3]+':'+nline[4]+':'+nline[6]+':'+mir
            seedk=nline[0]+':'+str(seed_start)+':'+str(seed_end)+':'+nline[6]+':'+mir
            mature2seed_2_8[maturek]=seedk

#for length
hairpin_json={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/hairpin.fa.json") as infile:
    hairpin_json=json.load(infile)
mature_seq={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/muture.fa.hsa.json") as infile:
    mature_seq=json.load(infile)

#id transfer
mature_pre_dict={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/hsa.mirbase.mature.pre.json") as infile:
    mature_pre_dict=json.load(infile)

with open("/home/fux/fux/miRNASNP3/Analysis/MAF/indel_in_mir_seed2-7.anno.txt","a") as out:
    with open("/home/fux/fux/miRNASNP3/Analysis/MAF/indel_in_mir_seed2-8.anno.txt","a") as out2:
        head="mature_id\tprecurser_id\tmature_len\tpre_len\tpre_totla\tpre_rare\tpre_common\tmature_total\tmature_rare\tmature_common\tseed_total\tseed_common\tseed_rare"
        out.write(head+'\n')
        out2.write(head+'\n')
        for lk in mature_pre_dict:
            #print(lk)
            mature_id=lk.split(':')[4]
            precurser_id=mature_pre_dict[lk].split(':')[4]
            pk=mature_pre_dict[lk]
            s27k=mature2seed_2_7[lk]
            s28k=mature2seed_2_8[lk]
            #print(s28k)
            if pk in stat_premir.keys():
                pre_total=len(set(stat_premir[pk]['total']))
                pre_common=len(set(stat_premir[pk]['common']))
                pre_rare=len(set(stat_premir[pk]['rare']))
            else:
                "no premir found"
                pre_total=0
                pre_common=0
                pre_rare=0
            if lk in stat_mature.keys():
                mature_total=len(set(stat_mature[lk]['total']))
                mature_common=len(set(stat_mature[lk]['common']))
                mature_rare=len(set(stat_mature[lk]['rare']))
            else:
                mature_total=0
                mature_common=0
                mature_rare=0
            if s27k in stat_seed_2_7.keys():
                seed_total=len(set(stat_seed_2_7[s27k]['total']))
                seed_common=len(set(stat_seed_2_7[s27k]['common']))
                seed_rare=len(set(stat_seed_2_7[s27k]['rare']))
            else:
                seed_total=0
                seed_common=0
                seed_rare=0
            if s28k in stat_seed_2_8.keys():
                seed_28_total=len(set(stat_seed_2_8[s28k]['total']))
                seed_28_common=len(set(stat_seed_2_8[s28k]['common']))
                seed_28_rare=len(set(stat_seed_2_8[s28k]['rare']))
            else:
                seed_28_total=0
                seed_28_common=0
                seed_28_rare=0
            newline=lk+'\t'+pk+'\t'+str(len(mature_seq[mature_id]))+'\t'+str(len(hairpin_json[precurser_id]))+'\t'+str(pre_total)+'\t'+str(pre_rare)+'\t'+str(pre_common)+'\t'+str(mature_total)+'\t'+str(mature_rare)+'\t'+str(mature_common)+'\t'+str(seed_total)+'\t'+str(seed_common)+'\t'+str(seed_rare)
            newline28=lk+'\t'+pk+'\t'+str(len(mature_seq[mature_id]))+'\t'+str(len(hairpin_json[precurser_id]))+'\t'+str(pre_total)+'\t'+str(pre_rare)+'\t'+str(pre_common)+'\t'+str(mature_total)+'\t'+str(mature_rare)+'\t'+str(mature_common)+'\t'+str(seed_28_total)+'\t'+str(seed_28_common)+'\t'+str(seed_28_rare)
            out.write(newline+'\n')
            out2.write(newline28+'\n')
            #print(newline)
            #print(newline28)
            #break


    
import re,json

hairpin_json={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/hairpin.fa.json") as infile:
    hairpin_json=json.load(infile)

flank2premir={}
with open("/home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/grch38p12_hsa.gff3.primary.flank35") as infile:
    for line in infile:
        nline=line.strip().split()
        ftype=nline[8].split(':')
        pre_len=len(hairpin_json[ftype[0]])
        fk=nline[0]+':'+nline[3]+':'+nline[4]+':'+nline[6]+':'+ftype[0]
        if ftype[1]=='precurser':
            pk=fk
            flank2premir[fk]=pk
        if ftype[1]=='flank3':
            if nline[6]=='+':
                pre_start=int(nline[3])-pre_len*int(ftype[2])
                pre_end=pre_start+pre_len-1
            else:
                pre_start=int(nline[3])+pre_len*int(ftype[2])
                pre_end=pre_start+pre_len-1
            pk=nline[0]+':'+str(pre_start)+':'+str(pre_end)+':'+nline[6]+':'+ftype[0]
            flank2premir[fk]=pk
        if ftype[1]=='flank5':
            if nline[6]=='+':
                pre_start=int(nline[3])+pre_len*int(ftype[2])
                pre_end=pre_start+pre_len-1
            else:
                pre_start=int(nline[3])-pre_len*int(ftype[2])
                pre_end=pre_start+pre_len-1
            pk=nline[0]+':'+str(pre_start)+':'+str(pre_end)+':'+nline[6]+':'+ftype[0]
            flank2premir[fk]=pk

stat_flank={}
with open("/home/fux/fux/miRNASNP3/Fix/Indel/indel_in_flank") as infile:
    for line in infile:
        #print(line)
        nline=line.strip().split()
        namelist=nline[16].split(':')
        fk=nline[8]+':'+nline[11]+':'+nline[12]+':'+nline[14]+':'+namelist[0]
        pk=flank2premir[fk]
        if pk in stat_flank.keys():
            tk=namelist[1]+'_'+namelist[2]+'_total'
            #print(tk)
            stat_flank[pk][tk].append(nline[2])
            if re.search("COMMON",nline[7]):
                ck=namelist[1]+'_'+namelist[2]+'_common'
                stat_flank[pk][ck].append(nline[2])
            else:
                rk=namelist[1]+'_'+namelist[2]+'_rare'
                stat_flank[pk][rk].append(nline[2])
        else:
            stat_flank[pk]={}
            for rs in ['total','common','rare']:
                #print(rs)
                kp='precurser_'+str(len(hairpin_json[namelist[0]]))+'_'+rs
                #print(kp)
                stat_flank[pk][kp]=[]
                for i in range(1,4):
                    k3='flank3_'+str(i)+'_'+rs
                    k5='flank5_'+str(i)+'_'+rs
                    stat_flank[pk][k3]=[]
                    stat_flank[pk][k5]=[]
            
            tk=namelist[1]+'_'+namelist[2]+'_total'
            #print(tk)
            stat_flank[pk][tk].append(nline[2])
            if re.search("COMMON",nline[7]):
                ck=namelist[1]+'_'+namelist[2]+'_common'
                stat_flank[pk][ck].append(nline[2])
            else:
                rk=namelist[1]+'_'+namelist[2]+'_rare'
                stat_flank[pk][rk].append(nline[2])



        
with open("/home/fux/fux/miRNASNP3/Analysis/MAF/indel_in_flank.anno.txt","a") as out:
    head="precurser_id\tpre_totla\tpre_flank3_1_total\tpre_flank5_1_total\tpre_flank3_2_total\tpre_flank5_2_total\tpre_flank3_3_total\tpre_flank5_3_total\tpre_common\tpre_flank3_1_common\tpre_flank5_1_common\tpre_flank3_2_common\tpre_flank5_2_common\tpre_flank3_3_common\tpre_flank5_3_common\tpre_rare\tpre_flank3_1_rare\tpre_flank5_1_rare\tpre_flank3_2_rare\tpre_flank5_2_rare\tpre_flank3_3_rare\tpre_flank5_3_rare"
    out.write(head+'\n')
    for pk in stat_flank.keys():
        pre_id=pk.split(':')[4]
        newline=pk
        for rs in ['total','common','rare']:
            kp='precurser_'+str(len(hairpin_json[pre_id]))+'_'+rs
            newline+='\t'+str(len(set(stat_flank[pk][kp])))
            for i in range(1,4):
                newline+='\t'+str(len(set(stat_flank[pk]['flank3_'+str(i)+'_'+rs])))+'\t'+str(len(set(stat_flank[pk]['flank5_'+str(i)+'_'+rs])))
        out.write(newline+'\n')
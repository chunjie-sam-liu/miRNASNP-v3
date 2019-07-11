import json,sys,re

def getMutationinfo():
    with open("/home/fux/fux/miRNASNP3/mutation/clinvar_in_utr3.ty.snp.pos_correct.json") as infile:
        mut_dict=json.load(infile)
        return mut_dict

def getMutation_line(mut_id,chrome):
    if len(mut_dict[mut_id])==1:
        return mut_dict[mut_id][0]
    else:
        chro=chrome.split(':')[0]
        for mut in mut_dict[mut_id]:
            if mut.split()[0]==chro[3:]:
                return mut
def outInfo(ouch):
    with open("/home/fux/fux/miRNASNP3/Gain_Loss/utr_loss_clinvar_info_02.info","a") as out:
        out.write(ouch+'\n')          

f=sys.argv[1]
RULE1={'A':'T','U':'A','G':'C','C':'G','N':'N'}
RULE2={'A':'A','U':'T','G':'G','C':'C','N':'N'}

mut_dict=getMutationinfo()
item=0
mut_in_site=0
mut_notin_site=0
side_count=0
unmatch=0
mut_in_tgs_site_only=0

with open(sys.argv[2],"a") as out:
    temp_json={}
    temp_id=0
    with open(sys.argv[1]) as infile:
        for line in infile:
            temp_id+=1
            temp_dict={}
            mut_info={}
            utr_info={}
            site_info={}
            nline=line.strip().split('\t')
            #print('utrinfo:'+nline[28])
            nutr=nline[28].split('#')
            #print(nutr)
            strand=re.split(r'\(|\)',nutr[1])[1]
            #print('aligninfpo:'+nline[27])
            nalign=nline[27].split('#')
            temp_dict['mirna_id']=nline[8]
            temp_dict['mut_id']=nline[9]
            temp_dict['gene_symbol']=nutr[3]
            #temp_dict['experiment_valid']=IsValid(nline[8],nutr[3])
            #temp_dict['expr_corelation']=gmCorelate(nline[8],nutr[3])
            mut_line=getMutation_line(nline[9],nutr[1])
            mutinfo=mut_line.split()
            mut_info['mut_id']=mutinfo[2]
            mut_info['chr']="chr"+mutinfo[0]
            mut_info['position']=mutinfo[1]
            mut_info['ref']=mutinfo[3]
            mut_info['alt']=mutinfo[4]
            #print('ref:'+snpinfo[3])
            #print('alt:'+snpinfo[4])
            #if snpinfo[2]>=min(nline[1],nline[5]) and snpinfo[2]<=max(nline[2],nline[6]):
                #snp_in_site+=1
                #distance=int(snpinfo[2])-int(nline[11])
                #curseq=list(nalign[2])
                #curalt=curseq[distance-int(nalign[0].split()[0])]
                #print(curseq)
                #print("distance:"+str(distance-int(nalign[0].split()[0])))
                #print("curalt:"+curalt)
            #print('mutinfo:'+mut_line)
            #print('siteinfo:'+line.strip())
                #if curalt in snpinfo[4].split(','):
                #    item+=1
                #    snp_info['alt']=curalt
                #    snp_info['distance']=int(snpinfo[2])-int(nline[11])-int(nalign[0].split()[0])
            if strand =='-':
                curseq = list(''.join(map(lambda x:RULE1[x],nalign[2])))#直接取snp到3'端的距离，就不用将序列倒序了
                distance=int(nutr[8])-int(mutinfo[1])
                if distance==int(nutr[8])-int(nutr[7]):
                    side_count+=1
                    continue
            else:
                curseq = list(''.join(map(lambda x:RULE2[x],nalign[2])))
                distance=int(mutinfo[1])-int(nutr[7])-1
            
            #print(curseq)
            #print("distance:"+str(distance))
            if mutinfo[1]>=min(nline[1],nline[5]) and mutinfo[1]<=max(nline[2],nline[6]):
                mut_in_site+=1
                if mutinfo[1]>=nline[1] and mutinfo[1]<nline[2]:
                    if curseq[distance-int(nalign[0].split()[0])+1]==mutinfo[3]:
                        item+=1
                        mut_info['distance_align']=distance-int(nalign[0].split()[0])+1
                    else:
                        unmatch+=1
                        outInfo('mutinfo:'+mut_line)
                        outInfo('siteinfo:'+line.strip())
                        #print(curseq)
                        #print("distance:"+str(distance))
                        mut_info['distance_align']=-2
                        continue
                else:
                    mut_in_tgs_site_only+=1
                    mut_info['distance_align']=-1

            else:
                mut_notin_site+=1
                mut_info['distance_align']=-1
            mut_info['distance']=distance
            #print("distance:"+str(distance))
            #print("curref:"+curseq[distance-int(nalign[0].split()[0])]
            utr_info['position']=nutr[1]
            utr_info['enst_id']=nutr[2]
            utr_info['gene_symbol']=nutr[3]
            utr_info['acc']=nutr[4]
            site_info['chrome']=nline[0]
            site_info['mm_start']=nline[1]
            site_info['mm_end']=nline[2]
            site_info['tgs_start']=nline[5]
            site_info['tgs_end']=nline[6]
            site_info['dg_duplex']=nline[18]
            site_info['dg_binding']=nline[19]
            site_info['dg_open']=nline[20]
            site_info['tgs_au']=nline[21]
            site_info['tgs_score']=nline[24]
            site_info['prob_exac']=nline[25]
            site_info['align_1']=nalign[0]
            site_info['align_2']=nalign[1]
            site_info['align_3']=nalign[2]
            site_info['align_4']=' '*(len(nalign[0])-len(nalign[3])-1)+nalign[3]
            site_info['align_5']=' '*(len(nalign[0])-len(nalign[4])-1)+nalign[4]
            site_info['truncate_start']=nutr[7]
            site_info['truncate_end']=nutr[8]
            temp_dict['mut_info']=mut_info
            temp_dict['utr_info']=utr_info
            temp_dict['site_info']=site_info
            temp_json[str(temp_id)]=temp_dict
        json.dump(temp_json,out)
        outInfo("chrome:"+nline[0])
        outInfo("total site:"+str(temp_id))
        outInfo("mut in site:"+str(mut_in_site))
        outInfo("mut_notin_site:"+str(mut_notin_site))
        outInfo("match site:"+str(item))
        outInfo("mut in side:"+str(side_count))
        outInfo("site_unmatch:"+str(unmatch))
        outInfo("mut in tgs site but not mirmap site:"+str(mut_in_tgs_site_only))
        outInfo("dict_length:"+str(len(temp_json)))
                


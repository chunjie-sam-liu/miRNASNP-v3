import json,sys,re

def getSNPinfo():
    with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/snp_utr3.table.json") as infile:
        snp_dict=json.load(infile)
        return snp_dict

def getExperimentV():
    with open("/project/fux/miRNASNP3/data/experiment_mir_gene.json") as infile:
        experiment_valid=json.load(infile)
        return experiment_valid

def getExpressionCorelation():
    with open("/home/fux/fux/miRNASNP3/expression/corelation_mir_gene.json") as infile:
        core_dict=json.load(infile)
        return core_dict

def IsValid(mirna_id,gene_symbol):
    if mirna_id in experiment_valid.keys():
        if gene_symbol in experiment_valid[mirna_id].keys():
            return 1
    return 0

def gmCorelate(mirna_id,gene_symbol):
    if mirna_id in core_dict.keys():
        if gene_symbol in core_dict[mirna_id].keys():
            if core_dict[mirna_id][gene_symbol]=='no':
                return "Not significant"
            else:
                return core_dict[mirna_id][gene_symbol]
    return 0

def getSnpinfo_line(snp_id,chrome):
    if len(snp_dict[snp_id])==1:
        return snp_dict[snp_id][0]
    else:
        chro=chrome.split(':')[0]
        for snp in snp_dict[snp_id]:
            if snp.split()[1]==chro:
                return snp
def outInfo(ouch):
    with open(f+".info","a") as out:
        out.write(ouch+'\n')          

f=sys.argv[1]
RULE1={'A':'T','U':'A','G':'C','C':'G','N':'N'}
RULE2={'A':'A','U':'T','G':'G','C':'C','N':'N'}

snp_dict=getSNPinfo()
experiment_valid=getExperimentV()
core_dict=getExpressionCorelation()
item=0
snp_in_site=0
snp_notin_site=0
side_count=0
unmatch=0
snp_in_tgs_site_only=0

with open(sys.argv[2],"a") as out:
    temp_json={}
    temp_id=0
    with open(sys.argv[1]) as infile:
        for line in infile:
            temp_id+=1
            temp_dict={}
            snp_info={}
            utr_info={}
            site_info={}
            nline=line.strip().split('\t')
            #print('utrinfo:'+nline[28])
            nutr=nline[28].split('#')
            strand=re.split(r'\(|\)',nutr[0])[1]
            #print('aligninfpo:'+nline[27])
            nalign=nline[27].split('#')
            temp_dict['mirna_id']=nline[8]
            temp_dict['snp_id']=nline[9]
            temp_dict['gene_symbol']=nutr[2]
            temp_dict['experiment_valid']=IsValid(nline[8],nutr[2])
            temp_dict['expr_corelation']=gmCorelate(nline[8],nutr[2])
            snpinfo_line=getSnpinfo_line(nline[9],nutr[0])
            snpinfo=snpinfo_line.split()
            snp_info['snp_id']=snpinfo[0]
            snp_info['chr']=snpinfo[1]
            snp_info['position']=snpinfo[2]
            snp_info['ref']=snpinfo[3]
            snp_info['alt']=snpinfo[4]
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
            #print('snpinfo:'+snpinfo_line)
            #print('siteinfo:'+line.strip())
                #if curalt in snpinfo[4].split(','):
                #    item+=1
                #    snp_info['alt']=curalt
                #    snp_info['distance']=int(snpinfo[2])-int(nline[11])-int(nalign[0].split()[0])
            if strand =='-':
                curseq = list(''.join(map(lambda x:RULE1[x],nalign[2])))#直接取snp到3'端的距离，就不用将序列倒序了
                distance=int(nline[12])-int(snpinfo[2])
                if distance==int(nline[12])-int(nline[11]):
                    side_count+=1
                    continue
            else:
                curseq = list(''.join(map(lambda x:RULE2[x],nalign[2])))
                distance=int(snpinfo[2])-int(nline[11])-1
            
            #print(curseq)
            #print("distance:"+str(distance))
            if snpinfo[2]>=min(nline[1],nline[5]) and snpinfo[2]<=max(nline[2],nline[6]):
                snp_in_site+=1
                if snpinfo[2]>=nline[1] and snpinfo[2]<nline[2]:
                    if curseq[distance-int(nalign[0].split()[0])+1]==snpinfo[3]:
                        item+=1
                        snp_info['distance_align']=distance-int(nalign[0].split()[0])+1
                    else:
                        unmatch+=1
                        outInfo('snpinfo:'+snpinfo_line)
                        outInfo('siteinfo:'+line.strip())
                        #print(curseq)
                        #print("distance:"+str(distance))
                        snp_info['distance_align']=-2
                        continue
                else:
                    snp_in_tgs_site_only+=1
                    snp_info['distance_align']=-1

            else:
                snp_notin_site+=1
                snp_info['distance_align']=-1
            snp_info['distance']=distance
            #print("distance:"+str(distance))
            #print("curref:"+curseq[distance-int(nalign[0].split()[0])]
            utr_info['position']=nutr[0]
            utr_info['enst_id']=nutr[1]
            utr_info['gene_symbol']=nutr[2]
            utr_info['acc']=nutr[3]
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
            site_info['prob_exxac']=nline[25]
            site_info['align_1']=nalign[0]
            site_info['align_2']=nalign[1]
            site_info['align_3']=nalign[2]
            site_info['align_4']=' '*(len(nalign[0])-len(nalign[3])-1)+nalign[3]
            site_info['align_5']=' '*(len(nalign[0])-len(nalign[4])-1)+nalign[4]
            site_info['truncate_start']=nline[11]
            site_info['truncate_end']=nline[12]
            temp_dict['snp_info']=snp_info
            temp_dict['utr_info']=utr_info
            temp_dict['site_info']=site_info
            temp_json[str(temp_id)]=temp_dict
        json.dump(temp_json,out)
        outInfo("chrome:"+snpinfo[1])
        outInfo("total site:"+str(temp_id))
        outInfo("snp in site:"+str(snp_in_site))
        outInfo("snp_notin_site:"+str(snp_notin_site))
        outInfo("match site:"+str(item))
        outInfo("snp in side:"+str(side_count))
        outInfo("site_unmatch:"+str(unmatch))
        outInfo("snp in tgs site but not mirmap site:"+str(snp_in_tgs_site_only))
        #print("snp_in_site:"+str(snp_in_site))
        #print("invalid site:"+str(no_snp_site_count))
                


import json,sys,re

info_file="/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_info_02.info"

def getSNPinfo():
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/mongotable/snp_in_seed.json") as infile:
        snp_dict=json.load(infile)
        return snp_dict


def outInfo(ouch):
    with open(info_file,"a") as out:
        out.write(ouch+'\n')

f=sys.argv[1]
RULE1={'A':'T','U':'A','G':'C','C':'G','N':'N'}
RULE2={'A':'A','U':'T','G':'G','C':'C','N':'N'}

snp_dict=getSNPinfo()

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
            
            strand=nline[12]
            #print('aligninfpo:'+nline[27])
            nalign=nline[31].split('#')
            temp_dict['mirna_id']=nline[8]
            temp_dict['snp_id']=nline[32]
            temp_dict['gene_symbol']=nline[14]
            snpinfo_line=snp_dict[nline[32]][0]
            snpinfo=snpinfo_line.split()
            snp_info['snp_id']=snpinfo[2]
            snp_info['chr']=snpinfo[0]
            snp_info['position']=snpinfo[1]
            snp_info['ref']=snpinfo[3]
            snp_info['alt']=snpinfo[4]
            temp_dict['mir_seedstart']=snpinfo[9]
            temp_dict['mir_seedend']=snpinfo[10]
            temp_dict['mir_seedchr']=snpinfo[8]
            temp_dict['strand']=snpinfo[13]
            strand=snpinfo[13]
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
                curseq = list(''.join(map(lambda x:RULE1[x],nalign[4])))[::-1]#直接取snp到3'端的距离，就不用将序列倒序了
                if nline[0]=="chrX" or nlin[0]=="chrY":
                    distance=int(snpinfo[10])-int(snpinfo[1])#对于X，Y染色体，直接将vcf与bed文件比对，所用的seed区域的是[]
                else:
                    distance=int(snpinfo[10])-int(snpinfo[1])+1 #非X,Y染色体，用的是bed文件比对，seed区域的关系是[)
                   # continue
            else:
                curseq = list(''.join(map(lambda x:RULE2[x],nalign[4])))[::-1]#对于位于seed区域的snp而言，处于
                distance=int(snpinfo[1])-int(snpinfo[9])+1
            
            #print(curseq)
            #print("distance:"+str(distance))

            if int(snpinfo[1])>=int(snpinfo[9]) and int(snpinfo[1])<=int(snpinfo[10]):
                snp_in_site+=1
                if curseq[distance] ==snpinfo[3]:
                    item+=1
                    site_info['curalt']=curseq[distance]
                else:
                    unmatch+=1
            else:
                snp_notin_site+=1
            snp_info['distance']=distance
            #print("distance:"+str(distance))
            #print("curref:"+curseq[distance])
            utr_info['position']=nline[9]+':'+nline[10]+'-'+nline[11]+'('+nline[12]+')'
            utr_info['enst_id']=nline[13]
            utr_info['gene_symbol']=nline[14]
            utr_info['acc']=nline[15]
            site_info['chrome']=nline[0]
            site_info['mm_start']=nline[1]
            site_info['mm_end']=nline[2]
            site_info['tgs_start']=nline[4]
            site_info['tgs_end']=nline[5]
            site_info['dg_duplex']=nline[22]
            site_info['dg_binding']=nline[23]
            site_info['dg_open']=nline[24]
            site_info['tgs_au']=nline[25]
            site_info['tgs_score']=nline[28]
            site_info['prob_exxac']=nline[29]
            site_info['align_1']=nalign[0]
            site_info['align_2']=nalign[1]
            site_info['align_3']=nalign[2]
            site_info['align_4']=' '*(len(nalign[0])-len(nalign[3])-1)+nalign[3]
            site_info['align_5']=' '*(len(nalign[0])-len(nalign[4])-1)+nalign[4]
            temp_dict['snp_info']=snp_info
            temp_dict['utr_info']=utr_info
            temp_dict['site_info']=site_info
            temp_json[str(temp_id)]=temp_dict
        json.dump(temp_json,out)
        outInfo("pair:"+nline[8]+"\t"+nline[32]+'\n'"total site:"+str(temp_id)+'\n'+"snp in site:"+str(snp_in_site)+'\n'+"snp_notin_site:"+str(snp_notin_site)+'\n'+"match_site:"+str(item)+'\n'+"unmatch:"+str(unmatch)+'\n')
        if (unmatch !=0):
            outInfo("fix:"+nline[8]+'_'+nline[32])
        
        #print("snp_in_site:"+str(snp_in_site))
        #print("invalid site:"+str(no_snp_site_count))
                
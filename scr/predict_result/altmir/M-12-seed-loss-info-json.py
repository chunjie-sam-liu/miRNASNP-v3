import json,sys,re

info_file="/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss_info.info"

def getMutationinfo():
    with open("/home/fux/fux/miRNASNP3/mutation/cosmicncv_in_seed.json") as infile:
        mut_dict=json.load(infile)
        return mut_dict


def outInfo(ouch):
    with open(info_file,"a") as out:
        out.write(ouch+'\n')

f=sys.argv[1]
m=f.split('_')
mut_id=m[len(m)-1]
RULE1={'A':'T','U':'A','G':'C','C':'G','N':'N'}
RULE2={'A':'A','U':'T','G':'G','C':'C','N':'N'}

mut_dict=getMutationinfo()

item=0
mut_in_site=0
mut_notin_site=0
side_count=0
unmatch=0

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
            
            #print('aligninfpo:'+nline[27])
            nalign=nline[31].split('#')
            temp_dict['mirna_id']=nline[8]
            temp_dict['mut_id']=mut_id
            temp_dict['gene_symbol']=nline[14]
            mutinfo_line=mut_dict[mut_id]
            mutinfo=mutinfo_line.split()
            mut_info['mut_id']=mutinfo[2]
            mut_info['chr']=mutinfo[0]
            mut_info['position']=mutinfo[1]
            mut_info['ref']=mutinfo[3]
            mut_info['alt']=mutinfo[4]
            temp_dict['mir_seedstart']=mutinfo[9]
            temp_dict['mir_seedend']=mutinfo[10]
            temp_dict['mir_seedchr']="chr"+mutinfo[8]
            temp_dict['strand']=mutinfo[13]
            strand=mutinfo[13]
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
                curseq = list(''.join(map(lambda x:RULE1[x],nalign[4])))[::-1]#
                distance=int(mutinfo[10])-int(mutinfo[1])+1
                   # continue
            else:
                curseq = list(''.join(map(lambda x:RULE2[x],nalign[4])))[::-1]#对于位于seed区域的snp而言，无论正负链，都是3'端开头，都要倒序
                distance=int(mutinfo[1])-int(mutinfo[9])+1 #坐标位是seed的，要加1
            
            #print(curseq)
            #print("distance:"+str(distance))

            if int(mutinfo[1])>=int(mutinfo[9]) and int(mutinfo[1])<=int(mutinfo[10]):
                mut_in_site+=1
                #print(line.strip())
                #print('\t'.join(mutinfo))
                #print(curseq)
                #print("distance:"+str(distance))
                #print("curalt:"+curseq[distance])
                #print("alt:"+mutinfo[4])
                if curseq[distance] == mutinfo[3]:
                    item+=1
                    #mut_info['curalt']=curseq[distance]
                else:
                    unmatch+=1
            else:
                mut_notin_site+=1
            mut_info['distance']=distance
            #print("distance:"+str(distance))
            #print("curref:"+curseq[distance-int(nalign[0].split()[0])]
            utr_info['position']=nline[9]+':'+nline[10]+'-'+nline[11]+'('+nline[12]+')'
            utr_info['enst_id']=nline[13]
            utr_info['gene_symbol']=nline[14]
            utr_info['acc']=nline[15]
            site_info['chrome']=nline[0]
            site_info['mm_start']=nline[1]
            site_info['mm_end']=nline[2]
            site_info['tgs_start']=nline[5]
            site_info['tgs_end']=nline[6]
            site_info['dg_duplex']=nline[22]
            site_info['dg_binding']=nline[23]
            site_info['dg_open']=nline[24]
            site_info['tgs_au']=nline[25]
            site_info['tgs_score']=nline[28]
            site_info['prob_exac']=nline[29]
            site_info['align_1']=nalign[0]
            site_info['align_2']=nalign[1]
            site_info['align_3']=nalign[2]
            site_info['align_4']=' '*(len(nalign[0])-len(nalign[3])-1)+nalign[3]
            site_info['align_5']=' '*(len(nalign[0])-len(nalign[4])-1)+nalign[4]
            temp_dict['mut_info']=mut_info
            temp_dict['utr_info']=utr_info
            temp_dict['site_info']=site_info
            temp_json[str(temp_id)]=temp_dict
        json.dump(temp_json,out)
        outInfo("pair:"+nline[8]+"\t"+mut_id+'\n'"total site:"+str(temp_id)+'\n'+"mut in site:"+str(mut_in_site)+'\n'+"mut_notin_site:"+str(mut_notin_site)+'\n'+"match_site:"+str(item)+'\n'+"unmatch:"+str(unmatch)+'\n')
        if (unmatch !=0):
            outInfo("fix:"+nline[8]+'_'+mut_id)
        #print("invalid site:"+str(no_snp_site_count))
                


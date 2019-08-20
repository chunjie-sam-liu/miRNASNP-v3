import json,sys

#there are 598 snps in seed with multiple alleles, 51 of them are predicted by each allele, 547 are left

def getJson():
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/snp_in_seed_4666.rela.snv.json") as infile:
        rela_dict = json.load(infile)
        return rela_dict

def getMirseq():
    with open("/home/fux/fux/miRNASNP3/data/miRbase/muture.fa.hsa.json") as infile:
        mirseq_dict = json.load(infile)
        return mirseq_dict

rela_dict = getJson()
mirseq_dict = getMirseq()
item = 0
RULE1 = {'A':'T','U':'A','G':'C','C':'G','N':'N'}
RULE2 = {'A':'A','U':'T','G':'G','C':'C','N':'N'}
RULE3 = {'A':'U','T':'A','G':'C','C':'G','N':'N'}
RULE4 = {'A':'A','T':'U','G':'G','C':'C','N':'N'}

with open(sys.argv[2],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
#            print("now:"+line.strip())
            snv_line = rela_dict[line.strip()]
 #           print("line:"+snv_line)
            nl = snv_line.split()
            mir = nl[11].split(':')[1]
            if nl[13] == '-':
                mirseq = "".join(map(lambda x:RULE1[x],mirseq_dict[mir].upper()))
                distance = int(nl[10])-int(nl[1])
            else:
                mirseq = "".join(map(lambda x:RULE2[x],mirseq_dict[mir].upper()))
                distance = int(nl[1])-int(nl[9])+1
  #          print(mirseq)
            ref = nl[3]
            alt = nl[4].split(',')
   #         print("ref: "+ref)
    #        print("distance:"+str(distance))
            curseq = list(mirseq)
     #       print("in ref locate is:"+curseq[distance])
            if curseq[distance] == ref:
                for curalt in alt:
                    item+=1
                    curseq[distance] = curalt
                    if nl[13] == '-':
                        alt_seq = "".join(map(lambda x:RULE3[x],curseq))
                    else:
                        alt_seq = "".join(map(lambda x:RULE4[x],curseq))
                    out.write('>'+mir+'#'+nl[2]+'#'+ref+'#'+curalt+'\n')
                    out.write(alt_seq+'\n')
        print("item:"+str(item))            
        
        
        


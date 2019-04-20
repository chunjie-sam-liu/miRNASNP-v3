import json,re

def getMirseq():
    with open("wild_hsa_mir.fa.json") as mirj:
        mirseq_dict = json.load(mirj)
        return mirseq_dict

def preDeal(line):
    line_dict = {}
    line = line.split()
    line_dict['snp_id'] = line[2]
    line_dict['ref'] = line[3]
    line_dict['alt'] = line[4]
    line_dict['vtype'] = re.findall(r';VC=([A-Z]+)',line[7])[0]
    if line_dict['vtype'] != "SNV":
#        print(line_dict)
        return 0
    line_dict['distance'] = int(line[1]) - int(line[9])
    line_dict['mir_id'] = line[11].split(':')[1]
    line_dict['strand'] = line[13]
    if line_dict['strand'] == '-':
        newseq = "".join(map(lambda x:RULE1[x],mirseq_dict[line_dict['mir_id']]))[::-1]
    else:
        newseq = mirseq_dict[line_dict['mir_id']]
    line_dict['seq'] = newseq
    return line_dict

def altSeq():
    item = 0
    with open("xy_altseq.fa","a") as out:
        with open("xy_snp_in_mirseed") as infile:
            line = infile.readline().strip()
            while line:
#                print("now:"+ line)
                line_dict = preDeal(line)
#                print(line_dict)
                if line_dict:
                    alt = line_dict['alt'].split(',')
                    item += len(alt)
                    for curalt in alt:
                        seq = list(line_dict['seq'])
                        if seq[line_dict['distance']] == RULE2[line_dict['ref']]:
                            seq[line_dict['distance']] = RULE2[curalt]
                        if line_dict['strand'] == '-':
                            altseq = "".join(map(lambda x:RULE1[x],seq))[::-1]
                        else:
                            altseq = ''.join(seq)
                        out.write(">"+line_dict['mir_id']+"_"+line_dict['snp_id']+"\n")
                        out.write(altseq + "\n")
                line = infile.readline().strip()
        print("Count items:"+str(item))

if __name__ == '__main__':
    RULE1={"A":"U","C":"G","G":"C","U":"A"}
    RULE2={"A":"A","C":"C","G":"G","T":"U"}
    mirseq_dict = getMirseq()
    altSeq()

                
                
    
   
                

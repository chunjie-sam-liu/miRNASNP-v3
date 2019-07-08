import sys,json,re

with open(sys.argv[2]) as infile:
    gain_dict=json.load(infile)
with open(sys.argv[3]) as infile:
    info_dict=json.load(infile)

with open(sys.argv[4],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            lkey=nline[0]+'#'+nline[4]+'#'+nline[5]+'#'+nline[1]+'#'+nline[2]+'#'+nline[3]
            infos=info_dict[lkey]
            for info in infos:
                ni=info.split('\t')
                gainkey=ni[7]+'_'+ni[1]
                if gainkey in gain_dict.keys():
                    if ni[0] in gain_dict[gainkey]:
                        out.write(line.strip()+'\t'+info+'\n')
import json,sys,re

with open(sys.argv[2]) as infile:
    info_dict=json.load(infile)

with open(sys.argv[3],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split()
            lkey=nline[0]+'#'+nline[1]+'#'+nline[2]+'#'+nline[3]
            infos=info_dict[lkey]
            for info in infos:
                out.write(line.strip()+'\t'+info+'\n')
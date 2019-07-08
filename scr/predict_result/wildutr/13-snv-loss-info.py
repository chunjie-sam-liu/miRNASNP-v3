import json,sys,re

with open(sys.argv[2]) as infile:
    loss_dict=json.load(infile)

with open(sys.argv[3]) as infile:
    info_dict=json.load(infile)

with open(sys.argv[4],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split()
            infokey=nline[0]+'#'+nline[1]+'#'+nline[2]+'#'+nline[3]
            infos=info_dict[infokey]
            for info in infos:
                ni=re.split(r'\t|#',info)
                lkey=ni[26]+'_'+ni[1]
                if  lkey in loss_dict.keys():
                    if ni[0] in loss_dict[lkey]:
                        out.write(line.strip()+'\t'+info+'\n')
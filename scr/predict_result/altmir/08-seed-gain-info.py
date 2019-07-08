import json,sys,re

with open(sys.argv[2]) as infile:
    gain_dict=json.load(infile)

with open(sys.argv[3],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split('#|\t',line.strip())
            if nline[0].endswith('_alt') or nline[0]=="chrUn_GL000195v1":
                pass
            else:
                lkey=nline[3]+'_'+nline[4]
                if lkey in gain_dict.keys():
                    if nline[5] in gain_dict[lkey]:
                        out.write(line)

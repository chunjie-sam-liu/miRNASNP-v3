import json,sys,re

with open(sys.argv[2]) as infile:
    gain_dict=json.load(infile)

with open(sys.argv[3],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            lkey=nline[1]+'_'+nline[2]
            if lkey in gain_dict.keys():
                if nline[3] in gain_dict[lkey]:
                    out.write(line)
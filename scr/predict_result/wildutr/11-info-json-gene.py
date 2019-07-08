import json,sys,re

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            lkey=nline[26]+'_'+nline[1]
            if lkey in temp_json.keys():
                temp_json[lkey].append(nline[0])
            else:
                temp_json[lkey]=[nline[0]]
        json.dump(temp_json,out)
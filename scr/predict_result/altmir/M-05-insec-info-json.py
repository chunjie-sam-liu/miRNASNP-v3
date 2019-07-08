import json,re,sys

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            lkey=nline[1]+'_'+nline[2]
            if lkey in temp_json.keys():
                temp_json[lkey].append(nline[3])
            else:
                temp_json[lkey]=[nline[3]]
        json.dump(temp_json,out)
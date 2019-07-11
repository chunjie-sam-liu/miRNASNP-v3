import json,sys

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split('\t')
            if nline[0].endswith('_alt') or nline[0]=="chrUn_GL000195v1":
                pass
            else:
                lkey=nline[8]+'_'+nline[9]
                if lkey in temp_json.keys():
                    temp_json[lkey].append(nline[15])
                else:
                    temp_json[lkey]=[nline[15]]
        json.dump(temp_json,out)

import sys,json

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split('\t')
            if nline[0].endswith('_alt') or nline[0]=="chrUn_GL000195v1":
                pass
            else:
                if nline[8] in temp_json.keys():
                    temp_json[nline[8]].append(nline[14])
                else:
                    temp_json[nline[8]]=[nline[14]]
        json.dump(temp_json,out)
import sys,json


with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split()
            if nline[0] in temp_json.keys():
                temp_json[nline[0]].append(nline[1])
            else:
                temp_json[nline[0]]=[nline[1]]
        json.dump(temp_json,out)
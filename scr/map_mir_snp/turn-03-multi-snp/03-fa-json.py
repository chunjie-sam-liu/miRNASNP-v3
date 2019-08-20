import json,sys

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        line=infile.readline()
        while line:
            if line.startswith('>'):
                lkey=line.strip()[1:]
                temp_json[lkey]=infile.readline().strip()
            line=infile.readline()
    json.dump(temp_json,out)
            
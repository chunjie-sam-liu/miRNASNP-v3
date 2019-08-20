import sys,json

with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38.fa") as infile:
    temp_json={}
    line=infile.readline()
    while line:
        if line.startswith('>'):
            lkey=line.strip()[1:]
            seq=infile.readline().strip()
            if len(seq)<6:
                pass
            else:
                temp_json[lkey]=seq
        line=infile.readline()
with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38.over6.json","a") as out:
    json.dump(temp_json,out)
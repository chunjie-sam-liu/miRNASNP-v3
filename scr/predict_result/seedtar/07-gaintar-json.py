import json,sys

in_path="/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_gain_4666/"
out_path="/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_gain_4666_json/"
stat_path="/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_gain_4666_json.stat"

f=sys.argv[1]

with open(out_path+f+".json","a") as out:
    temp_json={}
    with open(in_path+f) as infile:
        temp_json[f]=[]
        for line in infile:
            nline=line.strip().split()
            temp_json[f].append(nline[1])
        json.dump(temp_json,out)

with open(stat_path,"a") as out:
    line=f+'\t'+str(len(temp_json[f]))
    out.write(line+'\n')


import sys,json


with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome") as infile:
    temp_json={}
    for line in infile:
        nline=line.strip().split()
        if nline[2] in temp_json.keys():
            if int(nline[4]) >int(temp_json[nline[2]].split()[4]):
                temp_json[nline[2]]=line.strip()
        else:
            temp_json[nline[2]]=line.strip()

print(str(len(temp_json)))
with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.longest","a") as out:
    for k in temp_json.keys():
        out.write(temp_json[k]+'\n')

with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.longest.fa","a") as out:
    new_json={}
    with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.json") as infile:
        raw_json=json.load(infile)
    for k in temp_json.keys():
        lkey='#'.join(temp_json[k].split())
        new_json[lkey]=raw_json[lkey]
        out.write('>'+lkey+'\n')
        out.write(raw_json[lkey]+'\n')

with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.longest.json","a") as out:
    json.dump(new_json,out)

with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.longest.tgs.txt","a") as out:
    for k in new_json.keys():
        newline=k+'\t9606\t'+new_json[k]
        out.write(newline+'\n')



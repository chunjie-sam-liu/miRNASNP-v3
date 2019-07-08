import json,re

with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/truncate_wildutr_03.key.json","a") as out:
    temp_json={}
    with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/truncate_wildutr_03.fa") as infile:
        line = infile.readline()
        while line:
            if line.startswith('>'):
                nline=re.split(r':|#',line.strip()[1:])
                lkey=nline[0]+':'+nline[7]+'-'+nline[8]+'#'+nline[6] # truncate  region as key
                if lkey in temp_json.keys():
                    temp_json[lkey].append(line.strip()[1:])
                else:
                    temp_json[lkey]=[line.strip()[1:]]
            line=infile.readline()
        json.dump(temp_json,out)

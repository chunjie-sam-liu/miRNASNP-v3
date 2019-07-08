import sys,json

with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/truncate_altutr_03.key.json","a") as out:
    temp_json={}
    with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/truncate_altutr_03.key") as infile:
        for line in infile:
            nline=line.strip().split('#')
            lkey=nline[0]+'#'+nline[5]
            value=nline[8]+'\t'+nline[9]
            temp_json[lkey]=value
        json.dump(temp_json,out)
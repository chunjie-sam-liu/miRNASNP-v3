import sys,json

utr_tgs_file="/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.tgs.txt"
utr_json_file="/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.json"
utr_infile="/home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome"

with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38.over6.json") as infile:
    utr_dict=json.load(infile)

with open(utr_tgs_file,"a") as tgs:
    with open(utr_json_file,"a") as jout:
        temp_json={}
        with open(utr_infile) as infile:
            for line in infile:
                lkey='#'.join(line.strip().split())
                temp_json[lkey]=utr_dict[lkey]
                newline=lkey+'\t9606\t'+utr_dict[lkey]
                tgs.write(newline+'\n')
        json.dump(temp_json,jout)
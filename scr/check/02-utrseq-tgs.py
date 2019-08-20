import sys,json

with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38.over6.tgs.txt","a") as out:
    with open("/home/fux/fux/miRNASNP3/data/genome/total_grch38.over6.json") as infile:
        utr_dict=json.load(infile)
        for k in utr_dict.keys():
            newline=k+'\t9606\t'+utr_dict[k]
            out.write(newline+'\n')
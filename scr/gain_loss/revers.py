import json

with open("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3_02.json","a") as out:
    with open("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3.json") as infile:
        grch38_dict = json.load(infile)
        dict_new=dict(zip(grch38_dict.values(),grch38_dict.keys()))
        json.dump(dict_new,out)

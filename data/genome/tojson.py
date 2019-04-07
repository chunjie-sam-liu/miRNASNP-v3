import json

grch38_utr3 = {}

with open("grch38_utr3.json","a") as out:
    with open("grch38_utr3.bed") as infile:
        for line in infile:
            line = line.strip().split()
            ukey = line[0]+':'+line[1]+'-'+line[2]+'('+line[5]+')'
            grch38_utr3[ukey] = line[3]
    json.dump(grch38_utr3,out) 

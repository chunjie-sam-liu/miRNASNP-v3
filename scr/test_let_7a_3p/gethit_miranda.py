import json

def getJson(infiles):
    with open(infiles) as infile:
        mydict = json.load(infile)
        return mydict

grch38_utr3 = getJson("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3.json")


with open("miranda_wildmir_res.bed","a") as out:
    with open("miranda_wildmir_res.txt") as res:
        for line in res:
            if line:
                if line.startswith('>hsa'):
                    line = line.split()
                    mirid = line[0][5:]
                    utrid = grch38_utr3[line[1]]
                    newline = utrid+':'+mirid+'\t'+line[6]+'\t'+line[7]+'\n'
                    out.write(newline)

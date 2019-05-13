with open("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3_03.json","a") as out:
    with open("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3.bed") as infile:
        utr_dict = {}
        line = infile.readline()
        for line in infile:
            nline = line.strip().split()
            value = nline[0]+":"+nline[1]+"-"+nline[2]+"("+nline[5]+")"
            utr_dict[nline[3]] = value
        json.dump(utr_dict,out)
            
    

import sys

with open("/home/fux/fux/miRNASNP3/Gain_Loss/By_snp_in_seed/chr_tgs_wild.bed") as infile:
    line  = infile.readline()
    while line:
        chro = line.strip().split(':')[0]
        with open("/home/fux/fux/miRNASNP3/Gain_Loss/By_snp_in_seed/tgs_wild_chr_bed/tgs_wild_"+chro,"a") as out:
            out.write(line)
        line = infile.readline()  

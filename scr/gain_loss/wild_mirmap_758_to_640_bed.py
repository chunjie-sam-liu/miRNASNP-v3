import sys

def getMirlist():
    with open("/home/fux/fux/miRNASNP3/target/miRmap/only_mir_with_snp_all") as infile:
        mir_list = []
        for line in infile:
            mir_list.append(line.strip())
        return mir_list

with open("/project/fux/miRNASNP3/target/miRmap/predict/mirmap_res_640_table67.txt","a") as out:
    mir_list = getMirlist()
    with open("/project/fux/miRNASNP3/target/miRmap/predict/mirmap_res_758_table67.txt") as infile:
        line = infile.readline()
        while line:
            nline = line.strip().split()
            if nline[0] in mir_list:
                utrid = nline[1]+':'+nline[2]+'-'+nline[3]+'('+nline[4]+')#'+nline[5]+'#'+nline[6]+'#'+nline[7]+'#'+nline[8]
                site_end_chr = nline[3]+nline[10]-1 #site_end = nline[10]
                site_start_chr = site_end_chr-nline[11] #site_lenth = nline[11]
                newline = utrid+':'+nline[0]+'\t'+site_start_chr+'\t'+site_end_chr
                out.write(newline+'\n')

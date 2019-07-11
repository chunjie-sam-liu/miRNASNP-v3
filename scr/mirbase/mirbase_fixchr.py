import sys

with open("/home/fux/fux/miRNASNP3/data/miRbase/hsa_intchr.gff3","a") as out:
    with open("/home/fux/fux/miRNASNP3/data/miRbase/hsa.gff3") as infile:
        line=infile.readline()
        while line:
            if line.startswith('chr'):
                nline=line.strip().split()
                nline[0]=nline[0][3:]
                newline='\t'.join(nline)
            else:
                newline=line.strip()
            out.write(newline+'\n')
            line=infile.readline()

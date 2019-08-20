import sys,re

with open(sys.argv[2],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split()
            if nline[0].endswith('seq'):
                site_start=nline[3]
                site_end=nline[4]
                newline=nline[1]+'\t'+site_start+'\t'+site_end
                out.write(newline+'\n')
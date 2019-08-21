import sys,re

with open(sys.argv[2],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            if line.startswith('chr'):
                nline=re.split(r':|#|\t',line.strip())
                nl=line.strip().split()
                strand=re.split(r'\(|\)',nline[1])[1]
                position=re.split(r'\(|\)',nline[1])[0].split('-')
                if strand == '-':
                    site_start=int(position[1])-int(nline[9])
                    site_end=int(position[1])-int(nline[8])
                else:
                    site_start=int(position[0])+int(nline[8])
                    site_end=int(position[0])+int(nline[9])
                newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nl[0]
                out.write(newline+'\n')
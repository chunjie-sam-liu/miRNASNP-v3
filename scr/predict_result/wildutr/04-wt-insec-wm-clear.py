import re,sys

with open(sys.argv[2],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split(r'\t',line.strip())
            if nline[3] == nline[7]:
                out.write(line)
import sys

with open(sys.argv[2],"a") as out:
    with open(sys.argv[1]) as infile:
        line=infile.readline()
        while line:
            if line.startswith('>'):
                mirna_rs=line.strip()[1:]
                seq=infile.readline()
                newline=mirna_rs+'\t'+seq[1:7]+'\t9606'
                out.write(newline+'\n')
            line=infile.readline()
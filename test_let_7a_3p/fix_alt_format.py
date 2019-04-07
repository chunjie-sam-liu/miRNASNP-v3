import re,sys

def changeFormat(infile,outfile):
    with open(outfile,"a") as out:
        with open(infile) as infile:
            for line in infile:
                line = line.strip().split()
                partid = re.findall(r'(ENST.*)_(rs.*)',line[0])[0]
                newline = partid[0]+'\t'+line[1]+'\t'+line[2]+'\t'+partid[1]+'\n'
                out.write(newline)


if len(sys.argv)!=3:
    print("usage:"+sys.argv[0]+"\tinfile\toutfile\n")
else:
    changeFormat(sys.argv[1],sys.argv[2])
#print(sys.argv[0],sys.argv[1])

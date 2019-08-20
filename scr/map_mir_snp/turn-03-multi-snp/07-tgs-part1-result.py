import os

with open(sys.argv[1]) as infile:
    for line in infile:
        if line.startswith('chr'):
            nline=line.strip().split()
            with open("/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_t03_547_res/"+nline[1]+".res","a") as out:
                out.write(line)

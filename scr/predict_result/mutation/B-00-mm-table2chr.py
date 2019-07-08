import sys

out_path="/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr/"

with open(sys.argv[1]) as infile:
    for line in infile:
        nline=line.strip().split()
        with open(out_path+nline[2],"a") as out:
            out.write(line)

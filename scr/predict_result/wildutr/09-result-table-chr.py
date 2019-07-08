import sys

out_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/result_table_chr/"

with open(sys.argv[1]) as infile:
    for line in infile:
        if line.startswith('hsa'):
            nline=line.strip().split()
            with open(out_path+nline[2],"a") as out:
                out.write(line)


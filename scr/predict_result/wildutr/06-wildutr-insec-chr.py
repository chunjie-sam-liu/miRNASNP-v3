import os

out_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/wm_insec_wt_chr/"
in_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear/"

files=os.listdir(in_path)

for f in files:
    with open(in_path+f) as infile:
        for line in infile:
            nline=line.strip().split()
        with open(out_path+nline[0],"a") as out:
            out.write(line)
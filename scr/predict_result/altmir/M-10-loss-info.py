import json,sys,re

with open(sys.argv[1]) as infile:
    loss_dict=json.load(infile)

info_path="/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info/"
out_path="/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss_info/"

for k in loss_dict.keys():
    mirna=k.split('_')[0]
    with open(info_path+mirna) as infile:
        for line in infile:
            nline=line.split()
            if nline[14] in loss_dict[k]:
                with open(out_path+k,"a") as out:
                    out.write(line)

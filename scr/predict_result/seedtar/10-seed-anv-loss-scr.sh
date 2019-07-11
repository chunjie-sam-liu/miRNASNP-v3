#!/usr/bin/bash

insec_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info_json
unin_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_unin_sm_json
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_02
stat_file=/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_02.stat

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/10-seed-snv-loss.py

for f in `ls ${unin_path}`
do
  mirna=${f%%_*}
  mirna_rs=${f%%.*}
  echo "python ${script} ${insec_path}/${mirna}.json ${unin_path}/${f} ${out_path}/${mirna_rs}.json ${stat_file}">>10-seed-snv-loss-scrs.sh
done 
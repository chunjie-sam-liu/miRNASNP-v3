#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info
loss_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_02
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_info_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/11-seed-snv-loss-info.py

for f in `ls ${loss_path}`
do
  mirna_rs=${f%%.*}
  mirna=${f%%_*}
  echo "python ${script} ${in_path}/${mirna} ${loss_path}/${f} ${out_path}/${mirna_rs}">>11-seed-snv-loss-info-scrs.sh
done

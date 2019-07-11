#!/usr/bin/bash 

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear
loss_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_loss_02
info_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_mm_json

out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_loss_info_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/13-snv-loss-info.py

for f in `ls ${in_path}`
do
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${loss_path}/${fi}.json ${info_path}/${fi}.json ${out_path}/${fi}">>13-snv-loss-info-scrs.sh
done
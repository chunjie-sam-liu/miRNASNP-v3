#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm_clear
gain_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_cosmic_gain
info_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr_json
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_cosmic_gain_info

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-08-cosmic-gain-info.py

for f in `ls ${in_path}`
do
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${gain_path}/${fi}.json ${info_path}/${fi}.json ${out_path}/${fi}">>B-08-cosmic-gain-info-scrs.sh
done
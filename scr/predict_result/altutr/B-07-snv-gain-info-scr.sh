#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed
gain_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_02
info_path=/home/fux/fux/miRNASNP3/predict_result/altutr/miRmap/mirmap_altutr_table_chr_bed_json
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_info_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-07-snv-gain-info.py

for f in `ls ${in_path}`
do
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${gain_path}/${fi}.json ${info_path}/${fi}.json ${out_path}/${fi}">>B-07-snv-gain-info-scrs.sh
done
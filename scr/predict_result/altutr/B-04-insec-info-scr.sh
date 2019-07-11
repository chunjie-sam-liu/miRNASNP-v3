#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed
info_path=/home/fux/fux/miRNASNP3/predict_result/altutr/miRmap/mirmap_altutr_table_chr_bed_json
out_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed_info

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-04-insec-info.py

for f in `ls ${in_path}`
do 
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${info_path}/${fi}.json ${out_path}/${fi}">>B-04-insec-info-scrs.sh
done
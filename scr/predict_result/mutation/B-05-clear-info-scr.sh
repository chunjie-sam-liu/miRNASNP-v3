#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm_clear
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm_clear_info
info_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-05-clear-info.py

for f in `ls ${in_path}`
do 
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${info_path}/${fi}.json ${out_path}/${fi}">>B-05-clear-info-scrs.sh
done
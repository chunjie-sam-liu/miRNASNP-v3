#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear
info_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_mm_json
out_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear_info

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/10-f04-insec-clear-info.py

for f in `ls ${in_path}`
do
  fi=${f%%.*}
  #echo ${fi}
  echo "python ${script} ${in_path}/${f} ${info_path}/${fi}.json ${out_path}/${fi}">>10-f04-insec-clear-info-scrs.sh
done
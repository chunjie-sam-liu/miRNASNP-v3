#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear
info_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_json
out_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/04-A-clear-info.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${info_path}/${f}.json ${out_path}/${f}">>04-A-clear-info-scrs.sh
done
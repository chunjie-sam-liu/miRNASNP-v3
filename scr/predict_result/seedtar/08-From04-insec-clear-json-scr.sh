#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info
out_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/08-From04-insec-clear-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>08-From04-insec-clear-json-scrs.sh
done
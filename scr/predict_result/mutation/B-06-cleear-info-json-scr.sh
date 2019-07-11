#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm_clear_info
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm_clear_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-06-clear-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>B-06-clear-info-json-scrs.sh
done
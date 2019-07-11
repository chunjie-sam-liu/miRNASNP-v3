#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st_info
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-05-insec-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>M-05-insec-info-json-scrs.sh
done
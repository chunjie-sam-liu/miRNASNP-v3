#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed_info
out_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-05-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>B-05-info-json-scrs.sh
done
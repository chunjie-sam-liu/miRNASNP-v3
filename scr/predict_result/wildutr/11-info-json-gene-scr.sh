#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear_info
out_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/11-info-json-gene.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>11-info-json-gene-scrs.sh
done
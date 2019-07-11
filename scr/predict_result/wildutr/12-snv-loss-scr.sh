#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear_info_json/
script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/12-snv-loss.py

#echo "python ${script} chrY.json"

for f in `ls ${in_path}`
do
  echo "python ${script} ${f}">>12-snv-loss-scrs.sh
done
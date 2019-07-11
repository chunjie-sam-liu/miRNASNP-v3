#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_unin_wm_2652
out_path=/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_unin_wm_2652_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/07-wt-unin-wm-json.py

for f in `ls ${in_path}`
do 
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>07-wt-unin-wm-json-scrs.sh
done
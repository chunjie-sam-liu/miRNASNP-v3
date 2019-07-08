#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_unin_sm
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_unin_sm_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/09-st-unin-sm-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>09-st-unin-sm-json-scrs.sh
done
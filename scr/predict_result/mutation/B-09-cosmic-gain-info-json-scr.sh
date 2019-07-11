#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_cosmic_gain_info
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_cosmic_gain_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-09-cosmic-gain-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>B-09-cosmic-gain-info-json-scrs.sh
done
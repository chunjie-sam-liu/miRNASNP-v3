#1/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_gain_info_02
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_gain_info_json_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/09-seed-gain-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>09-seed-gain-info-json-scrs.sh
done
#1/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_info_02
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_loss_info_json_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/12-seedsnv-loss-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>12-seedsnv-loss-info-json-scrs.sh
done
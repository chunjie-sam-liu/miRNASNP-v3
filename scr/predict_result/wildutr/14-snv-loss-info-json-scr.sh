#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_loss_info_02
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_loss_info_json_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/14-snv-loss-info-json.py

for f in `ls ${in_path}`
do 
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>14-snv-loss-info-json-scrs.sh
done
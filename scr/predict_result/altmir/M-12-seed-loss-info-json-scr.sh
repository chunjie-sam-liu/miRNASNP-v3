#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss_info
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-12-seed-loss-info-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>M-12-seed-loss-info-json-scrs.sh
done

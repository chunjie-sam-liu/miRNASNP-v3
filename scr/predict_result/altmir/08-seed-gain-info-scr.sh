#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear_info
gain_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_gain_02

out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_gain_info_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/08-seed-gain-info.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${gain_path}/${f}.json ${out_path}/${f}">>08-seed-gain-info-scrs.sh
done
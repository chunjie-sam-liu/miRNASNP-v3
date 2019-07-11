#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st_info
gain_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_gain
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_gain_info

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-07-gain-info.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${gain_path}/${f}.json ${out_path}/${f}">>M-07-gain-info-scrs.sh
done
#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm
out_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/04-wt-insec-wm-clear.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>04-wt-insec-wm-clear-scrs.sh
done
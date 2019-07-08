#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed_clear

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-03-st-insec-sm-clear.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>B-03-st-insec-sm-clear-scrs.sh
done


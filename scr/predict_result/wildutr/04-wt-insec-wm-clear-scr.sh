#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm
out_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear

for f in `ls ${in_path}`
do
  echo "python /home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/04-wt-insec-wm-clear.py ${in_path}/${f} ${out_path}/${f}">>04-wt-insec-wm-clear-scrs.sh
done
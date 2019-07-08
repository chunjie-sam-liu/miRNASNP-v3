#!/usr/bin/bash

data_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear

for f in ` ls ${data_path}`
do
  echo "cat ${data_path}/${f}|sort -u >${data_path}/${f}.uniq">>04-wt-insec-wm-lear-uniq-scrs.sh
done
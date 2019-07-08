#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm
out_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear

for f in `ls ${in_path}`
do
  echo "awk 'OFS=\"\t\"{if(\$4==\$8)print \$0}' ${in_path}/${f}>${out_path}/${f}">>04-wt-insec-wm-clear-scrs.sh
done
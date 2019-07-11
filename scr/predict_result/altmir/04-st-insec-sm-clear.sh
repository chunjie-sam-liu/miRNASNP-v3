#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear

for f in `ls ${in_path}`
do
  echo "awk 'OFS=\"\t\"{if(\$4==\$8)print \$0}' ${in_path}/${f}>${out_path}/${f}">>04-st-insec-sm-clear-scrs.sh
done
#!/usr/bin/bash

insec_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed_info_json
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_02

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-06-snv-gain.py

for f in `ls ${insec_path}`
do
  fi=${f%%.*}
  echo "python ${script} ${insec_path}/${f} ${out_path}/${f} ${out_path}/${fi}.stat">>B-06-snv-gain-scrs.sh
done
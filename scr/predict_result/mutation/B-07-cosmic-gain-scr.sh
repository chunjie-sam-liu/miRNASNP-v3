#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm_clear_info_json
out_path=/home/fux/fux/miRNASNP3/Gain_Loss/utr_cosmic_gain

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-07-cosmic-gain.py

for f in `ls ${in_path}`
do
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${out_path}/${fi}.json ${out_path}/${fi}.stat">>B-07-cosmic-gain-scrs.sh
done
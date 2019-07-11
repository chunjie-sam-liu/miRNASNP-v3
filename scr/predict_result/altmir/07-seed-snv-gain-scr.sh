#!/usr/bin/bash

insec_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear_info_json
unin_path=/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_unin_wm_2652_json

out_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_gain_02
stat_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_gain_02.stat

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/07-seed-snv-gain.py

for f in `ls ${insec_path}`
do
  mirna=${f%%_*}
  mirna_rs=${f%%.*}
  echo "python ${script} ${insec_path}/${f} ${unin_path}/${mirna}.json ${out_path}/${mirna_rs}.json ${stat_path}">>07-seed-snv-gain-scrs.sh
done
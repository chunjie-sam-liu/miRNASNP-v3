#!/usr/bin/bash

wt_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/tgs_wild_mir_bed_sort
wm_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_bed_sort
out_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm

for f in `ls ${wt_path}`
do
  fi=${f%%.*}
  echo "bedtools intersect -sorted -a ${wm_path}/${f} -b ${wt_path}/${f} -wa -wb >${out_path}/${fi}">>03-wt-insec-wm-scrs.sh
done
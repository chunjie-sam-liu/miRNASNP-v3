#!/usr/bin/bash

sm_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed_sort
st_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/tgs_altmir_mir240_bed_sort

out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st

for f in `ls ${sm_path}`
do
  fi=${f%%.*}
  echo "bedtools intersect -sorted -a ${sm_path}/${f} -b ${st_path}/${fi} -wa -wb >${out_path}/${fi}">>M-03-st-insec-sm-scrs.sh
done
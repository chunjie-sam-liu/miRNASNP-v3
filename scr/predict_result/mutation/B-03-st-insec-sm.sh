#!/usr/bin/bash

sm_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr_bed_sort
st_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_tgs_chr_suply_bed_sort

out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/st_insec_sm

for f in `ls ${sm_path}`
do
  echo "bedtools intersect -sorted -a ${sm_path}/${f} -b ${st_path}/${f} -wa -wb >${out_path}/${f}">>B-03-st-insec-sm-scrs.sh
done
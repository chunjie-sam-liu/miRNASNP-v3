#!/usr/bin/bash

st_path=/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_bed_sort
sm_path=/home/fux/fux/miRNASNP3/predict_result/altutr/miRmap/mirmap_altutr_table_chr_bed_sort

out_path=/home/fux/fux/miRNASNP3/predict_result/altutr/st_insec_sm_bed

for f in `ls ${st_path}`
do
  echo "bedtools intersect -sorted -a ${sm_path}/${f} -b ${st_path}/${f} -wa -wb >${out_path}/${f}">>B-02-st-insec-sm-scrs.sh
done  
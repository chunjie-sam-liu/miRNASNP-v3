#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_bed_02
out_path=/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_bed_sort

for f in `ls ${in_path}`
do
  echo "bedtools sort -i ${in_path}/${f} >${out_path}/${f}">>B-02-a-bedsort-tgs-scrs.sh
done
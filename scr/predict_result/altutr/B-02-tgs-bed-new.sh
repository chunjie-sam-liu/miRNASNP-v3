#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_bed_02

for f in `ls ${in_path}`
do
  echo "awk '{print \$1\"#\"\$4\"\\\t\"\$2\"\\\t\"\$3}' ${in_path}/${f} >${out_path}/${f}">>B-02-tgs-bed-new-scrs.sh
done
#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/miRmap/mirmap_altutr_table_chr
out_bed=/home/fux/fux/miRNASNP3/predict_result/altutr/miRmap/mirmap_altutr_table_chr_bed
out_json=/home/fux/fux/miRNASNP3/predict_result/altutr/miRmap/mirmap_altutr_table_chr_bed_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-01-altutr-mm-bed.py

for f in   `ls ${in_path}`
do
  fi=${f%%.*}
  echo "python ${script} ${in_path}/${f} ${out_json}/${fi}.json ${out_bed}/${f}">>B-01-altutr-mm-bed-scrs.sh
done
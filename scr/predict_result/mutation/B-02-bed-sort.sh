#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_tgs_chr_suply_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_tgs_chr_suply_bed_sort

for f in `ls ${in_path}`
do
  echo "bedtools sort -i ${in_path}/${f} >${out_path}/${f}">>B-02-bed-sort-scrs.sh
done
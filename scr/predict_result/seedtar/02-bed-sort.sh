#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_bed_sort

for f in `ls ${in_path}`
do
  echo "bedtools sort -i ${in_path}/${f} >${out_path}/${f}.sort">>02-bed-sort-scrs.sh
done
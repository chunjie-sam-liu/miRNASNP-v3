#!/usr/bin/bash

tgs_bed=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_tgs_bed
sort_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_tgs_bed_sort

for f in `ls ${tgs_bed}`
do
  echo "bedtools sort -i ${tgs_bed}/${f} >${sort_path}/${f}" >>02-tgs-bed-sort-scrs.sh
done
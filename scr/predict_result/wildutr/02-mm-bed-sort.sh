#!/usr/bin/bash

mm_bed=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_mm_bed
sort_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_mm_bed_sort



for f in `ls ${mm_bed}`
do
  echo "bedtools sort -i ${mm_bed}/${f} >${sort_path}/${f}">>02-mm-bed-sort-scrs.sh
done
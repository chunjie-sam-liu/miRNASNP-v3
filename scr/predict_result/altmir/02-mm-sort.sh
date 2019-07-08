#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mir_bed_4666_mirs_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mir_bed_4666_mirs_bed_sort

for f in `ls ${in_path}`
do 
  echo "bedtools sort -i ${in_path}/${f} >${out_path}/${f}">>02-mm-sort-scrs.sh
done
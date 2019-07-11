#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mir_bed_4666_mirs
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mir_bed_4666_mirs_sort

for f in `ls ${in_path}`
do
  echo "bedtools sort -i ${in_path}/${f}>${out_path}/${f}">>02-tgs-sort-scrs.sh
done
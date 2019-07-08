#!/usr/bin/bash 

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed_new
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed_sort

for f in `ls ${in_path}`
do
  echo "bedtools sort -i ${in_path}/${f} >${out_path}/${f}">>M-02-sort-mm-scrs.sh
done
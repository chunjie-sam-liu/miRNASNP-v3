#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed_new

for f in `ls ${in_path}`
do
  echo "awk '{print \$1\"#\"\$4\"\\\t\"\$2\"\\\t\"\$3}' ${in_path}/${f} >${out_path}/${f}">>M-01-mm-newbed-scrs.sh
done
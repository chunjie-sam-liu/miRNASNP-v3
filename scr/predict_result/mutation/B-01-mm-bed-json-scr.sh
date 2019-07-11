#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr
bed_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr_bed
json_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply_chr_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-01-mm-bed-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${bed_path}/${f}.bed ${json_path}/${f}.json">>B-01-mm-bed-json-scrs.sh
done
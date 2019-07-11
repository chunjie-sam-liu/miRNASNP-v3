#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_tgs_chr

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-01-tgs-bed-json.py

for f in ` ls ${in_path}`
do
  echo "python ${script} ${f}">>B-01-tgs-bed-json-scrs.sh
done
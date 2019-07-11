#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/cosmic_mm_table_suply

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/mutation/B-00-mm-table2chr.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f}" >>B-00-mm-table2chr-scrs.sh
done
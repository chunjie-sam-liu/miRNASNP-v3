#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/result_table
script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/09-result-table-chr.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f}" >>09-result-table-chr-scrs.sh
done

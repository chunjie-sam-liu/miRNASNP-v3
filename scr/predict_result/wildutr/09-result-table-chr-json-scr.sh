#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/result_table_chr
out_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/result_table_chr_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/09-result-table-chr-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>09-result-table-chr-json-scrs.sh
done
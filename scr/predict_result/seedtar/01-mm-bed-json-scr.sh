#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_2652
bed_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_bed
json_path=/home/fux/fux/miRNASNP3/predict_result/seed_target/mm_wild_mir_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/01-mm-bed-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${bed_path}/${f}.bed ${json_path}/${f}.json">>01-mm-bed-json-scrs.sh
done
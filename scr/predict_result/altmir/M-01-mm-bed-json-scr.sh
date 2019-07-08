#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240
bed_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed
json_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-01-mm-bed-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${bed_path}/${f}.bed ${json_path}/${f}.json">>M-01-mm-bed-json-scrs.sh
done
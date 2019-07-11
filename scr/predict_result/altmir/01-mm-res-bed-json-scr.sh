#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mirs_4666
bed_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mir_bed_4666_mirs_bed
json_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mir_bed_4666_mirs_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/01-mm-res-bed-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${bed_path}/${f}.bed ${json_path}/${f}.json">>01-mm-res-bed-json-scrs.sh
done
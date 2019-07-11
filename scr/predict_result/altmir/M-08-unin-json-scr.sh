#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/st_unin_sm
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/st_unin_sm_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-08-unin-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}" >>M-08-unin-json-scrs.sh
done
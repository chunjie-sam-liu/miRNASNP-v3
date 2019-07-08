#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/tgs_altmir_mir240

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-01-tgs-bed-json.py

for f in `ls ${in_path}`
do 
  echo "python ${script} ${in_path}/${f}">>M-01-tgs-bed-json-scrs.sh
done
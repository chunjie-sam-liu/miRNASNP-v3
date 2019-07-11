#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_gain_4666

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/07-gaintar-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${f}">>07-gaintar-json-scrs.sh
done
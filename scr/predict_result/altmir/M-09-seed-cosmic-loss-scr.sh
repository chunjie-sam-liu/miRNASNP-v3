#1/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/st_unin_sm_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-09-seed-cosmic-loss.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${f}">>M-09-seed-cosmic-loss-scrs.sh
done
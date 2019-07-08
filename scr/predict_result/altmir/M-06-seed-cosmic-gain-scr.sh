#1/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-06-seed-cosmic-gain.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${f}">>M-06-seed-cosmic-gain-scrs.sh
done
#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st
out_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st_info
info_path=/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/mm_altmir_mir240_bed_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-04-insec-info.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${info_path}/${f}.json ${out_path}/${f}">>M-04-insec-info-scrs.sh
done

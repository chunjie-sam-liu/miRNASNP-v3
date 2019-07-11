#!/usr/bin/bash

in_path=/project/fux/miRNASNP3/target/TargetScan/altmir_481_res

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/00-tgs-res-bed-481.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f}">>00-tgs-res-bed-481-scrs.sh
done
#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/By_snp_in_seed/tgs_altmir_mir_bed

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/00-tgs-res-bed.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f}">>00-tgs-res-bed-scrs.sh
done
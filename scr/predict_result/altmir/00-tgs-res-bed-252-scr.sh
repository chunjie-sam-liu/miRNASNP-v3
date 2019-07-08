#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mirs_252
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mir_bed_252_mirs

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/00-tgs-res-bed-252.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}">>00-tgs-res-bed-252-scrs.sh
done
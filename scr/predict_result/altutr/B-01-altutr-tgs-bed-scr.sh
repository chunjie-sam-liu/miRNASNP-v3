#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altutr/B-01-altutr-tgs-bed.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${f}">>B-01-altutr-tgs-bed-scrs.sh
done

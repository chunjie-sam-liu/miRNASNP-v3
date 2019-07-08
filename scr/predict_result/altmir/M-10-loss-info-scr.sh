#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/M-10-loss-info.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f}">>M-10-loss-info-scrs.sh
done
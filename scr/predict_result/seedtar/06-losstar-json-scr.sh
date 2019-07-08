#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_loss_4666

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/seedtar/06-losstar-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${f}" >>06-losstar-json-scrs.sh
done
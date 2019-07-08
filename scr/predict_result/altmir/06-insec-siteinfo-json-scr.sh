#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear_info
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear_info_json

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/06-insec-siteinfo-json.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json">>06-insec-siteinfo-json-scrs.sh
done
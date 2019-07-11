#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear
info_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mir_bed_4666_mirs_json
out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed_clear_info

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/altmir/05-st-insec-sm-siteinfo.py

for f in `ls ${in_path}`
do
  echo "python ${script} ${in_path}/${f} ${info_path}/${f}.json ${out_path}/${f}">>05-st-insec-sm-siteinfo-scrs.sh
done
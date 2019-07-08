#!/usr/bin/bash

st_path=/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mir_bed_4666_mirs_sort
sm_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_mir_bed_4666_mirs_bed_sort

out_path=/home/fux/fux/miRNASNP3/predict_result/altmir/st_intersect_sm_bed

for f in `ls ${st_path}`
do
  echo "bedtools intersect -sorted -a ${sm_path}/${f}.bed -b ${st_path}/${f} -wa -wb >${out_path}/${f}">>03-st-insec-sm-scrs.sh
done
#1/usr/bin/bash

wm_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_mm_bed_sort
wt_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_tgs_bed_sort
out_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm

for f in `ls ${wm_path}`
do
  echo "bedtools intersect -sorted -a ${wm_path}/${f} -b ${wt_path}/${f} -wa -wb >${out_path}/${f}.insec" >>03-wt-insec-wm-scrs.sh
done
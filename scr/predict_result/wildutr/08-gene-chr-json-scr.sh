#!/usr/bin/bash

in_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wm_insec_wt_chr
out_path=/home/fux/fux/miRNASNP3/predict_result/wildutr/wm_insec_wt_gene_json_chr

script=/home/fux/fux/github/miRNASNP3/scr/predict_result/wildutr/08-gene-chr-json.py

for f in `ls ${in_path}`
do
    echo "python ${script} ${in_path}/${f} ${out_path}/${f}.json" >>08-gene-chr-json-scrs.sh
done
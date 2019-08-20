#!/usr/bin/bash

result_path=/home/fux/fux/miRNASNP3/predict_result/altmir/mm_altmir_t03_547_res

while read mirs
do
    echo "python2 /home/fux/fux/github/miRNASNP3/scr/map_mir_snp/turn-03-multi-snp/05-t03-run-mirmap.py ${mirs} ${result_path}/${mirs}.res">>05-t03-mirmap-scrs-part2.sh
done</home/fux/fux/github/miRNASNP3/scr/map_mir_snp/turn-03-multi-snp/mirmap_fail.files
#/home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03.keys
#!/bin/bash

cd /home/fux/fux/miRNASNP3/data/dbsnp/VCF
bedfiles=$(ls x*.bed)
for bed in ${bedfiles};do
	bedtools coverage -a /home/fux/fux/miRNASNP3/data/genome/grch38_utr3.bed -b ${bed} > ${bed}.utr3.coverage 
done

coveragefile=$(ls *.utr3.coverage)
for coverage in ${coveragefile};do
	awk '$5>0{print $0}' ${coverage} >${coverage}.filter
done

mv *.utr3.coverage.filter /home/fux/fux/miRNASNP3/map_utr3_snp/seedregion/
 

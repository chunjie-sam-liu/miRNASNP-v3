#!/bin/bash

#cd /home/fux/fux/miRNASNP3/data/dbsnp/VCF
#bedfiles=$(ls x*.bed)
#for bed in ${bedfiles};do
#	bedtools coverage -a /home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/grch38p12.flanks.bed -b ${bed} > ${bed}.flank.coverage 
#done

#coveragefile=$(ls *.flank.coverage)
#for coverage in ${coveragefile};do
#	awk '$5>0{print $0}' ${coverage} >${coverage}.filter
#done

bedtools intersect -a grch38p21.flank.cov.bed -b /home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/mirflanks.b.bed -wa -wb >flanks_mir_relate

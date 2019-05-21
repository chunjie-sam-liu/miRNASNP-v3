#!/bin/bash

#cd /home/fux/fux/miRNASNP3/data/dbsnp/VCF
#bedfiles=$(ls x*.bed)
#for bed in ${bedfiles};do
#	bedtools coverage -a /home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/grch38p12.seedregion.bed -b ${bed} > ${bed}.seedregion.coverage 
#done

#coveragefile=$(ls *.seedregion.coverage)
#for coverage in ${coveragefile};do
#	awk '$5>0{print $0}' ${coverage} >${coverage}.filter
#done

#mv *.seedregion.coverage.filter /home/fux/fux/miRNASNP3/map_mir_snp/seedregion/

#bedtools getfasta -fi /home/fux/fux/miRNASNP3/data/genome/hg38.fa -bed snp_in_seedregion.mir.bed -fo snp_in_seedregion.mir.fa
 
#awk '{print $4}' snp_in_seedregion |while read line
#do
	#grep -w to ensure accurate matching 
	#grep -w ${line} /home/fux/fux/miRNASNP3/data/dbsnp/VCF/GCF_000001405.38.vcf >>snp_in_seedregion.vcf
#	grep -w ${line} snp_in_seedregion.vcf >>snp_in_seedregion_b.vcf
#done

#awk '{OFS='\t'}{if($1!~/^NW|^NT/)print $0}' snp_in_seedregion_b.vcf >snp_in_seedregion_c.vcf

#cat rs_seed.add|while read line
#do 
#	grep -w ${line} /home/fux/fux/miRNASNP3/data/dbsnp/VCF/GCF_000001405.38.vcf >>snp_in_seedregion_d.vcf
#done

awk '{OFS='\t'}{if($1!~/^NW|^NT/)print $0}' snp_in_seedregion_d.vcf >snp_in_seedregion_d_1.vcf

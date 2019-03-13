# bedtools coverage -a /home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/grch38p12_hsa.bed -b /home/fux/fux/miRNASNP3/data/dbsnp/VCF/GCF_000001405.38.bed & 
#!/bin/bash
cd /home/fux/fux/miRNASNP3/map_mir_snp
files_name=$(ls *.coverage)
for file in ${files_name};do
	awk '$5>0{print $0}'  ${file} > ${file}.filter
done

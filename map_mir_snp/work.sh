# bedtools coverage -a /home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/grch38p12_hsa.bed -b /home/fux/fux/miRNASNP3/data/dbsnp/VCF/GCF_000001405.38.bed & 
#!/bin/bash
cd /home/fux/fux/miRNASNP3/map_mir_snp
files_name=$(ls *.coverage)
for file in ${files_name};do
	awk '$5>0{print $0}'  ${file} > ${file}.filter
done

awk '{print $1"\t"$2"\t"$3"\t"$4"_"$5}' grch38.coverage.filter >grch38.coverage.filter.bed

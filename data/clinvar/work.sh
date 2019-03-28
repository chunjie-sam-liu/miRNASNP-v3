awk '{if($1!~/^#/)print "chr"$1"\t"$2"\t"$2+1"\t"$3}' clinvar.vcf>clinvar.bed

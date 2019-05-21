awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr18.anno >temp.chr18
cat ../snp_in_utr3.chr18 temp.chr18 temp.chr18|sort|uniq -u >snp_in_utr3_b.chr18
python ../work_utr3.py snp_in_utr3_b.chr18 snp_in_utr3_b.chr18.anno

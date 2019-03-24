awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr13.anno >temp.chr13
cat ../snp_in_utr3.chr13 temp.chr13 temp.chr13|sort|uniq -u >snp_in_utr3_b.chr13
python ../work_utr3.py snp_in_utr3_b.chr13 snp_in_utr3_b.chr13.anno

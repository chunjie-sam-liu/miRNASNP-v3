awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr22.anno >temp.chr22
cat ../snp_in_utr3.chr22 temp.chr22 temp.chr22|sort|uniq -u >snp_in_utr3_b.chr22
python ../work_utr3.py snp_in_utr3_b.chr22 snp_in_utr3_b.chr22.anno

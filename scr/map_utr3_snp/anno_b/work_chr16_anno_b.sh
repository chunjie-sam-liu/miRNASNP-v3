awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr16.anno >temp.chr16
cat ../snp_in_utr3.chr16 temp.chr16 temp.chr16|sort|uniq -u >snp_in_utr3_b.chr16
python ../work_utr3.py snp_in_utr3_b.chr16 snp_in_utr3_b.chr16.anno

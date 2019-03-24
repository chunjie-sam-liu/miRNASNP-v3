awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr6.anno >temp.chr6
cat ../snp_in_utr3.chr6 temp.chr6 temp.chr6|sort|uniq -u >snp_in_utr3_b.chr6
python ../work_utr3.py snp_in_utr3_b.chr6 snp_in_utr3_b.chr6.anno

awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr7.anno >temp.chr7
cat ../snp_in_utr3.chr7 temp.chr7 temp.chr7|sort|uniq -u >snp_in_utr3_b.chr7
python ../work_utr3.py snp_in_utr3_b.chr7 snp_in_utr3_b.chr7.anno

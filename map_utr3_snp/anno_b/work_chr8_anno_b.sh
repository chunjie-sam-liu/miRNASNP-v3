awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr8.anno >temp.chr8
cat ../snp_in_utr3.chr8 temp.chr8 temp.chr8|sort|uniq -u >snp_in_utr3_b.chr8
python ../work_utr3.py snp_in_utr3_b.chr8 snp_in_utr3_b.chr8.anno

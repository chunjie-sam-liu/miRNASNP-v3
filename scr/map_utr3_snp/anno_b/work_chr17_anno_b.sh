awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr17.anno >temp.chr17
cat ../snp_in_utr3.chr17 temp.chr17 temp.chr17|sort|uniq -u >snp_in_utr3_b.chr17
python ../work_utr3.py snp_in_utr3_b.chr17 snp_in_utr3_b.chr17.anno

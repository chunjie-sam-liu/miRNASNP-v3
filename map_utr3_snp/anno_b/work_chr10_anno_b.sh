awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr10.anno >temp.chr10
cat ../snp_in_utr3.chr10 temp.chr10 temp.chr10|sort|uniq -u >snp_in_utr3_b.chr10
python ../work_utr3.py snp_in_utr3_b.chr10 snp_in_utr3_b.chr10.anno

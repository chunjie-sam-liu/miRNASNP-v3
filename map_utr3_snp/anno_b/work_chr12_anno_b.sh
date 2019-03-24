awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr12.anno >temp.chr12
cat ../snp_in_utr3.chr12 temp.chr12 temp.chr12|sort|uniq -u >snp_in_utr3_b.chr12
python ../work_utr3.py snp_in_utr3_b.chr12 snp_in_utr3_b.chr12.anno

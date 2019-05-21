awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr1.anno >temp.chr1
cat ../snp_in_utr3.chr1 temp.chr1 temp.chr1|sort|uniq -u >snp_in_utr3_b.chr1
python ../work_utr3.py snp_in_utr3_b.chr1 snp_in_utr3_b.chr1.anno

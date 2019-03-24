awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6"\t"$7"\t"$8}' ../snp_in_utr3.chr5.anno >temp.chr5
cat ../snp_in_utr3.chr5 temp.chr5 temp.chr5|sort|uniq -u >snp_in_utr3_b.chr5
python ../work_utr3.py snp_in_utr3_b.chr5 snp_in_utr3_b.chr5.anno

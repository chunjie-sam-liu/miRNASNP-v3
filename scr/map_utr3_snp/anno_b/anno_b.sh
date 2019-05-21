cat ../chrom|while read line
do
	echo "awk '{print \$1\"\t\"\$2\"\t\"\$3\"\t\"\$4\"\t\"\$5\"\t\"\$6\"\t\"\$7\"\t\"\$8}' ../snp_in_utr3.${line}.anno >temp.${line}" >work_${line}_anno_b.sh
	echo "cat ../snp_in_utr3.${line} temp.${line} temp.${line}|sort|uniq -u >snp_in_utr3_b.${line}" >>work_${line}_anno_b.sh
	echo "python ../work_utr3.py snp_in_utr3_b.${line} snp_in_utr3_b.${line}.anno">>work_${line}_anno_b.sh
done


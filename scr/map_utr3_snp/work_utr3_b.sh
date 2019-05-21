cat chrom |while read line
do 
	echo "nohup python work_utr3.py snp_in_utr3.${line} snp_in_utr3.${line}.anno 2>${line}.err &" >>work_utr3_b_1.sh
done 

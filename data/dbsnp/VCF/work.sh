#split .vcf into  bed
#awk '{if($1!~/^#/){match($1,/NC_00000([1-9]|X|Y)\.*/,chrom);print "chr"chrom[1]"\t"$2"\t"$2+1"\t"$3}}' xfile > xfile.bed 2> err

#check chrom
#nohup awk '{if($1!~/^#/)print $1}' GCF_000001405.38.vcf | uniq > chrom.vesion 2> err &
#grep NC chrom.vesion >chrom.24

cat chrom.24|while read line
do
	echo "grep ${line} GCF_000001405.38.vcf > ${line}.pvcf" >> work_snpvcf.sh
done

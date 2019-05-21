path='/home/fux/fux/miRNASNP3/target/miranda/alter_utr'

find $path -name "x*" > track_files

cat track_files|while read file
do
	briefname=`echo ${file}|cut -c 50-52`
	echo "nohup miranda ${file} alter_utr3.fa -out miranda_res_${briefname}.txt 2>err.${briefname} &">>work_scr.sh
done

#nohup perl ../s1_rm_nohit.pl miranda_altmir_res_02.txt s1_miranda_altmir_res_02.txt &

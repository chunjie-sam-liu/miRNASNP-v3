#split -l 100 ../altmir_seed_2_8.txt

path="/home/fux/fux/miRNASNP3/target/TargetScan/turn03_alter"

find $path -name "x*" > track_files

cat track_files|while read file
do
        briefname=`echo ${file:0-3}`
        echo "nohup perl /home/fux/fux/miRNASNP3/TargetScan/targetscan_70.pl  ${file} utr3.txt Targetscan_altmir_result_03_${briefname} 2>err.${briefname} &">>work_scr.sh
done

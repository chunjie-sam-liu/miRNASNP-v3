tgs_txt=/home/fux/fux/github/miRNASNP3/scr/map_mir_snp/turn-03-multi-snp/tgs_txt
tgs_res=/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_t03_547_res_part3
for f in `ls ${tgs_txt}`
do
  echo "/home/fux/fux/miRNASNP3/TargetScan/targetscan_70.pl /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03.tgs.txt ${tgs_txt}/${f} ${tgs_res}/${f}.res">>/home/fux/fux/github/miRNASNP3/scr/map_mir_snp/turn-03-multi-snp/tgs_txt-scrs.sh
done

#cat total_grch38_over6.autosome.part2.tgs.txt|tail -30949 >total_grch38_over6.autosome.part9.tgs.txt

#/home/fux/fux/miRNASNP3/TargetScan/targetscan_70.pl /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03.tgs.txt /home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.tgs.txt /home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_t03_547.res

#cat /home/fux/fux/miRNASNP3/data/genome/total_grch38_over6.autosome.tgs.txt|tail -31855>total_grch38_over6.autosome.part2.tgs.txt

#part2 utr include 31855 utrs
#/home/fux/fux/miRNASNP3/TargetScan/targetscan_70.pl /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03.tgs.txt /home/fux/fux/github/miRNASNP3/scr/map_mir_snp/turn-03-multi-snp/total_grch38_over6.autosome.tgs.txt /home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_t03_547.part2.res

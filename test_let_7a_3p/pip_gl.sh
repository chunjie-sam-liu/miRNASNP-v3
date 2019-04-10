
#to bed 
python gethit_miranda.py miranda_altmir_res.txt miranda_altmir_res.bed
python gethit_miranda.py miranda_wildmir_res.txt miranda_wildmir_res.bed
awk '{print $1":"$2"\t"$4"\t"$5}' Targetscan_altmir_res.txt > Targetscan_altmir_res.bed
awk '{print $1":"$2"\t"$4"\t"$5}' Targetscan_wildmir_res.txt > Targetscan_wildmir_res.bed

#4 set
bedtools intersect -a miranda_altmir_res.bed -b Targetscan_altmir_res.bed -wa >sm_insec_st
bedtoold intersect -a miranda_wildmir_res.bed -b Targetscan_wildmir_res.bed -wa >wm_insec_wt
cat miranda_altmir_res.bed Targetscan_altmir_res.bed >>sm_unin_st
cat miranda_wildmir_res.bed Targetscan_wildmir_res.bed >>wm_unin_wt

#change format
python fix_alt_format.py sm_insec_st sm_insec_st_1
python fix_alt_format.py sm_unin_st sm_unin_st_1

#share
bedtools intersect -a wm_insec_wt -b sm_unin_st_1 -wb >>unloss
bedtools intersect -a sm_insec_st -b wm_unin_wt -wa >>ungain

#gl
python getTargain.py ungain sm_insec_st_1 gaintar
python getTarloss.py sis.txt unloss wm_insec_wt losstar


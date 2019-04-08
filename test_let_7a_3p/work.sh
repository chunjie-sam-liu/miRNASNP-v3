grep hsa-let-7a-3p /home/fux/fux/miRNASNP3/map_mir_snp/seedregion/snp_in_seed/snp_mir_relate > /home/fux/fux/miRNASNP3/test_let_7a_3p/snp_in_seedregion

grep -n 'Read Sequence:hsa-let-7a-3p_rs779353569 (21 nt)' s1_miranda_altmir_res_02.txt
#59787126:Read Sequence:hsa-let-7a-3p_rs779353569 (21 nt)
grep -n 'Read Sequence:hsa-miR-3196_rs779946725 (18 nt)' s1_miranda_altmir_res_02.txt
#60081611:Read Sequence:hsa-miR-3196_rs779946725 (18 nt)

sed -n '59787126,60081610p' s1_miranda_altmir_res_02.txt >>/home/fux/fux/miRNASNP3/test_let_7a_3p/miranda_altmir_res.txt

grep -n 'Read Sequence:hsa-let-7a-3p_rs781681931 (21 nt)' s1_miranda_altmir_res_02.txt
#562573081:Read Sequence:hsa-let-7a-3p_rs781681931 (21 nt)
grep -n 'Read Sequence:hsa-let-7f-1-3p_rs780673185 (22 nt)' s1_miranda_altmir_res_02.txt
#562938739:Read Sequence:hsa-let-7f-1-3p_rs780673185 (22 nt)

sed -n '562573081,562938739p' s1_miranda_altmir_res_02.txt>>/home/fux/fux/miRNASNP3/test_let_7a_3p/miranda_altmir_res.txt

awk '{print $1":"$2"\t"$4"\t"$5}' Targetscan_wildmir_res.txt >Targetscan_wildmir_res.bed

cat miranda_wildmir_res.txt |tr -s '\n' >miranda_wildmir_res_0.txt

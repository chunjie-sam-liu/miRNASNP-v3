#get utr
#nohup awk '{OFS="\t";if($4~/9606/)print $0}' UTR_Sequences.txt | cut -f1,4,5 > UTR_sequences_hsa.txt 2> err &

#get miR
#awk '{print $4}' /home/fux/fux/miRNASNP3/map_mir_snp/seedregion/snp_in_seedregion.mir.bed > snp_in_seedregion.mirbase_id
cat snp_in_seedregion.mirbase_id |while read line
do
	grep ${line} miR_Family_Info.txt >>miR_family_info.txt
done 


#get altmir fasta file
python 01-altmir-fa.py /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03_multisnp.rs.exclude481 /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03_multisnp.rs.exclude481.fa

#to tgs file
python 02-tgs.py /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03_multisnp.rs.exclude481.fa /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03.tgs.txt

#altmir fasta file 2 json file
python 03-fa-json.py /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03_multisnp.rs.exclude481.fa /home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/turn_03_multi_snp/t03.fa.json

#utr handle
python 04-utr-json-tgs.py

#scrs
bash 05-t03-mirmap-scr.sh

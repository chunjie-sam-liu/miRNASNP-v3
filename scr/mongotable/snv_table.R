setwd("/home/fux/fux/github/miRNASNP3/scr/mongotable")

data_path<-"/home/fux/fux/miRNASNP3/mongotable/snpinfo"

library(readr)
library(dplyr)

snv_utr3<-read_tsv(file.path(data_path,"snp_utr3.table"))
snv_seed<-read_tsv(file.path(data_path,"snp_in_seed_4666.rela.table"))

rs_tagld<-read_tsv(file.path(data_path,"tag_ld.rs"),col_names = F)
rs_mutation<-read_tsv(file.path(data_path,"mutation.rs"),col_names = F)
colnames(rs_tagld)<-"snp_id"
colnames(rs_mutation)<-"snp_id"

seed_gain<-read_tsv(file.path(data_path,"seed_gain.stat"),col_names = F)
seed_loss<-read_tsv(file.path(data_path,"seed_loss.stat"),col_names = F)
colnames(seed_gain)<-c("mirna_id","snp_id","gain_count")
colnames(seed_loss)<-c("mirna_id","snp_id","loss_count")

utr_gain<-read_tsv(file.path(data_path,"utr_gain.stat"),col_names = F)
utr_loss<-read_tsv(file.path(data_path,"utr_loss.a.stat"),col_names = F)
colnames(utr_gain)<-c("gene","snp_id","gain_count")
colnames(utr_loss)<-c("gene","snp_id","loss_count")

rs_tagld%>%
  mutate(ldsnp=1)->rs_tagld
rs_mutation%>%
  mutate(mutation_rela=1)->rs_mutation

snv_seed%>%
  left_join(rs_tagld)%>%
  left_join(rs_mutation)%>%
  left_join(seed_gain,by=c("snp_id"="snp_id","identifier"="mirna_id"))%>%
  left_join(seed_loss,by=c("snp_id"="snp_id","identifier"="mirna_id"))->snv_seed_table

snv_utr3%>%
  left_join(rs_tagld)%>%
  left_join(rs_mutation)%>%
  left_join(utr_gain,by=c("snp_id"="snp_id","identifier"="gene"))%>%
  left_join(utr_loss,by=c("snp_id"="snp_id","identifier"="gene"))->snv_utr_table

write_tsv(snv_seed_table,file.path(data_path,"snv_seed_table.txt"))
write_tsv(snv_utr_table,file.path(data_path,"snv_utr_table.txt"))

snv_table<-rbind(snv_seed_table,snv_utr_table)
snv_table[is.na(snv_table)]<-0

write_tsv(snv_table,file.path(data_path,"snv_table.txt"))

data_path<-"/home/fux/fux/miRNASNP3/mongotable/mutation"

library(tidyr)

cosmic<-read_tsv(file.path(data_path,"cosmic_summary.txt"))
clinvar<-read_tsv(file.path(data_path,"clinvar_summary_chrfix.txt"),col_names = F)

colnames(clinvar)<-c("chrome","position","mut_id","ref","alt","pathology","snp_rela","snp_id","location")

unite(cosmic,"pathology",`Primary histology`,`Primary site`,sep = ';')%>%
  dplyr::select(chrome,position,ref,alt,snp_rela,snp_id,location,ID_NCV,PUBMED_PMID,pathology)->cosmic_01
cosmic_01%>%
  mutate(chro=paste("chr",chrome,sep = ''))%>%
  dplyr::select(-chrome)->cosmic_02

colnames(cosmic_02)<-c("position","ref","alt","snp_rela","snp_id","location","mut_id","pubmed_id","pathology","chrome")

clinvar%>%
  mutate(resource="clinvar")%>%
  mutate(pubmed_id=NA)->clinvar_01
cosmic_02%>%
  mutate(resource="cosmic")->cosmic_03
mutation<-rbind(clinvar_01,cosmic_03)

write_tsv(mutation,file.path(data_path,"mutation_summery.txt"))

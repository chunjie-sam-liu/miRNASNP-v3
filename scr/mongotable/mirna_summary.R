mirnainfo_path<-"/home/fux/fux/miRNASNP3/mongotable/mirnainfo"

mirnainfo<-read_tsv(file.path(mirnainfo_path,"mirinfo_01.txt"))
mir_count<-read_tsv(file.path(mirnainfo_path,"mature_snp_mut_count.txt"))

mirna_summary<-mirnainfo%>%
  left_join(mir_count,by=c("mir_id"="mirna_id"))

write_tsv(mirna_summary,file.path(mirnainfo_path,"mirna_summary.txt"))

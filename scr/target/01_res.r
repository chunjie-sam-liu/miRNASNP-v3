#TargetScan result dealing
setwd("/data/fux/miRNASNP3/target")

install.packages("data.table")
library(data.table)
library(dplyr)

anno_mir_snp<-read.table("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/snp_in_seedregion.anno")

result_TarScan<-read.table("TarScan_result_r",header=F)
result_TarScan<-data.table(result_TarScan)
class(result_TarScan)

Tarhead<-c("gene","miR_family","species","MSA_start","MSA_end","UTR_start","UTR_end",
           "group_num","Site_type","miR_in_species","group_type","Species_in_this_group",
           "ORF_overlap")
colnames(result_TarScan)<-Tarhead

result_TarScan%>%
  count(gene)->Tarsan_gene
Tarsan_gene<-Tarsan_gene[order(Tarsan_gene$n,decreasing = T),]

result_TarScan%>%
  count(miR_family)->Tarsan_mirf
Tarsan_mirf<-Tarsan_mirf[order(Tarsan_mirf$n,decreasing = T),]

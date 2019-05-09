library(dplyr)
library(readr)

flank_path = "/home/fux/fux/miRNASNP3/map_mir_snp/flanks"

snp_in_flank <- readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/flanks/flanks_mir_relate",col_names=F)
x_snp_in_flank <- readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/x_snp_in_mirflank",col_names = F)
y_snp_in_flank <- readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_flank",col_names = F)

x_snp_in_flank%>%
  count(X1)->x_count_chr
y_snp_in_flank%>%
  count(X1)->y_count_chr

count_chr%>%
  rbind(x_count_chr)%>%
  rbind(y_count_chr)->t_count_chr

snp_in_premir<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/grch38.coverage.filter.pre.only",col_names = F)
snp_in_mature<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/grch38.coverage.filter.mature.only",col_names = F)
snp_in_seed<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/snp_in_seedregion",col_names = F)

x_snp_in_premir<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/x_snp_in_premir.only",col_names = F)
x_snp_in_mature<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/x_snp_in_mature.only",col_names = F)
x_snp_in_seed<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/x_snp_in_seed_01.id",col_names = F)

y_snp_in_premir<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_premir.only",col_names = F)
y_snp_in_mature<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_mature.only",col_names = F)
y_snp_in_seed<-readr::read_tsv("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_seed_01.id",col_names = F)

x_snp_in_mature%>%
  count(X1)->x_mature_chr
x_snp_in_premir%>%
  count(X1)->x_premir_chr
x_snp_in_seed%>%
  count(X1)->x_seed_chr
y_snp_in_mature%>%
  count(X1)->y_mature_chr
y_snp_in_premir%>%
  count(X1)->y_premir_chr
y_snp_in_seed%>%
  count(X1)->y_seed_chr

snp_in_mature%>%
  count(X1)->mature_chr
snp_in_premir%>%
  count(X1)->premir_chr
snp_in_seed%>%
  count(X1)->seed_chr

mature_chr%>%
  rbind(x_mature_chr)%>%
  rbind(y_mature_chr)->t_mature_chr
premir_chr%>%
  rbind(x_premir_chr)%>%
  rbind(y_premir_chr)->t_premir_chr
seed_chr%>%
  rbind(x_seed_chr)%>%
  rbind(y_seed_chr)->t_seed_chr

colnames(t_count_chr)<-c("Chromosome","snp_in_flank")
colnames(t_mature_chr)<-c("Chromosome","snp_in_MIR")
colnames(t_premir_chr)<-c("Chromosome","snp_in_premir")
colnames(t_seed_chr)<-c("Chromosome","snp_in_seedregion")

t_count_chr%>%
  left_join(t_premir_chr)%>%
  left_join(t_mature_chr)%>%
  left_join(t_seed_chr)->snp_chr

library(ggplot2)
library(reshape2)
melt(snp_chr)->melt_snp_chr
ggplot(melt_snp_chr,aes(x=Chromosome,y=value,fill=variable))+
  geom_bar(stat = "identity",width = 0.5)+
  theme(panel.grid.major = element_blank(),panel.background = element_blank())

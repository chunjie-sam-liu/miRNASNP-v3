data_path = "/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY"

library(readr)
library(dplyr)

snp_in_premir_info <- readr::read_tsv(file.path(data_path,"y_snp_in_premir"),col_names = F)
snp_in_mature_info <- readr::read_tsv(file.path(data_path,"y_snp_in_mature"),col_names = F)

snp_in_premir_info%>%
  filter(X3 %in% y_snp_in_premir$X3 )%>%
  mutate("location" = "PremiR")->y_snp_in_premir_only
snp_in_mature_info%>%
  filter(X3 %in% y_snp_in_mature$X3)%>%
  mutate("location" = "Mature")->y_snp_in_mature_only
snp_in_mature_info%>%
  filter(X3 %in% y_snp_in_seed$X3)%>%
  mutate("location" = "SeedRegion")->y_snp_in_seed_only

y_snp_in_premir_only%>%
  rbind(y_snp_in_mature_only)%>%
  rbind(y_snp_in_seed_only)->y_snp_mir

y_snp_mir%>%
  count(X3)
readr::write_tsv(y_snp_mir,file.path(data_path,"y_snp_in_mir"))


# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)

# Path --------------------------------------------------------------------

path_snps <- '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz'
path_ccle <- '/workspace/liucj/refdata/mirna-drug/CCLE_miRNA_annoed_drug_correlation.rds.gz'
path_nci60 <- '/workspace/liucj/refdata/mirna-drug/NCI60_miRNA_annoed_drug_correlation.rds.gz'



# load data ---------------------------------------------------------------
data_snps <- readr::read_rds(path = path_snps)
drug_ccle <- readr::read_rds(path = path_ccle)
drug_nci60 <- readr::read_rds(path = path_nci60)


drug_ccle %>% 
  dplyr::filter(stringr::str_detect(string = Symbol, pattern = 'hsa')) 


# Library -----------------------------------------------------------------

library(magrittr)



# Path --------------------------------------------------------------------

path_snv <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv'
path_manifest <- file.path(path_snv, 'gdc_manifest_20191108_022041.txt')


# Load files --------------------------------------------------------------
manifest_tb <- readr::read_tsv(file = path_manifest)

maf_filename <- list.files(path = path_snv, pattern = 'maf$', recursive = TRUE)

.maf <- maftools::read.maf(
  maf = file.path(path_snv, maf_filename)[1],
  useAll = TRUE
  )



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

# Path --------------------------------------------------------------------

path_manifest <- '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/gdc_manifest_mirna_expression.txt'
manifest_tb <- readr::read_tsv(file = path_manifest)
barcodes <- list.dirs(path = '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression', full.names = FALSE, recursive = F)

setdiff(manifest_tb$id, barcodes)
manifest_tb %>% 
  dplyr::filter(!id %in% barcodes) %>% 
  readr::write_tsv(path = '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/gdc_manifest_mirna_expression.sup.txt')



# uuid to barcode ---------------------------------------------------------


files_endpoint = "https://api.gdc.cancer.gov/files"

body = list("filters" = list("op" = "in", "content" = list('field'='files.file_id', 'value'=manifest_tb$id)), 'format' = 'TSV', 'fields'="file_id,file_name,cases.case_id,cases.submitter_id,cases.samples.sample_id,cases.samples.submitter_id,cases.samples.portions.analytes.aliquots.aliquot_id,cases.samples.portions.analytes.aliquots.submitter_id,cases.samples.sample_type,cases.samples.tissue_type,data_category,data_type", 'size' = length(manifest_tb$id))

response <- httr::POST(url = files_endpoint, body = body, encode = 'json')

res_table <- httr::content(x = response, as = 'parsed', type = 'text/tab-separated-values')
readr::write_tsv(x = res_table, path = '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/manifest-uuid-barcode.tsv')



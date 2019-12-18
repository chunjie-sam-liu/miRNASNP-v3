
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

# setdiff(manifest_tb$id, barcodes)
# manifest_tb %>% 
#   dplyr::filter(!id %in% barcodes) %>% 
#   readr::write_tsv(path = '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/gdc_manifest_mirna_expression.sup.txt')



# uuid to barcode ---------------------------------------------------------


files_endpoint = "https://api.gdc.cancer.gov/files"

body = list("filters" = list("op" = "in", "content" = list('field'='files.file_id', 'value'=manifest_tb$id)), 'format' = 'TSV', 'fields'="file_id,file_name,cases.case_id,cases.submitter_id,cases.samples.sample_id,cases.samples.submitter_id,cases.samples.portions.analytes.aliquots.aliquot_id,cases.samples.portions.analytes.aliquots.submitter_id,cases.samples.sample_type,cases.samples.tissue_type,cases.project.project_id,data_category,data_type", 'size' = length(manifest_tb$id))

response <- httr::POST(url = files_endpoint, body = body, encode = 'json')

res_table <- httr::content(x = response, as = 'parsed', type = 'text/tab-separated-values')
readr::write_tsv(x = res_table, path = '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/manifest-uuid-barcode.tsv')





# MAF sample statistics ---------------------------------------------------


snv_path <- '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv'

maf_files <- list.files(path = snv_path, pattern = 'maf$', recursive = T)

fn_callback <- function(.y) {
  .y <- gsub(pattern = '#tumor.aliquots.submitter_id ', replacement = '', x = .y)
  .xx <- stringr::str_split(string = .y, pattern = ',', simplify = T)[1, ]
  
  tibble::tibble(
    Tumor_Sample_Barcode = .xx
  ) %>% 
    dplyr::distinct() %>% 
    dplyr::mutate(barcode = stringr::str_sub(string = Tumor_Sample_Barcode, start = 1, end= 16)) %>% 
    dplyr::mutate(sample = stringr::str_sub(string = barcode, start = 1, end = 12))
}

maf_files %>% 
  purrr::map(.f = function(.x) {
    .cancer <- gsub(
      pattern = '\\.',
      replacement = '-',
      x = gsub(pattern = '.*/(TCGA.+)\\.mutect.*', replacement = '\\1', x = .x)
    )
    .x_file <- file.path(snv_path, .x)
    readr::read_lines(file = .x_file, skip = 4, n_max = 1) %>% 
      fn_callback() %>% 
      dplyr::mutate(cancers = .cancer, n_sample = length(unique(barcode)))
  }) %>% 
  dplyr::bind_rows() -> 
  maf_data
readr::write_rds(x = maf_data, path = '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation/maf-sample-statistics.rds.gz', compress = 'gz')

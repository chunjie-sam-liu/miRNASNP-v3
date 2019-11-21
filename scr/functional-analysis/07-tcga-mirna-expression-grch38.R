
# Library -----------------------------------------------------------------

library(magrittr)


# Path --------------------------------------------------------------------

path_root <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression'
path_sample <- '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/manifest-uuid-barcode.tsv'

# Load files --------------------------------------------------------------

mirna_quantification <- list.files(path = path_root, pattern = 'mirbase21.mirnas.quantification.txt',full.names = T, recursive = T)

data_samples <- readr::read_tsv(file = path_sample) %>% 
  dplyr::select(cancers = cases.0.project.project_id, file_name, type = cases.0.samples.0.sample_type, cases.0.samples.0.submitter_id, cases.0.submitter_id)


# Functions ---------------------------------------------------------------

fn_read_mirna_quantification <- function(.x) {
  .filename <- basename(.x)
  .d <- readr::read_tsv(file = .x)
  tibble::tibble(
    file_name = .filename,
    expr = list(.d)
  )
}

mirna_quantification %>% 
  purrr::map(fn_read_mirna_quantification) %>% 
  dplyr::bind_rows() ->
  mirna_exprs

mirna_exprs %>% 
  dplyr::filter(!grepl('parcel', x = file_name)) %>% 
  dplyr::left_join(data_samples, by = 'file_name') ->
  mirna_expression_samples
readr::write_rds(x = mirna_expression_samples, path = '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/mirna-expression-grch38.rds.gz')


# Save image --------------------------------------------------------------

save.image(file = '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/07-tcga-mirna-expression-grch38.rda')

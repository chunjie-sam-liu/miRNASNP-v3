
# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)
# Path --------------------------------------------------------------------

path_mirna_mutation <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation'
maffiles <- list.files(path = path_mirna_mutation, pattern = '*maf.premir.format')
head_name <- readr::read_tsv(file = file.path(path_mirna_mutation, 'headnames.txt'), skip = 5, col_names = F) %>% 
  unlist() %>% unname()
head_name <- c('mirna', head_name)

mirna_expression <- readr::read_rds(path = '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/mirna-expression-grch38.rds.gz') %>% 
  dplyr::select(cancers, type, barcode = cases.0.samples.0.submitter_id, sample = cases.0.submitter_id, expr)

# Function ----------------------------------------------------------------

fn_load <- function(.x) {
  .d <- readr::read_tsv(file = file.path(path_mirna_mutation, .x), col_names = F) %>% 
    dplyr::mutate(X120 = as.character(X120), X22 = as.character(X22))
  .d
}

maffiles %>% 
  purrr::map(.f = fn_load) %>% 
  dplyr::bind_rows() ->
  tcga_mirna_mutation

names(tcga_mirna_mutation) <- head_name


tcga_mirna_mutation %>% 
  dplyr::group_by(mirna) %>% 
  dplyr::count() %>% 
  dplyr::filter(n > 1) %>% 
  dplyr::arrange(-n) %>% 
  print(n = 30)
mirna_expression %>% dplyr::select(cancers, sample) -> .cancers
tcga_mirna_mutation %>% 
  dplyr::select(mirna, Tumor_Sample_Barcode) %>% 
  dplyr::mutate(barcode = stringr::str_sub(string = Tumor_Sample_Barcode, start = 1, end= 16)) %>% 
  dplyr::mutate(sample = stringr::str_sub(string = barcode, start = 1, end = 12)) %>% 
  dplyr::inner_join(.cancers, by = 'sample') ->
  .d
.d %>% 
  dplyr::group_by(mirna, cancers) %>% 
  dplyr::count() %>% 
  dplyr::arrange(-n) ->
  .dd

.d %>% dplyr::filter(mirna == .dd$mirna[[1]], cancers == .dd$cancers[[1]]) -> .cand

mirna_expression %>% 
  dplyr::filter(cancers == .dd$cancers[[1]]) %>% 
  dplyr::mutate(expr = purrr::map(.x = expr, .f = function(.x) {
    .x %>% dplyr::filter(miRNA_ID == 'hsa-mir-10b')
  })) %>% 
  tidyr::unnest() %>% 
  dplyr::mutate(mut = ifelse(barcode %in% .cand$barcode, 'mut', 'no_mut')) %>% 
  dplyr::mutate(mut = ifelse(type == 'Solid Tissue Normal', 'normal', mut))->
  .skcm

t.test(
  x = .skcm %>% 
    dplyr::filter(mut == 'mut') %>% 
    dplyr::pull(reads_per_million_miRNA_mapped),
  y = .skcm %>% 
    dplyr::filter(mut == 'no_mut') %>% 
    dplyr::pull(reads_per_million_miRNA_mapped)
)

t.test(
  x = .skcm %>% 
    dplyr::filter(mut == 'normal') %>% 
    dplyr::pull(reads_per_million_miRNA_mapped),
  y = .skcm %>% 
    dplyr::filter(mut == 'no_mut') %>% 
    dplyr::pull(reads_per_million_miRNA_mapped)
)

.skcm %>% 
  ggplot(aes(x = mut, y = reads_per_million_miRNA_mapped)) +
  geom_boxplot()

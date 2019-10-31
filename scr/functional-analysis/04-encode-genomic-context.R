
# Library -----------------------------------------------------------------
library(magrittr)


# Path --------------------------------------------------------------------

path_gencode <- '/home/liucj/data/refdata/mirna-genomic-context/premir_map_gene_genecode'
path_mirna_context <- '/workspace/liucj/refdata/mirna-genomic-context/mirna-genomic-context.rds.gz'

# Load data ---------------------------------------------------------------

genecode_inter <- readr::read_tsv(file = path_gencode, col_names = FALSE)
mirna_context <- readr::read_rds(path = path_mirna_context) %>% 
  dplyr::rename(name = miRNA) %>% 
  dplyr::mutate(Region = ifelse(is.na(Region), 'Intergenic', Region))

# Function ----------------------------------------------------------------
fn_parse_X9 <- function(.a) {
  strsplit(x = .a, split = ';')[[1]] %>% 
    strsplit(split = '=') ->
    .l
  .names <- purrr::map_chr(.l, 1)
  .values <- purrr::map_chr(.l, 2)
  names(.values) <- .names
  .values
}
fn_check_exon <- function(.b) {
  .exon <- dplyr::filter(.b, X3 == 'exon')
  .region <- if (nrow(.exon) == 0) {
    'Intronic'
  } else {
    .exon$X9 %>% 
      purrr::map(.f = fn_parse_X9) %>% 
      purrr::map_chr(.f = 'transcript_type') ->
      .transcript_type
    ifelse("protein_coding" %in% .transcript_type, 'Exonic', paste0(.transcript_type, ';'))
  }
  .region
}
fn_parse_protein <- function(.x) {
  .x %>% 
    dplyr::mutate(
      `pre-mirna` = paste(X10, X13, X14, X16, gsub(pattern = '(.*):precursor:.*', replacement = '\\1', x = X18), sep = ':'),
      'host gene' = gsub(pattern = '.*;gene_name=(.*?);.*', replacement = "\\1", x = X9),
      'host gene type' = gsub(pattern = '.*;gene_type=(.*?);.*', replacement = "\\1", x = X9),
      direction = paste(X16, X7, sep = '')
    ) %>%
    dplyr::group_by(`pre-mirna`, `host gene`, direction, `host gene type`) %>% 
    tidyr::nest() %>% 
    dplyr::mutate(region = purrr::map_chr(.x = data, .f = fn_check_exon)) %>% 
    dplyr::select(-data) ->
    .r
  .r
}
# Parse -------------------------------------------------------------------

genecode_inter %>% 
  dplyr::mutate(
    gene_id = gsub(pattern = '.*;gene_id=(ENSG.*?);.*', replacement = "\\1", x = X9),
  ) ->
  genecode_inter_gene_id


# all ---------------------------------------------------------------------

genecode_inter_gene_id %>% 
  dplyr::group_by(gene_id) %>% 
  tidyr::nest() %>% 
  plyr::mutate(context = purrr::map(.x = data, .f = fn_parse_protein)) %>% 
  dplyr::select(-data) %>% 
  tidyr::unnest(context) ->
  genecode_inter_gene_id_context

%>% 
  dplyr::mutate(gene_type = ifelse(
    stringr::str_detect(string = gene_type, pattern = 'pseudogene'),
    'pseudogene',
    gene_type
  )) %>% 
  dplyr::mutate(gene_type = ifelse(
    stringr::str_detect(string = gene_type, pattern = 'RNA'),
    'ncRNA',
    gene_type
  )) %>% 
  dplyr::mutate(gene_type = ifelse(
    test = gene_type %in% c('ncRNA', 'protein_coding', 'pseudogene'),
    gene_type,
    'others'
  )) 

# Save image --------------------------------------------------------------

save.image(file = '/workspace/liucj/refdata/mirna-genomic-context/04-encode-genomic-context.rda')

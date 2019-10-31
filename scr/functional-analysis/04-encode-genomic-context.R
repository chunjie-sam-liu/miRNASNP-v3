
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

fn_filter_multiple_context <- function(.x) {
  .protein_coding <- .x %>% 
    dplyr::filter(`host gene type` == 'protein_coding') %>% 
    dplyr::mutate(region = ifelse(
      test = stringr::str_detect(string = region, pattern = 'intron'),
      'Intronic',
      region
    ))
  if (nrow(.protein_coding) > 0) {
    .protein_coding %>% 
      dplyr::mutate(region = ifelse(region != 'Exonic', 'Intronic', region)) %>% 
      dplyr::filter(!grepl(pattern = '^AC[[:digit:]]+.[[:digit:]]*$', x = `host gene`)) %>% 
      dplyr::filter(!grepl(pattern = '^AL[[:digit:]]+.[[:digit:]]*$', x = `host gene`)) %>% 
      dplyr::filter(!grepl(pattern = '^AF[[:digit:]]+.[[:digit:]]*$', x = `host gene`)) ->
      .mis
    if ('Exonic' %in% .mis$region) {
      .mis %>% dplyr::filter(region == 'Exonic')
    } else {
      .mis
    }
  } else {
    .x %>% 
      dplyr::filter(!`host gene type` %in% c('pseudogene', 'ncRNA', 'others')) %>% 
      dplyr::filter(!grepl(pattern = '^AC[[:digit:]]+.[[:digit:]]*$', x = `host gene`)) %>% 
      dplyr::filter(!grepl(pattern = '^AL[[:digit:]]+.[[:digit:]]*$', x = `host gene`)) %>% 
      dplyr::filter(!grepl(pattern = '^AF[[:digit:]]+.[[:digit:]]*$', x = `host gene`))
  }
}
fn_merge_context <- function(.x) {
  if (nrow(.x) > 1) {
    .x %>% 
      dplyr::group_by(`host gene type`, `region`) %>% 
      dplyr::summarise_at(.vars = dplyr::vars('gene_id', 'host gene', 'direction'), .funs = paste0, collapse = ';') %>% 
      dplyr::ungroup() %>% 
      dplyr::select(gene_id, `host gene`, direction, `host gene type`, region)
  } else if (nrow(.x) == 0) {
    tibble::tibble(
      'gene_id' = '-',
      'host gene' = '-',
      'direction' = '-',
      'host gene type' = '-',
      'region' = 'Intergenic'
    )
  } else {
    .x
  }
}
# Parse -------------------------------------------------------------------

genecode_inter %>% 
  dplyr::mutate(gene_id = gsub(pattern = '.*;gene_id=(ENSG.*?);.*', replacement = "\\1", x = X9)) ->
  genecode_inter_gene_id


# all ---------------------------------------------------------------------

genecode_inter_gene_id %>% 
  dplyr::group_by(gene_id) %>% 
  tidyr::nest() %>% 
  plyr::mutate(context = purrr::map(.x = data, .f = fn_parse_protein)) %>% 
  dplyr::select(-data) %>% 
  tidyr::unnest(context) ->
  genecode_inter_gene_id_context

genecode_inter_gene_id_context %>% 
  readr::write_rds(path = '/workspace/liucj/refdata/mirna-genomic-context/encode-genomic-context-raw.rds.gz', compress = 'gz')

genecode_inter_gene_id_context %>% 
  dplyr::mutate(`host gene type` = ifelse(
    stringr::str_detect(string = `host gene type`, pattern = 'pseudogene'),
    'pseudogene',
    `host gene type`
  )) %>% 
  dplyr::mutate(`host gene type` = ifelse(
    stringr::str_detect(string = `host gene type`, pattern = 'RNA'),
    'ncRNA',
    `host gene type`
  )) %>% 
  dplyr::mutate(`host gene type` = ifelse(
    test = `host gene type` %in% c('ncRNA', 'protein_coding', 'pseudogene'),
    `host gene type`,
    'others'
  )) %>% 
  dplyr::group_by(`pre-mirna`) %>% 
  tidyr::nest() %>% 
  dplyr::mutate(data = purrr::map(.x = data, .f = fn_filter_multiple_context)) %>%
  dplyr::mutate(data = purrr::map(.x = data, .f = fn_merge_context)) %>% 
  tidyr::unnest() ->
  genecode_inter_gene_id_context_merge


genecode_inter_gene_id_context_merge %>% 
  readr::write_rds(path = '/workspace/liucj/refdata/mirna-genomic-context/encode-genomic-context.rds.gz', compress = 'gz')




# Save image --------------------------------------------------------------

save.image(file = '/workspace/liucj/refdata/mirna-genomic-context/04-encode-genomic-context.rda')

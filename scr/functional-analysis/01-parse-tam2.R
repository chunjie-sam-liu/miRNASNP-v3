
# Library -----------------------------------------------------------------

library(magrittr)

# Path --------------------------------------------------------------------

path_tam <- '/home/liucj/data/refdata/tam2.0/mirset_v9.txt'
path_snps <- '/home/liucj/data/refdata/tam2.0/mature_pre_var.txt'
path_snps_pre <- '/home/liucj/data/refdata/tam2.0/precursor_var.txt'

# Load data ---------------------------------------------------------------

data_tam <- readr::read_lines(file = path_tam)
data_snps <- readr::read_tsv(file = path_snps) %>% 
  dplyr::select(`mature-mirna` = mature_id, `pre-mirna` = precurser_id, snp_num = num_of_snp_in_mature)
data_snps_pre <- readr::read_tsv(file = path_snps_pre) %>% 
  dplyr::select(`mature-mirna` = mature_id, `pre-mirna` = precurser_id, `pre-length` = hairpin_seq_length,
                `num_snp_pre` = num_of_snp_in_pre) %>% 
  dplyr::select(-`mature-mirna`) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate(prop = num_snp_pre / `pre-length`) %>% 
  dplyr::arrange(-prop)


# Function ----------------------------------------------------------------

fn_parse_lines <- function(.line) {
  # type name pre-mirna
  .v <- stringr::str_split(string = .line, pattern = '\t')[[1]]
  tibble::tibble(
    type = .v[1],
    name = .v[2],
    `pre-mirna` = .v[-c(1,2)]
  )
}


# Parse text file to tibble -----------------------------------------------

data_tam %>%
  purrr::map_df(.f = fn_parse_lines) ->
  tb_tam


data_snps %>% 
  dplyr::group_by(`pre-mirna`) %>% 
  dplyr::summarise(sum = sum(snp_num)) ->
  data_snps_sum

data_snps_pre %>% 
  dplyr::mutate(group = dplyr::case_when(
    dplyr::between(x = prop, left = 0, 0.2) ~ '0-0.2',
    dplyr::between(x = prop, left = 0.2, 0.4) ~ '0.2-0.4',
    dplyr::between(x = prop, left = 0.4, 0.6) ~ '0.4-0.6',
    dplyr::between(x = prop, left = 0.6, 0.8) ~ '0.6-0.8',
    dplyr::between(x = prop, left = 0.8, 1) ~ '0.8-1'
  )) ->
  data_snps_pre

data_snps_pre %>% 
  dplyr::arrange(-prop) %>% 
  dplyr::filter(`pre-mirna` == 'hsa-mir-3939')
# Function ----------------------------------------------------------------


tb_tam_func_snps_pre <- tb_tam %>% 
  dplyr::filter(type == 'Function') %>% 
  dplyr::inner_join(data_snps_pre, by = 'pre-mirna')


tb_tam_func_snps_pre %>% 
  dplyr::group_by(name) %>% 
  dplyr::summarise(median_prop = median(prop)) %>% 
  dplyr::arrange(median_prop)

tb_tam_func_snps_pre %>% 
  dplyr::filter(name == 'Collagen Formation')

# snp num in pre-mirna


# HMDD --------------------------------------------------------------------


tb_tam_hmdd_snps <- tb_tam %>% 
  dplyr::filter(type == 'HMDD') %>% 
  dplyr::inner_join(data_snps_sum, by = 'pre-mirna')

tb_tam_hmdd_snps %>% 
  dplyr::group_by(name) %>% 
  dplyr::summarise(mean = mean(sum)) %>% 
  dplyr::arrange(mean)


# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)

# Source ------------------------------------------------------------------

source(file = 'utils.R')

# Path --------------------------------------------------------------------

path_tam <- '/home/liucj/data/refdata/tam2.0/mirset_v9.txt.rds.gz'
path_snps <- '/home/liucj/data/refdata/tam2.0/variation_seed28_anno_addacc_flank1k.txt'
path_mirna_context <- '/workspace/liucj/refdata/mirna-genomic-context/encode-genomic-context.rds.gz'
path_mirna_conservation_score <- '/home/liucj/data/refdata/tam2.0/mirna-conservation-scores.rds.gz'
path_mirna_conservation_score_by_species <- '/workspace/liucj/refdata/tam2.0/mirna_acc_conserved.rds.gz'
path_out <- '/home/liucj/data/refdata/tam2.0/'
path_mirna_confidnece <- '/workspace/liucj/refdata/tam2.0/mirna-confidence.rds'


# Load data ---------------------------------------------------------------
mirna_conservation_score <- readr::read_rds(path = path_mirna_conservation_score)
mirna_conservation_score_by_species <- readr::read_rds(path = path_mirna_conservation_score_by_species) 
mirna_context <- readr::read_rds(path = path_mirna_context) 
mirna_confidence <- readr::read_rds(path = path_mirna_confidnece)
data_snps <- readr::read_tsv(file = path_snps) %>% 
  dplyr::select(
    'pre-mirna' = 'precurser_id',
    'pre-length' = 'pre_len',
    'pre-total' = 'pre_totla',
    'pre-rare' = 'pre_rare',
    'pre-common' = 'pre_common',
    'flank5-1-total' = 'pre_flank5_1_total',
    'flank5-1-common' = 'pre_flank5_1_common',
    'flank5-1-rare' = 'pre_flank5_1_rare',
    'flank5-2-total' = 'pre_flank5_2_total',
    'flank5-2-common' = 'pre_flank5_2_common',
    'flank5-2-rare' = 'pre_flank5_2_rare',
    'flank5-3-total' = 'pre_flank5_3_total',
    'flank5-3-common' = 'pre_flank5_3_common',
    'flank5-3-rare' = 'pre_flank5_3_rare',
    'flank5-1k-total' = 'flank5_over_1k',
    'flank3-1-total' = 'pre_flank3_1_total',
    'flank3-1-common' = 'pre_flank3_1_common',
    'flank3-1-rare' = 'pre_flank3_1_rare',
    'flank3-2-total' = 'pre_flank3_2_total',
    'flank3-2-common' = 'pre_flank3_2_common',
    'flank3-2-rare' = 'pre_flank3_2_rare',
    'flank3-3-total' = 'pre_flank3_3_total',
    'flank3-3-common' = 'pre_flank3_3_common',
    'flank3-3-rare' = 'pre_flank3_3_rare',
    'flank3-1k-total' = 'flank3_over_1k',
    'mature-mirna' = 'mature_id',
    'mature-length' = 'mature_len',
    'mature-total' = 'mature_total',
    'mature-common' = 'mature_common',
    'mature-rare' = 'mature_rare',
    'seed-total' = 'seed_total',
    'seed-common' = 'seed_common',
    'seed-rare' = 'seed_rare'
  ) %>% 
  dplyr::mutate(`pre-mirna` = gsub(pattern = ':MI.*', replacement = '', x = `pre-mirna`)) %>% 
  dplyr::inner_join(mirna_context, by = 'pre-mirna') %>% 
  dplyr::left_join(mirna_conservation_score_by_species, by = 'pre-mirna') %>% 
  dplyr::select(-acc) %>% 
  dplyr::left_join(mirna_conservation_score, by = 'pre-mirna') %>%
  dplyr::mutate(ave_score = ifelse(ave_score < 0, 0, ave_score)) %>%
  dplyr::mutate(score_range = dplyr::case_when(
    ave_score <= 0.02 ~ 'Low',
    ave_score < 0.98 & ave_score > 0.02 ~ 'Mid',
    ave_score >= 0.98 ~ 'High'
  )) %>%
  dplyr::left_join(mirna_confidence, by = 'pre-mirna')
tb_tam <- readr::read_rds(path = path_tam) %>% 
  dplyr::rename(mirna = `pre-mirna`)

# readr::write_rds(x = data_snps, path = '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz')

# Colours -----------------------------------------------------------------


color_palletes <- c(
  'Exonic' = '#e9266d', 
  'Intronic' = '#dee8a9', 
  'Intergenic' = '#e3c17b', 
  "5'UTR" = '#eaff00',
  "3'UTR" = '#74e501',
  'Pre-miRNA' = '#bb0655', 
  'Mature miRNA' = '#63bd98', 
  'Seed' = '#b97835',
  'Flank3' = '#9bcade',
  'Flank5' = '#c8efab',
  'Human' = '#63bd98',
  'High' = '#e9266d',
  'Low' = '#74e501',
  'Mid' = '#eaff00'
)
color_conserve <- c(
  'High' = '#e9266d',
  'Low' = '#dee8a9',
  'Non' = '#e3c17b' 
)

# Function ----------------------------------------------------------------
#utils

fn_pre_vs_flank <- function() {
  # dbSNP v151 689966785/3000000000 = 0.23
  dplyr::bind_rows(
    # pre-mirna
    tibble::tibble(
      density = data_snps_pre_no_mature %>% 
        dplyr::pull(`pre-prop-total`),
      type = 'Pre-miRNA'
    ),
    # mature mirna
    tibble::tibble(
      density = data_snps_mature_no_seed %>% 
        dplyr::pull(`mature-prop-total`),
      type = 'Mature miRNA'
    ),
    # seed
    tibble::tibble(
      density = data_snps_seed %>% 
        dplyr::pull(`seed-prop-total`),
      type = 'Seed'
    ),
    # flank51
    tibble::tibble(
      density = data_snps_flank51 %>%
        dplyr::pull(`flank51-prop-total`),
      type = 'Flank5-1'
    ),
    # flank52
    tibble::tibble(
      density = data_snps_flank52 %>%
        dplyr::pull(`flank52-prop-total`),
      type = 'Flank5-2'
    ),
    # flank53
    tibble::tibble(
      density = data_snps_flank53 %>%
        dplyr::pull(`flank53-prop-total`),
      type = 'Flank5-3'
    ),
    tibble::tibble(
      density = data_snps_flank51k %>% 
        dplyr::pull(`flank51k-prop-total`),
      type = 'Flank5-1k'
    ),
    # flank31
    tibble::tibble(
      density = data_snps_flank31 %>%
        dplyr::pull(`flank31-prop-total`),
      type = 'Flank3-1'
    ),
    # flank32
    tibble::tibble(
      density = data_snps_flank32 %>%
        dplyr::pull(`flank32-prop-total`),
      type = 'Flank3-2'
    ),
    # flank33
    tibble::tibble(
      density = data_snps_flank33 %>%
        dplyr::pull(`flank33-prop-total`),
      type = 'Flank3-3'
    ),
    tibble::tibble(
      density = data_snps_flank31k %>% 
        dplyr::pull(`flank31k-prop-total`),
      type = 'Flank3-1k'
    ),
  ) %>% 
    dplyr::mutate(type = factor(
      x = type, 
      levels = c('Flank5-1k', 'Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 'Mature miRNA', 'Seed',
                 'Flank3-1', 'Flank3-2', 'Flank3-3', 'Flank3-1k'))
    ) %>% 
    dplyr::mutate(color = dplyr::case_when(
      grepl(pattern = 'Flank5', x = type) ~ 'Flank5',
      grepl(pattern = 'Flank3', x = type) ~ 'Flank3',
      grepl(pattern = 'Pre', x = type) ~ 'Pre-miRNA',
      grepl(pattern = 'Mature', x = type) ~ 'Mature miRNA',
      grepl(pattern = 'Seed', x = type) ~ 'Seed'
    )) %>% 
    dplyr::mutate(color = factor(color, levels = c('Flank5', 'Pre-miRNA', 'Mature miRNA', 'Seed', 'Flank3'))) ->
    density_pre_flank
  
  t.test(
    x = density_pre_flank %>% 
      dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% 
      dplyr::pull(density),
    y = density_pre_flank %>% 
      dplyr::filter(type == 'Flank3-1') %>% 
      dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank31
  
  t.test(
    x = density_pre_flank %>% 
      dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% 
      dplyr::pull(density),
    y = density_pre_flank %>% 
      dplyr::filter(type == 'Flank5-1') %>% 
      dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank51
  
  t.test(
    x = density_pre_flank %>% 
      dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% 
      dplyr::pull(density),
    y = density_pre_flank %>% 
      dplyr::filter(type %in% c('Flank3-2', 'Flank3-3')) %>% 
      dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank323
  
  t.test(
    x = density_pre_flank %>% 
      dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% 
      dplyr::pull(density),
    y = density_pre_flank %>% 
      dplyr::filter(type %in% c('Flank5-2', 'Flank5-3')) %>% 
      dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank523
  
  snp_density <- 689966785/3000000000 # dbSNP v151
  
  density_pre_flank %>% 
    dplyr::mutate(density = ifelse(density > 0.7, 0.7, density)) %>% 
    ggplot(aes(x = type, y = density, fill = color)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") -> 
    density_pre_flank_531k_plot
  ggsave(
    filename = 'density-pre-flank-531k.pdf',
    plot = density_pre_flank_531k_plot,
    device = 'pdf', 
    path = path_out
  )
    
  
# Split data_snps to regions-----------------------------------------------

data_snps %>% 
  # dplyr::select(`pre-mirna`, `pre-length`, `flank5-1-total`, `flank5-1-rare`, `flank5-1-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-1-total`, `flank5-1-rare`, `flank5-1-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank51-prop-total' = `flank5-1-total`/`pre-length`) %>% 
  dplyr::mutate('flank51-prop-rare' = `flank5-1-rare`/`pre-length`) %>% 
  dplyr::mutate('flank51-prop-common' = `flank5-1-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank51

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-2-total`, `flank5-2-rare`, `flank5-2-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank52-prop-total' = `flank5-2-total`/`pre-length`) %>% 
  dplyr::mutate('flank52-prop-rare' = `flank5-2-rare`/`pre-length`) %>% 
  dplyr::mutate('flank52-prop-common' = `flank5-2-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank52

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-3-total`, `flank5-3-rare`, `flank5-3-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank53-prop-total' = `flank5-3-total`/`pre-length`) %>% 
  dplyr::mutate('flank53-prop-rare' = `flank5-3-rare`/`pre-length`) %>% 
  dplyr::mutate('flank53-prop-common' = `flank5-3-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank53

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-1k-total`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank51k-prop-total' = `flank5-1k-total`/1000) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank51k

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-1-total`, `flank3-1-rare`, `flank3-1-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank31-prop-total' = `flank3-1-total`/`pre-length`) %>% 
  dplyr::mutate('flank31-prop-rare' = `flank3-1-rare`/`pre-length`) %>% 
  dplyr::mutate('flank31-prop-common' = `flank3-1-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank31

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-2-total`, `flank3-2-rare`, `flank3-2-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank32-prop-total' = `flank3-2-total`/`pre-length`) %>% 
  dplyr::mutate('flank32-prop-rare' = `flank3-2-rare`/`pre-length`) %>% 
  dplyr::mutate('flank32-prop-common' = `flank3-2-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank32

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-3-total`, `flank3-3-rare`, `flank3-3-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank33-prop-total' = `flank3-3-total`/`pre-length`) %>% 
  dplyr::mutate('flank33-prop-rare' = `flank3-3-rare`/`pre-length`) %>% 
  dplyr::mutate('flank33-prop-common' = `flank3-3-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank33

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-1k-total`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank31k-prop-total' = `flank3-1k-total`/1000) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank31k

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region, conserve) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('pre-prop-total' = `pre-total`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-rare' = `pre-rare`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-common' = `pre-common`/`pre-length`) ->
  data_snps_pre

data_snps %>% 
  dplyr::group_by(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region, conserve) %>%
  tidyr::nest() %>%
  dplyr::mutate(mature = purrr::map(.x = data, .f = function(.x) {
    .x %>% 
      dplyr::summarise('mature-total' = sum(`mature-total`), 'mature-rare' = sum(`mature-rare`), 'mature-common' = sum(`mature-common`), 'mature-length' = sum(`mature-length`))
  })) %>%
  dplyr::select(-data) %>%
  tidyr::unnest() %>%
  dplyr::ungroup() %>% 
  dplyr::mutate(`pre-length` = `pre-length` - `mature-length`, `pre-total` = `pre-total` - `mature-total`, `pre-rare` = `pre-rare` - `mature-rare`, `pre-common` = `pre-common` - `mature-common`) %>%
  dplyr::select(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region, conserve) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('pre-prop-total' = `pre-total`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-rare' = `pre-rare`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-common' = `pre-common`/`pre-length`) ->
  data_snps_pre_no_mature

data_snps %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature

data_snps %>% 
  dplyr::mutate(`mature-total` = `mature-total` - `seed-total`, `mature-rare` = `mature-rare` - `seed-rare`, `mature-common` = `mature-common` - `seed-common`, `mature-length` = `mature-length` - 7) %>%
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`, gene_id, `host gene`, direction, region, conserve) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature_no_seed

data_snps %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `seed-total`, `seed-rare`, `seed-common`, gene_id, `host gene`, direction, region, conserve) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('seed-prop-total' = `seed-total`/7) %>% 
  dplyr::mutate('seed-prop-rare' = `seed-rare`/7) %>% 
  dplyr::mutate('seed-prop-common' = `seed-common`/7) ->
  data_snps_seed


# Analysis ----------------------------------------------------------------



# Pre-miRNA vs. Flank region ----------------------------------------------

density_pre_flank_plot_table <- fn_pre_vs_flank()

# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/11-parse-tam2-1k.rda')


# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)
# Path --------------------------------------------------------------------

path_tam <- '/home/liucj/data/refdata/tam2.0/mirset_v9.txt.rds.gz'
path_snps <- '/home/liucj/data/refdata/tam2.0/variation_seed28_anno.txt'
path_mirna_context <- '/workspace/liucj/refdata/mirna-genomic-context/encode-genomic-context.rds.gz'
path_out <- '/home/liucj/data/refdata/tam2.0/'


# Load data ---------------------------------------------------------------
mirna_context <- readr::read_rds(path = path_mirna_context) 
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
    'flank3-1-total' = 'pre_flank3_1_total',
    'flank3-1-common' = 'pre_flank3_1_common',
    'flank3-1-rare' = 'pre_flank3_1_rare',
    'flank3-2-total' = 'pre_flank3_2_total',
    'flank3-2-common' = 'pre_flank3_2_common',
    'flank3-2-rare' = 'pre_flank3_2_rare',
    'flank3-3-total' = 'pre_flank3_3_total',
    'flank3-3-common' = 'pre_flank3_3_common',
    'flank3-3-rare' = 'pre_flank3_3_rare',
    'mature-mirna' = 'mature_id',
    'mature-length' = 'mature_len',
    'mature-total' = 'mature_total',
    'mature-common' = 'mature_common',
    'mature-rare' = 'mature_rare',
    'seed-total' = 'seed_total',
    'seed-common' = 'seed_common',
    'seed-rare' = 'seed_rare'
  ) %>% 
  dplyr::inner_join(mirna_context, by = 'pre-mirna') 
tb_tam <- readr::read_rds(path = path_tam)

# readr::write_rds(x = data_snps, path = '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz')

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


fn_pre_vs_flank <- function() {
  # dbSNP v151 689966785/3000000000 = 0.23
  dplyr::bind_rows(
    # pre-mirna
    tibble::tibble(
      density = data_snps_pre %>% 
        dplyr::pull(`pre-prop-total`),
      type = 'Pre-miRNA'
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
    )
  ) %>% 
    dplyr::mutate(type = factor(
      x = type, 
      levels = c('Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 
                 'Flank3-1', 'Flank3-2', 'Flank3-3'))
    ) ->
    density_pre_flank
  
  density_pre_flank %>% 
    dplyr::group_by(type) %>% 
    dplyr::summarise(m = mean(density))
  
  density_pre_flank %>% 
    ggplot(aes(x = type, y = density),) +
    geom_boxplot()
  
}

fn_mirna_context_pie <- function() {
  data_snps_pre %>% 
    dplyr::group_by(region) %>% 
    dplyr::count() %>% 
    dplyr::ungroup() %>% 
    dplyr::mutate(percent = n / sum(n) * 100) %>% 
    dplyr::mutate(label = glue::glue('{region}: {n} ({round(percent, 1)}%)')) -> 
    data_snps_pre_for_pie_plot
  
  data_snps_pre_for_pie_plot %>% 
    ggplot(aes(x = '', y = n, fill = region)) +
    geom_bar(width = 1, stat = 'identity') +
    scale_fill_manual(name = 'Region', values=c('#f4ff00', '#f0ba7e', '#e3e2ac')) +
    theme(
      axis.title = element_blank(),
      axis.text = element_blank(),
      axis.ticks = element_blank(),
      
      panel.background = element_rect(fill = NA, color = NA),
      plot.background = element_rect(fill = NA, color = NA),
      
      legend.position = 'None'
      
    ) +
    annotate(
      geom = 'text', x = 1, 
      y = data_snps_pre_for_pie_plot$n[3]/2, 
      label = data_snps_pre_for_pie_plot$label[3],
      size = 6
    ) +
    annotate(
      geom = 'text', x = 1, 
      y = data_snps_pre_for_pie_plot$n[2]/2 + data_snps_pre_for_pie_plot$n[3] + 50,
      label = data_snps_pre_for_pie_plot$label[2],
      size = 6
    ) +
    annotate(
      geom = 'text', x = 1.45, 
      y = data_snps_pre_for_pie_plot$n[1]/2 + data_snps_pre_for_pie_plot$n[2] + data_snps_pre_for_pie_plot$n[3] - 35,
      label = data_snps_pre_for_pie_plot$label[1],
      size = 6
    ) +
    coord_polar(theta = 'y') ->
    .pie_plot
  ggsave(
    filename = 'mirna-genomic-context.pdf',
    plot = .pie_plot,
    device = 'pdf',
    path = path_out,
    width = 7, height = 7
  )
  .pie_plot
}
fn_mirna_context_proption_sankey <- function() {
  data_snps_pre %>% 
    dplyr::mutate(
      density = dplyr::case_when(
        `pre-prop-total` <= 0.2 ~ '<0.2',
        `pre-prop-total` > 0.2 & `pre-prop-total` <= 0.3 ~ '0.2~0.3',
        `pre-prop-total` > 0.3 & `pre-prop-total` <= 0.4 ~ '0.3~0.4',
        `pre-prop-total` > 0.4 & `pre-prop-total` <=0.6 ~ '0.4~0.6',
        `pre-prop-total` > 0.6 ~ '>0.6'
      )
    )  ->
    data_snps_pre_density
}
# Split data_snps to regions-----------------------------------------------

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-1-total`, `flank5-1-rare`, `flank5-1-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank51-prop-total' = `flank5-1-total`/`pre-length`) %>% 
  dplyr::mutate('flank51-prop-rare' = `flank5-1-rare`/`pre-length`) %>% 
  dplyr::mutate('flank51-prop-common' = `flank5-1-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank51

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-2-total`, `flank5-2-rare`, `flank5-2-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank52-prop-total' = `flank5-2-total`/`pre-length`) %>% 
  dplyr::mutate('flank52-prop-rare' = `flank5-2-rare`/`pre-length`) %>% 
  dplyr::mutate('flank52-prop-common' = `flank5-2-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank52

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-3-total`, `flank5-3-rare`, `flank5-3-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank53-prop-total' = `flank5-3-total`/`pre-length`) %>% 
  dplyr::mutate('flank53-prop-rare' = `flank5-3-rare`/`pre-length`) %>% 
  dplyr::mutate('flank53-prop-common' = `flank5-3-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank53


data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-1-total`, `flank3-1-rare`, `flank3-1-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank31-prop-total' = `flank3-1-total`/`pre-length`) %>% 
  dplyr::mutate('flank31-prop-rare' = `flank3-1-rare`/`pre-length`) %>% 
  dplyr::mutate('flank31-prop-common' = `flank3-1-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank31

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-2-total`, `flank3-2-rare`, `flank3-2-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank32-prop-total' = `flank3-2-total`/`pre-length`) %>% 
  dplyr::mutate('flank32-prop-rare' = `flank3-2-rare`/`pre-length`) %>% 
  dplyr::mutate('flank32-prop-common' = `flank3-2-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank32

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-3-total`, `flank3-3-rare`, `flank3-3-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank33-prop-total' = `flank3-3-total`/`pre-length`) %>% 
  dplyr::mutate('flank33-prop-rare' = `flank3-3-rare`/`pre-length`) %>% 
  dplyr::mutate('flank33-prop-common' = `flank3-3-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank33

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('pre-prop-total' = `pre-total`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-rare' = `pre-rare`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-common' = `pre-common`/`pre-length`) ->
  data_snps_pre

data_snps %>% 
  dplyr::group_by(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region) %>%
  tidyr::nest() %>%
  dplyr::mutate(mature = purrr::map(.x = data, .f = function(.x) {
    .x %>% 
      dplyr::summarise('mature-total' = sum(`mature-total`), 'mature-rare' = sum(`mature-rare`), 'mature-common' = sum(`mature-common`), 'mature-length' = sum(`mature-length`))
  })) %>%
  dplyr::select(-data) %>%
  tidyr::unnest() %>%
  dplyr::mutate(`pre-length` = `pre-length` - `mature-length`, `pre-total` = `pre-total` - `mature-total`, `pre-rare` = `pre-rare` - `mature-rare`, `pre-common` = `pre-common` - `mature-common`) %>%
  dplyr::select(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('pre-prop-total' = `pre-total`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-rare' = `pre-rare`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-common' = `pre-common`/`pre-length`) ->
  data_snps_pre_no_mature

data_snps %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature

data_snps %>% 
  dplyr::mutate(`mature-total` = `mature-total` - `seed-total`, `mature-rare` = `mature-rare` - `seed-rare`, `mature-common` = `mature-common` - `seed-common`, `mature-length` = `mature-length` - 7) %>%
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`, gene_id, `host gene`, direction, region) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature_no_seed

data_snps %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `seed-total`, `seed-rare`, `seed-common`, gene_id, `host gene`, direction, region) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('seed-prop-total' = `seed-total`/7) %>% 
  dplyr::mutate('seed-prop-rare' = `seed-rare`/7) %>% 
  dplyr::mutate('seed-prop-common' = `seed-common`/7) ->
  data_snps_seed


# Analysis ----------------------------------------------------------------


# Pre-miRNA vs. Flank region ----------------------------------------------

fn_pre_vs_flank()


data_snps_pre %>% 
  dplyr::inner_join(mirna_context, by = 'pre-mirna') ->
  data_snps_pre_context

data_snps_pre_context %>% 
  dplyr::group_by(region) %>% 
  dplyr::summarise(m = mean(`pre-prop-rare`))

data_snps_pre_context %>% 
  ggplot(aes(x = region, y = `pre-prop-rare`)) +
  geom_boxplot()

data_snps_pre_context %>% dplyr::filter(region == 'Exonic') -> exon
data_snps_pre_context %>% dplyr::filter(region == 'Intronic') -> intronic
data_snps_pre_context %>% dplyr::filter(region == 'Intergenic') -> intergenic



# Pre common and rare -----------------------------------------------------


# common

dplyr::bind_rows(
  # pre-mirna
  tibble::tibble(
    density = data_snps_pre$`pre-prop-common`,
    type = 'Pre-miRNA'
  ),
  # flank51
  tibble::tibble(
    density = data_snps_flank51$`flank51-prop-common`,
    type = 'Flank5-1'
  ),
  # flank52
  tibble::tibble(
    density = data_snps_flank52$`flank52-prop-common`,
    type = 'Flank5-2'
  ),
  # flank53
  tibble::tibble(
    density = data_snps_flank53$`flank53-prop-common`,
    type = 'Flank5-3'
  ),
  # flank31
  tibble::tibble(
    density = data_snps_flank31$`flank31-prop-common`,
    type = 'Flank3-1'
  ),
  # flank32
  tibble::tibble(
    density = data_snps_flank32$`flank32-prop-common`,
    type = 'Flank3-2'
  ),
  # flank33
  tibble::tibble(
    density = data_snps_flank33$`flank33-prop-common`,
    type = 'Flank3-3'
  )
) %>% 
  dplyr::mutate(type = factor(
    x = type, 
    levels = c('Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 
               'Flank3-1', 'Flank3-2', 'Flank3-3'))
  ) %>% 
  dplyr::mutate(density = density * 1000) ->
  density_pre_flank_common

density_pre_flank_common %>% 
  dplyr::group_by(type) %>% 
  dplyr::summarise(m = mean(density))

density_pre_flank_common %>% 
  ggplot(aes(x = type, y = density)) +
  geom_boxplot()


# rare

dplyr::bind_rows(
  # pre-mirna
  tibble::tibble(
    density = data_snps_pre$`pre-prop-rare`,
    type = 'Pre-miRNA'
  ),
  # flank51
  tibble::tibble(
    density = data_snps_flank51$`flank51-prop-rare`,
    type = 'Flank5-1'
  ),
  # flank52
  tibble::tibble(
    density = data_snps_flank52$`flank52-prop-rare`,
    type = 'Flank5-2'
  ),
  # flank53
  tibble::tibble(
    density = data_snps_flank53$`flank53-prop-rare`,
    type = 'Flank5-3'
  ),
  # flank31
  tibble::tibble(
    density = data_snps_flank31$`flank31-prop-rare`,
    type = 'Flank3-1'
  ),
  # flank32
  tibble::tibble(
    density = data_snps_flank32$`flank32-prop-rare`,
    type = 'Flank3-2'
  ),
  # flank33
  tibble::tibble(
    density = data_snps_flank33$`flank33-prop-rare`,
    type = 'Flank3-3'
  )
) %>% 
  dplyr::mutate(type = factor(
    x = type, 
    levels = c('Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 
               'Flank3-1', 'Flank3-2', 'Flank3-3'))
  ) ->
  density_pre_flank_rare

density_pre_flank_rare %>% 
  dplyr::group_by(type) %>% 
  dplyr::summarise(m = median(density))

density_pre_flank_rare %>% 
  ggplot(aes(x = type, y = density)) +
  geom_boxplot()




# Combine total -----------------------------------------------------------


dplyr::bind_rows(
  # pre-mirna
  tibble::tibble(
    density = data_snps_pre_no_mature$`pre-prop-total`,
    type = 'Pre-miRNA'
  ),
  # mature 
  tibble::tibble(
    density = data_snps_mature$`mature-prop-total`,
    type = 'Mature miRNA'
  ),
  # seed
  tibble::tibble(
    density = data_snps_seed$`seed-prop-total`,
    type = 'Seed'
  )
) %>% 
  dplyr::mutate(type = factor(
    x = type, 
    levels = c('Pre-miRNA', 'Mature miRNA', 'Seed'))
  ) ->
  density_total_mature

density_total_mature %>% dplyr::group_by(type) %>% dplyr::summarise(m = mean(density))
density_total_mature %>% 
  ggplot(aes(x = type, y = density)) +
  geom_boxplot()


# Functional --------------------------------------------------------------

data_snps_pre
tb_tam %>% 
  dplyr::inner_join(data_snps_pre, by = 'pre-mirna') ->
  tb_tam_merge

tb_tam_merge %>% 
  dplyr::filter(type == 'Function') %>% 
  dplyr::group_by(name) %>% 
  dplyr::summarise(`median_total` = median(`pre-prop-total`))


# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/parse-tam2.rda')
load(file = '/home/liucj/data/refdata/tam2.0/parse-tam2.rda')

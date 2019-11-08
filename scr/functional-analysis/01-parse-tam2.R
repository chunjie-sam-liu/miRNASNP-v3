
# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)

# Source ------------------------------------------------------------------

source(file = 'utils.R')

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
tb_tam <- readr::read_rds(path = path_tam) %>% 
  dplyr::rename(mirna = `pre-mirna`)

# readr::write_rds(x = data_snps, path = '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz')

color_palletes <- c(
  'Exonic' = '#eaff00', 
  'Intronic' = '#dee8a9', 
  'Intergenic' = '#e3c17b', 
  'Pre-miRNA' = '#bb0655', 
  'Mature miRNA' = '#63bd98', 
  'Seed' = '#b97835',
  'Flank3' = '#9bcade',
  'Flank5' = '#c8efab'
  )

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
    scale_fill_manual(name = 'Region', values = color_palletes[c('Exonic', 'Intergenic', 'Intronic')]) +
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
    width = 6, height = 6
  )
  .pie_plot
}

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
      levels = c('Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 'Mature miRNA', 'Seed',
                 'Flank3-1', 'Flank3-2', 'Flank3-3'))
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
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type == 'Flank3-1') %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank31

  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type == 'Flank5-1') %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank51

  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type %in% c('Flank3-2', 'Flank3-3')) %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank323

  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type %in% c('Flank5-2', 'Flank5-3')) %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank523
  
  snp_density <- 689966785/3000000000 # dbSNP v151
  
  density_pre_flank %>% 
    dplyr::mutate(density = ifelse(density > 0.7, 0.7, density)) %>% 
    ggplot(aes(x = type, y = density, fill = color)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c('Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 'Mature miRNA', 'Seed', 'Flank3-1','Flank3-2', 'Flank3-3'),
      labels = c('3', '2', '1', 'Precusor', 'Mature', 'Seed', '1', '2', '3')
      ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c('Flank5', 'Pre-miRNA', 'Mature miRNA', 'Seed', 'Flank3' )]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    # miRNA
    annotate(geom = 'segment', x = 3.7, xend = 6.3, y = 0.71, yend = 0.71) +
    # flank51
    annotate(geom = 'segment', x = 3, xend = 4.93, y = 0.72, yend = 0.72) +
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.6, yend = 0.72) +
    annotate(geom = 'segment', x = 2.9, xend = 3.1, y = 0.6, yend = 0.6) +
    annotate(geom = 'segment', x = 4.93, xend = 4.93, y = 0.71, yend = 0.72) +
    annotate(
      geom = 'text', x = 4, y = 0.74,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_flank51$p.value)
      )
    ) +
    # flank31
    annotate(geom = 'segment', x = 5.03, xend = 7, y = 0.72, yend = 0.72) +
    annotate(geom = 'segment', x = 5.03, xend = 5.03, y = 0.71, yend = 0.72) +
    annotate(geom = 'segment', x = 7, xend = 7, y = 0.6, yend = 0.72) +
    annotate(geom = 'segment', x= 6.9, xend = 7.1, y = 0.6, yend = 0.6) +
    annotate(
      geom = 'text', x = 6.2, y = 0.74,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_flank31$p.value)
      )
    ) +
    # flank5 32
    annotate(geom = 'segment', x = 0.7, xend = 2.3, y = 0.6, yend = 0.6) +
    annotate(geom = 'segment', x = 1.5, xend = 4.93, y = 0.77, yend = 0.77) +
    annotate(geom = 'segment', x = 1.5, xend = 1.5, y = 0.6, yend = 0.77) +
    annotate(geom = 'segment', x = 4.93, xend = 4.93, y = 0.76, yend = 0.77) +
    annotate(
      geom = 'text', x = 3, y = 0.79,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_flank523$p.value)
      )
    ) +
    # flank3 32
    annotate(geom = 'segment', x = 7.7, xend = 9.3, y = 0.6, yend = 0.6) +
    annotate(geom = 'segment', x = 5.03, xend = 8.5, y = 0.77, yend = 0.77) +
    annotate(geom = 'segment', x = 5.03, xend = 5.03, y = 0.76, yend = 0.77) +
    annotate(geom = 'segment', x = 8.5, xend = 8.5, y = 0.6, yend = 0.77) +
    annotate(
      geom = 'text', x = 7, y = 0.79,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_flank323$p.value)
      )
    ) +
    coord_cartesian(xlim=c(1,9), ylim=c(0,0.83), clip="off") +
    annotate(geom = 'segment', x = 0.8, xend = 3.2, y = -0.075, yend = -0.075) +
    annotate(geom = 'text', x = 2, y = -0.09, label = "5' flanking regions") +
    
    annotate(geom = 'segment', x = 6.8, xend = 9.2, y = -0.075, yend = -0.075) +
    annotate(geom = 'text', x = 8, y = -0.09, label = "3' flanking regions") +
    
    annotate(geom = 'segment', x = 3.5, xend = 6.3, y = -0.075, yend = -0.075) +
    annotate(geom = 'text', x = 5, y = -0.09, label = "miRNA regions") ->
    density_pre_flank_plot
  
  ggsave(
    filename = 'snp-density-pre-mirna-flanking-region-new.pdf',
    plot = density_pre_flank_plot,
    device = 'pdf',
    path = path_out,
    width = 6, height = 6
  )
  
  density_pre_flank %>% 
    dplyr::group_by(type) %>% 
    dplyr::summarise(m = mean(density), s = sd(density)) %>% 
    dplyr::rename('Average SNP density' = m, 'SD SNP density' = s, Region = type) ->
    density_pre_flank_table
  
  list(
    density_pre_flank_table = density_pre_flank_table,
    density_pre_flank_plot = density_pre_flank_plot
  )
}
fn_pre_vs_flank_common <- function() {
  # dbSNP v151 689966785/3000000000 = 0.23
  dplyr::bind_rows(
    # pre-mirna
    tibble::tibble(
      density = data_snps_pre_no_mature %>% 
        dplyr::pull(`pre-prop-common`),
      type = 'Pre-miRNA'
    ),
    # mature mirna
    tibble::tibble(
      density = data_snps_mature_no_seed %>% 
        dplyr::pull(`mature-prop-common`),
      type = 'Mature miRNA'
    ),
    # seed
    tibble::tibble(
      density = data_snps_seed %>% 
        dplyr::pull(`seed-prop-common`),
      type = 'Seed'
    ),
    # flank51
    tibble::tibble(
      density = data_snps_flank51 %>% 
        dplyr::pull(`flank51-prop-common`),
      type = 'Flank5-1'
    ),
    # flank52
    tibble::tibble(
      density = data_snps_flank52 %>% 
        dplyr::pull(`flank52-prop-common`),
      type = 'Flank5-2'
    ),
    # flank53
    tibble::tibble(
      density = data_snps_flank53 %>% 
        dplyr::pull(`flank53-prop-common`),
      type = 'Flank5-3'
    ),
    # flank31
    tibble::tibble(
      density = data_snps_flank31 %>% 
        dplyr::pull(`flank31-prop-common`),
      type = 'Flank3-1'
    ),
    # flank32
    tibble::tibble(
      density = data_snps_flank32 %>% 
        dplyr::pull(`flank32-prop-common`),
      type = 'Flank3-2'
    ),
    # flank33
    tibble::tibble(
      density = data_snps_flank33 %>% 
        dplyr::pull(`flank33-prop-common`),
      type = 'Flank3-3'
    )
  ) %>% 
    dplyr::mutate(type = factor(
      x = type, 
      levels = c('Flank5-3', 'Flank5-2', 'Flank5-1', 'Pre-miRNA', 'Mature miRNA', 'Seed',
                 'Flank3-1', 'Flank3-2', 'Flank3-3'))
    ) %>% 
    dplyr::mutate(color = dplyr::case_when(
      grepl(pattern = 'Flank5', x = type) ~ 'Flank5',
      grepl(pattern = 'Flank3', x = type) ~ 'Flank3',
      grepl(pattern = 'Pre', x = type) ~ 'Pre-miRNA',
      grepl(pattern = 'Mature', x = type) ~ 'Mature miRNA',
      grepl(pattern = 'Seed', x = type) ~ 'Seed'
    )) %>% 
    dplyr::mutate(color = factor(color, levels = c('Flank5', 'Pre-miRNA', 'Mature miRNA', 'Seed', 'Flank3'))) %>% 
    dplyr::mutate(density = density * 1000) ->
    density_pre_flank
  
  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type == 'Flank3-1') %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank31
  
  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type == 'Flank5-1') %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank51
  
  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type %in% c('Flank3-2', 'Flank3-3')) %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank323
  
  t.test(
    x = density_pre_flank %>% dplyr::filter(color %in% c('Pre-miRNA', 'Mature miRNA', 'Seed')) %>% dplyr::pull(density),
    y = density_pre_flank %>% dplyr::filter(type %in% c('Flank5-2', 'Flank5-3')) %>% dplyr::pull(density)
  ) %>%
    broom::tidy() ->
    t_test_pre_flank523
  
  # snp_density <- 15338492/3000000000 * 1000# dbSNP v151
  snp_density <- 5.1
    
  density_pre_flank %>% 
    dplyr::group_by(type) %>% 
    dplyr::summarise(mean = mean(density), sd = sd(density)) %>% 
    dplyr::rename('Mean common SNP density (SNPs/kb)' = mean, Region = type) ->
    density_pre_flank_table
  
  list(
    density_pre_flank_table = density_pre_flank_table,
    snp_density = snp_density
  )
}

fn_pre_vs_mature_vs_seed <- function() {
  data_snps_pre_no_mature
  data_snps_mature_no_seed
  data_snps_seed
  
  dplyr::bind_rows(
    # pre-mirna
    tibble::tibble(
      density = data_snps_pre_no_mature$`pre-prop-total`,
      type = 'Pre-miRNA'
    ),
    # mature 
    tibble::tibble(
      density = data_snps_mature_no_seed$`mature-prop-total`,
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
    density_pre_mature_seed

  t.test(
    x = density_pre_mature_seed %>% dplyr::filter(type == 'Pre-miRNA') %>% dplyr::pull(density),
    y = density_pre_mature_seed %>% dplyr::filter(type == 'Mature miRNA') %>% dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_pre_mature
  
  t.test(
    x = density_pre_mature_seed %>% dplyr::filter(type == 'Pre-miRNA') %>% dplyr::pull(density),
    y = density_pre_mature_seed %>% dplyr::filter(type == 'Seed') %>% dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_pre_seed
  
  t.test(
    x = density_pre_mature_seed %>% dplyr::filter(type == 'Pre-miRNA') %>% dplyr::pull(density),
    y = density_pre_mature_seed %>% dplyr::filter(type == 'Mature miRNA') %>% dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_pre_mature
  
  t.test(
    x = density_pre_mature_seed %>% dplyr::filter(type == 'Seed') %>% dplyr::pull(density),
    y = density_pre_mature_seed %>% dplyr::filter(type == 'Mature miRNA') %>% dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_mature_seed
  snp_density <- 689966785/3000000000 # dbSNP v151
  density_pre_mature_seed %>% 
    dplyr::mutate(density = ifelse(density > 0.7, 0.7, density)) %>%
    ggplot(aes(x = type, y = density, fill = type)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c('Pre-miRNA', 'Mature miRNA', 'Seed'),
      labels = c('pre-miRNA', 'Mature miRNA', 'Seed region')
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c('Pre-miRNA', 'Mature miRNA', 'Seed')]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    annotate(geom = 'segment', x = 2.1, xend = 3, y = 0.71, yend = 0.71) +
    annotate(geom = 'segment', x = 2.1, xend = 2.1, y = 0.705, yend = 0.71) + 
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.705, yend = 0.71) +
    annotate(
      geom = 'text', x = 2.5, y = 0.72,
      label = human_read_latex_pval(
        .x = human_read(t_test_mature_seed$p.value)
      )
    ) +
    annotate(geom = 'segment', x = 1, xend = 1.9, y = 0.71, yend = 0.71) +
    annotate(geom = 'segment', x = 1, xend = 1, y = 0.705, yend = 0.71) + 
    annotate(geom = 'segment', x = 1.9, xend = 1.9, y = 0.705, yend = 0.71) +
    annotate(
      geom = 'text', x = 1.5, y = 0.72,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_mature$p.value)
      )
    ) +
    annotate(geom = 'segment', x = 1, xend = 3, y = 0.74, yend = 0.74) +
    annotate(geom = 'segment', x = 1, xend = 1, y = 0.73, yend = 0.74) + 
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.73, yend = 0.74) +
    annotate(
      geom = 'text', x = 2, y = 0.75,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_seed$p.value)
      )
    ) ->
    density_pre_mature_seed_plot
  
  density_pre_mature_seed %>% 
    dplyr::group_by(type) %>% 
    dplyr::summarise(m = mean(density), s = sd(density))  %>% 
    dplyr::rename('Mean SNP density' = m, 'SD SNP density' = s, Region = type) ->
    density_pre_mature_seed_table
  
  ggsave(
    filename = 'snp-density-pre-mature-seed-region.pdf',
    plot = density_pre_mature_seed_plot,
    device = 'pdf',
    path = path_out,
    width = 6, height = 6
  )
  
  list(
    density_pre_mature_seed_table = density_pre_mature_seed_table,
    density_pre_mature_seed_plot = density_pre_mature_seed_plot
  )
}
fn_mirna_exon_intron_density <- function() {
  snp_density <- 689966785/3000000000 # dbSNP v151
  
  t.test(
    x = data_snps_pre %>% dplyr::filter(region == 'Exonic') %>% dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% dplyr::filter(region %in% c('Intergenic', 'Intronic')) %>% dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_exon_intron_inter
  
  t.test(
    x = data_snps_pre %>% dplyr::filter(region == 'Intergenic') %>% dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% dplyr::filter(region == 'Intronic') %>% dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_intron_inter
  
  data_snps_pre %>% 
    dplyr::mutate(density = ifelse(`pre-prop-total` > 0.7, 0.7, `pre-prop-total`)) %>%
    ggplot(aes(x = region, y = density, fill = region)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c('Exonic', 'Intronic', 'Intergenic'),
      labels = c('Exon\n(200, 10.4%)', 'Intron\n(967, 50.4%)', 'Intergenic\n(791, 39.2%)')
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c('Exonic', 'Intronic', 'Intergenic')]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    
    annotate(geom = 'segment', x = 2, xend = 3, y = 0.63, yend = 0.63) +
    annotate(geom = 'segment', x = 2, xend = 2, y = 0.62, yend = 0.63) + 
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.62, yend = 0.63) +
    annotate(
      geom = 'text', x = 2.5, y = 0.64,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_intron_inter$p.value)
      )
    ) +
    
    annotate(geom = 'segment', x = 1, xend = 2.5, y = 0.72, yend = 0.72) +
    annotate(geom = 'segment', x = 1, xend = 1, y = 0.71, yend = 0.72) +
    annotate(geom = 'segment', x = 2.5, xend = 2.5, y = 0.71, yend = 0.72) +
    annotate(
      geom = 'text', x = 1.75, y = 0.735,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_exon_intron_inter$p.value)
      )
    ) ->
    density_exon_intron_inter_plot
  
  ggsave(
    filename = 'snp-density-exon-intron-integenic-region.pdf',
    plot = density_exon_intron_inter_plot,
    device = 'pdf',
    path = path_out,
    width = 6, height = 6
  )
  
  data_snps_pre %>% 
    dplyr::group_by(region) %>% 
    dplyr::summarise(m = mean(`pre-prop-total`), s = sd(`pre-prop-total`)) %>% 
    dplyr::rename('Mean SNP density' = m, 'SD SNP density' = s, Region = region) ->
    density_exon_intron_inter_table
  
  list(
    density_exon_intron_inter_table = density_exon_intron_inter_table,
    density_exon_intron_inter_plot = density_exon_intron_inter_plot
  )
  
}

fn_tam_cluster <- function() {
  tb_tam_merge
  tb_tam_merge %>% 
    dplyr::filter(type == 'Cluster') -> 
    .cluster
  
  # cluster
  data_snps_pre_name %>% 
    dplyr::filter(!mirna %in% .cluster$mirna) %>% 
    dplyr::select(mirna, `pre-prop-total`) ->
    .individual_mirna
  
  t.test(.cluster$`pre-prop-total`, .individual_mirna$`pre-prop-total`) %>% 
    broom::tidy()
  
  # disease
  tb_tam_merge %>% 
    dplyr::filter(type == 'HMDD') %>% 
    dplyr::select(mirna, `pre-prop-total`, region) %>% 
    dplyr::distinct() ->
    .hmdd
  
  data_snps_pre_name %>% 
    dplyr::filter(!mirna %in% .hmdd$mirna) %>% 
    dplyr::select(mirna, `pre-prop-total`) ->
    .non_hmdd
  
  t.test(.hmdd$`pre-prop-total`, .non_hmdd$`pre-prop-total`) %>% 
    broom::tidy()
  
  # Family
  tb_tam_merge %>% 
    dplyr::filter(type == 'Family') %>% 
    dplyr::group_by(name) %>% 
    dplyr::summarise(mean = mean(`pre-prop-total`), n = dplyr::n()) %>% 
    dplyr::arrange(mean) %>% View()
  
  tb_tam_merge %>% 
    dplyr::filter(type == 'Family') %>% 
    dplyr::select(mirna, `pre-prop-total`, region) %>% 
    dplyr::distinct() ->
    .family
  
  data_snps_pre_name %>% 
    dplyr::filter(!mirna %in% .hmdd$mirna) %>% 
    dplyr::select(mirna, `pre-prop-total`) ->
    .non_family
  
  t.test(.family$`pre-prop-total`, .non_family$`pre-prop-total`) %>% 
    broom::tidy()
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

density_pre_flank_plot_table <- fn_pre_vs_flank()

# Pre-miRNA vs. mature-miRNA vs. Seed -------------------------------------

density_pre_mature_seed_plot_table <- fn_pre_vs_mature_vs_seed()


# Pre-miRNA vs. Exon ----------------------------------------------------

fn_mirna_context_pie()
density_exon_intron_inter_plot_table <- fn_mirna_exon_intron_density()


# Functional --------------------------------------------------------------

data_snps_pre %>% 
  dplyr::mutate(mirna = purrr::map_chr(
    .x = `pre-mirna`,
    .f = function(.x) {
      gsub(pattern = '.*:(.*)', replacement = '\\1', x = .x)
    }
  )) ->
  data_snps_pre_name

tb_tam %>% 
  dplyr::inner_join(data_snps_pre_name, by = 'mirna') %>% 
  dplyr::select(type, name, mirna, `pre-prop-total`, region) ->
  tb_tam_merge


# Cluster -----------------------------------------------------------------




# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/parse-tam2.rda')
load(file = '/home/liucj/data/refdata/tam2.0/parse-tam2.rda')

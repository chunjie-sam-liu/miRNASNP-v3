
# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)

# Source ------------------------------------------------------------------

source(file = 'utils.R')

# Path --------------------------------------------------------------------

path_tam <- '/home/liucj/data/refdata/tam2.0/mirset_v9.txt.rds.gz'
path_snps <- '/home/liucj/data/refdata/tam2.0/variation_seed28_anno.txt'
path_mirna_context <- '/workspace/liucj/refdata/mirna-genomic-context/encode-genomic-context.rds.gz'
path_mirna_conservation_score <- '/home/liucj/data/refdata/tam2.0/mirna-conservation-scores.rds.gz'
path_out <- '/home/liucj/data/refdata/tam2.0/'


# Load data ---------------------------------------------------------------
mirna_conservation_score <- readr::read_rds(path = path_mirna_conservation_score)
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
  dplyr::inner_join(mirna_context, by = 'pre-mirna') %>% 
  dplyr::left_join(mirna_conservation_score, by = 'pre-mirna') %>% 
  dplyr::mutate(ave_score = ifelse(ave_score < 0, 0, ave_score)) %>% 
  dplyr::mutate(score_range = dplyr::case_when(
    ave_score <= 0.02 ~ 'Low',
    ave_score < 0.98 & ave_score > 0.02 ~ 'Mid',
    ave_score >= 0.98 ~ 'High'
  ))
tb_tam <- readr::read_rds(path = path_tam) %>% 
  dplyr::rename(mirna = `pre-mirna`)

# readr::write_rds(x = data_snps, path = '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz')

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

# Function ----------------------------------------------------------------
fn_create_conservation_score_files <- function() {
  data_snps_pre %>% 
    dplyr::select(1) %>% 
    dplyr::mutate(z = `pre-mirna`) %>% 
    tidyr::separate(`pre-mirna`, c('a', 'b', 'c', 'd', 'e'), sep = ':') %>% 
    dplyr::mutate(f = glue::glue('{a}:{b}-{c}')) %>% 
    dplyr::select(f, z) ->
    d
  
    d %>% readr::write_tsv(path = '/home/liucj/data/refdata/tam2.0/regions-for-conservation-score.tsv')
  
    d %>% 
    dplyr::slice(1:1000) %>% 
    readr::write_tsv(path = '/home/liucj/data/refdata/tam2.0/regions-for-conservation-score-1-1000.tsv')
  
    d %>% 
    dplyr::slice(1001:nrow(data_snps_pre)) %>% 
    readr::write_tsv(path = '/home/liucj/data/refdata/tam2.0/regions-for-conservation-score-1001-1918.tsv')
}
fn_conservation_score_correlation <- function() {
  data_snps_pre %>% 
    dplyr::mutate(ave_score = ifelse(ave_score < 0, 0, ave_score)) %>% 
    dplyr::mutate(score_range = dplyr::case_when(
      ave_score == 0 ~ 'Human',
      ave_score <= 0.02 & ave_score > 0 ~ 'Low',
      ave_score < 0.98 & ave_score > 0.02 ~ 'Mid',
      ave_score >= 0.98 ~ 'High'
    )) %>% 
    dplyr::select(`pre-mirna`, `pre-prop-total`, `pre-prop-common`, `pre-prop-rare`, ave_score, region, score_range) ->
    data_snps_pre_cons_score
  
  conservation_name <- c('Non-conserved\n(617)', 'Lowly conserved\n(1058)', 'Highly conserved\n(243)')
  
  data_snps_pre_cons_score %>% 
    ggplot(aes(x = ave_score)) +
    geom_density() +
    geom_vline(xintercept = 0.03, color = 'red') +
    geom_vline(xintercept = 0.97, color = 'red') +
    scale_x_discrete(limits = seq(0, 1, 0.1), labels = seq(0, 1, 0.1), expand = c(0, 0)) +
    scale_y_continuous(expand = c(0, 0)) +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    labs(
      x = 'Conservation score',
      y = 'Density',
      title = 'miRNA conservation score'
    ) +
    annotate(
      geom = 'segment', x = 0.01, xend = 0.18, y = 1.8, yend = 2.2, arrow = arrow( type = 'closed', length = unit(0.05, 'inches'))
    ) +
    annotate(
      geom = 'text', x = 0.22, y = 2.2, label = conservation_name[1], size = 5
    ) +
    annotate(
      geom = 'segment', x = 0.15, xend = 0.3, y = 0.3, yend = 1.1, arrow = arrow( type = 'closed', length = unit(0.05, 'inches'))
    ) +
    annotate(
      geom = 'text', x = 0.37, y = 1.1, label = conservation_name[2], size = 5
    ) +
    annotate(
      geom = 'segment', x = 0.98, xend = 0.8, y = 0.5, yend = 0.8, arrow = arrow( type = 'closed', length = unit(0.05, 'inches'))
    ) +
    annotate(
      geom = 'text', x = 0.75, y = 0.8, label = conservation_name[3], size = 5
    ) -> 
    mirna_density_conservation_score_plot
  
  ggsave(
    filename = 'mirna-density-conservation-score.pdf',
    plot = mirna_density_conservation_score_plot,
    device = 'pdf',
    path = path_out,
    width = 5, height = 4.5
  )
    
  
  # boxplot
  conservation_name <- c('Human Specific\n(18, 1%)', 'Non-conserved\n(599, 21.2%)', 'Lowly conserved\n(1058, 55.1%)', 'Highly conserved\n(243, 12.7%)')
  
  t.test(
    x = data_snps_pre_cons_score %>% 
      dplyr::filter(score_range == 'Low') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_cons_score %>% 
      dplyr::filter(score_range == 'Mid') %>% 
      dplyr::pull(`pre-prop-total`)
  ) ->
    t_test_low_mid
  
  t.test(
    x = data_snps_pre_cons_score %>% 
      dplyr::filter(score_range %in% c('Low', 'Mid')) %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_cons_score %>% 
      dplyr::filter(score_range == 'High') %>% 
      dplyr::pull(`pre-prop-total`)
  ) ->
    t_test_high_lowmid
  
  t.test(
    x = data_snps_pre_cons_score %>% 
      dplyr::filter(score_range %in% c('Low', 'Mid')) %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_cons_score %>% 
      dplyr::filter(score_range == 'Human') %>% 
      dplyr::pull(`pre-prop-total`)
  ) ->
    t_test_human_lowmid
  
  snp_density <- 689966785/3000000000 # dbSNP v151
  data_snps_pre_cons_score %>% 
    dplyr::mutate(`pre-prop-total` = ifelse(`pre-prop-total` > 0.7, 0.7, `pre-prop-total`)) %>% 
    ggplot(aes(x = score_range, y = `pre-prop-total`, fill = score_range)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c('Human', 'Low', 'Mid', 'High'),
      labels = conservation_name
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c("High", 'Human', "Low", 'Mid')]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    annotate(geom = 'segment', x = 2, xend = 3, y = 0.64, yend = 0.64) +
    annotate(geom = 'segment', x = 2, xend = 2, y = 0.63, yend = 0.64) +
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.63, yend = 0.64) +
    annotate(
      geom = 'text', x = 2.5, y = 0.655,
      label = human_read_latex_pval(
        .x = human_read(t_test_low_mid$p.value)
      )
    ) +
    annotate(geom = 'segment', x = 2.55, xend = 4, y = 0.69, yend = 0.69) +
    annotate(geom = 'segment', x = 2.55, xend = 2.55, y = 0.68, yend = 0.69) +
    annotate(geom = 'segment', x = 4, xend = 4, y = 0.68, yend = 0.69) +
    annotate(
      geom = 'text', x = 3.5, y = 0.705,
      label = human_read_latex_pval(
        .x = human_read(t_test_high_lowmid$p.value)
      )
    )  +
    annotate(geom = 'segment', x = 1, xend = 2.45, y = 0.69, yend = 0.69) +
    annotate(geom = 'segment', x = 1, xend = 1, y = 0.68, yend = 0.69) +
    annotate(geom = 'segment', x = 2.45, xend = 2.45, y = 0.68, yend = 0.69) +
    annotate(
      geom = 'text', x = 1.5, y = 0.705,
      label = human_read_latex_pval(
        .x = human_read(t_test_human_lowmid$p.value)
      )
    )->
    mirna_snp_density_conservation_plot
  ggsave(
    filename = 'mirna-snp-density-conservation.pdf',
    plot = mirna_snp_density_conservation_plot,
    device = 'pdf',
    path = path_out,
    width = 5, height = 5
  )
    
}

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
    scale_fill_manual(name = 'Region', values = color_palletes[c("3'UTR", "5'UTR", 'Exonic', 'Intergenic', 'Intronic')]) +
    coord_polar(theta = 'y') +
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
      y = data_snps_pre_for_pie_plot$n[5]/2, 
      label = data_snps_pre_for_pie_plot$label[5],
      size = 5
    ) +
    annotate(
      geom = 'text', x = 1, 
      y = data_snps_pre_for_pie_plot$n[4]/2 + data_snps_pre_for_pie_plot$n[5],
      label = data_snps_pre_for_pie_plot$label[4],
      size = 5
    ) +
    annotate(
      geom = 'text', x = 1.8, 
      y = data_snps_pre_for_pie_plot$n[3]/2 + data_snps_pre_for_pie_plot$n[4] + data_snps_pre_for_pie_plot$n[5] - 80,
      label = data_snps_pre_for_pie_plot$label[3],
      size = 5
    ) + 
    annotate(
      geom = 'text', x = 1.8, 
      y = data_snps_pre_for_pie_plot$n[2]/2 + data_snps_pre_for_pie_plot$n[3] + data_snps_pre_for_pie_plot$n[4] + data_snps_pre_for_pie_plot$n[5] - 90,
      label = data_snps_pre_for_pie_plot$label[2],
      size = 5
    ) +
    annotate(
      geom = 'text', x = 1.8, 
      y = data_snps_pre_for_pie_plot$n[1]/2 + data_snps_pre_for_pie_plot$n[2] + data_snps_pre_for_pie_plot$n[3] + data_snps_pre_for_pie_plot$n[4] + data_snps_pre_for_pie_plot$n[5] - 80,
      label = data_snps_pre_for_pie_plot$label[1],
      size = 5
    ) ->
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
fn_pre_vs_flank_conservation_high <- function() {
  # dbSNP v151 689966785/3000000000 = 0.23
  dplyr::bind_rows(
    # pre-mirna
    tibble::tibble(
      density = data_snps_pre_no_mature %>% 
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`pre-prop-total`),
      type = 'Pre-miRNA'
    ),
    # mature mirna
    tibble::tibble(
      density = data_snps_mature_no_seed %>% 
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`mature-prop-total`),
      type = 'Mature miRNA'
    ),
    # seed
    tibble::tibble(
      density = data_snps_seed %>% 
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`seed-prop-total`),
      type = 'Seed'
    ),
    # flank51
    tibble::tibble(
      density = data_snps_flank51 %>%
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`flank51-prop-total`),
      type = 'Flank5-1'
    ),
    # flank52
    tibble::tibble(
      density = data_snps_flank52 %>%
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`flank52-prop-total`),
      type = 'Flank5-2'
    ),
    # flank53
    tibble::tibble(
      density = data_snps_flank53 %>%
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`flank53-prop-total`),
      type = 'Flank5-3'
    ),
    # flank31
    tibble::tibble(
      density = data_snps_flank31 %>%
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`flank31-prop-total`),
      type = 'Flank3-1'
    ),
    # flank32
    tibble::tibble(
      density = data_snps_flank32 %>%
        dplyr::filter(score_range == 'High') %>% 
        dplyr::pull(`flank32-prop-total`),
      type = 'Flank3-2'
    ),
    # flank33
    tibble::tibble(
      density = data_snps_flank33 %>%
        dplyr::filter(score_range == 'High') %>% 
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
    filename = 'snp-density-pre-mirna-flanking-region-new-high-conservation.pdf',
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
fn_pre_vs_flank_conservation <- function() {
  # dbSNP v151 689966785/3000000000 = 0.23
  dplyr::bind_rows(
    # pre-mirna
    tibble::tibble(
      density = data_snps_pre_no_mature %>% 
        dplyr::pull(`pre-prop-total`),
      type = 'Pre-miRNA',
      ave_score = data_snps_pre_no_mature %>% 
        dplyr::pull(ave_score)
    ),
    # mature mirna
    tibble::tibble(
      density = data_snps_mature_no_seed %>% 
        dplyr::pull(`mature-prop-total`),
      type = 'Mature miRNA',
      ave_score = data_snps_mature_no_seed %>% 
        dplyr::pull(ave_score)
    ),
    # seed
    tibble::tibble(
      density = data_snps_seed %>% 
        dplyr::pull(`seed-prop-total`),
      type = 'Seed',
      ave_score = data_snps_seed %>% 
        dplyr::pull(ave_score)
    )
  ) %>% 
    dplyr::mutate(type = factor(
      x = type, 
      levels = c('Pre-miRNA', 'Mature miRNA', 'Seed'))
    ) %>% 
    dplyr::mutate(color = dplyr::case_when(
      grepl(pattern = 'Pre', x = type) ~ 'Pre-miRNA',
      grepl(pattern = 'Mature', x = type) ~ 'Mature miRNA',
      grepl(pattern = 'Seed', x = type) ~ 'Seed'
    )) %>% 
    dplyr::mutate(color = factor(color, levels = c('Pre-miRNA', 'Mature miRNA', 'Seed'))) %>% 
    dplyr::mutate(score_range = dplyr::case_when(
      ave_score == 0 ~ 'Human',
      ave_score <= 0.02 & ave_score > 0 ~ 'Low',
      ave_score < 0.98 & ave_score > 0.02 ~ 'Mid',
      ave_score >= 0.98 ~ 'High'
    )) %>% 
    dplyr::mutate(score_range = factor(score_range, levels = c('Human', 'Low', 'Mid', 'High')))->
    density_pre_flank
  
  snp_density <- 689966785/3000000000 # dbSNP v151
  
  density_pre_flank %>% 
    dplyr::mutate(density = ifelse(density > 0.7, 0.7, density)) %>% 
    ggplot(aes(x = type, y = density, fill = color)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c('Pre-miRNA', 'Mature miRNA', 'Seed'),
      labels = c('Precusor', 'Mature', 'Seed')
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c('Pre-miRNA', 'Mature miRNA', 'Seed')]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black', angle = 45, vjust = 1, hjust = 1),
      legend.position = 'none',
      strip.background = element_rect(fill = NA, color = 'black')
    ) +
    facet_grid(.~score_range, labeller = as_labeller(conservation_name)) ->
    density_pre_flank_plot
  
  ggsave(
    filename = 'snp-density-pre-mirna-flanking-region-new-conservation.pdf',
    plot = density_pre_flank_plot,
    device = 'pdf',
    path = path_out,
    width = 7, height = 4
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
  
  density_pre_flank_table %>% 
    ggplot(aes(x = Region, y = `Mean common SNP density (SNPs/kb)`)) +
    geom_bar(stat = "identity")
  
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
      density = data_snps_pre_no_mature %>% 
        dplyr::pull(`pre-prop-total`),
      type = 'Pre-miRNA'
    ),
    # mature 
    tibble::tibble(
      density = data_snps_mature_no_seed %>% 
        dplyr::pull(`mature-prop-total`),
      type = 'Mature miRNA'
    ),
    # seed
    tibble::tibble(
      density = data_snps_seed %>% 
        dplyr::pull(`seed-prop-total`) ,
      type = 'Seed'
    )
  ) %>% 
    dplyr::mutate(type = factor(
      x = type, 
      levels = c('Pre-miRNA', 'Mature miRNA', 'Seed'))
    ) ->
    density_pre_mature_seed

  t.test(
    x = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Pre-miRNA') %>% 
      dplyr::pull(density),
    y = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Mature miRNA') %>% 
      dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_pre_mature
  
  t.test(
    x = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Pre-miRNA') %>% 
      dplyr::pull(density),
    y = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Seed') %>% 
      dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_pre_seed
  
  t.test(
    x = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Pre-miRNA') %>% 
      dplyr::pull(density),
    y = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Mature miRNA') %>% 
      dplyr::pull(density)
  ) %>% 
    broom::tidy() ->
    t_test_pre_mature
  
  t.test(
    x = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Seed') %>% 
      dplyr::pull(density),
    y = density_pre_mature_seed %>% 
      dplyr::filter(type == 'Mature miRNA') %>% 
      dplyr::pull(density)
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
    x = data_snps_pre %>% 
  
      dplyr::filter(region == "3'UTR") %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% 
  
      dplyr::filter(region %in% c('Intergenic', 'Intronic')) %>% 
      dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_3utr_intron_inter
  
  t.test(
    x = data_snps_pre %>% 
  
      dplyr::filter(region == 'Exonic') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% 
  
      dplyr::filter(region == "3'UTR") %>% 
      dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_exon_3utr
  
  t.test(
    x = data_snps_pre %>% 
  
      dplyr::filter(region == 'Exonic') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% 
  
      dplyr::filter(region == "5'UTR") %>% 
      dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_exon_5utr
  
  t.test(
    x = data_snps_pre %>% 
  
      dplyr::filter(region == 'Intergenic') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% 
  
      dplyr::filter(region == 'Intronic') %>% 
      dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_intron_inter
  
  t.test(
    x = data_snps_pre %>% 
  
      dplyr::filter(region == 'Exonic') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre %>% 
  
      dplyr::filter(region %in% c('Intergenic', 'Intronic')) %>% 
      dplyr::pull(`pre-prop-total`)
  ) %>% 
    broom::tidy() ->
    t_test_pre_exon_intron_inter
  
  data_snps_pre %>% 

    dplyr::mutate(density = ifelse(`pre-prop-total` > 0.7, 0.7, `pre-prop-total`)) %>%
    ggplot(aes(x = region, y = density, fill = region)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c("5'UTR", 'Exonic', "3'UTR", 'Intronic', 'Intergenic'),
      labels = c("5'UTR\n(63, 3.3%)", 'Exon\n(73, 3.8%)',"3'UTR\n(62, 3.2%)" , 'Intron\n(973, 50.7%)', 'Intergenic\n(747, 38.9%)')
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c("5'UTR", 'Exonic', 'Intronic', "3'UTR", 'Intergenic')]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    # intergenic intron
    annotate(geom = 'segment', x = 4, xend = 5, y = 0.61, yend = 0.61) +
    annotate(geom = 'segment', x = 4, xend = 4, y = 0.605, yend = 0.61) + 
    annotate(geom = 'segment', x = 5, xend = 5, y = 0.605, yend = 0.61) +
    annotate(
      geom = 'text', x = 4.5, y = 0.625,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_intron_inter$p.value)
      )
    ) +
    # 3'utr intergenic intron
    annotate(geom = 'segment', x = 3, xend = 4.5, y = 0.64, yend = 0.64) +
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.635, yend = 0.64) + 
    annotate(geom = 'segment', x = 4.5, xend = 4.5, y = 0.635, yend = 0.64) +
    annotate(
      geom = 'text', x = 3.75, y = 0.655,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_3utr_intron_inter$p.value)
      )
    ) +
    # 5'utr exon
    annotate(geom = 'segment', x = 1, xend = 1.95, y = 0.71, yend = 0.71) +
    annotate(geom = 'segment', x = 1, xend = 1, y = 0.705, yend = 0.71) +
    annotate(geom = 'segment', x = 1.95, xend = 1.95, y = 0.705, yend = 0.71) +
    annotate(
      geom = 'text', x = 1.5, y = 0.725,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_exon_5utr$p.value)
      )
    ) + 
    # 3'utr exon
    annotate(geom = 'segment', x = 2, xend = 3, y = 0.66, yend = 0.66) +
    annotate(geom = 'segment', x = 2, xend = 2, y = 0.655, yend = 0.66) +
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.655, yend = 0.66) +
    annotate(
      geom = 'text', x = 2.5, y = 0.675,
      label = human_read_latex_pval(
        .x = human_read(t_test_pre_exon_3utr$p.value)
      )
    ) +
    # intergenic intron exon
    annotate(geom = 'segment', x = 2.05, xend = 4.5, y = 0.71, yend = 0.71) +
    annotate(geom = 'segment', x = 2.05, xend = 2.05, y = 0.705, yend = 0.71) +
    annotate(geom = 'segment', x = 4.5, xend = 4.5, y = 0.705, yend = 0.71) +
    annotate(
      geom = 'text', x = 3.25, y = 0.725,
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
fn_mirna_exon_intron_density_conservation <- function() {
  
  snp_density <- 689966785/3000000000 # dbSNP v151
  conservation_name <- c('Human' = 'Human specific', 'Low' = 'Non-conserved', 'Mid' = 'Lowly conserved', 'High' = 'Highly conserved')
  data_snps_pre %>% 
    dplyr::mutate(score_range = dplyr::case_when(
      ave_score == 0 ~ 'Human',
      ave_score <= 0.02 & ave_score > 0 ~ 'Low',
      ave_score < 0.98 & ave_score > 0.02 ~ 'Mid',
      ave_score >= 0.98 ~ 'High'
    )) %>% 
    dplyr::mutate(score_range = factor(score_range, levels = c('Human', 'Low', 'Mid', 'High'))) %>% 
    dplyr::mutate(density = ifelse(`pre-prop-total` > 0.7, 0.7, `pre-prop-total`)) %>%
    ggplot(aes(x = region, y = density, fill = region)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c("5'UTR", 'Exonic', "3'UTR", 'Intronic', 'Intergenic'),
      labels = c("5'UTR", 'Exon',"3'UTR" , 'Intron', 'Intergenic')
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = color_palletes[c("5'UTR", 'Exonic', 'Intronic', "3'UTR", 'Intergenic')]) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black', angle = 45, hjust = 1, vjust = 1),
      legend.position = 'none',
      strip.background = element_rect(fill = NA, color = 'black')
    ) +
    facet_grid(.~score_range, labeller = as_labeller(conservation_name)) ->
    density_exon_intron_inter_plot
  
  ggsave(
    filename = 'snp-density-exon-intron-integenic-region-conservation.pdf',
    plot = density_exon_intron_inter_plot,
    device = 'pdf',
    path = path_out,
    width = 7, height = 4
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
  tb_tam %>% dplyr::filter(type == 'Cluster') %>% dplyr::select(-1) -> tb_tam_cluster
  
  data_snps_pre_name %>% 
    dplyr::left_join(tb_tam_cluster, by = 'mirna') %>% 
    dplyr::select(-c(2, 3, 4, 5, 6, 7, 8, 13, 14, 15)) %>% 
    dplyr::mutate(cluster = ifelse(is.na(name), 'Individual', 'Cluster')) -> 
    .d
  
  t.test(
    x = .d %>% 
      dplyr::filter(cluster == 'Individual') %>% 
      dplyr::pull(`pre-prop-total`),
    y = .d %>% 
      dplyr::filter(cluster == 'Cluster') %>% 
      dplyr::pull(`pre-prop-total`)
  )
  
  .d %>% 
    ggplot(aes(x = cluster, y = `pre-prop-total`)) +
    geom_boxplot()
}

fn_tam_disease <- function() {
  tb_tam %>% dplyr::filter(type == 'HMDD') %>% dplyr::select(-1) -> tb_tam_hmdd
  
  data_snps_pre_name %>% 
    dplyr::left_join(tb_tam_hmdd, by = 'mirna') %>% 
    dplyr::select(-c(2, 3, 4, 5, 6, 7, 8, 13, 14, 15)) %>% 
    dplyr::group_by(`pre-mirna`, region, ave_score, score_range, `pre-prop-total`) %>% 
    tidyr::nest() %>% 
    dplyr::mutate(n_hmdd = purrr::map_dbl(.x = data, .f = function(.x) {
      if (all(is.na(.x$name))) {
        0
      } else {
        .x %>% dplyr::distinct() %>% nrow()
      }
    })) %>% 
    dplyr::select(-data) %>% 
    dplyr::mutate(
      disease = dplyr::case_when(
        n_hmdd == 0 ~ 'Non-disease',
        n_hmdd == 1 ~ 'Few',
        n_hmdd > 1 ~ 'Many'
      )
    ) %>% 
    dplyr::mutate(disease = factor(x = disease, levels = c('Many', 'Few', 'Non-disease')))-> 
    data_snps_pre_name_hmdd
  data_snps_pre_name_hmdd$disease %>% table()
  
  t.test(
    x = data_snps_pre_name_hmdd %>% 
      dplyr::filter(disease == 'Non-disease') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_name_hmdd %>% 
      dplyr::filter(disease == 'Few') %>% 
      dplyr::pull(`pre-prop-total`)
  ) -> 
    t_test_hmdd_few_non
  
  t.test(
    x = data_snps_pre_name_hmdd %>% 
      dplyr::filter(disease == 'Many') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_name_hmdd %>% 
      dplyr::filter(disease == 'Few') %>% 
      dplyr::pull(`pre-prop-total`)
  ) ->
    t_test_few_many
  snp_density <- 689966785/3000000000 # dbSNP v151
  data_snps_pre_name_hmdd %>% 
    dplyr::group_by(disease) %>% 
    dplyr::summarise(m = mean(`pre-prop-total`))
  
  data_snps_pre_name_hmdd %>% 
    dplyr::mutate(`pre-prop-total` = ifelse(`pre-prop-total` > 0.7, 0.7, `pre-prop-total`)) %>% 
    ggplot(aes(x = disease, y = `pre-prop-total`, fill = `disease`)) +
    stat_boxplot(geom = 'errorbar', width = 0.3) +
    geom_boxplot(outlier.colour = NA, width = 0.5) +
    geom_hline(yintercept = snp_density, color = 'red', linetype = "dashed") +
    scale_x_discrete(
      limits = c('Many', 'Few', 'Non-disease'),
      labels = c('>1-disease\n(583, 30.4%)', '1-disease\n(238, 12.4%)', '0-disease\n(1097, 57.2%)')
    ) +
    scale_y_continuous(breaks = sort(c(seq(0, 0.8, by = 0.1), snp_density))) +
    scale_fill_manual(values = unname(color_palletes[c('Pre-miRNA', 'Mature miRNA', 'Seed')])) +
    labs(x = '', y = 'SNP density') +
    theme(
      panel.background = element_rect(fill = NA, color = 'black'),
      plot.background = element_rect(fill = NA),
      axis.text.y = element_text(color = 'black'),
      axis.text.x = element_text(color = 'black'),
      legend.position = 'none'
    ) +
    # Many few
    annotate(geom = 'segment', x = 1, xend = 1.95, y = 0.615, yend = 0.615) +
    annotate(geom = 'segment', x = 1, xend = 1, y = 0.61, yend = 0.615) + 
    annotate(geom = 'segment', x = 1.95, xend = 1.95, y = 0.61, yend = 0.615) +
    annotate(
      geom = 'text', x = 1.5, y = 0.63,
      label = human_read_latex_pval(
        .x = human_read(t_test_few_many$p.value)
      )
    ) +
    #  few non
    annotate(geom = 'segment', x = 2.05, xend = 3, y = 0.615, yend = 0.615) +
    annotate(geom = 'segment', x = 2.05, xend = 2.05, y = 0.61, yend = 0.615) + 
    annotate(geom = 'segment', x = 3, xend = 3, y = 0.61, yend = 0.615) +
    annotate(
      geom = 'text', x = 2.5, y = 0.63,
      label = human_read_latex_pval(
        .x = human_read(t_test_hmdd_few_non$p.value)
      )
    ) ->
    disease_snp_density
  ggsave(
    filename = 'disease-snp-density.pdf',
    plot = disease_snp_density,
    device = 'pdf',
    path = path_out,
    width = 6, height = 5
  )
  
}
fn_tam_function <- function() {
  tb_tam %>% dplyr::filter(type == 'Function') %>% dplyr::select(-1) -> tb_tam_func
  
  data_snps_pre_name %>% 
    dplyr::left_join(tb_tam_func, by = 'mirna') %>% 
    dplyr::select(-c(2, 3, 4, 5, 6, 7, 8, 13, 14, 15)) %>% 
    dplyr::mutate(name = ifelse(is.na(name), 'Non-function', name)) %>% 
    dplyr::group_by(name) %>% 
    dplyr::summarise(m = mean(`pre-prop-total`)) %>% 
    dplyr::arrange(m) %>% View()
    dplyr::group_by(`pre-mirna`, region, ave_score, score_range, `pre-prop-total`) %>% 
    tidyr::nest() %>% 
    dplyr::mutate(n_func = purrr::map_dbl(.x = data, .f = function(.x) {
      if (all(is.na(.x$name))) {
        0
      } else {
        .x %>% dplyr::distinct() %>% nrow()
      }
    })) %>% 
    dplyr::select(-data) %>% 
    dplyr::mutate(
      func = dplyr::case_when(
        n_func == 0 ~ 'Non',
        n_func <= 3 ~ 'Few',
        n_func > 3 ~ 'Many'
      )
    )  %>% 
    dplyr::mutate(func = factor(x = func, levels = c('Many', 'Few', 'Non')))-> 
    data_snps_pre_name_func
  data_snps_pre_name_func$func %>% table()
  
  t.test(
    x = data_snps_pre_name_func %>% 
      dplyr::filter(func == 'Non') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_name_func %>% 
      dplyr::filter(func == 'Few') %>% 
      dplyr::pull(`pre-prop-total`)
  ) -> 
    t_test_func_few_non
  
  t.test(
    x = data_snps_pre_name_func %>% 
      dplyr::filter(func == 'Many') %>% 
      dplyr::pull(`pre-prop-total`),
    y = data_snps_pre_name_func %>% 
      dplyr::filter(func == 'Few') %>% 
      dplyr::pull(`pre-prop-total`)
  ) ->
    t_test_func_few_many
  snp_density <- 689966785/3000000000 # dbSNP v151
  data_snps_pre_name_func %>% 
    dplyr::group_by(func) %>% 
    dplyr::summarise(m = mean(`pre-prop-total`))
  
  data_snps_pre_name_func %>% 
    dplyr::filter(n_func != 0) %>% 
    ggplot(aes(x = n_func, y = `pre-prop-total`)) +
    geom_point()
  
}
# Split data_snps to regions-----------------------------------------------

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-1-total`, `flank5-1-rare`, `flank5-1-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank51-prop-total' = `flank5-1-total`/`pre-length`) %>% 
  dplyr::mutate('flank51-prop-rare' = `flank5-1-rare`/`pre-length`) %>% 
  dplyr::mutate('flank51-prop-common' = `flank5-1-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank51

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-2-total`, `flank5-2-rare`, `flank5-2-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank52-prop-total' = `flank5-2-total`/`pre-length`) %>% 
  dplyr::mutate('flank52-prop-rare' = `flank5-2-rare`/`pre-length`) %>% 
  dplyr::mutate('flank52-prop-common' = `flank5-2-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank52

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank5-3-total`, `flank5-3-rare`, `flank5-3-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank53-prop-total' = `flank5-3-total`/`pre-length`) %>% 
  dplyr::mutate('flank53-prop-rare' = `flank5-3-rare`/`pre-length`) %>% 
  dplyr::mutate('flank53-prop-common' = `flank5-3-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank53


data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-1-total`, `flank3-1-rare`, `flank3-1-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank31-prop-total' = `flank3-1-total`/`pre-length`) %>% 
  dplyr::mutate('flank31-prop-rare' = `flank3-1-rare`/`pre-length`) %>% 
  dplyr::mutate('flank31-prop-common' = `flank3-1-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank31

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-2-total`, `flank3-2-rare`, `flank3-2-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank32-prop-total' = `flank3-2-total`/`pre-length`) %>% 
  dplyr::mutate('flank32-prop-rare' = `flank3-2-rare`/`pre-length`) %>% 
  dplyr::mutate('flank32-prop-common' = `flank3-2-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank32

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `flank3-3-total`, `flank3-3-rare`, `flank3-3-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('flank33-prop-total' = `flank3-3-total`/`pre-length`) %>% 
  dplyr::mutate('flank33-prop-rare' = `flank3-3-rare`/`pre-length`) %>% 
  dplyr::mutate('flank33-prop-common' = `flank3-3-common`/`pre-length`) %>% 
  dplyr::mutate(name = stringr::str_split(`pre-mirna`, pattern = ":", simplify = T)[,5]) ->
  data_snps_flank33

data_snps %>% 
  dplyr::select(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('pre-prop-total' = `pre-total`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-rare' = `pre-rare`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-common' = `pre-common`/`pre-length`) ->
  data_snps_pre

data_snps %>% 
  dplyr::group_by(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>%
  tidyr::nest() %>%
  dplyr::mutate(mature = purrr::map(.x = data, .f = function(.x) {
    .x %>% 
      dplyr::summarise('mature-total' = sum(`mature-total`), 'mature-rare' = sum(`mature-rare`), 'mature-common' = sum(`mature-common`), 'mature-length' = sum(`mature-length`))
  })) %>%
  dplyr::select(-data) %>%
  tidyr::unnest() %>%
  dplyr::mutate(`pre-length` = `pre-length` - `mature-length`, `pre-total` = `pre-total` - `mature-total`, `pre-rare` = `pre-rare` - `mature-rare`, `pre-common` = `pre-common` - `mature-common`) %>%
  dplyr::select(`pre-mirna`, `pre-length`, `pre-total`, `pre-rare`, `pre-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('pre-prop-total' = `pre-total`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-rare' = `pre-rare`/`pre-length`) %>% 
  dplyr::mutate('pre-prop-common' = `pre-common`/`pre-length`) ->
  data_snps_pre_no_mature

data_snps %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature

data_snps %>% 
  dplyr::mutate(`mature-total` = `mature-total` - `seed-total`, `mature-rare` = `mature-rare` - `seed-rare`, `mature-common` = `mature-common` - `seed-common`, `mature-length` = `mature-length` - 7) %>%
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature_no_seed

data_snps %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `seed-total`, `seed-rare`, `seed-common`, gene_id, `host gene`, direction, region, ave_score, score_range) %>%
  dplyr::distinct() %>% 
  dplyr::mutate('seed-prop-total' = `seed-total`/7) %>% 
  dplyr::mutate('seed-prop-rare' = `seed-rare`/7) %>% 
  dplyr::mutate('seed-prop-common' = `seed-common`/7) ->
  data_snps_seed


# Analysis ----------------------------------------------------------------


# Pre-miRNA vs. Flank region ----------------------------------------------

density_pre_flank_plot_table <- fn_pre_vs_flank()
density_pre_flank_plot_table_conservation <- fn_pre_vs_flank_conservation()


# Conservation ------------------------------------------------------------

fn_conservation_score_correlation()

# Pre-miRNA vs. mature-miRNA vs. Seed -------------------------------------

density_pre_mature_seed_plot_table <- fn_pre_vs_mature_vs_seed()

# Pre-miRNA vs. Exon ----------------------------------------------------

fn_mirna_context_pie()
density_exon_intron_inter_plot_table <- fn_mirna_exon_intron_density()
fn_mirna_exon_intron_density_conservation()


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
tb_tam

# Disease -----------------------------------------------------------------
fn_tam_disease()




# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/parse-tam2.rda')
load(file = '/home/liucj/data/refdata/tam2.0/parse-tam2.rda')

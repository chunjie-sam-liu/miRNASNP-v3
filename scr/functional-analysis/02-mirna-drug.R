
# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)

# Path --------------------------------------------------------------------

path_snps <- '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz'
path_ccle <- '/workspace/liucj/refdata/mirna-drug/CCLE_miRNA_annoed_drug_correlation.rds.gz'
path_nci60 <- '/workspace/liucj/refdata/mirna-drug/NCI60_miRNA_annoed_drug_correlation2.rds.gz'
path_drug <- '/workspace/liucj/refdata/mirna-drug'
path_tam <- '/home/liucj/data/refdata/tam2.0/mirset_v9.txt.rds.gz'


# load data ---------------------------------------------------------------
data_snps <- readr::read_rds(path = path_snps)
drug_ccle <- readr::read_rds(path = path_ccle)
drug_nci60 <- readr::read_rds(path = path_nci60)
tb_tam <- readr::read_rds(path = path_tam)

data_snps %>% 
  dplyr::mutate(`mature-total` = `mature-total` - `seed-total`, `mature-rare` = `mature-rare` - `seed-rare`, `mature-common` = `mature-common` - `seed-common`) %>% 
  dplyr::select(`pre-mirna`, `mature-mirna`, `mature-length`, `mature-total`, `mature-rare`, `mature-common`) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('mature-prop-total' = `mature-total`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-rare' = `mature-rare`/`mature-length`) %>% 
  dplyr::mutate('mature-prop-common' = `mature-common`/`mature-length`) ->
  data_snps_mature

drug_ccle %>% 
  dplyr::filter(stringr::str_detect(string = Symbol, pattern = 'hsa')) %>% 
  dplyr::filter(!stringr::str_detect(string = Symbol, pattern = '\\+')) %>% 
  dplyr::rename('mature-mirna' = Symbol) %>%
  # dplyr::mutate(result = purrr::map(.x = result, .f = function(.x){
  #   .x %>%
  #     dplyr::mutate(fdr = p.adjust(p = pv, method = 'fdr'))
  # })) %>%
  tidyr::unnest() %>% 
  dplyr::mutate(fdr = p.adjust(p = pv, method = 'BH')) %>% 
  dplyr::mutate(log_fdr = -log10(fdr)) ->
  drug_ccle_compound

data_snps_mature %>% 
  dplyr::filter(`mature-mirna` %in% drug_ccle_compound$`mature-mirna`) %>% 
  dplyr::group_by(`mature-mirna`) %>% 
  tidyr::nest() %>% 
  dplyr::mutate(prop = purrr::map(.x = data, .f = function(.x){
    .x %>% dplyr::summarise(prop = sum(`mature-total`) / sum(`mature-length`))
  })) %>% 
  dplyr::select(1, 3) %>% 
  tidyr::unnest() ->
  data_snps_mature_drug

data_snps_mature_drug %>% 
  dplyr::arrange(-prop) %>% 
  dplyr::filter(prop < 0.05) %>% 
  dplyr::mutate(color = ifelse(prop == 0, 'red', 'black')) -> d

drug_ccle_compound %>% 
  dplyr::inner_join(d, by = 'mature-mirna') %>% 
  dplyr::filter(log_fdr > -log10(0.05)) -> 
  drug_ccle_compound_for_plot

drug_ccle_compound_for_plot %>% 
  dplyr::group_by(`mature-mirna`) %>% 
  dplyr::summarise(sum_cor = sum(cor)) %>% 
  dplyr::left_join(d, by = 'mature-mirna') %>% 
  dplyr::arrange(sum_cor) ->
  drug_ccle_compound_for_plot_rank_mirna
  
drug_ccle_compound_for_plot %>% 
  dplyr::group_by(Compound) %>% 
  dplyr::summarise(sum_cor = sum(cor)) %>% 
  dplyr::arrange(-sum_cor) ->
  drug_ccle_compound_for_plot_rank_Compound

drug_ccle_compound_for_plot %>% 
  dplyr::mutate(cor = ifelse(cor < -0.2, -0.2, cor)) %>% 
  dplyr::mutate(cor = ifelse(cor > 0.2, 0.2, cor)) %>% 
  dplyr::mutate(log_fdr = ifelse(log_fdr > 5, 5, log_fdr)) %>%
  dplyr::mutate(log_fdr = ifelse(log_fdr < 1.5, 1.5, log_fdr)) %>%
  ggplot(aes(y = `mature-mirna`, x = Compound, color = cor, size = log_fdr)) +
  geom_point() +
  scale_y_discrete(
    limits = drug_ccle_compound_for_plot_rank_mirna$`mature-mirna`
  ) +
  scale_x_discrete(limits = drug_ccle_compound_for_plot_rank_Compound$Compound) +
  scale_color_gradient2(
    name = "Spearman Correlation",
    high = "red",
    mid = "white",
    low = "blue",
    breaks = seq(-0.3, 0.2,by =  0.1),
    labels = c('-0.3', '-0.2', '-0.1', '0', '0.1', '0.2')
  ) +
  scale_size(
    name = '-log10(FDR)',
    breaks = c(2, 3, 5),
    labels = c(2, 3, 5)
  ) +
  theme(
    panel.background = element_rect(color = "black", fill = "white", size = 0.1),
    panel.grid = element_line(colour = "grey", linetype = "dashed"),
    panel.grid.major = element_line(colour = "grey", linetype = "dashed", size = 0.2),
    axis.title = element_blank(),
    axis.text.x = element_text(size = 9, angle = 90, hjust = 1, vjust = 0.5),
    axis.text.y = element_text(size = 10, color = drug_ccle_compound_for_plot_rank_mirna$color),
    axis.ticks = element_line(color = "black"),
    legend.position = "right",
    legend.direction = "vertical",
    legend.text = element_text(size = 10),
    legend.title = element_text(size = 10, angle = 90),
    legend.key = element_rect(fill = NA, colour = "black"),
    plot.title = element_text(hjust = 0.5)
  ) + guides(
    color = guide_colorbar(
      title.position = "left",
      title.hjust = -1,
      barheight = 6,
      barwidth = 0.5
    ),
    size = guide_legend(
      title.position = 'left'
    )
  )+
  labs(title = 'low SNP density miRNA correlates with drugs', x = 'Compound', y = 'miRNA') -> 
  drug_ccle_compound_for_plot_few_mutation

ggsave(
  filename = 'low-snp-density-mirna-with-drugs.pdf',
  plot = drug_ccle_compound_for_plot_few_mutation,
  device = 'pdf',
  path = path_drug,
  width = 5.5, height = 5.5
)

# plot all

data_snps_mature_drug %>% 
  dplyr::arrange(-prop) %>% 
  dplyr::filter(prop > 0.3) -> d

drug_ccle_compound %>% 
  dplyr::filter(log_fdr > -log10(0.05)) %>% 
  dplyr::inner_join(d, by = 'mature-mirna') -> 
  drug_ccle_compound_for_plot

drug_ccle_compound_for_plot %>% 
  dplyr::group_by(`mature-mirna`) %>% 
  dplyr::summarise(sum_cor = sum(cor)) %>% 
  dplyr::left_join(d, by = 'mature-mirna') %>% 
  dplyr::arrange(sum_cor) ->
  drug_ccle_compound_for_plot_rank_mirna

drug_ccle_compound_for_plot %>% 
  dplyr::group_by(Compound) %>% 
  dplyr::summarise(sum_cor = sum(cor)) %>% 
  dplyr::arrange(-sum_cor) ->
  drug_ccle_compound_for_plot_rank_Compound



drug_ccle_compound_for_plot %>% 
  dplyr::mutate(cor = ifelse(cor < -0.3, -0.3, cor)) %>% 
  dplyr::mutate(cor = ifelse(cor > 0.2, 0.2, cor)) %>% 
  dplyr::mutate(log_fdr = ifelse(log_fdr > 5, 5, log_fdr)) %>%
  dplyr::mutate(log_fdr = ifelse(log_fdr < 1.5, 1.5, log_fdr)) %>%
  ggplot(aes(x = Compound, y = `mature-mirna`, color = cor, size = log_fdr)) +
  geom_point() +
  scale_y_discrete(
    limits = drug_ccle_compound_for_plot_rank_mirna$`mature-mirna`
  ) +
  scale_x_discrete(limits = drug_ccle_compound_for_plot_rank_Compound$Compound) +
  scale_color_gradient2(
    name = "Spearman Correlation",
    high = "red",
    mid = "white",
    low = "blue",
    breaks = seq(-0.3, 0.2,by =  0.1),
    labels = c('-0.3', '-0.2', '-0.1', '0', '0.1', '0.2')
  ) +
  scale_size(
    name = '-log10(FDR)',
    breaks = c(2, 3, 5),
    labels = c(2, 3, 5)
  ) +
  theme(
    panel.background = element_rect(color = "black", fill = "white", size = 0.1),
    panel.grid = element_line(colour = "grey", linetype = "dashed"),
    panel.grid.major = element_line(colour = "grey", linetype = "dashed", size = 0.2),
    # axis.title = element_blank(),
    axis.text.x = element_text(size = 9, angle = 90, hjust = 1, vjust = 0.5),
    axis.text.y = element_text(size = 10),
    axis.ticks = element_line(color = "black"),
    legend.position = "right",
    legend.direction = "vertical",
    legend.text = element_text(size = 10),
    legend.title = element_text(size = 10, angle = 90),
    legend.key = element_rect(fill = NA, colour = "black"),
    plot.title = element_text(hjust = 0.5)
  ) + guides(
    color = guide_colorbar(
      title.position = "left",
      title.hjust = -1,
      barheight = 6,
      barwidth = 0.5
    ),
    size = guide_legend(
      title.position = 'left'
    )
  ) +
  labs(title = 'high SNP density miRNA correlates with drugs', x = 'Compound', y = 'miRNA') -> 
  drug_ccle_compound_for_plot_all

ggsave(
  filename = 'high-snp-density-mirna-with-drugs.pdf',
  plot = drug_ccle_compound_for_plot_all,
  device = 'pdf',
  path = path_drug,
  width = 5.5, height = 7.5
)

# save ccle mirna correlation with drugs
drug_ccle_compound_for_plot %>% 
  dplyr::rename(
    'miRNA' = `mature-mirna`,
    'Spearman corr.' = cor,
    'P-value' = pv,
    'FDR' = 'fdr',
    'SNP density' = prop
  ) %>% 
  dplyr::select(-log_fdr) %>% 
  dplyr::arrange(FDR) ->
  drug_ccle_compound_for_excel

drug_ccle_compound_for_excel %>% 
  writexl::write_xlsx(path = file.path(path_drug, 'mirna-correlates-with-drug-ccle.xlsx'))

# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/mirna-drug.rda')


# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)

# Path --------------------------------------------------------------------

path_snps <- '/home/liucj/data/refdata/tam2.0/data_snps.rds.gz'
path_ccle <- '/workspace/liucj/refdata/mirna-drug/CCLE_miRNA_annoed_drug_correlation.rds.gz'
path_nci60 <- '/workspace/liucj/refdata/mirna-drug/NCI60_miRNA_annoed_drug_correlation.rds.gz'
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
  dplyr::mutate(log_fdr = -log10(fdr)) %>%
  dplyr::filter(log_fdr > -log10(0.05)) ->
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
  ggplot(aes(x = `mature-mirna`, y = Compound, color = cor, size = log_fdr)) +
  geom_point() +
  scale_x_discrete(
    limits = drug_ccle_compound_for_plot_rank_mirna$`mature-mirna`
  ) +
  scale_y_discrete(limits = drug_ccle_compound_for_plot_rank_Compound$Compound) +
  scale_color_gradient2(
    name = "Spearman Correlation",
    high = "red",
    mid = "white",
    low = "blue"
  ) +
  theme(
    panel.background = element_rect(color = "black", fill = "white", size = 0.1),
    panel.grid = element_line(colour = "grey", linetype = "dashed"),
    panel.grid.major = element_line(colour = "grey", linetype = "dashed", size = 0.2),
    axis.title = element_blank(),
    axis.text.x = element_text(size = 9, angle = 90, hjust = 1, vjust = 0.5, color = drug_ccle_compound_for_plot_rank_mirna$color),
    axis.text.y = element_text(size = 10),
    axis.ticks = element_line(color = "black"),
    legend.position = "bottom",
    legend.direction = "horizontal",
    legend.text = element_text(size = 10),
    legend.title = element_text(size = 10),
    # legend.key.width = unit(1,"cm"),
    # legend.key.heigh = unit(0.3,"cm"),
    legend.key = element_rect(fill = "white", colour = "black")
  ) + guides(
    color = guide_colorbar(
      title.position = "top",
      title.hjust = 0.5,
      barheight = 0.5,
      barwidth = 10
    )
  )
  

# plot all

data_snps_mature_drug %>% 
  dplyr::arrange(-prop) %>% 
  dplyr::filter(prop > 0.3) -> d

drug_ccle_compound %>% 
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
    low = "blue"
  ) +
  theme(
    panel.background = element_rect(color = "black", fill = "white", size = 0.1),
    panel.grid = element_line(colour = "grey", linetype = "dashed"),
    panel.grid.major = element_line(colour = "grey", linetype = "dashed", size = 0.2),
    axis.title = element_blank(),
    axis.text.x = element_text(size = 9, angle = 90, hjust = 1, vjust = 0.5),
    axis.text.y = element_text(size = 10),
    axis.ticks = element_line(color = "black"),
    legend.position = "bottom",
    legend.direction = "horizontal",
    legend.text = element_text(size = 10),
    legend.title = element_text(size = 10),
    # legend.key.width = unit(1,"cm"),
    # legend.key.heigh = unit(0.3,"cm"),
    legend.key = element_rect(fill = "white", colour = "black")
  ) + guides(
    color = guide_colorbar(
      title.position = "top",
      title.hjust = 0.5,
      barheight = 0.5,
      barwidth = 10
    )
  ) -> 
  drug_ccle_compound_for_plot_all

ggsave(
  filename = 'drug_ccle_compound_for_plot_all.pdf',
  plot = drug_ccle_compound_for_plot_all,
  device = 'pdf',
  path = path_drug,
  width = 8, height = 30
)



# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/mirna-drug.rda')

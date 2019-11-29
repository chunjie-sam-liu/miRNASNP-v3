
# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)
# Path --------------------------------------------------------------------

path_mirna_mutation <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation'
path_maf_stat <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation/maf-sample-statistics.rds.gz'
maffiles <- list.files(path = path_mirna_mutation, pattern = '*maf.premir.format')
path_out <- '/home/liucj/data/refdata/tam2.0/'
# Load data ---------------------------------------------------------------
head_name <- readr::read_tsv(file = file.path(path_mirna_mutation, 'headnames.txt'), skip = 5, col_names = F) %>% 
  unlist() %>% unname()
head_name <- c('mirna', head_name)

maf_stat <- readr::read_rds(path = path_maf_stat)

mirna_expression <- readr::read_rds(path = '/workspace/liucj/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/mirna-expression/mirna-expression-grch38.rds.gz') %>% 
  dplyr::select(cancers, type, barcode = cases.0.samples.0.submitter_id, sample = cases.0.submitter_id, expr)
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

# Function ----------------------------------------------------------------



# Analysis ----------------------------------------------------------------

tcga_mirna_mutation %>% 
  dplyr::select(mirna, Tumor_Sample_Barcode) %>% 
  dplyr::mutate(barcode = stringr::str_sub(string = Tumor_Sample_Barcode, start = 1, end= 16)) %>% 
  dplyr::mutate(sample = stringr::str_sub(string = barcode, start = 1, end = 12)) %>% 
  dplyr::inner_join(maf_stat %>% dplyr::select(sample, cancers), by = 'sample') ->
  tcga_mirna_mutation_cancer_types


tcga_mirna_mutation_cancer_types %>% 
  dplyr::group_by(mirna, cancers) %>% 
  tidyr::nest() %>% 
  dplyr::mutate(n = purrr::map_int(.x = data, .f = function(.x) {length(unique(.x$barcode))})) %>% 
  dplyr::ungroup() %>% 
  dplyr::select(-data) %>% 
  dplyr::left_join(
    y = maf_stat %>% dplyr::select(cancers, n_sample) %>% dplyr::distinct(),
    by = 'cancers'
  ) %>% 
  dplyr::mutate(percent = n / n_sample) %>% 
  dplyr::arrange(percent) %>% 
  dplyr::filter(n > 6) %>% 
  dplyr::mutate(name = stringr::str_split(string = mirna, pattern = ':', simplify = T)[,5]) %>% 
  dplyr::mutate(cancer_name = gsub(pattern = 'TCGA-', replacement = '', x = cancers))->
  mirna_mutation_statistics

mirna_mutation_statistics %>% 
  dplyr::group_by(cancer_name) %>% 
  dplyr::summarise(s = table(cancer_name)) %>% 
  dplyr::arrange(dplyr::desc(s)) ->
  cancer_rank

mirna_mutation_statistics %>% 
  dplyr::group_by(name) %>% 
  dplyr::summarise(s = table(name), p = sum(percent)) %>% 
  dplyr::arrange(p, s) -> gene_rank

mirna_mutation_statistics %>% 
  ggplot(aes(x = name, y = cancer_name, fill = percent)) +
  geom_tile() +
  geom_text(aes(label = n)) +
  scale_x_discrete(position = "bottom", limits = gene_rank$name, expand = c(0, 0)) +
  scale_y_discrete(limits = cancer_rank$cancer_name, expand = c(0, 0)) +
  scale_fill_gradient2(
    name = "Mutation Frequency (%)",
    limit = c(0.01, 0.03),
    breaks = seq(0.01, 0.03, 0.01),
    label = c("1", "2", "3"),
    high = "red", mid = 'yellow',low = 'blue',
    na.value = "#8B1A1A"
  ) +
  coord_fixed(ratio = 1) +
  labs(x = "", y = "") +
  theme(
    axis.text = element_text(color = 'black'),
    panel.background = element_rect(fill = NA, color = 'black'),
    axis.text.x = element_text(angle = 45, hjust = 1, vjust = 1, size = 12),
    legend.position = 'top'
  ) +
  guides(fill = guide_legend(
    title = "Mutation Frequency (%)", 
    title.position = "left", 
    title.theme = element_text(angle = 0, vjust = 1), 
    reverse = F, keywidth = 0.6, keyheight = 0.8 )
  ) ->
  mirna_mutation_tcga_plot

ggsave(
  filename = 'tcga-mirna-mutation.pdf',
  plot = mirna_mutation_tcga_plot,
  device = 'pdf',
  path = path_out,
  width = 10, height = 4
)


# -------------------------------------------------------------------------

mirna_mutation_statistics %>% 
  dplyr::left_join(tcga_mirna_mutation_cancer_types, by = c('mirna', 'cancers')) %>% 
  dplyr::group_by(mirna, cancers) %>% 
  tidyr::nest() %>% 
  dplyr::ungroup() %>% 
  dplyr::mutate(exp = purrr::pmap(
    .l = list(.x = mirna, .y = cancers, .z = data),
    .f = function(.x, .y, .z) {
      # .x <- .d$mirna[[1]]
      # .y <- .d$cancers[[1]]
      # .z <- .d$data[[1]]
      .m <- stringr::str_split(string = .x, pattern = ':', simplify = T)[,5]
      
      mirna_expression %>% 
        dplyr::filter(cancers == .y) %>% 
        dplyr::mutate(mut = ifelse(barcode %in% .z$barcode, 'mut', 'no_mut')) %>% 
        dplyr::mutate(mut = ifelse(stringr::str_sub(string = barcode, start = 14, end = 15) == '11', 'normal', mut)) %>% 
        dplyr::mutate(expr = purrr::map_dbl(.x = expr, .f = function(.a) {
          .a %>% dplyr::filter(miRNA_ID == .m) %>% dplyr::pull(reads_per_million_miRNA_mapped)
        })) -> 
        .expr
      .expr
    }
  )) %>% 
  dplyr::select(-data) ->
  mirna_mutation_statistics_expr

mirna_mutation_statistics_expr %>% 
  dplyr::mutate(test = purrr::map(.x = exp, .f = function(.x) {
    
    t.test(
      x = .x %>% 
        dplyr::filter(mut == 'mut') %>% 
        dplyr::pull(expr),
      y = .x %>% 
        dplyr::filter(mut == 'no_mut') %>% 
        dplyr::pull(expr)
    ) %>% 
      broom::tidy() %>% 
      dplyr::select('mut-no_mut' = estimate, mut = estimate1, no_mut = estimate2, pval.mut_vs_no = p.value) ->
      mut_vs_no
    
    no_vs_normal <- tryCatch(
      expr = {
        t.test(
          x = .x %>% 
            dplyr::filter(mut == 'no_mut') %>% 
            dplyr::pull(expr),
          y = .x %>% 
            dplyr::filter(mut == 'normal') %>% 
            dplyr::pull(expr)
        ) %>% 
          broom::tidy() %>% 
          dplyr::select('no_mut-normal' = estimate, no_mut.n = estimate1, normal = estimate2, pval.no_mut_vs_normal = p.value)
      },
      error = function(e) {
        tibble::tibble('no_mut-normal' = 1, no_mut.n = 1, normal = 1, pval.no_mut_vs_normal = 1
        )
      }
    )
    
    dplyr::bind_cols(mut_vs_no, no_vs_normal)
    
  })) %>% 
  tidyr::unnest(test) ->
  mirna_mutation_statistics_expr_test
  
mirna_mutation_statistics_expr_test %>% 
  dplyr::filter(`mut-no_mut` < 0, pval.mut_vs_no < 0.05) %>% 
  dplyr::select(-exp) %>% 
  dplyr::arrange(`mut-no_mut`) %>% View


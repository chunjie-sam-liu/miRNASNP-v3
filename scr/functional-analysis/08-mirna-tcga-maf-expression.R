
# Library -----------------------------------------------------------------

library(magrittr)
library(ggplot2)
# Path --------------------------------------------------------------------

path_mirna_mutation <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation'
path_maf_stat <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation/maf-sample-statistics.rds.gz'
maffiles <- list.files(path = path_mirna_mutation, pattern = '*maf.premir.format')
path_out <- '/home/liucj/data/refdata/tam2.0/'
path_clinical <- '/workspace/liucj/project/06-autophagy/TCGA/TCGA_pancan_cancer_cell_survival_time.rds.gz'
path_snps <- '/home/liucj/data/refdata/tam2.0/variation_seed28_anno.txt'
# Load data ---------------------------------------------------------------
data_snps <- readr::read_tsv(file = path_snps) %>% 
  dplyr::select('pre-mirna' = 'precurser_id', 'mature-mirna' = 'mature_id')

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

clinical <- readr::read_rds(path = path_clinical)
# Function ----------------------------------------------------------------



# Mutation ----------------------------------------------------------------

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
    na.value = "#7FFF00"
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
  width = 11, height = 4
)


# expression-------------------------------------------------------------------------

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
  )) ->
  mirna_mutation_statistics_expr

mirna_mutation_statistics_expr %>% 
  dplyr::mutate(test = purrr::pmap(
    .l = list(.x = exp, .y = mirna, .z = cancers),
    .f = function(.x, .y, .z) {
      .mirna <- stringr::str_split(string = .y, pattern = ':', simplify = T)[, 5]
      .cancer <- gsub(pattern = 'TCGA-', replacement = '', x = .z)
      
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
      
      my_comparisons <- if (.x$mut %>% unique() %>% length == 2) list(c(1,2)) else list(c(1,2), c(2, 3), c(1,3))
      
      .x %>% 
        dplyr::mutate(mut = plyr::revalue(x = mut, replace = c('mut' = "Mutant", 'no_mut' = 'Wild', 'normal' = 'Normal'))) %>%
        dplyr::mutate(mut = factor(mut, levels = c('Mutant', 'Wild', 'Normal'))) %>% 
        dplyr::mutate(expr = ifelse(expr > sort(expr, decreasing = T)[5], sort(expr, decreasing = T)[5], expr)) -> 
        .xx
      
      .xx %>% 
        dplyr::group_by(mut) %>% 
        dplyr::count() %>%
        dplyr::ungroup() %>% 
        dplyr::mutate(percent = n / sum(n) * 100) %>% 
        dplyr::mutate(label = glue::glue('{mut}\n({n}, {round(percent,2)}%)')) ->
        .xx_label
      
      .xx %>% 
        ggpubr::ggboxplot(
          x = 'mut', y = 'expr', fill = 'mut', bxp.errorbar = T, bxp.errorbar.width = 0.2, width = 0.5, outlier.colour = NA,
          xlab = '', ylab = '', title = glue::glue('{.cancer}, {.mirna}')
        ) +
        ggpubr::stat_compare_means(comparisons = my_comparisons) +
        # scale_x_discrete(label = .xx_label$label) +
        ggsci::scale_fill_rickandmorty() +
        theme(
          legend.position = 'none'
        )-> 
        .plot
      
      dplyr::bind_cols(mut_vs_no, no_vs_normal) %>% 
        dplyr::mutate(plot = list(.plot))
      
  })) %>% 
  tidyr::unnest(test) ->
  mirna_mutation_statistics_expr_test
  
mirna_mutation_statistics_expr_test %>% 
  dplyr::filter(mut > 1.5) %>% 
  dplyr::arrange(`mut-no_mut`) -> 
  mirna_mutation_statistics_expr_test_filter

gridExtra::arrangeGrob(
  grobs = mirna_mutation_statistics_expr_test_filter$plot, nrow = 2, bottom = '', left = 'mRNA expression (RPM)'
) %>% 
  ggsave(
    filename = 'tcga-mirna-mutation-expression.pdf',
    plot = .,
    device = 'pdf',
    path = path_out,
    width = 16, height = 8
  )


# Clinical ----------------------------------------------------------------

mirna_mutation_statistics_expr_test_filter %>% 
  dplyr::select(mirna, type = cancers, mut = data) %>% 
  dplyr::mutate(type = gsub(pattern = 'TCGA-', replacement = '', x = type)) %>% 
  dplyr::left_join(y = clinical, by = 'type') ->
  mirna_mutation_statistics_expr_test_filter_merge

mirna_mutation_statistics_expr_test_filter_merge %>% 
  dplyr::mutate(plot = purrr::map2(
    .x = mut, .y = data,
    .f = function(.x, .y) {
      .y %>% 
        dplyr::select(sample = bcr_patient_barcode, status = PFI.1, time = PFI.time.1) %>% 
        dplyr::mutate(group = factor(ifelse(sample %in% .x$sample, 'Mutant', 'Wild'))) %>% 
        dplyr::filter(!is.na(time), time > 0, !is.na(status)) %>% 
        dplyr::mutate(time = time / 30 / 12)-> 
        .yy
      
      .d_diff <- survival::survdiff(survival::Surv(time, status) ~ group, data = .yy)
      .kmp <- 1 - pchisq(.d_diff$chisq, df = length(levels(as.factor(.yy$group))) - 1)
      .fit_x <- survival::survfit(survival::Surv(time, status) ~ group, data = .yy , na.action = na.exclude)
      .plot <- survminer::ggsurvplot(
        .fit_x, data = .yy, pval=T, pval.method = T,
        xlab = "Survival in days",
        ylab = 'Probability of survival')
      tibble::tibble(
        kmp = .kmp,
        plot = list(.plot$plot)
      )
    }
  )) %>% 
  tidyr::unnest(plot) -> 
  mirna_mutation_statistics_expr_test_filter_ind

clinical %>% 
  dplyr::filter(type == 'UCEC') %>% 
  tidyr::unnest(data) %>% 
  dplyr::select(type, sample = bcr_patient_barcode, status = PFI.1, time = PFI.time.1) %>% 
  dplyr::filter(!is.na(time), time > 0, !is.na(status)) %>% 
  dplyr::mutate(group = factor(
    ifelse(
      sample %in% (mirna_mutation_statistics_expr_test_filter_merge %>%
          dplyr::filter(mirna %in% c('chr2:176150303:176150412:+:hsa-mir-10b', 'chr14:101055419:101055491:+:hsa-mir-485')) %>%
          dplyr::filter(type == 'UCEC') %>% 
          dplyr::select(mirna, mut) %>% 
          tidyr::unnest(mut) %>% 
          dplyr::pull(sample)), 'Mutant', 'Wild'))) %>% 
  dplyr::mutate(time = time / 30 / 12) %>% 
  dplyr::filter(time < 10) -> 
  clincal_d


.d_diff <- survival::survdiff(survival::Surv(time, status) ~ group, data = clincal_d)
.kmp <- 1 - pchisq(.d_diff$chisq, df = length(levels(as.factor(clincal_d$group))) - 1)
.fit_x <- survival::survfit(survival::Surv(time, status) ~ group, data = clincal_d , na.action = na.exclude)
survminer::ggsurvplot(
  .fit_x, data = clincal_d, pval=T, pval.method = T,
  xlab = "Survival in days",
  ylab = 'Probability of survival')



# miRNA lolipop -----------------------------------------------------------

tcga_mirna_mutation %>% 
  dplyr::select(mirna, chr=Chromosome, start=Start_Position, end=End_Position, Tumor_Sample_Barcode) %>% 
  dplyr::mutate(barcode = stringr::str_sub(string = Tumor_Sample_Barcode, start = 1, end= 16)) %>% 
  dplyr::mutate(sample = stringr::str_sub(string = barcode, start = 1, end = 12)) %>% 
  dplyr::inner_join(maf_stat %>% dplyr::select(sample, cancers), by = 'sample') %>% 
  dplyr::select(-c(Tumor_Sample_Barcode, barcode)) ->
  tcga_mirna_mutation_with_sample

mirna_mutation_statistics %>% 
  dplyr::group_by(mirna, cancers) %>% 
  tidyr::nest() %>% 
  dplyr::ungroup() %>% 
  dplyr::mutate(lolipop = purrr::pmap(.l = list(.x = mirna, .y = data, .z = cancers), .f = function(.x, .y, .z) {
    # .x <- .d$mirna[[1]]
    # .y <- .d$data[[1]]
    
    # mature
    data_snps %>% 
      dplyr::filter(`pre-mirna` == .x) %>% 
      tidyr::separate(col = `mature-mirna`, into = c('chr', 'start', 'end', 'strand', 'mature'), sep = ':') %>% 
      dplyr::select(start, end, strand, mature) %>% 
      dplyr::mutate(start = as.integer(start), end = as.integer(end)) ->
      .mature
    # seed
    .seed <- if (.mature$strand[[1]] == '+') {
      .mature %>% dplyr::mutate(start = start + 1, end = start + 7)
    } else {
      .mature %>% dplyr::mutate(start = end - 1, end = end - 7)
    }
    
    # pre-mirna
    .mirna <- stringr::str_split(string = .x, pattern = ':', simplify = T)
    
    .mirna_start <- as.integer(.mirna[,2])
    .mirna_end <- as.integer(.mirna[,3])
    .mirna_name <- .mirna[,5]
    
    # sample mutation
    tcga_mirna_mutation_with_sample %>% 
      dplyr::filter(mirna == .x, cancers == .z) %>% 
      dplyr::select(start, end) %>% 
      dplyr::group_by(start) %>% 
      dplyr::count() %>% 
      dplyr::ungroup() -> 
      .sample_for_plot
    
    # x axis ticks
    .x_axis_ticks <- tibble::tibble(x = as.integer(seq(.mirna_start, .mirna_end, length.out = 5)))
    # y axis ticks
    .y_axis_ticks <- tibble::tibble(y = seq(0, max(.sample_for_plot$n) + 3, by = 1))
    
    ggplot() +
      geom_segment(mapping = aes(x=start, xend=start, y=0, yend=n), data = .sample_for_plot, color = 'grey') +
      geom_point(mapping = aes(x = start, y = n), data = .sample_for_plot, size = 5, color = 'orange') +
      scale_x_continuous(limits = c(.mirna_start-10, .mirna_end+10), labels = scales::math_format(10^.x)) +
      scale_y_continuous(limits = c(-2, max(.sample_for_plot$n) + 5)) +
      theme(
        panel.background = element_rect(fill = NA, colour = NA),
        axis.line = element_blank(),
        axis.ticks = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank()
      ) +
      # mirna structure
      # geom_segment(x = .mirna_start, xend = .mirna_end, y = -0.25, yend = -0.25, size = 13, color = 'grey', alpha = 0.7, lineend = 'butt') +
      geom_rect(data =.sample_for_plot, xmin = .mirna_start, xmax = .mirna_end, ymin = 0, ymax = -0.5, fill = 'grey',alpha = 0.7) +
      # mature mirna 
      # geom_segment(mapping = aes(x = start, xend = end), data = .mature, y = -0.25, yend = -0.25, size = 13, color = '#248b21') +
      geom_rect(mapping = aes(xmin = start, xmax = end, ymin = 0, ymax = -0.5), data = .mature, fill = '#248b21') +
      # seed
      # geom_segment(mapping = aes(x = start, xend = end), data = .seed, y = -0.25, yend = -0.25, size = 13, color = '#fed700') +
      geom_rect(mapping = aes(xmin = start, xmax = end, ymin = 0, ymax = -0.5), data = .seed, fill = '#fed700') +
      # x axis
      geom_segment(data =.sample_for_plot, x = .mirna_start, xend = .mirna_end, y = -0.6, yend = -0.6, size = 0.5) +
      geom_segment(mapping = aes(x = x, xend = x), data = .x_axis_ticks, y = -0.6, yend = -0.7, size = 0.5) +
      geom_text(mapping = aes(x = x, label = x), data = .x_axis_ticks, y = -1) +
      # y axis
      geom_segment(data =.sample_for_plot, x= .mirna_start-1, xend= .mirna_start-1, y = 0, yend = max(.sample_for_plot$n) + 3, size = 0.5) +
      geom_segment(mapping = aes(y = y, yend = y), data = .y_axis_ticks, x = .mirna_start-1, xend = .mirna_start-1.5, size = 0.5) +
      geom_text(mapping = aes(y = y, label = y), data = .y_axis_ticks, x = .mirna_start - 3, vjust = 0.4) +
      geom_text(data = .sample_for_plot, x = .mirna_start - 7, y = (max(.sample_for_plot$n) + 3) / 2, label = 'Number of mutations', size = 6, angle = 90) +
      # mature mirna label
      geom_text(mapping = aes(x = (start + end)/2, y = -1.6, label = mature), data = .mature, size = 6) +
      # premirna
      geom_text(data =.sample_for_plot, x = (.mirna_start + .mirna_end) / 2, y = max(.sample_for_plot$n) + 2, label = .mirna_name, size = 8) ->
      .lolipop
  })) ->
  ？



# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/08-mirna-tcga-maf-expression.rda')
load(file = '/home/liucj/data/refdata/tam2.0/08-mirna-tcga-maf-expression.rda')

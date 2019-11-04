
# Library -----------------------------------------------------------------

library(magrittr)


# Path --------------------------------------------------------------------

path_inter <- '/workspace/liucj/refdata/mirna-genomic-context/human-intergenic-mirna-file.txt'
path_intra <- '/workspace/liucj/refdata/mirna-genomic-context/human-intragenic-mirna-file.txt'


# Load data ---------------------------------------------------------------

data_inter <- readr::read_tsv(file = path_inter) %>% 
  dplyr::mutate(`host gene` = NA, direction = NA) %>% 
  dplyr::select(1, 2, 3, 7, 8, 4, 5, 6)
data_intra <- readr::read_tsv(file = path_intra)


# Function ----------------------------------------------------------------

fn_parse_html <- function(.mirna) {
  .url <- glue::glue('https://bmi.ana.med.uni-muenchen.de/miriad/miRNA/human/{.mirna}/')
  .html <- xml2::read_html(x = .url)
  .html %>% 
    rvest::html_nodes(css = 'div.info.genomic_context dl') %>% 
    rvest::html_nodes(css = 'dd') %>% 
    rvest::html_text() ->
    .context
  .context <- if (length(.context) > 7) .context[-8] else .context
  
  # .err <- tryCatch(
  #   
  #   expr = {names(.context) <- c("Chromosome", "Strand", "Start", "End", "Intragenic", "Region", "Intron/Exonic number", "Distance from 5' exon")},
  #   
  #   error = function(e) NULL
  # )
  # 
  # if(is.null(.err)) return(NULL)
  names(.context) <- c("Chromosome", "Strand", "Start", "End", "Intragenic", "Region", "Intron/Exonic number")
  
  tibble::as_tibble(as.list(.context)) %>% 
    dplyr::select(-seq(1, 5, 1)) ->
    .tb_context
  
  .html %>% 
    rvest::html_node(css = 'table') %>% 
    rvest::html_table() %>% 
    tibble::as_tibble() ->
    .tb_gene_info
  
  dplyr::bind_cols(.tb_context, .tb_gene_info)
}

# Parse html --------------------------------------------------------------

n_cluster <- 23
# new cluster
cluster <- multidplyr::new_cluster(n = n_cluster)
# add library
multidplyr::cluster_library(cluster, packages = 'magrittr')
# assign values
multidplyr::cluster_assign(cluster, "fn_parse_html" = fn_parse_html)

# data_intra %>% 
#   head(2) %>% 
#   dplyr::mutate(context = purrr::map(.x = miRNA, .f = fn_parse_html))

# partition
data_intra %>% 
  dplyr::group_by(chromosome) %>% 
  multidplyr::partition(cluster = cluster) ->
  data_intra_party

data_intra_party %>% 
  dplyr::mutate(context = purrr::map(.x = miRNA, .f = fn_parse_html)) %>% 
  dplyr::collect() %>% 
  dplyr::ungroup() ->
  data_intra_genomic_context
  
data_intra_genomic_context %>% 
  tidyr::unnest() %>% 
  dplyr::bind_rows(data_inter) ->
  data_intra_genomic_context_and_inter

readr::write_rds(x = data_intra_genomic_context_and_inter, path = '/workspace/liucj/refdata/mirna-genomic-context/mirna-genomic-context.rds.gz', compress = 'gz')


# Save image --------------------------------------------------------------

save.image(file = '/workspace/liucj/refdata/mirna-genomic-context/03-mirna-genomic-context.rda')

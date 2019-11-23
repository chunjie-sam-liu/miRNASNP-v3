
# Library -----------------------------------------------------------------


library(magrittr)



# Path --------------------------------------------------------------------

path_acc <- '/workspace/liucj/refdata/tam2.0/variation_seed28_anno_addacc.txt'


# Load data ---------------------------------------------------------------

mirna_acc <- readr::read_tsv(file = path_acc) %>% 
  dplyr::select(precurser_id) %>% 
  dplyr::distinct() %>% 
  dplyr::mutate('pre-mirna' = stringr::str_split(string = precurser_id, pattern = ':MI', simplify = T)[,1]) %>% 
  dplyr::mutate(acc = gsub(pattern = '.*:', replacement = '', x = precurser_id)) %>% 
  dplyr::select(-1)


# Function ----------------------------------------------------------------

fn_parse_pre_table <- function(.pre_table) {
  .pre_table %>%
    rvest::html_nodes(css = 'td.left') %>% 
    rvest::html_text(trim = TRUE) ->
    .names

  .ind_confidence <- which(.names == 'Confidence')
  .pre_table %>% 
    rvest::html_nodes(css = 'td.right')->
    .td.right
  .td.right %>% rvest::html_text(trim = TRUE) -> .values
  .confidence <- gsub(pattern = 'Annotation confidence: (.+)\n\n\n.*\\?', replacement = '\\1', x = .values[.ind_confidence])
  
  .ind_deep <- which(.names == 'Deep sequencing')
  if (length(.ind_deep) == 0) {
    return(tibble::tibble(
      'reads' = as.numeric(NA),
      'cpm' =  as.numeric(NA),
      'experiments' =  as.numeric(NA),
      'Confidence' = .confidence
    ))
  }
  .deep <- .values[.ind_deep] %>% stringr::str_split(pattern = ', +', simplify = T)
  .reads <- gsub(pattern = '[[:space:]]+reads', replacement = '', x = .deep[,1]) %>% as.numeric()
  .cpm <- gsub(pattern = '[[:space:]]+reads per million', replacement = '', x = .deep[,2]) %>% as.numeric()
  .exps <- gsub(pattern = '[[:space:]]+experiments', replacement = '', x = .deep[,3]) %>% as.numeric()
  
  tibble::tibble(
    'reads' = .reads,
    'cpm' = .cpm,
    'experiments' = .exps,
    'Confidence' = .confidence
  )

}

fn_parse_mirbase_html <- function(.acc) {
  print(.acc)
  # .url <- 'http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc=MI0000060'
  .base_url <- 'http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc'
  .url <- paste(.base_url, .acc, sep = '=')
  
  .html <- tryCatch(
    expr = {
        xml2::read_html(x = .url)
    },
    error = function (e) {
      return(FALSE)
    }
  )
  
  if (isFALSE(.html)) {
    return(return(NULL))
  }
  
  .html %>% rvest::html_nodes(css = 'table.data') -> .html_data
  .lenght_table <- length(.html_data)
  
  .pre_table <- .html_data[1]
  # .mature_table <- .html_data[-c(1, .lenght_table)]
  
  .deep_confidence <- tryCatch(
    expr = fn_parse_pre_table(.pre_table = .pre_table),
    error = function(e) {return(NULL)}
  )

  .deep_confidence
}


# Parse from html ---------------------------------------------------------
n_cluster <- 23
# new cluster
cluster <- multidplyr::new_cluster(n = n_cluster)
# add library
multidplyr::cluster_library(cluster, packages = 'magrittr')
# assign values
multidplyr::cluster_assign(cluster, "fn_parse_pre_table" = fn_parse_pre_table, "fn_parse_mirbase_html" = fn_parse_mirbase_html)


mirna_acc %>% 
  dplyr::mutate(chromosome = stringr::str_split(string = `pre-mirna`, pattern = ':', simplify = T)[,1]) %>% 
  dplyr::group_by(chromosome) %>% 
  multidplyr::partition(cluster = cluster) ->
  mirna_acc_party

mirna_acc_party %>% 
  dplyr::mutate(deep_confidence = purrr::map(.x = acc, .f = fn_parse_mirbase_html)) %>% 
  dplyr::collect() %>% 
  dplyr::ungroup() ->
  mirna_acc_confidence

mirna_acc_confidence %>% 
  dplyr::filter(!purrr::map_lgl(.x = deep_confidence, .f = function(.x) {is.logical(unlist(.x))})) %>% 
  tidyr::unnest(cols = deep_confidence) ->
  captured


mirna_acc_confidence %>% 
  dplyr::filter(purrr::map_lgl(.x = deep_confidence, .f = function(.x) {is.logical(unlist(.x))})) %>% 
  tidyr::unnest(cols = deep_confidence) ->
  not_captured


mirna_acc %>% 
  dplyr::filter(acc %in% not_captured$acc) %>% 
  dplyr::mutate(acc = stringr::str_split(string = acc, pattern = '_', simplify = T)[, 1]) %>% 
  dplyr::mutate(deep_confidence = purrr::map(.x = acc, .f = fn_parse_mirbase_html)) ->
  mirna_acc_recapture

mirna_acc_recapture %>% 
  tidyr::unnest(deep_confidence) -> 
  recapture

captured %>% 
  dplyr::select(-chromosome) %>% 
  dplyr::mutate(experiments = as.numeric(experiments)) %>% 
  dplyr::bind_rows(recapture) %>% 
  dplyr::mutate(`pre-mirna` = paste('chr', `pre-mirna`, sep = '')) ->
  mirna_confidence

readr::write_rds(x = mirna_confidence, path = '/workspace/liucj/refdata/tam2.0/mirna-confidence.rds', compress = 'gz')

# Save image --------------------------------------------------------------

save.image(file = '/workspace/liucj/refdata/tam2.0/10-mirbase-info.rda', compress = TRUE)

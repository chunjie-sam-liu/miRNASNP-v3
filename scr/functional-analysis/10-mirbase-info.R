
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


fn_mirna_gene_family <- function(.f) {
  # http://www.mirbase.org/cgi-bin/get_summary_json.pl?_=1574995049945&fam=MIPF0002123
   
   
   .d <- tryCatch(
     expr = {
       .base_url <- 'http://www.mirbase.org/cgi-bin/get_summary_json.pl?_=1574995049945&fam='
       .url <- paste(.base_url, .f, sep = '')
       .response <- httr::GET(url = .url)
       .content <- httr::content(x = .response, type = 'application/json', as = 'parsed')
       
       .family <- .content$title
       .content$data[[1]] %>% 
         purrr::map(.f = function(.x) {
           data.frame(.x) %>% tibble::as_tibble() %>% dplyr::select('accession', 'id')
         }) %>% 
         dplyr::bind_rows() ->
         .id
       
       tibble::tibble(
         family = .family,
         data = list(.id)
       )
     },
     error = function(e) {
       return(NULL)
     }
   )
   .d
   
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


fams <- tibble::tibble(mipf = paste('MIPF000', sprintf("%04d", 1:2123), sep = ''), group = sample(x = 1:20, size = 2123, replace = T))

n_cluster <- 20
# new cluster
cluster <- multidplyr::new_cluster(n = n_cluster)
# add library
multidplyr::cluster_library(cluster, packages = 'magrittr')
# assign values
multidplyr::cluster_assign(cluster, "fn_mirna_gene_family" = fn_mirna_gene_family)


fams %>% 
  dplyr::group_by(group) %>% 
  multidplyr::partition(cluster = cluster) ->
  fams_party



fams_party %>% 
  dplyr::mutate(mirbase_fams = purrr::map(.x = mipf, .f = fn_mirna_gene_family)) %>% 
  dplyr::collect() %>% 
  dplyr::ungroup() ->
  fams_party_results

readr::write_rds(x = fams_party_results, path = '/workspace/liucj/refdata/tam2.0/mirna-family.rds', compress = 'gz')

fams_party_results %>% 
  dplyr::filter(!purrr::map_lgl(mirbase_fams, is.null)) -> 
  fams_party_results_not_null

fams_party_results_not_null %>% 
  tidyr::unnest(mirbase_fams) %>% 
  dplyr::mutate(human = purrr::map_lgl(
    .x = data,
    .f = function(.x) {
      any(stringr::str_detect(string = .x$id, pattern = 'hsa'))
    }
  )) %>% 
  dplyr::filter(human)  %>% 
  dplyr::mutate(conserv = purrr::map(
    .x = data,
    .f = function(.x) {
      stringr::str_split(string = .x$id, pattern = '-', simplify = T)[, 1] %>% unique
    }
  )) %>% 
  dplyr::mutate(n_species = purrr::map_int(.x = conserv, .f = length)) %>% 
  dplyr::mutate(n_other_species = n_species -1) %>% 
  dplyr::mutate(human_mirna = purrr::map(.x = data, .f = function(.x) {
    dplyr::filter(.data = .x, grepl(pattern = 'hsa', x = id))
  })) ->
  fams_party_results_not_null_conserved

fams_party_results_not_null_conserved %>% 
  dplyr::mutate(data_new = purrr::map2(.x = human_mirna, .y = n_other_species, .f = function(.x, .y) {
    .x %>% 
      dplyr::mutate(n_other_species = .y)
  })) %>% 
  dplyr::select(data_new) %>% 
  tidyr::unnest(data_new) %>% 
  dplyr::rename(acc = accession) ->
  mirna_conserved_in_other_species

mirna_acc %>% 
  dplyr::mutate(`pre-mirna` = paste('chr', `pre-mirna`, sep = '')) %>% 
  dplyr::left_join(mirna_conserved_in_other_species, by = 'acc') %>% 
  dplyr::mutate(n_other_species = ifelse(is.na(n_other_species), 0, n_other_species)) %>% 
  dplyr::select(`pre-mirna`, acc, n_other_species) %>% 
  dplyr::mutate(conserve = dplyr::case_when(
    n_other_species == 0 ~ 'Non',
    n_other_species < 10 ~ 'Low',
    n_other_species >= 10 ~ 'High'
  )) ->
  mirna_acc_conserved

readr::write_rds(x = mirna_acc_conserved, path = '/workspace/liucj/refdata/tam2.0/mirna_acc_conserved.rds.gz', compress = 'gz')

# Save image --------------------------------------------------------------

save.image(file = '/workspace/liucj/refdata/tam2.0/10-mirbase-info.rda', compress = TRUE)

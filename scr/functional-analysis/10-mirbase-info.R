
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
  
  .ind_deep <- which(.names == 'Deep sequencing')
  .ind_confidence <- which(.names == 'Confidence')
  
  .pre_table %>% 
    rvest::html_nodes(css = 'td.right')->
    .td.right
  
  .td.right %>% rvest::html_text(trim = TRUE) -> .values
  .confidence <- gsub(pattern = 'Annotation confidence: (.+)\n\n\n.*\\?', replacement = '\\1', x = .values[.ind_confidence])
  
  .deep <- .values[.ind_deep] %>% stringr::str_split(pattern = ', +', simplify = T)
  .reads <- gsub(pattern = '[[:space:]]+reads', replacement = '', x = .deep[,1]) %>% as.numeric()
  .cpm <- gsub(pattern = '[[:space:]]+reads per million', replacement = '', x = .deep[,2]) %>% as.numeric()
  .exps <- gsub(pattern = '[[:space:]]+experiments', replacement = '', x = .deep[,3])
  
  tibble::tibble(
    'reads' = .reads,
    'cpm' = .cpm,
    'experiments' = .exps,
    'Confidence' = .confidence
  )

}

fn_parse_mirbase_html <- function(.acc) {
  # .url <- 'http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc=MI0000060'
  .base_url <- 'http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc'
  .url <- paste(.base_url, .acc, sep = '=')
  
  .html <- xml2::read_html(x = .url)
  
  .html %>% rvest::html_nodes(css = 'table.data') -> .html_data
  .lenght_table <- length(.html_data)
  
  .pre_table <- .html_data[1]
  # .mature_table <- .html_data[-c(1, .lenght_table)]
  
  .deep_confidence <- fn_parse_pre_table(.pre_table = .pre_table)

  .deep_confidence
}


# Parse from html ---------------------------------------------------------


mirna_acc %>% 
  dplyr::mutate(deep_confidence = purrr::map(.x = acc, .f = fn_parse_mirbase_html)) -> 
  mirna_acc_confidence

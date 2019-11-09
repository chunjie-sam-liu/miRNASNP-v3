
# Library -----------------------------------------------------------------

library(magrittr)
# Path --------------------------------------------------------------------

path_out <- '/home/liucj/data/refdata/tam2.0/'
path_ucsc1 <- file.path(path_out, 'ucsc-table-browse-1-1000.tsv')
path_ucsc2 <- file.path(path_out, 'ucsc-table-browse-1001-1918.tsv')
path_mirna <- file.path(path_out, 'regions-for-conservation-score.tsv')


# Function ----------------------------------------------------------------
fn_parse_chunk <- function(.x, .y, .v) {
  .sv <- .v[.x:.y]
  .ind_variableStep <- grep(pattern = 'variableStep', x = .sv)
  .ind_chrom <- grep(pattern = 'chrom specified', x = .sv)
  .ind_range <- grep(pattern = 'position specified', x = .sv)
  
  .chrom <- stringr::str_split(string = .sv[.ind_chrom], pattern = ': ', simplify = T)[, 2]
  .range <- stringr::str_split(string = .sv[.ind_range], pattern = ': ', simplify = T)[, 2]
  .pos <- paste(.chrom, .range, sep = ':')
  
  .v_score <- .sv[(.ind_variableStep+1):length(.sv)]
  stringr::str_split(string = .v_score, pattern = '\t', simplify = T)[,2] %>% 
    as.numeric() ->
    .score
  
  tibble::tibble(
    position = .pos,
    score = list(.score)
  )
  
}
fn_parse_read_lines <- function(.v) {
  .ind <- grep(pattern = 'output date', x = .v)
  .start <- .ind
  .tmp <- .start - 1
  .end <- c(.tmp[-1], length(.v))
  
  tibble::tibble(
    start = .start,
    end = .end
  ) %>% 
    dplyr::mutate(chunk = purrr::map2(.x = start, .y = .end, .f = fn_parse_chunk, .v = .v)) %>% 
    dplyr::select(chunk) %>% 
    tidyr::unnest()
}



# Load data ---------------------------------------------------------------


v_ucsc1 <- readr::read_lines(file = path_ucsc1, skip = 1)
v_ucsc2 <- readr::read_lines(file = path_ucsc2, skip = 1)

mirna_pos <- readr::read_tsv(file = path_mirna) %>% 
  dplyr::rename(position = 'f', 'pre-mirna' = z)

# Parse -------------------------------------------------------------------
data_ucsc1 <- fn_parse_read_lines(.v = v_ucsc1)
data_ucsc2 <- fn_parse_read_lines(.v = v_ucsc2)

mirna_conservation_score <- dplyr::bind_rows(data_ucsc1, data_ucsc2)

mirna_conservation_score %>% 
  dplyr::left_join(mirna_pos, by = 'position') %>% 
  dplyr::select(`pre-mirna`, score) %>% 
  dplyr::mutate(ave_score = purrr::map_dbl(.x = score, .f = mean)) %>% 
  dplyr::select(`pre-mirna`, ave_score) %>% 
  dplyr::distinct() ->
  mirna_conservation_score_final


readr::write_rds(x = mirna_conservation_score_final, path = '/home/liucj/data/refdata/tam2.0/mirna-conservation-scores.rds.gz')
# save image --------------------------------------------------------------

save.image(file = '/home/liucj/data/refdata/tam2.0/09-conservation-scores.rda')

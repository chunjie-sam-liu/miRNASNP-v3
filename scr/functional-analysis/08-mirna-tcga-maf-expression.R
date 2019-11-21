
# Library -----------------------------------------------------------------

library(magrittr)

# Path --------------------------------------------------------------------

path_mirna_mutation <- '/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/snv/mirna-mutation'
maffiles <- list.files(path = path_mirna_mutation, pattern = '*maf.premir.format')


# Function ----------------------------------------------------------------

fn_load <- function(.x) {
  .d <- readr::read_tsv(file = file.path(path_mirna_mutation, .x), col_names = F)
  .d
}

maffiles %>% 
  purrr::map(.f = fn_load) ->
  mirna_maf_mutation


mirna_maf_mutation %>% 
  purrr::map(ncol)



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

data_combine <- dplyr::bind_rows(data_intra, data_inter)

url <- glue::glue('https://bmi.ana.med.uni-muenchen.de/miriad/miRNA/human/hsa-mir-6726/')

h <- xml2::read_html(x = url)
h %>% 
  rvest::html_node(css = 'container')



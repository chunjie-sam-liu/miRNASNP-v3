
human_read <- function(.x){
  .sign = ifelse(.x < 0 , TRUE, FALSE)
  .x <- abs(.x)
  
  if (.x >= 0.1) {
    .x %>% signif(digits = 2) %>% toString() -> .xx
  } else if (.x < 0.1 && .x >= 0.001 ) {
    .x %>% signif(digits = 2) %>% toString() -> .xx
  } else if (.x < 0.001 && .x > 0) {
    .x %>% format(digits = 3, scientific = TRUE) -> .xx
  } else {
    .xx <- '0'
  }
  
  ifelse(.sign, paste0('-',.xx), .xx)
}

human_read_latex_pval <- function(.x, .s = 'p') {
  .s <- ifelse(.s == 'p', 'p', paste0(.s, ', p'))
  
  if (grepl(pattern = "e", x = .x)) {
    sub("-0", "-", strsplit(split = "e", x = .x, fixed = TRUE)[[1]]) -> .xx
    latex2exp::TeX(glue::glue("<<.s>>=$<<.xx[1]>> \\times 10^{<<.xx[2]>>}$", .open = "<<", .close = ">>"))
  } else {
    latex2exp::TeX(glue::glue("{.s}={.x}"))
  }
}
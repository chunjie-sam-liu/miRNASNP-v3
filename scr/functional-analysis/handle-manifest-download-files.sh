#!/usr/bin/env bash
# @AUTHOR: Chun-Jie Liu
# @CONTACT: chunjie.sam.liu.at.gmail.com
# @DATE: 2019-11-08 14:56:30
# @DESCRIPTION:

# Number of input parameters
path_root=/home/liucj/data/refdata/tcga-somatic-mutation-and-mirna-expression-grch38/
path_snv=${path_root}/snv
function fn_snv {
  find ${path_snv} -type f -name "*maf.gz"|xargs gunzip
}

# function fn_expr {}


fn_snv
#!/usr/bin/env python
# -*- conding:utf-8 -*-
# @AUTHOR: Chun-Jie Liu
# @CONTACT: chunjie.sam.liu.at.gmail.com
# @DATE: 2020-07-19 15:40:05
# @DESCRIPTION:

import os
from pymongo import MongoClient
import json

root_dir = os.path.dirname(os.path.abspath(__file__))

# connect to
THE_COLLECTION = "seed_gain_4666"
NEW_COLLECTION = THE_COLLECTION + "_cj"

# resource connection
mongo = MongoClient("mongodb://username:password@localhost:port/dbname")


def get_data(condition={}, output={"_id": 0}, col_name=THE_COLLECTION):
    """
    Connect to MongoDB and get data from collection "seed_gain_4666"
    """
    mcur = mongo.mirnasnp[col_name].find(condition, output)
    return list(mcur)


def insert_into_mongo(d={}, col_name=NEW_COLLECTION):
    """[summary]

    Args:
        d ([type]): [description]
    """
    if d:
        mongo.mirnasnp[col_name].insert_one(d)


def drop_new_col(col_name=NEW_COLLECTION):
    if col_name in mongo.mirnasnp.list_collection_names():
        mongo.mirnasnp[col_name].drop()


def key_words():
    """
    keywords: mirna_id, snp_id, gene_symbol
    refseq: utr_info.acc
    mirmap: site_info.mm_start, site_info.mm_end, site_info.tgs_start, site_info.tgs_end
    """
    pass


def make_key_from_target_site(d):
    return "#".join(
        [
            d["site_info"]["mm_start"],
            d["site_info"]["mm_end"],
            d["site_info"]["tgs_start"],
            d["site_info"]["tgs_end"],
        ]
    )


def get_single_item(cond):
    ds = get_data(condition=cond)

    the_keys_u = set(make_key_from_target_site(d) for d in ds)
    the_keys_u_d = {v: [] for v in the_keys_u}

    for d in ds:
        the_key = make_key_from_target_site(d)
        the_keys_u_d[the_key] += [d["utr_info"]["acc"]]

    for k, v in the_keys_u_d.items():
        cond.update(
            dict(
                zip(
                    [
                        "site_info.mm_start",
                        "site_info.mm_end",
                        "site_info.tgs_start",
                        "site_info.tgs_end",
                    ],
                    k.split("#"),
                )
            )
        )

        ds_u = get_data(cond)
        res = ds_u[0]
        res["utr_info"]["acc"] = v

        # insert to mongodb
        insert_into_mongo(d=res)


def traverse_all_mirna_snp_gene():
    """
    test mirna snp gene
    hsa-miR-105-3p rs778443619 SERBP1
    """
    # return datasets
    ds = get_data(output={"_id": 0, "mirna_id": 1, "snp_id": 1, "gene_symbol": 1})

    # unique datasets
    ds_u = map(dict, set(tuple(sorted(d.items())) for d in ds))

    for d in ds_u:
        """
        d is dict of gene_symbol, mirna_id, snp_id
        """
        get_single_item(cond=d)


def main():
    drop_new_col()
    traverse_all_mirna_snp_gene()


if __name__ == "__main__":
    main()


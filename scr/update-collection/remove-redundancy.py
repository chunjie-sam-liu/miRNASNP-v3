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


class MongoManipulation:
    __mongo = MongoClient("mongodb://username:passwd@ip:port/dbname")

    def __init__(self, col_name):
        self.__col_name = col_name
        self.__new_col_name = col_name + "_cj"

    def get_data(self, condition={}, output={"_id": 0}):
        mcur = self.__mongo.mirnasnp[self.__col_name].find(
            condition, output, no_cursor_timeout=True
        )
        return list(mcur)

    def insert_data(self, d={}):
        if d:
            self.__mongo.mirnasnp[self.__new_col_name].insert_one(d)

    def drop_col(self):
        if self.__new_col_name in self.__mongo.mirnasnp.list_collection_names():
            self.__mongo.mirnasnp[self.__new_col_name].drop()


class DataUpdate(MongoManipulation):
    def __init__(self, col_name):
        MongoManipulation.__init__(self, col_name)

    def traverse_all_mirna_snp_gene(self):
        ds = self.get_data(
            output={"_id": 0, "mirna_id": 1, "snp_id": 1, "gene_symbol": 1}
        )
        ds_u = map(dict, set(tuple(sorted(d.items())) for d in ds))
        for d in ds_u:
            self.__get_single_item(cond=d)

    def __get_single_item(self, cond):
        ds = self.get_data(condition=cond)
        the_keys_u = set(self.__make_key_from_target_site(d) for d in ds)
        the_keys_u_d = {v: [] for v in the_keys_u}

        for d in ds:
            the_key = self.__make_key_from_target_site(d)
            acc = d["utr_info"]["acc"]
            if not isinstance(acc, list):
                the_keys_u_d[the_key] += [acc]

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
            ds_u = self.get_data(cond)
            res = ds_u[0]
            res["utr_info"]["acc"] = v
            # insert to mongodb
            self.insert_data(d=res)

    def __make_key_from_target_site(self, d):
        return "#".join(
            [
                d["site_info"]["mm_start"],
                d["site_info"]["mm_end"],
                d["site_info"]["tgs_start"],
                d["site_info"]["tgs_end"],
            ]
        )


def main():
    col1 = DataUpdate(col_name="seed_gain_4666")
    col1.drop_col()
    col1.traverse_all_mirna_snp_gene()


if __name__ == "__main__":
    main()


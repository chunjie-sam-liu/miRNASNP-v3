import flask_restful

import re
from miRNASNP3 import app, api
from miRNASNP3.core import mongo

from flask_restful import Resource, fields, marshal_with, reqparse, marshal
from flask import send_file

mirna_exp_df = {
    "ACC": fields.String,
    "DLBC": fields.String,
    "READ": fields.String,
    "GBM": fields.String,
    "LGG": fields.String,
    "THCA": fields.String,
    "STAD": fields.String,
    "UCEC": fields.String,
    "PCPG": fields.String,
    "CESC": fields.String,
    "UCS": fields.String,
    "TGCT": fields.String,
    "LIHC": fields.String,
    "CHOL": fields.String,
    "HNSC": fields.String,
    "UVM": fields.String,
    "SKCM": fields.String,
    "COAD": fields.String,
    "PAAD": fields.String,
    "THYM": fields.String,
    "LUSC": fields.String,
    "MESO": fields.String,
    "OV": fields.String,
    "ESCA": fields.String,
    "SARC": fields.String,
    "KIRP": fields.String,
    "BLCA": fields.String,
    "PRAD": fields.String,
    "LUAD": fields.String,
    "BRCA": fields.String,
    "KIRC": fields.String,
    "KICH": fields.String,
}
mirna_expression = {
    "exp_df": fields.Nested(mirna_exp_df),
    "exp_mean": fields.String,
    "mir_id": fields.String,
}
mirna_expression_list = {
    "mirna_expression_list": fields.Nested(mirna_expression),
    "mirna_expression_count": fields.Integer,
}


class MirExpression(Resource):
    @marshal_with(mirna_expression_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mirna_id", type=str)
        args = parser.parse_args()
        mirna_id = args["mirna_id"]
        condition = {}
        if mirna_id:
            condition["mir_id"] = mirna_id
            mirna_expression_list = mongo.db.mirna_expression.find(condition)
            mirna_expression_count = mongo.db.mirna_expression.find(condition).count()
        else:
            mirna_expression_list = {}
            mirna_expression_count = 0
        return {
            "mirna_expression_list": list(mirna_expression_list),
            "mirna_expression_count": mirna_expression_count,
        }


api.add_resource(MirExpression, "/api/mirna_expression")

site_info = {
    "align_1": fields.String,
    "align_2": fields.String,
    "align_3": fields.String,
    "align_4": fields.String,
    "align_5": fields.String,
    "align6": fields.String,
    "align7": fields.String,
    "align8": fields.String,
    "mm_start": fields.String,
    "mm_end": fields.String,
    "tgs_start": fields.String,
    "tgs_end": fields.String,
    "tgs_score": fields.String,
    "dg_duplex": fields.String,
    "dg_binding": fields.String,
    "dg_open": fields.String,
    "tgs_au": fields.String,
    "prob_exac": fields.String(attribute="prob_exac"),
    "chrome": fields.String,
}
snp_info = {
    "distance": fields.String,
    "chr": fields.String,
    "position": fields.String,
    "snp_id": fields.String,
    "alt": fields.String,
    "ref": fields.String,
    "curalt": fields.String,
}
gene_exp_df = {
    "ACC": fields.String,
    "DLBC": fields.String,
    "READ": fields.String,
    "GBM": fields.String,
    "LGG": fields.String,
    "THCA": fields.String,
    "STAD": fields.String,
    "UCEC": fields.String,
    "PCPG": fields.String,
    "CESC": fields.String,
    "UCS": fields.String,
    "TGCT": fields.String,
    "LIHC": fields.String,
    "CHOL": fields.String,
    "HNSC": fields.String,
    "UVM": fields.String,
    "SKCM": fields.String,
    "COAD": fields.String,
    "PAAD": fields.String,
    "THYM": fields.String,
    "LUSC": fields.String,
    "MESO": fields.String,
    "OV": fields.String,
    "ESCA": fields.String,
    "SARC": fields.String,
    "KIRP": fields.String,
    "BLCA": fields.String,
    "PRAD": fields.String,
    "LUAD": fields.String,
    "BRCA": fields.String,
    "KIRC": fields.String,
    "KICH": fields.String,
}
gene_expression = {
    "exp_df": fields.Nested(gene_exp_df),
    "exp_mean": fields.String,
    "symbol": fields.String,
}
utr_info = {
    "acc": fields.List(fields.String),
    "position": fields.String,
    "enst_id": fields.String,
    "gene_symbol": fields.String,
}
gainsite_info = {
    "snp_id": fields.String,
    "mir_seedstart": fields.String,
    "strand": fields.String,
    "mir_seedchr": fields.String,
    "mir_seedend": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "snp_info": fields.Nested(snp_info),
    "site_info": fields.Nested(site_info),
    "utr_info": fields.Nested(utr_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
    "cor_key": fields.String,
}

snp_seed_gain = {
    "snp_seed_gain_list": fields.Nested(gainsite_info),
    "snp_seed_gain_count": fields.Integer,
}

class SnpSeedGainFull(Resource):
    @marshal_with(snp_seed_gain)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("mirna_id")
        parser.add_argument("gene")
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        print(args["mirna_id"])
        page = args["page"]
        #per_page = 15
        #record_skip = (int(page) - 1) * per_page
        condition = {}
        pipline = []
        print(args["mirna_id"])
        if args["snp_id"]:
            condition["snp_id"] = args["snp_id"]
        if args["mirna_id"]:
            condition["mirna_id"] = args["mirna_id"]
        if args["gene"]:
            condition["gene_symbol"] = {"$regex": args["gene"], "$options": "$i"}
        
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        match = {"$match": condition}
        group_count = {"$group": {"_id": "null", "count": {"$sum": 1}}}
    
        print(pipline)
        
        pipline = [match,lookup_gene, lookup_mirna]

        snp_seed4666_gain_count = mongo.db.seed_gain_4666_redundancy.find(condition).count()
        snp_indel_gain_count = mongo.db.seed_gain_addindel_redundancy.find(condition).count()
        snp_seed_gain_count = snp_seed4666_gain_count + snp_indel_gain_count
        # snp_seed_gain_count=[]
        snp_seed4666_gain_list = mongo.db.seed_gain_4666_redundancy.aggregate(pipline)
        indel_seed_gain_list = mongo.db.seed_gain_addindel_redundancy.aggregate(pipline)
        
        snp_seed_gain_list = list(snp_seed4666_gain_list) + list(indel_seed_gain_list)
        return {
            "snp_seed_gain_list": list(snp_seed_gain_list),
            "snp_seed_gain_count": snp_seed_gain_count,
        }

api.add_resource(SnpSeedGainFull, "/api/snp_seed_gain_full")

class SnpSeedGain(Resource):
    @marshal_with(snp_seed_gain)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("mirna_id")
        parser.add_argument("gene")
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        print(args["mirna_id"])
        page = args["page"]
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        pipline = []
        print(args["mirna_id"])
        if args["snp_id"]:
            condition["snp_id"] = args["snp_id"]
        if args["mirna_id"]:
            condition["mirna_id"] = args["mirna_id"]
        if args["gene"]:
            condition["gene_symbol"] = {"$regex": args["gene"], "$options": "$i"}
        
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        group_count = {"$group": {"_id": "null", "count": {"$sum": 1}}}
        print(pipline)
        pipline = [match, skip, limit, lookup_gene, lookup_mirna]

        snp_seed4666_gain_count = mongo.db.seed_gain_4666_redundancy.find(
            condition
        ).count()
        snp_indel_gain_count = mongo.db.seed_gain_addindel_redundancy.find(
            condition
        ).count()
        snp_seed_gain_count = snp_seed4666_gain_count + snp_indel_gain_count
        # snp_seed_gain_count=[]
        snp_seed4666_gain_list = mongo.db.seed_gain_4666_redundancy.aggregate(pipline)
        indel_seed_gain_list = mongo.db.seed_gain_addindel_redundancy.aggregate(pipline)
        # snp_seed4666_gain_count=mongo.db.seed_gain_4666.aggregate(pipline_count)
        # indel_seed_gain_count=mongo.db.seed_gain_addindel.aggregate(pipline_count)
        # snp_seed_gain_count=list(snp_seed4666_gain_count)+list(indel_seed_gain_count)
        # for i in snp_seed4666_gain_count:
        #    snp_seed_gain_count.append(i)
        # for i in indel_seed_gain_count:
        #    snp_seed_gain_count.append(i)

        # print("snp_seed_gain_count")
        # print(snp_seed_gain_count)
        if args["snp_id"]:
            snp_seed_gain_list = list(snp_seed4666_gain_list) + list(
                indel_seed_gain_list
            )
        elif record_skip > snp_seed4666_gain_count:
            print("view end pages")
            print(record_skip)
            print(snp_seed4666_gain_count)
            record_skip_indel = record_skip - snp_seed4666_gain_count
            skip_indel = {"$skip": record_skip_indel}
            pipline_indel = [match, skip_indel, limit, lookup_gene, lookup_mirna]
            snp_seed_gain_list = mongo.db.seed_gain_addindel_redundancy.aggregate(
                pipline_indel
            )
        elif (
            snp_seed_gain_count - record_skip < 15
            and snp_seed_gain_count - record_skip > 0
        ):
            print("view across pages")
            print(record_skip)
            print(snp_seed4666_gain_count)
            snp_seed4666_gain_list = mongo.db.seed_gain_4666_redundancy.aggregate(
                pipline
            )
            limit_indel = snp_seed4666_gain_count - record_skip
            limit_indel_pip = {"$limit": limit_indel}
            pipline_indel = [match, limit_indel_pip, lookup_gene, lookup_mirna]
            indel_seed_gain_list = mongo.db.seed_gain_addindel_redundancy.aggregate(
                pipline_indel
            )
            snp_seed_gain_list = list(snp_seed4666_gain_list) + list(
                indel_seed_gain_list
            )
        else:
            snp_seed_gain_list = mongo.db.seed_gain_4666_redundancy.aggregate(pipline)
        # snp_seed_gain_list=mongo.db.indel_target_test.aggregate(pipline)
        # snp_seed_gain_count=mongo.db.indel_target_test.find(condition).count()

        return {
            "snp_seed_gain_list": list(snp_seed_gain_list),
            "snp_seed_gain_count": snp_seed_gain_count,
        }


api.add_resource(SnpSeedGain, "/api/snp_seed_gain")

cor_df = {
    "ACC": fields.String,
    "BLCA": fields.String,
    "BRCA": fields.String,
    "CESC": fields.String,
    "CHOL": fields.String,
    "COAD": fields.String,
    "DLBC": fields.String,
    "ESCA": fields.String,
    "GBM": fields.String,
    "HNSC": fields.String,
    "KICH": fields.String,
    "KIRC": fields.String,
    "KIRP": fields.String,
    "LGG": fields.String,
    "LIHC": fields.String,
    "LUAD": fields.String,
    "LUSC": fields.String,
    "MESO": fields.String,
    "OV": fields.String,
    "PAAD": fields.String,
    "PCPG": fields.String,
    "PRAD": fields.String,
    "READ": fields.String,
    "SARC": fields.String,
    "SKCM": fields.String,
    "STAD": fields.String,
    "TGCT": fields.String,
    "THCA": fields.String,
    "THYM": fields.String,
    "UCEC": fields.String,
    "UCS": fields.String,
    "UVM": fields.String,
}

corelation_detail = {"cor_df": fields.Nested(cor_df), "mir_gene": fields.String}

losssite_info = {
    "snp_id": fields.String,
    "mir_seedstart": fields.String,
    "strand": fields.String,
    "mir_seedchr": fields.String,
    "mir_seedend": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "cor_key": fields.String,
    "expr_corelation": fields.String,
    "experiment_valid": fields.Integer,
    "snp_info": fields.Nested(snp_info),
    "site_info": fields.Nested(site_info),
    "utr_info": fields.Nested(utr_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
    "corelation_detail": fields.Nested(corelation_detail),
}

snp_seed_loss_list = {
    "snp_seed_loss_list": fields.Nested(losssite_info),
    "snp_seed_loss_count": fields.Integer,
}

class SnpSeedLossFull(Resource):
    @marshal_with(snp_seed_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("mirna_id")
        parser.add_argument("gene")
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        page = args["page"]
        condition = {}
        print(args["mirna_id"])
        if args["snp_id"]:
            condition["snp_id"] = args["snp_id"]
        if args["mirna_id"]:
            condition["mirna_id"] = args["mirna_id"]
        if args["gene"]:
            condition["gene_symbol"] = {"$regex": args["gene"], "$options": "$i"}
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        lookup_corelation = {
            "$lookup": {
                "from": "corelation_cancer_detail",
                "localField": "cor_key",
                "foreignField": "mir_gene",
                "as": "corelation_detail",
            }
        }
        match = {"$match": condition}
        
        pipline = [match, lookup_gene, lookup_mirna, lookup_corelation]
        snp_seed4666_loss_count = mongo.db.seed_loss_4666_redundancy.find(
            condition
        ).count()
        snp_indel_loss_count = mongo.db.seed_loss_addindel_redundancy.find(
            condition
        ).count()
        snp_seed_loss_count = snp_seed4666_loss_count + snp_indel_loss_count
        
        snp_seed4666_loss_list = mongo.db.seed_loss_4666_redundancy.aggregate(
                pipline
            )
        indel_seed_loss_list = mongo.db.seed_loss_addindel_redundancy.aggregate(
                pipline
            )
        snp_seed_loss_list = list(snp_seed4666_loss_list) + list(indel_seed_loss_list)

        
        return {
            "snp_seed_loss_list": list(snp_seed_loss_list),
            "snp_seed_loss_count": snp_seed_loss_count,
        }


api.add_resource(SnpSeedLossFull, "/api/snp_seed_loss_full")

class SnpSeedLoss(Resource):
    @marshal_with(snp_seed_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("mirna_id")
        parser.add_argument("gene")
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        page = args["page"]
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        print(args["mirna_id"])
        if args["snp_id"]:
            condition["snp_id"] = args["snp_id"]
        if args["mirna_id"]:
            condition["mirna_id"] = args["mirna_id"]
        if args["gene"]:
            condition["gene_symbol"] = {"$regex": args["gene"], "$options": "$i"}
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        lookup_corelation = {
            "$lookup": {
                "from": "corelation_cancer_detail",
                "localField": "cor_key",
                "foreignField": "mir_gene",
                "as": "corelation_detail",
            }
        }
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        pipline = [match, skip, limit, lookup_gene, lookup_mirna, lookup_corelation]
        snp_seed4666_loss_count = mongo.db.seed_loss_4666_redundancy.find(
            condition
        ).count()
        snp_indel_loss_count = mongo.db.seed_loss_addindel_redundancy.find(
            condition
        ).count()
        snp_seed_loss_count = snp_seed4666_loss_count + snp_indel_loss_count
        if args["snp_id"]:
            snp_seed4666_loss_list = mongo.db.seed_loss_4666_redundancy.aggregate(
                pipline
            )
            indel_seed_loss_list = mongo.db.seed_loss_addindel_redundancy.aggregate(
                pipline
            )
            snp_seed_loss_list = list(snp_seed4666_loss_list) + list(
                indel_seed_loss_list
            )
        elif record_skip > snp_seed4666_loss_count:
            record_skip_indel = record_skip - snp_seed4666_loss_count
            skip_indel = {"$skip": record_skip_indel}
            pipline_indel = [match, skip_indel, limit, lookup_gene, lookup_mirna]
            snp_seed_loss_list = mongo.db.seed_loss_addindel_redundancy.aggregate(
                pipline_indel
            )
        elif (
            snp_seed4666_loss_count - record_skip < 15
            and snp_seed4666_loss_count - record_skip > 0
        ):
            snp_seed4666_loss_list = mongo.db.seed_loss_4666_redundancy.aggregate(
                pipline
            )
            limit_indel = snp_seed4666_loss_count - record_skip
            limit_indel_pip = {"$limit": limit_indel}
            pipline_indel = [match, limit_indel_pip, lookup_gene, lookup_mirna]
            indel_seed_loss_list = mongo.db.seed_loss_addindel_redundancy.aggregate(
                pipline_indel
            )
            snp_seed_loss_list = list(snp_seed4666_loss_list) + list(
                indel_seed_loss_list
            )
        else:
            snp_seed_loss_list = mongo.db.seed_loss_4666_redundancy.aggregate(pipline)
        return {
            "snp_seed_loss_list": list(snp_seed_loss_list),
            "snp_seed_loss_count": snp_seed_loss_count,
        }


api.add_resource(SnpSeedLoss, "/api/snp_seed_loss")

mut_info = {
    "distance": fields.String,
    "chr": fields.String,
    "position": fields.String,
    "mut_id": fields.String,
    "alt": fields.String,
    "ref": fields.String,
    "curalt": fields.String,
    "distance_align": fields.String,
}

mut_gainsite_info = {
    "mut_id": fields.String,
    "mir_seedstart": fields.String,
    "strand": fields.String,
    "mir_seedchr": fields.String,
    "mir_seedend": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "mut_info": fields.Nested(mut_info),
    "site_info": fields.Nested(site_info),
    "utr_info": fields.Nested(utr_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
}
mut_seed_gain_list = {
    "mut_seed_gain_list": fields.Nested(mut_gainsite_info),
    "mut_seed_gain_count": fields.Integer,
}


class MutSeedGain(Resource):
    @marshal_with(mut_seed_gain_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mirna_id", type=str)
        parser.add_argument("mut_id")
        parser.add_argument("gene")
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        mirna_id = args["mirna_id"]
        page = 1
        page = args["page"]
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        if args["mirna_id"]:
            condition["mirna_id"] = mirna_id
        if args["mut_id"]:
            condition["mut_id"] = args["mut_id"]
        if args["gene"]:
            condition["gene_symbol"] = {"$regex": args["gene"], "$options": "$i"}
        match = {"$match": condition}
        print("mut_seed_gain")
        print(condition)
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}

        pipline = [match, skip, limit, lookup_gene, lookup_mirna]
        tysnv_mut_seed_gain_list = mongo.db.seed_cosmic_gain_redundancy.aggregate(
            pipline
        )
        tysnv_mut_seed_gain_count = mongo.db.seed_cosmic_gain_redundancy.find(
            condition
        ).count()
        indel_mut_seed_gain_list = mongo.db.indel_seed_mutation_gain_redundancy.aggregate(
            pipline
        )
        indel_mut_seed_gain_count = mongo.db.indel_seed_mutation_gain_redundancy.find(
            condition
        ).count()
        mut_seed_gain_list = list(tysnv_mut_seed_gain_list) + list(
            indel_mut_seed_gain_list
        )
        mut_seed_gain_count = tysnv_mut_seed_gain_count + indel_mut_seed_gain_count
        print(mut_seed_gain_count)
        return {
            "mut_seed_gain_list": list(mut_seed_gain_list),
            "mut_seed_gain_count": mut_seed_gain_count,
        }


api.add_resource(MutSeedGain, "/api/mut_seed_gain")


mut_losssite_info = {
    "mut_id": fields.String,
    "mir_seedstart": fields.String,
    "strand": fields.String,
    "mir_seedchr": fields.String,
    "mir_seedend": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "cor_key": fields.String,
    "expr_corelation": fields.String,
    "experiment_valid": fields.Integer,
    "mut_info": fields.Nested(mut_info),
    "site_info": fields.Nested(site_info),
    "utr_info": fields.Nested(utr_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
    "corelation_detail": fields.Nested(corelation_detail),
}

mut_seed_loss_list = {
    "mut_seed_loss_list": fields.Nested(mut_losssite_info),
    "mut_seed_loss_count": fields.Integer,
}


class MutSeedLoss(Resource):
    @marshal_with(mut_seed_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mirna_id", type=str)
        parser.add_argument("mut_id")
        parser.add_argument("gene")
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        mirna_id = args["mirna_id"]
        page = 1
        page = args["page"]
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        if args["mirna_id"]:
            condition["mirna_id"] = mirna_id
        if args["mut_id"]:
            condition["mut_id"] = args["mut_id"]
        if args["gene"]:
            condition["gene_symbol"] = {"$regex": args["gene"], "$options": "$i"}
        match = {"$match": condition}
        print("mut_seed_loss")
        print(condition)
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        lookup_corelation = {
            "$lookup": {
                "from": "corelation_cancer_detail",
                "localField": "cor_key",
                "foreignField": "mir_gene",
                "as": "corelation_detail",
            }
        }
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}

        pipline = [match, skip, limit, lookup_mirna, lookup_gene, lookup_corelation]
        tysnv_mut_seed_loss_list = mongo.db.seed_cosmic_loss_redundancy.aggregate(
            pipline
        )
        tysnv_mut_seed_loss_count = mongo.db.seed_cosmic_loss_redundancy.find(
            condition
        ).count()
        indel_mut_seed_loss_list = mongo.db.indel_seed_mutation_loss_redundancy.aggregate(
            pipline
        )
        indel_mut_seed_loss_count = mongo.db.indel_seed_mutation_loss_redundancy.find(
            condition
        ).count()

        mut_seed_loss_list = list(tysnv_mut_seed_loss_list) + list(
            indel_mut_seed_loss_list
        )
        mut_seed_loss_count = tysnv_mut_seed_loss_count + indel_mut_seed_loss_count
        print(mut_seed_loss_count)
        return {
            "mut_seed_loss_list": list(mut_seed_loss_list),
            "mut_seed_loss_count": mut_seed_loss_count,
        }


api.add_resource(MutSeedLoss, "/api/mut_seed_loss")

utr_site_info = {
    "chrome": fields.String,
    "mm_start": fields.String,
    "mm_end": fields.String,
    "tgs_start": fields.String,
    "tgs_end": fields.String,
    "dg_duplex": fields.String,
    "dg_binding": fields.String,
    "dg_open": fields.String,
    "tgs_au": fields.String,
    "tgs_score": fields.String,
    "prob_exac": fields.String,
    "align_1": fields.String,
    "align_2": fields.String,
    "align_3": fields.String,
    "align_4": fields.String,
    "align_5": fields.String,
    "align6": fields.String,
    "align7": fields.String,
    "align8": fields.String,
    "truncate_start": fields.String,
    "truncate_end": fields.String,
    "distance": fields.Integer,
    "alt_start": fields.Integer,
    "alt_end": fields.Integer,
    "alt_color": fields.String,
    "alt_display": fields.Integer,
}

snp_info_line = {
    "distance": fields.String,
    "distance_align": fields.String,
    "chr": fields.String,
    "position": fields.String,
    "snp_id": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "curalt": fields.String,
}
utr_info_line = {
    "gene_symbol": fields.String,
    "enst_id": fields.String,
    "acc": fields.List(fields.String),
    "chr": fields.String,
    "end": fields.String,
    "start": fields.String,
    "strand": fields.String,
    "position": fields.String,
}
experiment_valid = {
    "pubmedid": fields.String,
    "evidence": fields.String,
    "source": fields.String,
    "mirna": fields.String,
    "experiment_valid_key": fields.String,
    "gene": fields.String,
}
snv_utr_loss = {
    "snv": fields.Integer,
    "indel": fields.Integer,
    "snp_id": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "experiment_valid": fields.Nested(experiment_valid),
    "expr_corelation": fields.String,
    "snp_info": fields.Nested(snp_info_line),
    "utr_info": fields.Nested(utr_info_line),
    "site_info": fields.Nested(utr_site_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
    "corelation_detail": fields.Nested(corelation_detail),
}
utr_loss_list = {
    "utr_loss_list": fields.Nested(snv_utr_loss),
    "utr_loss_count": fields.Integer,
}


class SnvUtrLoss(Resource):
    @marshal_with(utr_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        snp_id = args["snp_id"]
        page = args["page"]
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        if snp_id:
            condition["snp_id"] = snp_id
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        lookup_corelation = {
            "$lookup": {
                "from": "corelation_cancer_detail",
                "localField": "cor_key",
                "foreignField": "mir_gene",
                "as": "corelation_detail",
            }
        }
        lookup_experiment_valid = {
            "$lookup": {
                "from": "gene_mirna_experiment_validation",
                "localField": "cor_key",
                "foreignField": "experiment_valid_key",
                "as": "experiment_valid",
            }
        }
        print(condition)
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        pipline = [
            match,
            skip,
            limit,
            lookup_gene,
            lookup_mirna,
            lookup_corelation,
            lookup_experiment_valid,
        ]
        snv_utr_loss_list = mongo.db.snv_utr_loss_v2_redundancy.aggregate(pipline)
        snv_utr_loss_count = mongo.db.snv_utr_loss_v2_redundancy.find(condition).count()
        indel_utr_loss_list = mongo.db.indel_utr_loss_v2_redundancy.aggregate(pipline)
        indel_utr_loss_count = mongo.db.indel_utr_loss_v2_redundancy.find(
            condition
        ).count()

        utr_loss_list = list(snv_utr_loss_list) + list(indel_utr_loss_list)
        utr_loss_count = snv_utr_loss_count + indel_utr_loss_count

        return {"utr_loss_list": list(utr_loss_list), "utr_loss_count": utr_loss_count}


api.add_resource(SnvUtrLoss, "/api/snv_utr_loss")

snv_utr_gain = {
    "snp_id": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "snp_info": fields.Nested(snp_info_line),
    "utr_info": fields.Nested(utr_info_line),
    "site_info": fields.Nested(utr_site_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
}

utr_gain_list = {
    "utr_gain_list": fields.Nested(snv_utr_gain),
    "utr_gain_count": fields.Integer,
}


class SnvUtrGain(Resource):
    @marshal_with(utr_gain_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("page", type=int, default=1)
        args = parser.parse_args()
        snp_id = args["snp_id"]
        page = args["page"]
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        if snp_id:
            condition["snp_id"] = snp_id
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        print(condition)
        pipline = [match, skip, limit, lookup_gene, lookup_mirna]
        snv_utr_gain_list = mongo.db.snv_utr_gain_v2_redundancy.aggregate(pipline)
        snv_utr_gain_count = mongo.db.snv_utr_gain_v2_redundancy.find(condition).count()
        indel_utr_gain_list = mongo.db.indel_utr_gain_v2_redundancy.aggregate(pipline)
        indel_utr_gain_count = mongo.db.indel_utr_gain_v2_redundancy.find(
            condition
        ).count()

        utr_gain_list = list(snv_utr_gain_list) + list(indel_utr_gain_list)
        utr_gain_count = snv_utr_gain_count + indel_utr_gain_count

        return {"utr_gain_list": list(utr_gain_list), "utr_gain_count": utr_gain_count}


api.add_resource(SnvUtrGain, "/api/snv_utr_gain")

mut_gain_utr_site = {
    "mut_id": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "mut_info": fields.Nested(mut_info),
    "site_info": fields.Nested(utr_site_info),
    "utr_info": fields.Nested(utr_info_line),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
}

mut_utr_gain = {
    "mut_utr_gain_list": fields.Nested(mut_gain_utr_site),
    "mut_utr_gain_count": fields.Integer,
}


class MutUtrGain(Resource):
    @marshal_with(mut_utr_gain)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id")
        parser.add_argument("page")
        args = parser.parse_args()
        page = 1
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        if args["page"]:
            record_skip = (int(args["page"]) - 1) * per_page
        if args["mut_id"]:
            condition["mut_id"] = args["mut_id"]
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}

        pipline = [match, skip, limit, lookup_gene, lookup_mirna]
        if args["mut_id"].lower().startswith("cosn"):
            tynsv_mut_utr_gain_list = mongo.db.utr_cosmic_gain_redundancy.aggregate(
                pipline
            )
            tysnv_mut_utr_gain_count = mongo.db.utr_cosmic_gain_redundancy.find(
                condition
            ).count()
            indel_mut_utr_gain_list = mongo.db.utr_cosmic_gain_indel_redundancy.aggregate(
                pipline
            )
            indel_mut_utr_gain_count = mongo.db.utr_cosmic_gain_indel_redundancy.find(
                condition
            ).count()
            mut_utr_gain_list = list(tynsv_mut_utr_gain_list) + list(
                indel_mut_utr_gain_list
            )
            mut_utr_gain_count = tysnv_mut_utr_gain_count + indel_mut_utr_gain_count
        else:
            tynsv_mut_utr_gain_list = mongo.db.utr_clinvar_gain_redundancy.aggregate(
                pipline
            )
            tysnv_mut_utr_gain_count = mongo.db.utr_clinvar_gain_redundancy.find(
                condition
            ).count()
            indel_mut_utr_gain_list = mongo.db.utr_clinvar_gain_indel_redundancy.aggregate(
                pipline
            )
            indel_mut_utr_gain_count = mongo.db.utr_clinvar_gain_indel_redundancy.find(
                condition
            ).count()
            mut_utr_gain_list = list(tynsv_mut_utr_gain_list) + list(
                indel_mut_utr_gain_list
            )
            mut_utr_gain_count = tysnv_mut_utr_gain_count + indel_mut_utr_gain_count

        return {
            "mut_utr_gain_list": list(mut_utr_gain_list),
            "mut_utr_gain_count": mut_utr_gain_count,
        }


api.add_resource(MutUtrGain, "/api/mut_utr_gain")

mut_loss_utr_site = {
    "mut_id": fields.String,
    "mirna_id": fields.String,
    "gene_symbol": fields.String,
    "experiment_valid": fields.Integer,
    "expr_corelation": fields.String,
    "mut_info": fields.Nested(mut_info),
    "utr_info": fields.Nested(utr_info_line),
    "site_info": fields.Nested(utr_site_info),
    "gene_expression": fields.Nested(gene_expression),
    "mirna_expression": fields.Nested(mirna_expression),
    "corelation_detail": fields.Nested(corelation_detail),
}

mut_utr_loss = {
    "mut_utr_loss_list": fields.Nested(mut_loss_utr_site),
    "mut_utr_loss_count": fields.Integer,
}


class MutUtrLoss(Resource):
    @marshal_with(mut_utr_loss)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id")
        parser.add_argument("page")
        args = parser.parse_args()
        page = 1
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        if args["page"]:
            record_skip = (int(args["page"]) - 1) * per_page
        if args["mut_id"]:
            condition["mut_id"] = args["mut_id"]
        lookup_gene = {
            "$lookup": {
                "from": "gene_expression",
                "localField": "gene_symbol",
                "foreignField": "symbol",
                "as": "gene_expression",
            }
        }
        lookup_mirna = {
            "$lookup": {
                "from": "mirna_expression",
                "localField": "mirna_id",
                "foreignField": "mir_id",
                "as": "mirna_expression",
            }
        }
        lookup_corelation = {
            "$lookup": {
                "from": "corelation_cancer_detail",
                "localField": "cor_key",
                "foreignField": "mir_gene",
                "as": "corelation_detail",
            }
        }
        print(condition)
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        pipline = [match, skip, limit, lookup_gene, lookup_mirna, lookup_corelation]
        if args["mut_id"].lower().startswith("cos"):
            tysnv_mut_utr_loss_list = mongo.db.utr_cosmic_loss_redundancy.aggregate(
                pipline
            )
            tysnv_mut_utr_loss_count = mongo.db.utr_cosmic_loss_redundancy.find(
                condition
            ).count()
            indel_mut_utr_loss_list = mongo.db.utr_cosmic_loss_indel_redundancy.aggregate(
                pipline
            )
            indel_mut_utr_loss_count = mongo.db.utr_cosmic_loss_indel_redundancy.find(
                condition
            ).count()
            mut_utr_loss_list = list(tysnv_mut_utr_loss_list) + list(
                indel_mut_utr_loss_list
            )
            mut_utr_loss_count = tysnv_mut_utr_loss_count + indel_mut_utr_loss_count
        else:
            tysnv_mut_utr_loss_list = mongo.db.utr_clinvar_loss_redundancy.aggregate(
                pipline
            )
            tysnv_mut_utr_loss_count = mongo.db.utr_clinvar_loss_redundancy.find(
                condition
            ).count()
            indel_mut_utr_loss_list = mongo.db.utr_clinvar_loss_indel_redundancy.aggregate(
                pipline
            )
            indel_mut_utr_loss_count = mongo.db.utr_clinvar_loss_indel_redundancy.find(
                condition
            ).count()
            mut_utr_loss_list = list(tysnv_mut_utr_loss_list) + list(
                indel_mut_utr_loss_list
            )
            mut_utr_loss_count = tysnv_mut_utr_loss_count + indel_mut_utr_loss_count
        return {
            "mut_utr_loss_list": list(mut_utr_loss_list),
            "mut_utr_loss_count": mut_utr_loss_count,
        }


api.add_resource(MutUtrLoss, "/api/mut_utr_loss")

browse_info = {
    "mir_id": fields.String,
    "mir_acc": fields.String,
    "mir_chr": fields.String,
    "mir_start": fields.String,
    "mir_end": fields.String,
    "mir_strand": fields.String,
    "location": fields.String,
    "count_snp": fields.Integer,
    "snp_info": fields.String,
    "count_nutation": fields.Integer,
    "mutation_info": fields.String,
}

browse_list = {"browse_list": fields.List(fields.Nested(browse_info))}


class BrowseMir(Resource):
    @marshal_with(browse_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("chr", type=str)
        parser.add_argument("page", type=int, default=1)
        parser.add_argument("per_page", type=int, default=30)
        args = parser.parse_args()
        page = args["page"]
        per_page = args["per_page"]
        chrome = args["chr"]
        record_skip = (page - 1) * per_page
        condition = {}
        browse_list = []
        if chrome:
            condition = {"mir_chr": chrome}
        browse_list = mongo.db.browseY.find(condition).skip(record_skip).limit(per_page)
        return {"browse_list": list(browse_list)}


api.add_resource(BrowseMir, "/api/browsemir")

mir_summary = {
    "mir_id": fields.String,
    "mir_acc": fields.String,
    "mir_chr": fields.String,
    "mir_start": fields.String,
    "mir_end": fields.String,
    "mir_strand": fields.String,
    "matureSeq": fields.String,
    "pre_id": fields.String,
    "pre_acc": fields.String,
    "pre_chr": fields.String,
    "pre_start": fields.String,
    "pre_end": fields.String,
    "pre_strand": fields.String,
    "harpin_seq": fields.String,
    "snp_in_seed": fields.Integer,
    "snp_in_mature": fields.Integer,
    "snp_in_premir": fields.Integer,
    "cosmic_in_seed": fields.Integer,
    "cosmic_in_mature": fields.Integer,
    "cosmic_in_premir": fields.Integer,
    "clinvar_in_seed": fields.Integer,
    "clinvar_in_mature": fields.Integer,
    "clinvar_in_premir": fields.Integer,
    "snp_gwas_in_seed": fields.Integer,
    "snp_gwas_in_mature": fields.Integer,
    "snp_gwas_in_premir": fields.Integer,
    "drv_in_seed": fields.Integer,
    "drv_in_mature": fields.Integer,
    "drv_in_premir": fields.Integer,
}

mirna_summary_list = {
    "mirna_summary_list": fields.Nested(mir_summary),
    "mirna_summary_count": fields.Integer,
}


class MirSummary(Resource):
    @marshal_with(mirna_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("page", type=int, default=1)
        parser.add_argument("chrome", type=str)
        parser.add_argument("mirna_id")
        args = parser.parse_args()
        page = args["page"]
        chrome = args["chrome"]
        mirna_id = args["mirna_id"]
        per_page = 15
        record_skip = (page - 1) * per_page
        print(mirna_id)
        condition = {}
        if chrome != "All":
            condition["mir_chr"] = chrome
        if mirna_id:
            condition["mir_id"] = {"$regex": mirna_id, "$options": "$i"}
        # mirna_summary_list = mongo.db.mirna_summary_sort.find(condition).skip(record_skip).limit(per_page)
        # mirna_summary_count=mongo.db.mirna_summary_sort.find(condition).count()
        mirna_summary_list = (
            mongo.db.seed_mature_pre_var_v1.find(condition)
            .skip(record_skip)
            .limit(per_page)
        )
        mirna_summary_count = mongo.db.seed_mature_pre_var_v1.find(condition).count()
        return {
            "mirna_summary_list": list(mirna_summary_list),
            "mirna_summary_count": mirna_summary_count,
        }


api.add_resource(MirSummary, "/api/mirna_summary")


class MirInfo(Resource):
    @marshal_with(mirna_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        args = parser.parse_args()
        search_ids = args["search_ids"]
        condition = {}
        print(search_ids)
        if search_ids:
            condition["mir_id"] = {
                "$regex": "".join(["^", search_ids, "$"]),
                "$options": "$i",
            }
            mirna_summary_list = mongo.db.seed_mature_pre_var_v1.find(condition)
            mirna_summary_count = mongo.db.seed_mature_pre_var_v1.find(
                condition
            ).count()
        else:
            mirna_summary_list = {}
            mirna_summary_count = 0
        return {
            "mirna_summary_list": list(mirna_summary_list),
            "mirna_summary_count": mirna_summary_count,
        }


api.add_resource(MirInfo, "/api/mirinfo")

drug_name = {
    "pubchem_sid": fields.String,
    "drug_name": fields.String,
    "fda_status": fields.String,
    "nsc_id": fields.String,
    "machanism_of_action": fields.String,
}

nci60_item = {
    "miRNA": fields.String,
    "NSC": fields.String,
    "pubchem": fields.String,
    "cor": fields.String,
    "pv": fields.String,
    "fdr": fields.String,
    "drug_name": fields.Nested(drug_name),
}

drug_cor = {"nci60_list": fields.Nested(nci60_item), "nci60_count": fields.Integer}


class MirDrug(Resource):
    @marshal_with(drug_cor)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mature_id", type=str)
        args = parser.parse_args()
        mature_id = args["mature_id"]
        condition_ccle = {}
        condition_nci60 = {}
        pipeline = []
        if mature_id:
            condition_nci60["miRNA"] = mature_id
            """
            condition_ccle['pv']={'$lt':'0.05'}
            condition_ccle['fdr']={'$lt':'0.05'}
            condition_nci60['miRNA']=mature_id
            condition_nci60['pv']={'$lt':'0.05'}
            """
            condition_nci60["fdr"] = {"$lt": "0.05"}
            #
            # ccle_list=mongo.db.ccle_drug_correlation.find(condition_ccle)
            # ccle_count=mongo.db.ccle_drug_correlation.find(condition_ccle).count()
            lookup_name = {
                "$lookup": {
                    "from": "nscid_psid",
                    "localField": "NSC",
                    "foreignField": "nsc_id",
                    "as": "drug_name",
                }
            }
            print(condition_nci60)
            match = {"$match": condition_nci60}
            pipeline = [match, lookup_name]
            nci60_list = mongo.db.nci60_drug_correlation.aggregate(pipeline)
            nci60_count = 1
        else:
            nci60_list = []
            nci60_count = 0
        return {"nci60_list": list(nci60_list), "nci60_count": nci60_count}


api.add_resource(MirDrug, "/api/mirdrug")

mirna_key_list = {
    "mirna_key_list": fields.Nested(mir_summary),
    "premir_key_list": fields.Nested(mir_summary),
}

mirnago_item = {
    "go_name": fields.String,
    "go_id": fields.String,
    "precursor_id": fields.String,
    "reference": fields.String,
}
mirnago_list = {
    "mirnago_list": fields.Nested(mirnago_item),
    "mirnago_count": fields.Integer,
}


class MirnaGo(Resource):
    @marshal_with(mirnago_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("precursor_id", type=str)
        args = parser.parse_args()
        precursor_id = args["precursor_id"]
        condition = {}
        if precursor_id:
            condition["precursor_id"] = precursor_id
            mirnago_list = mongo.db.mirnago.find(condition)
            mirnago_count = mongo.db.mirnago.find(condition).count()
        else:
            mirnago_list = []
            mirnago_count = 0
        return {"mirnago_list": list(mirnago_list), "mirnago_count": mirnago_count}


api.add_resource(MirnaGo, "/api/mirnago")


class MirnaKey(Resource):
    @marshal_with(mirna_key_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mirna_id", type=str)
        args = parser.parse_args()
        mirna_id = args["mirna_id"]
        condition = {}
        condition_pre = {}
        if mirna_id:
            condition["mir_id"] = {"$regex": mirna_id, "$options": "$i"}
            condition_pre["pre_id"] = {"$regex": mirna_id, "$options": "$i"}
            print(condition)
            mirna_key_list = mongo.db.pri_mir_summary.find(condition)
            premir_key_list = mongo.db.pri_mir_summary.find(condition_pre)
        else:
            mirna_key_list = {}
            premir_key_list = {}

        return {
            "mirna_key_list": list(mirna_key_list),
            "premir_key_list": list(premir_key_list),
        }


api.add_resource(MirnaKey, "/api/mirna_key")

pri_id = {
    "pre_id": fields.String,
    "pre_chr": fields.String,
    "pre_acc": fields.String,
    "pre_start": fields.String,
    "pre_end": fields.String,
    "pre_strand": fields.String,
    "snp_in_premir": fields.Integer,
    "cosmic_in_premir": fields.Integer,
    "clinvar_in_premir": fields.Integer,
}

mature_info = {
    "mir_id": fields.List(fields.String),
    "mir_acc": fields.List(fields.String),
}
pri_count = {"_id": fields.String, "count": fields.String}

primir_summary = {
    "pre_id": fields.String,
    "pre_chr": fields.String,
    "pre_acc": fields.String,
    "pre_start": fields.String,
    "pre_end": fields.String,
    "pre_strand": fields.String,
    "snp_in_premir": fields.Integer,
    "cosmic_in_premir": fields.Integer,
    "clinvar_in_premir": fields.Integer,
    "drv_in_premir": fields.Integer,
    "mature_info": fields.Nested(mature_info),
}
primir_summary_list = {
    "primir_summary_list": fields.Nested(primir_summary),
    "primir_summary_count": fields.Integer,
}


class PrimirSummary(Resource):
    @marshal_with(primir_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("page", type=int, default=1)
        parser.add_argument("chrome", type=str)
        parser.add_argument("pre_id")
        args = parser.parse_args()
        page = args["page"]
        chrome = args["chrome"]
        pre_id = args["pre_id"]
        per_page = 15
        record_skip = (page - 1) * per_page
        print(page)
        condition = {}
        if chrome != "All":
            condition["pre_chr"] = chrome
        if pre_id:
            condition["pre_id"] = {"$regex": pre_id, "$options": "$i"}
            """
        group={'$group':{
            '_id':{
                'pre_id':'$pre_id',
                'pre_acc':'$pre_acc',
                'pre_chr':'$pre_chr',
                'pre_start':'$pre_start',
                'pre_end':'$pre_end',
                'pre_strand':'$pre_strand',
                'snp_in_premir':'$snp_in_premir',
                'cosmic_in_premir':'$cosmic_in_premir',
                'clinvar_in_premir':'$clinvar_in_premir',
            },
            'mature_info':{'$push':{
                'mir_id':'$mir_id',
                'mir_acc':'$mir_acc',
            }},
        }}
        group_sum={'$group':{
            '_id':'null',
            'count':{'$sum':1}
        }}
        """
        print(condition)
        premir_summary_list = (
            mongo.db.premir_summary_v1.find(condition).skip(record_skip).limit(per_page)
        )
        premir_summary_count = mongo.db.premir_summary_v1.find(condition).count()
        print("done serch")
        # print(pip_sum)
        # print(pipline)
        return {
            "primir_summary_list": list(premir_summary_list),
            "primir_summary_count": premir_summary_count,
        }


api.add_resource(PrimirSummary, "/api/primir_summary")

"""
premir_genome={
    'start':fields.String,
    'end':fields.String,
    'stand':fields.String,
    'chromosome':fields.String
}

mir_cluster5k={
    'id':fields.String,
    'confidence':fields.String,
    'cluster5k_id':fields.String,
    'accession':fields.String,
    'genome':fields.List(fields.Nested(premir_genome)),
    'rpm':fields.String
}
mir_cluster10k={
    'id':fields.String,
    'confidence':fields.String,
    'cluster10k_id':fields.String,
    'accession':fields.String,
    'genome':fields.List(fields.Nested(premir_genome)),
    'rpm':fields.String
}
"""

mut_item = {
    "mut_id": fields.String,
    "chr": fields.String,
    "position": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "structure_analys": fields.Integer,
}

premir_cluster = {
    "pre_id": fields.String,
    "cluster10k_id": fields.String,
    "cluster5k_id": fields.String,
}
mirset_v9_item = {
    "Function": fields.List(fields.String),
    "precurser_id": fields.String,
    "HMDD": fields.List(fields.String),
}

premir_context = {
    "precursor_id": fields.String,
    "host_gene": fields.String,
    "region": fields.String,
}
premir_info = {
    "pre_id": fields.String,
    "cluster10k_id": fields.List(fields.List(fields.String)),
    "cluster5k_id": fields.List(fields.List(fields.String)),
    "sequence": fields.String,
    "dotfold": fields.String,
    "cosmic": fields.Nested(mut_item),
    "clinvar": fields.Nested(mut_item),
    "snv": fields.Nested(mut_item),
    "mfe": fields.String,
    "host_gene": fields.Nested(premir_context),
    "mirinfo": fields.Nested(mir_summary),
    "mature_position": fields.List(fields.List(fields.String)),
    "mirset_v9": fields.Nested(mirset_v9_item),
}
premir_info_list = {"premir_info": fields.Nested(premir_info)}


class PremirInfo(Resource):
    @marshal_with(premir_info_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        args = parser.parse_args()
        search_ids = args["search_ids"]
        condition = {}
        print(search_ids)
        if search_ids:
            match = {"$match": {"pre_id": search_ids}}
            lookup_mirinfo = {
                "$lookup": {
                    "from": "pri_mir_summary",
                    "localField": "pre_id",
                    "foreignField": "pre_id",
                    "as": "mirinfo",
                }
            }
            lookup_function = {
                "$lookup": {
                    "from": "mirset_v9",
                    "localField": "pre_id",
                    "foreignField": "precurser_id",
                    "as": "mirset_v9",
                }
            }
            lookup_context = {
                "$lookup": {
                    "from": "premir_context",
                    "localField": "pre_id",
                    "foreignField": "precursor_id",
                    "as": "host_gene",
                }
            }
            pipline = [match, lookup_mirinfo, lookup_function, lookup_context]
            print(pipline)
            # premir_info=mongo.db.premir_info.aggregate(pipline)
            premir_info = mongo.db.premir_info_addindel_v1.aggregate(pipline)
        else:
            premir_info = {}
        return {"premir_info": list(premir_info)}


api.add_resource(PremirInfo, "/api/premir_info")

pri_alt = {
    "pre_id": fields.String,
    "pre_start": fields.String,
    "pre_end": fields.String,
    "snp_id": fields.String,
    "snp_chr": fields.String,
    "snp_position": fields.String,
    "ref": fields.String,
    "snp_ref_freq": fields.String,
    "alt": fields.String(attribute="snp_alt"),
    "snp_alt_freq": fields.String,
    "curalt": fields.String,
    "pre_altseq": fields.String,
    "dotfold": fields.String,
    "mfe": fields.String,
    "pre_strand": fields.String,
    "pre_acc": fields.String,
    "rela_loc": fields.String,
    "insert": fields.Integer,
    "delete": fields.Integer,
    "alt_start": fields.String,
    "alt_end": fields.String,
}

primir_alt_list = {
    "primir_alt_list": fields.Nested(pri_alt),
    "primir_alt_count": fields.Integer,
}


class PrimirAlt(Resource):
    @marshal_with(primir_alt_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        parser.add_argument("pre_id", type=str)
        args = parser.parse_args()
        search_ids = args["search_ids"]
        condition = {}
        print(search_ids)
        if search_ids:
            condition["snp_id"] = search_ids
            condition["pre_id"] = args["pre_id"]
            # primir_alt_list=mongo.db.primary_altseq.find(condition)
            # primir_alt_count=mongo.db.primary_altseq.find(condition).count()
            primir_alt_list = mongo.db.primary_altseq_indel.find(condition)
            primir_alt_count = mongo.db.primary_altseq_indel.find(condition).count()
        else:
            primir_alt_list = {}
            primit_alt_count = 0

        return {
            "primir_alt_list": list(primir_alt_list),
            "primir_alt_count": primir_alt_count,
        }


api.add_resource(PrimirAlt, "/api/primir_altseq")

primir_mut = {
    "pre_id": fields.String,
    "pre_start": fields.String,
    "pre_end": fields.String,
    "mut_id": fields.String,
    "mut_chr": fields.String,
    "mut_position": fields.String,
    "ref": fields.String,
    "curalt": fields.String,
    "pre_altseq": fields.String,
    "dotfold": fields.String,
    "mfe": fields.String,
    "pre_strand": fields.String,
    "pre_acc": fields.String,
    "rela_loc": fields.String,
    "source": fields.String,
    "insert": fields.Integer,
    "delete": fields.Integer,
    "alt_start": fields.String,
    "alt_end": fields.String,
}

primir_mut_list = {
    "primir_mut_list": fields.Nested(primir_mut),
    "primir_mut_count": fields.Integer,
}


class PrimirMut(Resource):
    @marshal_with(primir_mut_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id", type=str)
        parser.add_argument("pre_id", type=str)
        args = parser.parse_args()
        mut_id = args["mut_id"]
        pre_id = args["pre_id"]
        condition = {}
        if mut_id:
            condition["mut_id"] = mut_id
            condition["pre_id"] = pre_id
            # primir_mut_list=mongo.db.primir_altseq_mut.find(condition)
            # primir_mut_count=mongo.db.primir_altseq_mut.find(condition).count()
            primir_mut_list = mongo.db.primir_altseq_mut_indel.find(condition)
            primir_mut_count = mongo.db.primir_altseq_mut_indel.find(condition).count()
        else:
            primir_mut_count = 0
            primir_mut_list = {}
        return {
            "primir_mut_list": list(primir_mut_list),
            "primir_mut_count": primir_mut_count,
        }


api.add_resource(PrimirMut, "/api/primir_altseq_mut")


snpinfo_line = {
    "snp_id": fields.String,
    "snp_chr": fields.String,
    "snp_coordinate": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "ref_freq": fields.String,
    "alt_freq": fields.String,
    "location": fields.String,
    "identifier": fields.String,
    "ldsnp": fields.Integer,
    "mutation_rela": fields.Integer,
    "gain_count": fields.String,
    "loss_count": fields.String,
}

snpinfo = {"snpinfo": fields.Nested(snpinfo_line), "snpinfo_count": fields.Integer}


class SnpInfo(Resource):
    @marshal_with(snpinfo)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("query_snp", type=str)
        parser.add_argument("page")
        args = parser.parse_args()
        page = args["page"]
        query_snp = args["query_snp"]
        per_page = 15
        record_skip = (int(page) - 1) * int(per_page)
        condition = {}
        if query_snp == "summary":
            snpinfo = mongo.db.snp_summary.find().skip(record_skip).limit(per_page)
            snpinfo_count = mongo.db.snp_summary.find().count()
        elif query_snp.startswith("rs"):
            condition = {"snp_id": query_snp}
            snpinfo = mongo.db.snp_summary.find(condition)
            snpinfo_count = mongo.db.snp_summary.find(condition).count()
        else:
            snpinfo = {}
            snpinfo_count = 0
        return {"snpinfo": list(snpinfo), "snpinfo_count": snpinfo_count}


api.add_resource(SnpInfo, "/api/snpinfo")

catalog_line = {
    "snp_id": fields.String(attribute="SNPS"),
    "risk_allele": fields.String(attribute="STRONGEST_SNP-RISK_ALLELE"),
    "risk_allele_fre": fields.String(attribute="RISK_ALLELE_FREQUENCY"),
    "disease": fields.String(attribute="DISEASE/TRAIT"),
    "reported_gene": fields.String(attribute="REPORTED_GENE"),
    "p_value": fields.String(attribute="P-VALUE"),
    "or_beta": fields.String(attribute="OR_or_BETA"),
    "ci95": fields.String(attribute="CI_95_TEXT"),
    "pubmed_id": fields.String(attribute="PUBMEDID"),
    "pubmed_link": fields.String(attribute="LINK"),
}

catalog_list = {
    "catalog_list": fields.Nested(catalog_line),
    "catalog_count": fields.Integer,
}


class GwasCatalog(Resource):
    @marshal_with(catalog_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        args = parser.parse_args()
        search_ids = args["search_ids"]
        print(search_ids)
        if search_ids:
            condition = {"SNPS": search_ids}
            catalog_list = mongo.db.gwas_catalog_alternative.find(condition)
            catalog_count = mongo.db.gwas_catalog_alternative.find(condition).count()
        else:
            catalog_list = {}
            catalog_count = 0
        return {"catalog_list": list(catalog_list), "catalog_count": catalog_count}


api.add_resource(GwasCatalog, "/api/gwas_catalog")

tag_info = {
    "population": fields.String,
    "ld_start": fields.String,
    "ld_end": fields.String,
}
relate_tag_info = {
    "population": fields.String,
    "relate_tag_chr": fields.String,
    "relate_tag_ld_start": fields.String,
    "relate_tag_ld_end": fields.String,
    "d_prime": fields.String,
    "r2": fields.String,
}
ld_info_id = {
    "snp_id": fields.String,
    "snp_chr": fields.String(attribute="chrome"),
    "snp_position": fields.String(attribute="position"),
    "is_tag": fields.String,
    "is_ld": fields.String,
    "location": fields.String,
    "rela_tag": fields.String,
    "relate_tag_pos": fields.String,
}

ld_info = {
    "_id": fields.Nested(ld_info_id),
    "tag_info": fields.Nested(tag_info),
    "relate_tag_info": fields.Nested(relate_tag_info),
    "catalog_info": fields.Nested(catalog_line),
}
ld_info_list = {"ld_list": fields.Nested(ld_info), "ld_item_lenth": fields.Integer}


class LDinfo(Resource):
    @marshal_with(ld_info_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        args = parser.parse_args()
        search_ids = args["search_ids"]
        print(search_ids)
        # condition = {}
        match = {"$match": {"snp_id": search_ids}}
        group = {
            "$group": {
                "_id": {
                    "snp_id": "$snp_id",
                    "chrome": "$chrome",
                    "position": "$position",
                    "is_tag": "$is_tag",
                    "is_ld": "$is_ld",
                    "location": "$location",
                    "rela_tag": "$rela_tag",
                    "relate_tag_pos": "$relate_tag_pos",
                },
                "tag_info": {
                    "$push": {
                        "population": "$population",
                        "ld_start": "$ld_start",
                        "ld_end": "$ld_end",
                    }
                },
                "relate_tag_info": {
                    "$push": {
                        "population": "$population",
                        "relate_tag_chr": "$relate_tag_chr",
                        "relate_tag_ld_start": "$relate_tag_ld_start",
                        "relate_tag_ld_end": "$relate_tag_ld_end",
                        "d_prime": "$d_prime",
                        "r2": "$r2",
                    }
                },
            }
        }
        lookup = {
            "$lookup": {
                "from": "gwas_catalog_alternative",
                "localField": "_id.rela_tag",
                "foreignField": "SNPS",
                "as": "catalog_info",
            }
        }
        pipline = [match, group, lookup]
        print(pipline)
        ld_list = mongo.db.ld_region.aggregate(pipline)
        ld_item_lenth = mongo.db.ld_region.find({"snp_id": search_ids}).count()
        return {"ld_list": list(ld_list), "ld_item_lenth": ld_item_lenth}


api.add_resource(LDinfo, "/api/ldinfo")

disease_pubmed_item = {"disease": fields.String, "pubmed_id": fields.String}

mutation_line = {
    "analysis": fields.Integer,
    "mut_chr": fields.String,
    "mut_position": fields.String,
    "mut_id": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "rela_tag_snp": fields.String,
    "location": fields.String,
    "source": fields.String,
    "gain_count": fields.String,
    "loss_count": fields.String,
    "mature_id": fields.String,
    "gene": fields.String,
    "identifier_lower": fields.String,
    "pre_id": fields.String,
    "energy_change": fields.String,
    "expression_change": fields.String,
    "snp_id": fields.String,
    "disease_pubmed": fields.Nested(disease_pubmed_item),
}

count_group = {"_id": fields.String, "count": fields.Integer}

mutation_summary_list = {
    "mutation_seed_list": fields.Nested(mutation_line),
    "mutation_seed_count": fields.Nested(count_group),
    "mutation_mature_list": fields.Nested(mutation_line),
    "mutation_mature_count": fields.Nested(count_group),
    "mutation_premir_list": fields.Nested(mutation_line),
    "mutation_premir_count": fields.Nested(count_group),
    "mutation_utr3_list": fields.Nested(mutation_line),
    #'mutation_utr3_count':fields.Nested(count_group),
    "mutation_utr3_count": fields.Integer,
    "mutation_summary_list": fields.Nested(mutation_line),
    "mutation_summary_count": fields.Nested(count_group),
}
"""
class MutationSummary(Resource):
    @marshal_with(mutation_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mut_id', type=str)
        parser.add_argument('page')
        #parser.add_argument('chrome')
        #parser.add_argument('location')
        parser.add_argument('resource')
        #parser.add_argument('snp_rela')
        #parser.add_argument('pubmed_id')
        parser.add_argument('histology')
        parser.add_argument('pathology')
        parser.add_argument('gene')
        args = parser.parse_args()
        #print(args['chrome'])
        page=1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        histology_dict={}
        pathology_dict={}
        match_histology={}
        match_pathology={}
        pipline=[]
        if args['page']:
            page=args['page']
            record_skip = (int(page) - 1) * per_page
        if args['gene']:
            condition['identifier_lower']=args['gene'].lower()
        #if args['chrome']!='All' and args['chrome']:
        #    condition['chrome']=args['chrome']
        #if args['location'] != 'All'and args['location']:
        #    condition['location']=args['location']
        if args['resource']!='All' and args['resource']:
            condition['source']=args['resource'].lower()
        if args['histology'] and args['histology'] != 'All':
            histology_dict['disease']={'$regex':args['histology'],'$options':'$i'}
            match_histology={'$match':histology_dict}

        if args['pathology'] and args['pathology']!='All':
            pathology_dict['disease']={'$regex':args['pathology'],'$options':'$i'}
            match_pathology={'$match':pathology_dict}
        if args['mut_id']:
            mut_id=args['mut_id']
            if mut_id.startswith('COS') or re.match('[0-9]*',mut_id):
                condition['mut_id']=args['mut_id']
        #if args['snp_rela']:
        #    condition['snp_rela']=args['snp_rela']
        #if args['pubmed_id']:
        #    condition['pubmed_id']={'$exists':True}
        match_condition={'$match':condition}
        skip={'$skip':record_skip}
        limit={'$limit':per_page}
        count_group={'$group':{'_id':'null','count':{'$sum':1}}}
        if condition:
            pipline.append(match_condition)
        if histology_dict:
            pipline.append(match_histology)
        if pathology_dict:
            pipline.append(match_pathology)

        pipline_count=pipline+[count_group]
        pipline.append(skip)
        pipline.append(limit)
        print("condition:")
        print(condition)
        print("histology:")
        print(histology_dict)
        print("pathology:")
        print(pathology_dict)

        if condition or histology_dict or pathology_dict:
            mutation_summary_list=mongo.db.mutation_summary_addtarget.aggregate(pipline)
        else:
            mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
        mutation_summary_count=mongo.db.mutation_summary_addtarget.aggregate(pipline_count)

        return{'mutation_summary_list':list(mutation_summary_list),'mutation_summary_count':list(mutation_summary_count)}

api.add_resource(MutationSummary,'/api/mutation_summary')
"""
gene_symbol = {"gene_symbol": fields.String, "gene_symbol_lower": fields.String}
gene_list = {
    "gene_list": fields.Nested(gene_symbol),
    "gene_query": fields.Nested(gene_symbol),
}


class GetGene(Resource):
    @marshal_with(gene_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("gene", type=str)
        args = parser.parse_args()
        condition = {}
        accurate_condition = {}
        print(args["gene"])
        if args["gene"]:
            condition["gene_symbol"] = {
                "$regex": args["gene"].lower(),
                "$options": "$i",
            }
            accurate_condition["gene_symbol_lower"] = args["gene"].lower()
            print(accurate_condition)
            gene_list = mongo.db.snp_summary_genelist.find(condition).limit(10)
            gene_query = mongo.db.snp_summary_genelist.find(accurate_condition)
        else:
            gene_list = {}
            gene_query = {}
        return {"gene_list": list(gene_list), "gene_query": list(gene_query)}


api.add_resource(GetGene, "/api/snp_summary_gene")


class MutGetGene(Resource):
    @marshal_with(gene_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("gene", type=str)
        args = parser.parse_args()
        condition = {}
        accurate_condition = {}
        print(args["gene"])
        if args["gene"]:
            condition["gene_symbol"] = {
                "$regex": args["gene"].lower(),
                "$options": "$i",
            }
            accurate_condition["gene_symbol_lower"] = args["gene"].lower()
            print(accurate_condition)
            gene_list = mongo.db.mutation_summary_genelist.find(condition).limit(10)
            gene_query = mongo.db.mutation_summary_genelist.find(accurate_condition)
        else:
            gene_list = {}
            gene_query = {}
        return {"gene_list": list(gene_list), "gene_query": list(gene_query)}


api.add_resource(MutGetGene, "/api/mutation_summary_gene")

phenotype_line = {"phenotype": fields.String}
phenotype_list = {"phenotype_list": fields.Nested(phenotype_line)}


class GetPhenotype(Resource):
    @marshal_with(phenotype_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("phenotype", type=str)
        args = parser.parse_args()
        condition = {}
        # accurate_condition={}
        print(args["phenotype"])
        if args["phenotype"]:
            condition["phenotype"] = {"$regex": args["phenotype"], "$options": "$i"}
            # accurate_condition['gene_symbol_lower']=args['gene'].lower()
            # print(accurate_condition)
            phenotype_list = mongo.db.phenotype_list.find(condition).limit(10)
            # gene_query=mongo.db.mutation_summary_genelist.find(accurate_condition)
        else:
            phenotype_list = {}
            # gene_query={}
        return {"phenotype_list": list(phenotype_list)}


api.add_resource(GetPhenotype, "/api/mutation_summary_phenotype")


class MutationSummarySeed(Resource):
    @marshal_with(mutation_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id", type=str)
        parser.add_argument("page")
        # parser.add_argument('chrome')
        parser.add_argument("location")
        parser.add_argument("resource")
        # parser.add_argument('snp_rela')
        # parser.add_argument('pubmed_id')
        parser.add_argument("histology")
        parser.add_argument("pathology")
        parser.add_argument("gene")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        histology_dict = {}
        pathology_dict = {}
        match_histology = {}
        match_pathology = {}
        pipline = []
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
        if args["gene"]:
            condition["identifier_lower"] = args["gene"].lower()
        # if args['chrome']!='All' and args['chrome']:
        #    condition['chrome']=args['chrome']
        # if args['location'] != 'All'and args['location']:
        #    condition['location']=args['location']
        if args["resource"] != "All" and args["resource"]:
            condition["source"] = args["resource"]
        if args["histology"] and args["histology"] != "All":
            histology_dict["disease_pubmed.disease"] = {
                "$regex": args["histology"],
                "$options": "$i",
            }
            match_histology = {"$match": histology_dict}
        if args["pathology"] and args["pathology"] != "All":
            pathology_dict["disease_pubmed.disease"] = {
                "$regex": args["pathology"],
                "$options": "$i",
            }
            match_pathology = {"$match": pathology_dict}
        if args["mut_id"]:
            # mut_id=args['mut_id']
            # if mut_id.startswith('COS') or re.match('[0-9]*',mut_id):
            condition["mut_id"] = args["mut_id"]
        # if args['snp_rela']:
        #    condition['snp_rela']=args['snp_rela']
        # if args['pubmed_id']:
        #    condition['pubmed_id']={'$exists':True}
        match_condition = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        count_group = {"$group": {"_id": "null", "count": {"$sum": 1}}}
        if condition:
            pipline.append(match_condition)
        if histology_dict:
            pipline.append(match_histology)
        if pathology_dict:
            pipline.append(match_pathology)

        pipline_count = pipline + [count_group]
        pipline.append(skip)
        pipline.append(limit)
        print("search srv seed")
        print(condition)
        print(histology_dict)
        print(pathology_dict)

        # if condition or histology_dict or pathology_dict:
        mutation_seed_list = mongo.db.drv_in_seed_v3_redundancy.aggregate(pipline)
        # else:
        #    mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
        mutation_seed_count = mongo.db.drv_in_seed_v3_redundancy.aggregate(
            pipline_count
        )

        return {
            "mutation_seed_list": list(mutation_seed_list),
            "mutation_seed_count": list(mutation_seed_count),
        }


api.add_resource(MutationSummarySeed, "/api/mutation_summary_seed")


class MutationSummaryMature(Resource):
    @marshal_with(mutation_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id", type=str)
        parser.add_argument("page")
        # parser.add_argument('chrome')
        # parser.add_argument('location')
        parser.add_argument("resource")
        # parser.add_argument('snp_rela')
        # parser.add_argument('pubmed_id')
        parser.add_argument("histology")
        parser.add_argument("pathology")
        parser.add_argument("gene")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        histology_dict = {}
        pathology_dict = {}
        match_histology = {}
        match_pathology = {}
        pipline = []
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
        if args["gene"]:
            condition["identifier_lower"] = args["gene"].lower()
        # if args['chrome']!='All' and args['chrome']:
        #    condition['chrome']=args['chrome']
        # if args['location'] != 'All'and args['location']:
        #    condition['location']=args['location']
        if args["resource"] != "All" and args["resource"]:
            condition["resource"] = args["resource"]
        if args["histology"] and args["histology"] != "All":
            histology_dict["pathology"] = {
                "$regex": args["histology"],
                "$options": "$i",
            }
            match_histology = {"$match": histology_dict}
        if args["pathology"] and args["pathology"] != "All":
            pathology_dict["disease"] = {"$regex": args["pathology"], "$options": "$i"}
            match_pathology = {"$match": pathology_dict}
        if args["mut_id"]:
            # mut_id=args['mut_id']
            # if mut_id.startswith('COS') or re.match('[0-9]*',mut_id):
            condition["mut_id"] = args["mut_id"]
        # if args['snp_rela']:
        #    condition['snp_rela']=args['snp_rela']
        # if args['pubmed_id']:
        #    condition['pubmed_id']={'$exists':True}
        condition["location"] = "Mature"
        match_condition = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        count_group = {"$group": {"_id": "null", "count": {"$sum": 1}}}
        if condition:
            pipline.append(match_condition)
        if histology_dict:
            pipline.append(match_histology)
        if pathology_dict:
            pipline.append(match_pathology)

        pipline_count = pipline + [count_group]
        pipline.append(skip)
        pipline.append(limit)

        print(condition)
        print(histology_dict)
        print(pathology_dict)

        # if condition or histology_dict or pathology_dict:
        mutation_mature_tmp_list = mongo.db.drv_in_premir_v3_redundancy.aggregate(
            pipline
        )
        # else:
        #    mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
        mutation_mature_tmp_count = mongo.db.drv_in_premir_v3_redundancy.aggregate(
            pipline_count
        )

        condition["location"] = "Seed"
        match_condition = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        count_group = {"$group": {"_id": "null", "count": {"$sum": 1}}}
        if condition:
            pipline.append(match_condition)
        if histology_dict:
            pipline.append(match_histology)
        if pathology_dict:
            pipline.append(match_pathology)

        pipline_count = pipline + [count_group]
        pipline.append(skip)
        pipline.append(limit)
        mutation_seed_list = mongo.db.drv_in_premir_v2.aggregate(pipline)
        mutation_seed_count = mongo.db.drv_in_premir_v2.aggregate(pipline_count)

        mutation_mature_list = list(mutation_mature_tmp_list) + list(mutation_seed_list)
        mutation_mature_count = list(mutation_mature_tmp_count) + list(
            mutation_seed_count
        )
        return {
            "mutation_mature_list": list(mutation_mature_list),
            "mutation_mature_count": list(mutation_mature_count),
        }


api.add_resource(MutationSummaryMature, "/api/mutation_summary_mature")


class MutationSummaryPremir(Resource):
    @marshal_with(mutation_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id", type=str)
        parser.add_argument("page")
        # parser.add_argument('chrome')
        # parser.add_argument('location')
        parser.add_argument("resource")
        # parser.add_argument('snp_rela')
        # parser.add_argument('pubmed_id')
        parser.add_argument("histology")
        parser.add_argument("pathology")
        parser.add_argument("gene")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        histology_dict = {}
        pathology_dict = {}
        match_histology = {}
        match_pathology = {}
        # find_gene={}
        pipline = []
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
        if args["gene"]:
            # condition['identifier_lower']=args['gene'].lower()
            condition["$or"] = [
                {"identifier_lower": args["gene"].lower()},
                {"pre_id": args["gene"].lower()},
            ]
        # if args['chrome']!='All' and args['chrome']:
        #    condition['chrome']=args['chrome']
        # if args['location'] != 'All'and args['location']:
        #    condition['location']=args['location']
        if args["resource"] != "All" and args["resource"]:
            condition["source"] = args["resource"]
        if args["histology"] and args["histology"] != "All":
            histology_dict["disease_pubmed.disease"] = {
                "$regex": args["histology"],
                "$options": "$i",
            }
            match_histology = {"$match": histology_dict}
        if args["pathology"] and args["pathology"] != "All":
            pathology_dict["disease_pubmed.disease"] = {
                "$regex": args["pathology"],
                "$options": "$i",
            }
            match_pathology = {"$match": pathology_dict}
        if args["mut_id"]:
            # mut_id=args['mut_id']
            # if mut_id.startswith('COS') or re.match('[0-9]*',mut_id):
            condition["mut_id"] = args["mut_id"]
        # if args['snp_rela']:
        #    condition['snp_rela']=args['snp_rela']
        # if args['pubmed_id']:
        #    condition['pubmed_id']={'$exists':True}
        match_condition = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        count_group = {"$group": {"_id": "null", "count": {"$sum": 1}}}
        if condition:
            pipline.append(match_condition)
        if histology_dict:
            pipline.append(match_histology)
        if pathology_dict:
            pipline.append(match_pathology)

        pipline_count = pipline + [count_group]
        pipline.append(skip)
        pipline.append(limit)

        print(condition)
        print(histology_dict)
        print(pathology_dict)

        # if condition or histology_dict or pathology_dict:
        mutation_premir_list = mongo.db.drv_in_premir_v3_redundancy.aggregate(pipline)
        # else:
        #    mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
        mutation_premir_count = mongo.db.drv_in_premir_v3_redundancy.aggregate(
            pipline_count
        )

        return {
            "mutation_premir_list": list(mutation_premir_list),
            "mutation_premir_count": list(mutation_premir_count),
        }


api.add_resource(MutationSummaryPremir, "/api/mutation_summary_premir")


class MutationSummaryUtr3(Resource):
    @marshal_with(mutation_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mut_id", type=str)
        parser.add_argument("page")
        # parser.add_argument('chrome')
        # parser.add_argument('location')
        parser.add_argument("resource")
        # parser.add_argument('snp_rela')
        # parser.add_argument('pubmed_id')
        parser.add_argument("histology")
        parser.add_argument("pathology")
        parser.add_argument("gene")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        page_condition = {}
        histology_dict = {}
        pathology_dict = {}
        match_histology = {}
        match_pathology = {}
        pipline = []
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
            # page_condition['item_number']={"$gt":record_skip}
        if args["gene"]:
            condition["identifier_lower"] = args["gene"].lower()
        # if args['chrome']!='All' and args['chrome']:
        #    condition['chrome']=args['chrome']
        # if args['location'] != 'All'and args['location']:
        #    condition['location']=args['location']
        if args["resource"] != "All" and args["resource"]:
            condition["source"] = args["resource"]
        if args["histology"] and args["histology"] != "All":
            # histology_dict['disease_pubmed.disease']={'$regex':args['histology'],'$options':'$i'}
            condition["disease_pubmed.disease"] = {
                "$regex": args["histology"],
                "$options": "$i",
            }
            match_histology = {"$match": histology_dict}
        if args["pathology"] and args["pathology"] != "All":
            # pathology_dict['disease_pubmed.disease']={'$regex':args['pathology'],'$options':'$i'}
            condition["disease_pubmed.disease"] = {
                "$regex": args["pathology"],
                "$options": "$i",
            }
            # match_pathology={'$match':pathology_dict}
        if args["mut_id"]:
            # mut_id=args['mut_id']
            # if mut_id.startswith('COS') or re.match('[0-9]*',mut_id):
            condition["mut_id"] = args["mut_id"]
        # if args['snp_rela']:
        #    condition['snp_rela']=args['snp_rela']
        # if args['pubmed_id']:
        #    condition['pubmed_id']={'$exists':True}
        """
        match_condition={'$match':condition}
        #skip={'$skip':record_skip}
        limit={'$limit':per_page}
        skip={'$skip':record_skip}
        count_group={'$group':{'_id':'null','count':{'$sum':1}}}

        if condition:
            pipline.append(match_condition)
        if histology_dict:
            pipline.append(match_histology)
        if pathology_dict:
            pipline.append(match_pathology)

        pipline_count=pipline+[count_group]
        #pipline.append(skip)
        if args['gene'] or (args['resource']!='All' and args['resource']) or (args['pathology'] and args['pathology']!='All') or (args['histology'] and args['histology'] != 'All') or args['mut_id']:
            pipline.append(skip)
        else:
            #pipline.append({'$match':page_condition})
            pipline.append(skip)
        pipline.append(limit)
        print('get mutation summary UTR3')
        print(condition)
        print(histology_dict)
        print(pathology_dict)
        print(pipline)
        #if condition or histology_dict or pathology_dict:
        mutation_utr3_list=mongo.db.drv_in_utr_v3_redundancy.aggregate(pipline)
        #print(list(mutation_utr3_list))
        #else:
        #    mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
        mutation_utr3_count=mongo.db.drv_in_utr_v3_redundancy.aggregate(pipline_count)
       """
        mutation_utr3_list = (
            mongo.db.drv_in_utr_v3_redundancy.find(condition)
            .skip(record_skip)
            .limit(per_page)
        )
        mutation_utr3_count = mongo.db.drv_in_utr_v3_redundancy.find(condition).count()
        return {
            "mutation_utr3_list": list(mutation_utr3_list),
            "mutation_utr3_count": mutation_utr3_count,
        }


api.add_resource(MutationSummaryUtr3, "/api/mutation_summary_utr3")

snp_line = {
    "snp_id": fields.String,
    "snp_chr": fields.String,
    "snp_position": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "curalt": fields.String,
    "ref_freq": fields.String,
    "alt_freq": fields.String,
    "location": fields.String,
    "gene": fields.String,
    "mature_chr": fields.String,
    "mature_start": fields.String,
    "mature_end": fields.String,
    "mature_strand": fields.String,
    "mature_id": fields.String,
    "is_ld": fields.String,
    "gain_count": fields.String,
    "loss_count": fields.String,
    "pre_id": fields.String,
    "energy_change": fields.String,
    "expression_change": fields.String,
    "analysis": fields.Integer,
    "snp_energy": fields.String,
    "wild_energy": fields.String,
}
"""
indel_line={
    'chr':fields.String,
    'position':fields.String,
    'snp_id':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'ref_freq':fields.String,
    'alt_freq':fields.String,
    'transcript_chr':fields.String,
    'trnascript_start':fields.String,
    'transcript_end':fields.String,
    'transcript_strand':fields.String,
    'enst_id':fields.String,
    'ref_seq':fields.String,
    'identifier':fields.String,
    'location':fields.String,
    'identifier_lower':fields.String,
    'mir_chr':fields.String,
    'mir_start':fields.String,
    'mir_end':fields.String,
    'mir_strand':fields.String
}

snp_summary_list={
    'snp_seed_list':fields.Nested(snp_line),
    'snp_seed_count':fields.Integer,
    'snp_mature_list':fields.Nested(snp_line),
    'snp_mature_count':fields.Integer,
    'snp_premir_list':fields.Nested(snp_line),
    'snp_premir_count':fields.Integer,
    'snp_utr3_list':fields.Nested(snp_line),
    'snp_utr3_count':fields.Integer,
    'snp_summary_list':fields.Nested(snp_line),
    'snp_summary_count':fields.Integer,
    'indel_seed_list':fields.Nested(indel_line),
    'indel_seed_count':fields.Integer,
    'indel_premir_list':fields.Nested(indel_line),
    'indel_premir_count':fields.Integer,
    'indel_utr_list':fields.Nested(indel_line),
    'indel_utr_count':fields.Integer

}
"""
snp_summary_list = {
    "snp_seed_list": fields.Nested(snp_line),
    "snp_seed_count": fields.Integer,
    "snp_premir_list": fields.Nested(snp_line),
    "snp_premir_count": fields.Integer,
    "snp_utr3_list": fields.Nested(snp_line),
    "snp_utr3_count": fields.Integer,
    "snp_mature_list": fields.Nested(snp_line),
    "snp_mature_count": fields.Integer,
    "snp_summary_list": fields.Nested(snp_line),
    "snp_summary_count": fields.Integer,
}


class SnpSummary(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        # parser.add_argument('page')
        # parser.add_argument('chrome')
        # parser.add_argument('location')
        parser.add_argument("identifier")
        # parser.add_argument('gmaf')
        # parser.add_argument('ldsnp')
        # parser.add_argument('mutation_rela')
        # parser.add_argument('gene')
        # parser.add_argument('spe_snp_id')
        args = parser.parse_args()
        # print(args['chrome'])
        # page=1
        # per_page = 15
        # record_skip = (int(page)-1)*per_page
        condition = {}
        pipline = []

        # print(args['page'])
        # print(record_skip)
        print(args)
        # if args['page']:
        #    page=args['page']
        #    record_skip = (int(page)-1)*per_page
        # if args['gene']:
        #    condition['identifier_lower']=args['gene'].lower()
        # if args['chrome'] != 'All' and args['chrome']:
        #    condition['snp_chr'] = args['chrome']
        # if args['spe_snp_id']:
        #    condition['snp_id']=args['spe_snp_id']
        if args["snp_id"]:
            # condition['snp_id']={'$regex':args['snp_id'],'$options':'$i'}
            condition["snp_id"] = args["snp_id"]
        if args["identifier"]:
            # condition['identifier']={'$regex':args['identifier'],'$options':'$i'}
            condition["identifier_lower"] = args["identifier"].lower()
        # if args['ldsnp']:
        #    condition['ldsnp']=args['ldsnp']
        # if args['mutation_rela']:
        #    condition['mutation_rela']=args['mutation_rela']
        # if args['gmaf'] !='All' and args['gmaf']:
        #    condition['alt_freq']={'$gt':args['gmaf'][1:]}
        # if args['location']=="All":
        #    condition_utr3=condition
        #    condition_utr3['location']='UTR3'
        #    snp_utr3_list=mongo.db.snp_summary.find(condition_utr3).skip(record_skip).limit(per_page)
        #    snp_utr3_count=mongo.db.snp_summary.find(condition_utr3).count()
        #    condition_seed=condition
        #    condition_seed['location']='mirseed'
        #    snp_seed_list=mongo.db.snp_summary.find(condition_seed).skip(record_skip).limit(per_page)
        #    snp_seed_count=mongo.db.snp_summary.find(condition_seed).count()
        #    condition_mature=condition
        #    condition_mature['location']='mature'
        #    snp_mature_list=mongo.db.snp_summary.find(condition_mature).skip(record_skip).limit(per_page)
        #    snp_mature_count=mongo.db.snp_summary.find(condition_mature).count()
        #    condition_premir=condition
        #    condition_premir['location']='pre-miRNA'
        #    snp_premir_list=mongo.db.snp_summary.find(condition_premir).skip(record_skip).limit(per_page)
        #    snp_premir_count=mongo.db.snp_summary.find(condition_premir).count()

        # elif args['location']=='mirseed':
        #    condition['location']='mirseed'
        #    snp_seed_list=mongo.db.snp_summary.find(condition).skip(record_skip).limit(per_page)
        #    snp_seed_count=mongo.db.snp_summary.find(condition).count()
        # elif args['location']=='mature':
        #    condition['location']='mature'
        #    snp_mature_list=mongo.db.snp_summary.find(condition).skip(record_skip).limit(per_page)
        #    snp_mature_count=mongo.db.snp_summary.find(condition).count()
        # elif args['location']=='pre-miRNA':
        #    condition['location']='pre-miRNA'
        #    snp_premir_list=mongo.db.snp_summary.find(condition).skip(record_skip).limit(per_page)
        #    snp_premir_count=mongo.db.snp_summary.find(condition).count()
        # elif args['location']=='UTR3':
        #    condition['location']='UTR3'
        #    snp_utr3_list=mongo.db.snp_summary.find(condition).skip(record_skip).limit(per_page)
        #    snp_utr3_count=mongo.db.snp_summary.find(condition).count()
        # print(condition)
        # snp_summary_list=mongo.db.snp_summary.find(condition)
        # snp_summary_count=mongo.db.snp_summary.find(condition).count()
        snp_summary_seed = mongo.db.snp_in_seed_v2.find(condition)
        snp_summary_premir = mongo.db.snp_in_premir_v2.find(condition)
        snp_summary_utr3 = mongo.db.snp_in_utr_v2.find(condition)
        snp_summary_seed_count = mongo.db.snp_in_seed_v2.find(condition).count()
        snp_summary_premir_count = mongo.db.snp_in_premir_v2.find(condition).count()
        snp_summary_utr3_count = mongo.db.snp_in_utr_v2.find(condition).count()
        snp_summary_list = (
            list(snp_summary_seed) + list(snp_summary_premir) + list(snp_summary_utr3)
        )
        snp_summary_count = (
            snp_summary_seed_count + snp_summary_premir_count + snp_summary_utr3_count
        )

        return {
            "snp_summary_list": list(snp_summary_list),
            "snp_summary_count": snp_summary_count,
        }


api.add_resource(SnpSummary, "/api/snp_summary")


class SnpSummarySeed(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("page")
        parser.add_argument("chrome")
        parser.add_argument("location")
        parser.add_argument("identifier")
        parser.add_argument("gmaf")
        parser.add_argument("ldsnp")
        parser.add_argument("gene")
        parser.add_argument("spe_snp_id")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        # condition['location']='mirseed'
        pipline = []
        snp_seed_list = {}
        snp_mature_list = {}
        snp_premir_list = {}
        snp_utr3_list = {}
        snp_seed_count = 0
        snp_mature_count = 0
        snp_premir_count = 0
        snp_utr3_count = 0
        print(args["page"])
        print(record_skip)
        print(args)
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
        if args["gene"]:
            condition["identifier_lower"] = args["gene"].lower()
        # if args['chrome'] != 'All' and args['chrome']:
        #    condition['snp_chr'] = args['chrome']
        # if args['spe_snp_id']:
        #    condition['snp_id']=args['spe_snp_id']
        if args["snp_id"]:
            # condition['snp_id']={'$regex':args['snp_id'],'$options':'$i'}
            condition["snp_id"] = args["snp_id"]
        if args["identifier"]:
            # condition['identifier']={'$regex':args['identifier'],'$options':'$i'}
            condition["identifier_lower"] = args["identifier"].lower()
        if args["ldsnp"]:
            condition["is_ld"] = str(args["ldsnp"])
        # if args['mutation_rela']:
        #     condition['mutation_rela']=args['mutation_rela']
        if args["gmaf"] != "All" and args["gmaf"]:
            condition["alt_freq"] = {"$gt": args["gmaf"][1:]}
        match = {"$match": condition}
        skip = {"$skip": record_skip}
        limit = {"$limit": per_page}
        pipline = [match, skip, limit]
        # snp_seed_list=mongo.db.snp_summary_mirseed.aggregate(pipline)
        snp_seed_count = mongo.db.snp_in_seed_v2.find(condition).count()
        snp_seed_list = (
            mongo.db.snp_in_seed_v2.find(condition).skip(record_skip).limit(per_page)
        )

        return {"snp_seed_list": list(snp_seed_list), "snp_seed_count": snp_seed_count}


api.add_resource(SnpSummarySeed, "/api/snp_summary_seed")


class SnpSummaryMature(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("page")
        parser.add_argument("chrome")
        parser.add_argument("location")
        parser.add_argument("identifier")
        parser.add_argument("gmaf")
        parser.add_argument("ldsnp")
        parser.add_argument("mutation_rela")
        parser.add_argument("gene")
        parser.add_argument("spe_snp_id")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        condition["location"] = "mature"
        pipline = []
        snp_seed_list = {}
        snp_mature_list = {}
        snp_premir_list = {}
        snp_utr3_list = {}
        snp_seed_count = 0
        snp_mature_count = 0
        snp_premir_count = 0
        snp_utr3_count = 0
        print(args["page"])
        print(record_skip)
        print(args)
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
        if args["gene"]:
            condition["identifier_lower"] = args["gene"].lower()
        if args["chrome"] != "All" and args["chrome"]:
            condition["snp_chr"] = args["chrome"]
        if args["spe_snp_id"]:
            condition["snp_id"] = args["spe_snp_id"]
        if args["snp_id"]:
            # condition['snp_id']={'$regex':args['snp_id'],'$options':'$i'}
            condition["snp_id"] = args["snp_id"]
        if args["identifier"]:
            # condition['identifier']={'$regex':args['identifier'],'$options':'$i'}
            condition["identifier_lower"] = args["identifier"].lower()
        if args["ldsnp"]:
            condition["id_ld"] = args["ldsnp"]
        if args["mutation_rela"]:
            condition["mutation_rela"] = args["mutation_rela"]
        if args["gmaf"] != "All" and args["gmaf"]:
            condition["alt_freq"] = {"$gt": args["gmaf"][1:]}
        condition["location"] = "Seed"
        snp_seed_count = mongo.db.snp_in_premir_v2.find(condition).count()
        snp_seed_list = (
            mongo.db.snp_in_premir_v2.find(condition).skip(record_skip).limit(per_page)
        )
        condition["location"] = "Mature"
        snp_mature_tmp_list = (
            mongo.db.snp_in_premir_v2.find(condition).skip(record_skip).limit(per_page)
        )
        snp_mature_tmp_count = mongo.db.snp_in_premir_v2.find(condition).count()
        snp_mature_list = list(snp_seed_list) + list(snp_mature_tmp_list)
        snp_mature_count = snp_seed_count + snp_mature_tmp_count
        return {
            "snp_mature_list": list(snp_mature_list),
            "snp_mature_count": snp_mature_count,
        }


api.add_resource(SnpSummaryMature, "/api/snp_summary_mature")


class SnpSummaryPremir(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("page")
        parser.add_argument("chrome")
        parser.add_argument("location")
        parser.add_argument("identifier")
        parser.add_argument("gmaf")
        parser.add_argument("ldsnp")
        parser.add_argument("mutation_rela")
        parser.add_argument("gene")
        parser.add_argument("spe_snp_id")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        pipline = []
        snp_seed_list = {}
        snp_mature_list = {}
        snp_premir_list = {}
        snp_utr3_list = {}
        snp_seed_count = 0
        snp_mature_count = 0
        snp_premir_count = 0
        snp_utr3_count = 0
        print(args)
        print(condition)
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page
        if args["gene"]:
            condition["$or"] = [
                {"identifier_lower": args["gene"].lower()},
                {"pre_id": args["gene"].lower()},
            ]
        # if args['chrome'] != 'All' and args['chrome']:
        #   condition['snp_chr'] = args['chrome']
        if args["spe_snp_id"]:
            condition["snp_id"] = args["spe_snp_id"]
        if args["snp_id"]:
            # condition['snp_id']={'$regex':args['snp_id'],'$options':'$i'}
            condition["snp_id"] = args["snp_id"]
        if args["identifier"]:
            # condition['identifier']={'$regex':args['identifier'],'$options':'$i'}
            condition["identifier_lower"] = args["identifier"].lower()
        if args["ldsnp"]:
            condition["is_ld"] = args["ldsnp"]
        if args["gmaf"] != "All" and args["gmaf"]:
            condition["alt_freq"] = {"$gt": args["gmaf"][1:]}
        print(condition)
        snp_premir_list = (
            mongo.db.snp_in_premir_v2.find(condition).skip(record_skip).limit(per_page)
        )
        snp_premir_count = mongo.db.snp_in_premir_v2.find(condition).count()

        return {
            "snp_premir_list": list(snp_premir_list),
            "snp_premir_count": snp_premir_count,
        }


api.add_resource(SnpSummaryPremir, "/api/snp_summary_premir")


class SnpSummaryUtr3(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("snp_id", type=str)
        parser.add_argument("page")
        parser.add_argument("chrome")
        parser.add_argument("location")
        parser.add_argument("identifier")
        parser.add_argument("gmaf")
        parser.add_argument("ldsnp")
        parser.add_argument("gene")
        parser.add_argument("spe_snp_id")
        args = parser.parse_args()
        # print(args['chrome'])
        page = 1
        per_page = 15
        record_skip = (int(page) - 1) * per_page
        condition = {}
        condition_indel = {}
        # condition['location']='UTR3'
        pipline = []
        snp_seed_list = {}
        snp_mature_list = {}
        snp_premir_list = {}
        snp_utr3_list = {}
        snp_seed_count = 0
        snp_mature_count = 0
        snp_premir_count = 0
        snp_utr3_count = 0
        print(args["page"])
        print(record_skip)
        print(args)
        if args["page"]:
            page = args["page"]
            record_skip = (int(page) - 1) * per_page

        if args["gene"]:
            condition["identifier_lower"] = args["gene"].lower()

        # if args['chrome'] != 'All' and args['chrome']:
        #    condition['snp_chr'] = args['chrome']
        # if args['spe_snp_id']:
        #    condition['snp_id']=args['spe_snp_id']
        if args["snp_id"]:
            # condition['snp_id']={'$regex':args['snp_id'],'$options':'$i'}
            condition["snp_id"] = args["snp_id"]

        if args["identifier"]:
            # condition['identifier']={'$regex':args['identifier'],'$options':'$i'}
            condition["identifier_lower"] = args["identifier"].lower()

        if args["ldsnp"]:
            condition["is_ld"] = args["ldsnp"]
        # if args['mutation_rela']:
        #    condition['mutation_rela']=args['mutation_rela']
        if args["gmaf"] != "All" and args["gmaf"]:
            condition["alt_freq"] = {"$gt": args["gmaf"][1:]}

        if (
            args["gene"]
            or args["snp_id"]
            or args["identifier"]
            or args["ldsnp"]
            or (args["gmaf"] != "All" and args["gmaf"])
        ):
            snp_utr3_list = (
                mongo.db.snp_in_utr_v2.find(condition).skip(record_skip).limit(per_page)
            )
            snp_utr3_count = mongo.db.snp_in_utr_v2.find(condition).count()
        elif int(page) <= 50000:
            snp_utr3_list = (
                mongo.db.snp_in_utr_v2.find(condition).skip(record_skip).limit(per_page)
            )
            snp_utr3_count = mongo.db.snp_in_utr_v2.find(condition).count()
        else:
            condition["item_number"] = {"$gt": str(record_skip)}
            snp_utr3_list = mongo.db.snp_in_utr_v2.find(condition).limit(per_page)
            snp_utr3_count = mongo.db.snp_in_utr_v2.find(condition).count()
        # snp_utr3_list=mongo.db.snp_summary_utr3.aggregate(pipline)
        print(condition)

        return {"snp_utr3_list": list(snp_utr3_list), "snp_utr3_count": snp_utr3_count}


api.add_resource(SnpSummaryUtr3, "/api/snp_summary_utr3")

cosmic_line = {
    "ID_NCV": fields.String,
    "snp_rela": fields.String,
    "Primary_histology": fields.String(attribute="Primary histology"),
    "chrome": fields.String,
    "Mutation_somatic_status": fields.String(attribute="Mutation somatic status"),
    "Primary_site": fields.String(attribute="Primary site"),
    "PUBMED_PMID": fields.String,
    "SNP": fields.String,
    "snp_id": fields.String,
    "position": fields.String,
    "alt": fields.String,
    "ref": fields.String,
    "location": fields.String,
}
cosmic_list = {"cosmic_list": fields.Nested(cosmic_line), "data_length": fields.Integer}


class CosmicInfo(Resource):
    @marshal_with(cosmic_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        parser.add_argument("page")
        args = parser.parse_args()
        search_ids = args["search_ids"]
        page = args["page"]
        per_page = 30
        print(page)
        print(search_ids)
        # skip_records = per_page * (page - 1)
        record_skip = (int(page) - 1) * per_page
        print(search_ids)
        if search_ids == "summary":
            cosmic_list = (
                mongo.db.cosmic_summary.find().skip(record_skip).limit(per_page)
            )
            cosmic_count = mongo.db.cosmic_summary.find().count()
        elif search_ids:
            condition = {"snp_id": search_ids}
            cosmic_list = mongo.db.cosmic_summary.find(condition)
            cosmic_count = mongo.db.cosmic_summary.find(condition).count()
        else:
            cosmic_list = {}
            cosmic_count = 0
        return {"cosmic_list": list(cosmic_list), "data_length": cosmic_count}


api.add_resource(CosmicInfo, "/api/cosmicinfo")

clinvar_line = {
    "chrome": fields.String,
    "position": fields.String,
    "clinvar_id": fields.String,
    "disease": fields.String,
    "snp_rela": fields.String,
    "snp_id": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "location": fields.String,
}
clinvar_list = {
    "clinvar_list": fields.Nested(clinvar_line),
    "data_length": fields.Integer,
}


class ClinvarInfo(Resource):
    @marshal_with(clinvar_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("search_ids", type=str)
        parser.add_argument("page")
        args = parser.parse_args()
        search_ids = args["search_ids"]
        per_page = 15
        page = args["page"]
        skip_records = (int(page) - 1) * per_page
        if search_ids == "summary":
            clinvar_list = (
                mongo.db.clinvar_summary.find().skip(skip_records).limit(per_page)
            )
            clinvar_count = mongo.db.clinvar_summary.find().count()
        elif search_ids:
            condition = {"snp_id": search_ids}
            clinvar_list = mongo.db.clinvar_summary.find(condition)
            clinvar_count = mongo.db.clinvar_summary.find(condition).count()
        else:
            clinvar_list = {}
            clinvar_count = 0
        return {"clinvar_list": list(clinvar_list), "data_length": clinvar_count}


api.add_resource(ClinvarInfo, "/api/clinvarinfo")

csv_table = {
    "op": fields.String(attribute="ONTOLOGY_pathway"),
    "id": fields.String(attribute="ID"),
    "description": fields.String(attribute="Description"),
    "gene_ratio": fields.String(attribute="GeneRatio"),
    "bg_ratio": fields.String(attribute="BgRatio"),
    "pvalue": fields.String,
    "padjust": fields.String,
    "qvalue": fields.String,
    "gene_id": fields.String(attribute="geneID"),
    "gene_count": fields.String(attribute="Count"),
    "csv_file": fields.String,
}

enrich_line = {
    "mirna_id": fields.String,
    "variation_id": fields.String,
    "alt": fields.String,
    "ref": fields.String,
    "enrich_type": fields.String,
    "effect": fields.String,
    "csv_file": fields.String,
    "dot_file": fields.String,
    "csv_table": fields.Nested(csv_table),
    "go_pathway_count": fields.String,
}

enrich_result_list = {
    "enrich_result_list": fields.Nested(enrich_line),
    "enrich_result_count": fields.Integer,
}


class EnrichResult(Resource):
    @marshal_with(enrich_result_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mirna_id", type=str)
        parser.add_argument("variate_id")
        args = parser.parse_args()
        condition = {}
        search = 0
        if args["mirna_id"]:
            search = 1
            condition["mirna_id"] = args["mirna_id"]
            match = {"$match": {"mirna_id": args["mirna_id"]}}
        if args["variate_id"]:
            search = 1
            condition["variation_id"] = args["variate_id"]
            match["$match"]["variation_id"] = args["variate_id"]
        lookup_csv = {
            "$lookup": {
                "from": "enrichment_csv_v2",
                "localField": "csv_file",
                "foreignField": "csv_file",
                "as": "csv_table",
            }
        }
        if search:
            pipline = [match, lookup_csv]
            enrich_result_list = mongo.db.enrichment_summary_v2.aggregate(pipline)
            enrich_result_count = mongo.db.enrichment_summary_v2.find(condition).count()
        else:
            enrich_result_list = {}
            enrich_result_count = 0
        return {
            "enrich_result_list": list(enrich_result_list),
            "enrich_result_count": enrich_result_count,
        }


api.add_resource(EnrichResult, "/api/enrich_result")

var_item = {
    "var_id": fields.String,
    "ref": fields.String,
    "alt": fields.String,
    "color": fields.String,
    "count": fields.Integer,
}

snp_distribute = {
    "base": fields.String,
    "pos": fields.Integer,
    "var_list": fields.Nested(var_item),
    "mature_id": fields.String,
}

snp_distribute_list = {
    "snp_distribute_list": fields.Nested(snp_distribute),
    "snp_distribute_count": fields.Integer,
}


class SnpDistribute(Resource):
    @marshal_with(snp_distribute_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("mirna_id", type=str)
        args = parser.parse_args()
        condition = {}
        if args["mirna_id"]:
            condition["mature_id"] = args["mirna_id"]
            snp_distribute_list = mongo.db.variation_distribute_deduplicate.find(
                condition
            )
            snp_distribute_count = mongo.db.variation_distribute_deduplicate.find(
                condition
            ).count()
        else:
            snp_distribute_list = []
            snp_distribute_count = 0
        return {
            "snp_distribute_list": list(snp_distribute_list),
            "snp_distribute_count": snp_distribute_count,
        }


api.add_resource(SnpDistribute, "/api/snp_distribute")


class BIGDIndexBS(Resource):
    def get(self):
        filepath_indexbs = "index.bs"
        return send_file(filepath_indexbs, mimetype="text/plain")


api.add_resource(BIGDIndexBS, "/index.bs")


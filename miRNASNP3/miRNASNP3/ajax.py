import flask_restful

import re
from miRNASNP3 import app, api
from miRNASNP3.core import mongo

from flask_restful import Resource, fields, marshal_with, reqparse, marshal

mirna_exp_df={
    'ACC':fields.String,
    'DLBC':fields.String,
    'READ':fields.String,
    'GBM':fields.String,
    'LGG':fields.String,
    'THCA':fields.String,
    'STAD':fields.String,
    'UCEC':fields.String,
    'PCPG':fields.String,
    'CESC':fields.String,
    'UCS':fields.String,
    'TGCT':fields.String,
    'LIHC':fields.String,
    'CHOL':fields.String,
    'HNSC':fields.String,
    'UVM':fields.String,
    'SKCM':fields.String,
    'COAD':fields.String,
    'PAAD':fields.String,
    'THYM':fields.String,
    'LUSC':fields.String,
    'MESO':fields.String,
    'OV':fields.String,
    'ESCA':fields.String,
    'SARC':fields.String,
    'KIRP':fields.String,
    'BLCA':fields.String,
    'PRAD':fields.String,
    'LUAD':fields.String,
    'BRCA':fields.String,
    'KIRC':fields.String,
    'KICH':fields.String
}
mirna_expression={
    'exp_df':fields.Nested(mirna_exp_df),
    'exp_mean':fields.String,
    'mir_id':fields.String
}
mirna_expression_list={
    'mirna_expression_list':fields.Nested(mirna_expression),
    'mirna_expression_count':fields.Integer
}

class MirExpression(Resource):
    @marshal_with(mirna_expression_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mirna_id', type=str)
        args = parser.parse_args()
        mirna_id = args['mirna_id']
        condition = {}
        if mirna_id:
            condition['mir_id']=mirna_id
            mirna_expression_list=mongo.db.mirna_expression.find(condition)
            mirna_expression_count=mongo.db.mirna_expression.find(condition).count()
        else:
            mirna_expression_list={}
            mirna_expression_count=0
        return{'mirna_expression_list':list(mirna_expression_list),'mirna_expression_count':mirna_expression_count}
api.add_resource(MirExpression,'/api/mirna_expression')

site_info={
    'align_1':fields.String,
    'align_2':fields.String,
    'align_3':fields.String,
    'align_4':fields.String,
    'align_5':fields.String,
    'align6':fields.String,
    'align7':fields.String,
    'align8':fields.String,
    'mm_start':fields.String,
    'mm_end':fields.String,
    'tgs_start':fields.String,
    'tgs_end':fields.String,
    'tgs_score':fields.String,
    'dg_duplex':fields.String,
    'dg_binding':fields.String,
    'dg_open':fields.String,
    'tgs_au':fields.String,
    'prob_exac':fields.String(attribute='prob_exac'),
    'chrome':fields.String,
}
snp_info={
    'distance':fields.String,
    'chr':fields.String,
    'position':fields.String,
    'snp_id':fields.String,
    'alt':fields.String,
    'ref':fields.String,
    'curalt':fields.String,
}
gene_exp_df={
    'ACC':fields.String,
    'DLBC':fields.String,
    'READ':fields.String,
    'GBM':fields.String,
    'LGG':fields.String,
    'THCA':fields.String,
    'STAD':fields.String,
    'UCEC':fields.String,
    'PCPG':fields.String,
    'CESC':fields.String,
    'UCS':fields.String,
    'TGCT':fields.String,
    'LIHC':fields.String,
    'CHOL':fields.String,
    'HNSC':fields.String,
    'UVM':fields.String,
    'SKCM':fields.String,
    'COAD':fields.String,
    'PAAD':fields.String,
    'THYM':fields.String,
    'LUSC':fields.String,
    'MESO':fields.String,
    'OV':fields.String,
    'ESCA':fields.String,
    'SARC':fields.String,
    'KIRP':fields.String,
    'BLCA':fields.String,
    'PRAD':fields.String,
    'LUAD':fields.String,
    'BRCA':fields.String,
    'KIRC':fields.String,
    'KICH':fields.String
}
gene_expression={
    'exp_df':fields.Nested(gene_exp_df),
    'exp_mean':fields.String,
    'symbol':fields.String
}
utr_info={
    'acc':fields.String,
    'position':fields.String,
    'enst_id':fields.String,
    'gene_symbol':fields.String
}
gainsite_info={
    'snp_id':fields.String,
    'mir_seedstart':fields.String,
    'strand':fields.String,
    'mir_seedchr':fields.String,
    'mir_seedend':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'snp_info':fields.Nested(snp_info),
    'site_info':fields.Nested(site_info),
    'utr_info':fields.Nested(utr_info),
    'gene_expression':fields.Nested(gene_expression),
    'mirna_expression':fields.Nested(mirna_expression),
    'cor_key':fields.String
}
snp_seed_gain={
   'snp_seed_gain_list':fields.Nested(gainsite_info),
    'snp_seed_gain_count':fields.Integer
}

class SnpSeedGain(Resource):
    @marshal_with(snp_seed_gain)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('snp_id', type=str)
        parser.add_argument('mirna_id')
        parser.add_argument('gene')
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        print(args['mirna_id'])
        page = args['page']
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        pipline=[]
        print(args['mirna_id'])
        if args['snp_id']:
            condition['snp_id']=args['snp_id']
        if args['mirna_id']:
            condition['mirna_id']=args['mirna_id']
        if args['gene']:
            condition['gene_symbol']={'$regex':args['gene'],'$options':'$i'}
        lookup_gene={'$lookup':{
            'from':'gene_expression',
            'localField':'gene_symbol',
            'foreignField':'symbol',
            'as':'gene_expression'
        }}
        lookup_mirna={'$lookup':{
            'from':'mirna_expression',
            'localField':'mirna_id',
            'foreignField':'mir_id',
            'as':'mirna_expression'

        }}
        match={'$match':condition}
        skip={'$skip':record_skip}
        limit={'$limit':per_page}
        pipline=[match,skip,limit,lookup_gene,lookup_mirna]
        snp_seed_gain_list=mongo.db.seed_gain_4666.aggregate(pipline)
        snp_seed_gain_count=mongo.db.seed_gain_4666.find(condition).count()
        return {'snp_seed_gain_list':list(snp_seed_gain_list),
                'snp_seed_gain_count':snp_seed_gain_count}

api.add_resource(SnpSeedGain,'/api/snp_seed_gain')

cor_df={
    'ACC':fields.String,
    'BLCA':fields.String,
    'BRCA':fields.String,
    'CESC':fields.String,
    'CHOL':fields.String,
    'COAD':fields.String,
    'DLBC':fields.String,
    'ESCA':fields.String,
    'GBM':fields.String,
    'HNSC':fields.String,
    'KICH':fields.String,
    'KIRC':fields.String,
    'KIRP':fields.String,
    'LGG':fields.String,
    'LIHC':fields.String,
    'LUAD':fields.String,
    'LUSC':fields.String,
    'MESO':fields.String,
    'OV':fields.String,
    'PAAD':fields.String,
    'PCPG':fields.String,
    'PRAD':fields.String,
    'READ':fields.String,
    'SARC':fields.String,
    'SKCM':fields.String,
    'STAD':fields.String,
    'TGCT':fields.String,
    'THCA':fields.String,
    'THYM':fields.String,
    'UCEC':fields.String,
    'UCS':fields.String,
    'UVM':fields.String,
}

corelation_detail={
    'cor_df':fields.Nested(cor_df),
    'mir_gene':fields.String
}

losssite_info={
    'snp_id':fields.String,
    'mir_seedstart':fields.String,
    'strand':fields.String,
    'mir_seedchr':fields.String,
    'mir_seedend':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'cor_key':fields.String,
    'expr_corelation':fields.String,
    'experiment_valid':fields.Integer,
    'snp_info':fields.Nested(snp_info),
    'site_info':fields.Nested(site_info),
    'utr_info':fields.Nested(utr_info),
    'gene_expression':fields.Nested(gene_expression),
    'mirna_expression':fields.Nested(mirna_expression),
    'corelation_detail':fields.Nested(corelation_detail)
}

snp_seed_loss_list={
    'snp_seed_loss_list':fields.Nested(losssite_info),
    'snp_seed_loss_count':fields.Integer,
}

class SnpSeedLoss(Resource):
    @marshal_with(snp_seed_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('snp_id', type=str)
        parser.add_argument('mirna_id')
        parser.add_argument('gene')
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        page = args['page']
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        print(args['mirna_id'])
        if args['snp_id']:
            condition['snp_id']=args['snp_id']
        if args['mirna_id']:
            condition['mirna_id']=args['mirna_id']
        if args['gene']:
            condition['gene_symbol']={'$regex':args['gene'],'$options':'$i'}
        lookup_gene = {'$lookup': {
            'from': 'gene_expression',
            'localField': 'gene_symbol',
            'foreignField': 'symbol',
            'as': 'gene_expression'
        }}
        lookup_mirna = {'$lookup': {
            'from': 'mirna_expression',
            'localField': 'mirna_id',
            'foreignField': 'mir_id',
            'as': 'mirna_expression'

        }}
        lookup_corelation= {'$lookup':{
            'from':'corelation_cancer_detail',
            'localField':'cor_key',
            'foreignField':'mir_gene',
            'as':'corelation_detail'
        }}
        match = {'$match': condition}
        skip = {'$skip': record_skip}
        limit = {'$limit': per_page}
        pipline = [match, skip, limit, lookup_gene,lookup_mirna,lookup_corelation]
        snp_seed_loss_list = mongo.db.seed_loss_4666.aggregate(pipline)
        snp_seed_loss_count = mongo.db.seed_loss_4666.find(condition).count()
        return {'snp_seed_loss_list': list(snp_seed_loss_list),
                'snp_seed_loss_count': snp_seed_loss_count}

api.add_resource(SnpSeedLoss,'/api/snp_seed_loss')

mut_info={
    'distance':fields.String,
    'chr':fields.String,
    'position':fields.String,
    'mut_id':fields.String,
    'alt':fields.String,
    'ref':fields.String,
    'curalt':fields.String(attribute="alt")
}

mut_gainsite_info={
    'mut_id':fields.String,
    'mir_seedstart':fields.String,
    'strand':fields.String,
    'mir_seedchr':fields.String,
    'mir_seedend':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'mut_info':fields.Nested(mut_info),
    'site_info':fields.Nested(site_info),
    'utr_info':fields.Nested(utr_info),
    'gene_expression':fields.Nested(gene_expression)
}
mut_seed_gain_list={
    'mut_seed_gain_list':fields.Nested(mut_gainsite_info),
    'mut_seed_gain_count':fields.Integer,
}

class MutSeedGain(Resource):
    @marshal_with(mut_seed_gain_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mirna_id', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        mirna_id = args['mirna_id']
        page = args['page']
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        if args['mirna_id']:
            condition['mirna_id']=mirna_id
        match={'$match':condition}
        print("mut_seed_gain")
        print(condition)
        lookup = {'$lookup': {
            'from': 'gene_expression',
            'localField': 'gene_symbol',
            'foreignField': 'symbol',
            'as': 'gene_expression'
        }}
        skip={'$skip':record_skip}
        limit={'$limit':per_page}

        pipline=[match,skip,limit,lookup]
        mut_seed_gain_list=mongo.db.seed_cosmic_gain.aggregate(pipline)
        mut_seed_gain_count=mongo.db.seed_cosmic_gain.find(condition).count()
        print(mut_seed_gain_count)
        return {'mut_seed_gain_list':list(mut_seed_gain_list),
                'mut_seed_gain_count':mut_seed_gain_count}

api.add_resource(MutSeedGain,'/api/mut_seed_gain')


mut_losssite_info={
    'mut_id':fields.String,
    'mir_seedstart':fields.String,
    'strand':fields.String,
    'mir_seedchr':fields.String,
    'mir_seedend':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'cor_key':fields.String,
    'expr_corelation':fields.String,
    'experiment_valid':fields.Integer,
    'mut_info':fields.Nested(mut_info),
    'site_info':fields.Nested(site_info),
    'utr_info':fields.Nested(utr_info),
    'gene_expression':fields.Nested(gene_expression),
    'mirna_expression':fields.Nested(mirna_expression),
    'corelation_detail':fields.Nested(corelation_detail)
}

mut_seed_loss_list={
    'mut_seed_loss_list':fields.Nested(mut_losssite_info),
    'mut_seed_loss_count':fields.Integer,
}

class MutSeedLoss(Resource):
    @marshal_with(mut_seed_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mirna_id', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        mirna_id = args['mirna_id']
        page = args['page']
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        if args['mirna_id']:
            condition['mirna_id']=mirna_id
        match={'$match':condition}
        print("mut_seed_loss")
        print(condition)
        lookup_gene = {'$lookup': {
            'from': 'gene_expression',
            'localField': 'gene_symbol',
            'foreignField': 'symbol',
            'as': 'gene_expression'
        }}
        lookup_corelation= {'$lookup':{
            'from':'corelation_cancer_detail',
            'localField':'cor_key',
            'foreignField':'mir_gene',
            'as':'corelation_detail'
        }}
        skip={'$skip':record_skip}
        limit={'$limit':per_page}

        pipline=[match,skip,limit,lookup_gene,lookup_corelation]
        mut_seed_loss_list=mongo.db.seed_cosmic_loss.aggregate(pipline)
        mut_seed_loss_count=mongo.db.seed_cosmic_loss.find(condition).count()
        print(mut_seed_loss_count)
        return {'mut_seed_loss_list':list(mut_seed_loss_list),
                'mut_seed_loss_count':mut_seed_loss_count}

api.add_resource(MutSeedLoss,'/api/mut_seed_loss')

utr_site_info={
    'chrome':fields.String,
    'mm_start':fields.String,
    'mm_end':fields.String,
    'tgs_start':fields.String,
    'tgs_end':fields.String,
    'dg_duplex':fields.String,
    'dg_binding':fields.String,
    'dg_open':fields.String,
    'tgs_au':fields.String,
    'tgs_score':fields.String,
    'prob_exac':fields.String,
    'align_1':fields.String,
    'align_2':fields.String,
    'align_3':fields.String,
    'align_4':fields.String,
    'align_5':fields.String,
    'align6':fields.String,
    'align7':fields.String,
    'align8':fields.String,
    'truncate_start':fields.String,
    'truncate_end':fields.String,
}
snp_info_line={
    'distance': fields.String,
    'distance_align': fields.String,
    'chr':fields.String,
    'position':fields.String,
    'snp_id':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'curalt':fields.String,
}
utr_info_line={
    'gene_symbol':fields.String,
    'position':fields.String,
    'enst_id':fields.String,
    'acc':fields.String,
    'chr':fields.String,
    'end':fields.String,
    'start':fields.String,
    'strand':fields.String
}
snv_utr_loss={
    'snp_id':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'experiment_valid':fields.Integer,
    'expr_corelation':fields.String,
    'snp_info':fields.Nested(snp_info_line),
    'utr_info':fields.Nested(utr_info_line),
    'site_info':fields.Nested(utr_site_info),
    'gene_expression': fields.Nested(gene_expression),
    'mirna_expression': fields.Nested(mirna_expression),
    'corelation_detail':fields.Nested(corelation_detail)
}
snv_utr_loss_list={
    'snv_utr_loss_list':fields.Nested(snv_utr_loss),
    'snv_utr_loss_count':fields.Integer
}

class SnvUtrLoss(Resource):
    @marshal_with(snv_utr_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('snp_id', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        snp_id = args['snp_id']
        page = args['page']
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        if snp_id:
            condition['snp_id']=snp_id
        lookup_gene = {'$lookup': {
                'from': 'gene_expression',
                'localField': 'gene_symbol',
                'foreignField': 'symbol',
                'as': 'gene_expression'
            }}
        lookup_mirna = {'$lookup': {
                'from': 'mirna_expression',
                'localField': 'mirna_id',
                'foreignField': 'mir_id',
                'as': 'mirna_expression'
            }}
        lookup_corelation= {'$lookup':{
            'from':'corelation_cancer_detail',
            'localField':'cor_key',
            'foreignField':'mir_gene',
            'as':'corelation_detail'
        }}
        print(condition)
        match = {'$match': condition}
        skip = {'$skip': record_skip}
        limit = {'$limit': per_page}
        pipline = [match, skip, limit, lookup_gene, lookup_mirna,lookup_corelation]
        snv_utr_loss_list=mongo.db.snv_utr_loss.aggregate(pipline)
        snv_utr_loss_count=mongo.db.snv_utr_loss.find(condition).count()
        return {'snv_utr_loss_list':list(snv_utr_loss_list),'snv_utr_loss_count':snv_utr_loss_count}

api.add_resource(SnvUtrLoss,'/api/snv_utr_loss')

snv_utr_gain={
    'snp_id':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'snp_info':fields.Nested(snp_info_line),
    'utr_info':fields.Nested(utr_info_line),
    'site_info':fields.Nested(utr_site_info),
    'gene_expression': fields.Nested(gene_expression),
    'mirna_expression': fields.Nested(mirna_expression)
}
    
snv_utr_gain_list={
    'snv_utr_gain_list':fields.Nested(snv_utr_gain),
    'snv_utr_gain_count':fields.Integer
}

class SnvUtrGain(Resource):
    @marshal_with(snv_utr_gain_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('snp_id', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        snp_id = args['snp_id']
        page = args['page']
        per_page = 15
        record_skip = (page - 1) * per_page
        condition = {}
        if snp_id:
            condition['snp_id']=snp_id
        lookup_gene = {'$lookup': {
                'from': 'gene_expression',
                'localField': 'gene_symbol',
                'foreignField': 'symbol',
                'as': 'gene_expression'
            }}
        lookup_mirna = {'$lookup': {
                'from': 'mirna_expression',
                'localField': 'mirna_id',
                'foreignField': 'mir_id',
                'as': 'mirna_expression'
            }}
        match = {'$match': condition}
        skip = {'$skip': record_skip}
        limit = {'$limit': per_page}
        print(condition)
        pipline = [match, skip, limit, lookup_gene, lookup_mirna]
        snv_utr_gain_list=mongo.db.snv_utr_gain.aggregate(pipline)
        snv_utr_gain_count=mongo.db.snv_utr_gain.find(condition).count()
        return {'snv_utr_gain_list':list(snv_utr_gain_list),'snv_utr_gain_count':snv_utr_gain_count}

api.add_resource(SnvUtrGain,'/api/snv_utr_gain')

browse_info = {
    'mir_id':fields.String,
    'mir_acc':fields.String,
    'mir_chr':fields.String,
    'mir_start':fields.String,
    'mir_end':fields.String,
    'mir_strand':fields.String,
    'location':fields.String,
    'count_snp':fields.Integer,
    'snp_info':fields.String,
    'count_nutation':fields.Integer,
    'mutation_info':fields.String
}

browse_list = {
    'browse_list':fields.List(fields.Nested(browse_info))
}

class BrowseMir(Resource):
    @marshal_with(browse_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('chr',type=str)
        parser.add_argument('page', type=int, default=1)
        parser.add_argument('per_page', type=int, default=30)
        args = parser.parse_args()
        page = args['page']
        per_page = args['per_page']
        chrome = args['chr']
        record_skip = (page - 1) * per_page
        condition = {}
        browse_list = []
        if chrome:
            condition = {'mir_chr':chrome}
        browse_list = mongo.db.browseY.find(condition).skip(record_skip).limit(per_page)
        return {'browse_list':list(browse_list)}

api.add_resource(BrowseMir,'/api/browsemir')

mir_summary = {
    'mir_id':fields.String,
    'mir_acc':fields.String,
    'mir_chr':fields.String,
    'mir_start':fields.String,
    'mir_end':fields.String,
    'mir_strand':fields.String,
    'matureSeq':fields.String,
    'pre_id':fields.String,
    'pre_acc':fields.String,
    'pre_chr':fields.String,
    'pre_start':fields.String,
    'pre_end':fields.String,
    'harpin_seq':fields.String,
    'snp_in_seed':fields.String,
    'snp_in_matue':fields.String,
    'cosmic_in_seed':fields.String,
    'cosmic_in_matue':fields.String,
    'clinvar_in_seed':fields.String,
    'clinvar_in_matue':fields.String,
    'snv_in_pri':fields.String,
    'cosmic_in_pri':fields.String,
    'clinvar_in_pri':fields.String,
    'pre_strand':fields.String,
}

mirna_summary_list = {
    'mirna_summary_list':fields.Nested(mir_summary),
    'mirna_summary_count':fields.Integer
}

class MirSummary(Resource):
    @marshal_with(mirna_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('page', type=int, default=1)
        parser.add_argument('chrome',type=str)
        parser.add_argument('mirna_id')
        args = parser.parse_args()
        page = args['page']
        chrome=args['chrome']
        mirna_id=args['mirna_id']
        per_page=15
        record_skip = (page - 1) * per_page
        print(mirna_id)
        condition={}
        if chrome!="All":
            condition['mir_chr']=chrome
        if mirna_id:
            condition['mir_id']={'$regex':mirna_id,'$options':'$1'}
        mirna_summary_list = mongo.db.mirna_summary.find(condition).skip(record_skip).limit(per_page)
        mirna_summary_count=mongo.db.mirna_summary.find(condition).count()
        return {'mirna_summary_list':list(mirna_summary_list),
                'mirna_summary_count':mirna_summary_count}

api.add_resource(MirSummary,'/api/mirna_summary')

class MirInfo(Resource):
    @marshal_with(mirna_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        condition = {}
        print(search_ids)
        if search_ids:
            condition = {'mir_id':search_ids}
            mirna_summary_list = mongo.db.pri_mir_summary.find(condition)
            mirna_summary_count=mongo.db.pri_mir_summary.find(condition).count()
        else:
            mirna_summary_list={}
            mirna_summary_count=0
        return {'mirna_summary_list':list(mirna_summary_list),
                'mirna_summary_count':mirna_summary_count}

api.add_resource(MirInfo,'/api/mirinfo')

mirna_key_list={
    'mirna_key_list':fields.Nested(mir_summary)
}

class MirnaKey(Resource):
    @marshal_with(mirna_key_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mirna_id', type=str)
        args = parser.parse_args()
        mirna_id = args['mirna_id']
        condition = {}
        if mirna_id:
            condition['mir_id']={'$regex':mirna_id,'$options':'$i'}
            print(condition)
            mirna_key_list = mongo.db.pri_mir_summary.find(condition)
        else:
            mirna_key_list = {}
        return {'mirna_key_list':list(mirna_key_list)}
api.add_resource(MirnaKey,'/api/mirna_key')

pri_id={
    'pre_id':fields.String,
    'pre_chr':fields.String,
    'pre_acc':fields.String,
    'pre_start':fields.String,
    'pre_end':fields.String,
    'pre_strand':fields.String,
    'snv_in_pri':fields.String,
    'cosmic_in_pri':fields.String,
    'clinvar_in_pri':fields.String,
}

mature_info={
    'mir_id':fields.String,
    'mir_acc':fields.String
}
pri_count={
    '_id':fields.String,
    'count':fields.String
}

primir_summary={
    '_id':fields.Nested(pri_id),
    'mature_info':fields.Nested(mature_info)
}
primir_summary_list={
    'primir_summary_list':fields.Nested(primir_summary),
    'primir_summary_count':fields.Nested(pri_count)
}

class PrimirSummary(Resource):
    @marshal_with(primir_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('page', type=int, default=1)
        parser.add_argument('chrome', type=str)
        parser.add_argument('pre_id')
        args = parser.parse_args()
        page = args['page']
        chrome = args['chrome']
        pre_id = args['pre_id']
        per_page = 15
        record_skip = (page - 1) * per_page
        print(page)
        pipline = []
        if chrome!="All":
            match_chr={'$match':{
                'pre_chr':chrome
            }}
            pipline.append(match_chr)
        if pre_id:
            match_mir = {'$match': {
                'pre_id': {'$regex':pre_id,'$options':'$1'}
            }}
            pipline.append(match_mir)
        group={'$group':{
            '_id':{
                'pre_id':'$pre_id',
                'pre_acc':'$pre_acc',
                'pre_chr':'$pre_chr',
                'pre_start':'$pre_start',
                'pre_end':'$pre_end',
                'pre_strand':'$pre_strand',
                'snv_in_pri':'$snv_in_pri',
                'cosmic_in_pri':'$cosmic_in_pri',
                'clinvar_in_pri':'$clinvar_in_pri'
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
        limit = {'$limit': per_page}
        skip = {'$skip': record_skip}
        piplines = pipline+[group, skip, limit]
        pip_sum=pipline+[group,group_sum]
        primir_summary_list = mongo.db.pri_mir_summary.aggregate(piplines)
        primir_summary_count = mongo.db.pri_mir_summary.aggregate(pip_sum)
        #print(pip_sum)
        #print(pipline)
        return {'primir_summary_list': list(primir_summary_list),'primir_summary_count':list(primir_summary_count)}

api.add_resource(PrimirSummary, '/api/primir_summary')

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

premir_info={
    'pre_id':fields.String,
    'cluster10k_id':fields.String,
    'cluster5k_id':fields.String,
    'sequence':fields.String,
    'dotfold':fields.String,
    'cosmic':fields.List(fields.String),
    'clinvar':fields.List(fields.String),
    'snv':fields.List(fields.String),
    'resouce':fields.String,
    'mfe':fields.String,
    'host_gene':fields.String,
    'cluster10k':fields.Nested(mir_cluster10k),
    'cluster5k':fields.Nested(mir_cluster5k),
    'mirinfo':fields.Nested(mir_summary),
    'mature_position':fields.List(fields.List(fields.String))
}
premir_info_list={
    'premir_info':fields.Nested(premir_info)
}

class PremirInfo(Resource):
    @marshal_with(premir_info_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        condition = {}
        print(search_ids)
        if search_ids:
            match={'$match':{
                'pre_id':search_ids
            }}
            lookup_cluster10k={'$lookup':{
                'from':'primir_cluster_advanced',
                'localField':'cluster10k_id',
                'foreignField':'cluster10k_id',
                'as':'cluster10k'
            }}
            lookup_cluster5k={'$lookup':{
                'from':'primir_cluster_advanced',
                'localField':'cluster5k_id',
                'foreignField':'cluster5k_id',
                'as':'cluster5k'
            }}
            lookup_mirinfo={'$lookup':{
                'from':'pri_mir_summary',
                'localField':'pre_id',
                'foreignField':'pre_id',
                'as':'mirinfo'
            }}
            pipline=[match,lookup_cluster5k,lookup_cluster10k,lookup_mirinfo]
            premir_info=mongo.db.premir_info.aggregate(pipline)
        else:
            premir_info={}
        return {'premir_info':list(premir_info)}

api.add_resource(PremirInfo,'/api/premir_info')

pri_alt={
    'pre_id':fields.String,
    'pre_start':fields.String,
    'pre_end':fields.String,
    'snp_id':fields.String,
    'snp_chr':fields.String,
    'snp_position':fields.String,
    'ref':fields.String,
    'snp_ref_freq':fields.String,
    'alt':fields.String(attribute='snp_alt'),
    'snp_alt_freq':fields.String,
    'curalt':fields.String,
    'pre_altseq':fields.String,
    'dotfold':fields.String,
    'mfe':fields.String,
    'pre_strand':fields.String,
    'pre_acc':fields.String,
    'rela_loc':fields.String
}

primir_alt_list={
    'primir_alt_list':fields.Nested(pri_alt),
    'primir_alt_count':fields.Integer
}

class PrimirAlt(Resource):
    @marshal_with(primir_alt_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        condition = {}
        print(search_ids)
        if search_ids:
            condition['snp_id']=search_ids
            primir_alt_list=mongo.db.primary_altseq.find(condition)
            primir_alt_count=mongo.db.primary_altseq.find(condition).count()
        else:
            primir_alt_list={}
            primit_alt_count=0

        return{'primir_alt_list':list(primir_alt_list),'primir_alt_count':primir_alt_count}
api.add_resource(PrimirAlt,'/api/primir_altseq')

primir_mut={
    'pre_id':fields.String,
    'pre_start':fields.String,
    'pre_end':fields.String,
    'mut_id':fields.String,
    'mut_chr':fields.String,
    'mut_position':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'pre_altseq':fields.String,
    'dotfold':fields.String,
    'mfe':fields.String,
    'pre_strand':fields.String,
    'pre_acc':fields.String,
    'rela_loc':fields.String,
    'resource':fields.String
}

primir_mut_list={
    'primir_mut_list':fields.Nested(primir_mut),
    'primir_mut_count':fields.Integer
}

class PrimirMut(Resource):
    @marshal_with(primir_mut_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mut_id', type=str)
        args = parser.parse_args()
        mut_id = args['mut_id']
        condition = {}
        if mut_id:
            condition['mut_id']=mut_id
            primir_mut_list=mongo.db.primir_altseq_mut.find(condition)
            primir_mut_count=mongo.db.primir_altseq_mut.find(condition).count()
        else:
            primir_mut_count=0
            primir_mut_list={}
        return{'primir_mut_list':list(primir_mut_list),'primir_mut_count':primir_mut_count}

api.add_resource(PrimirMut,'/api/primir_altseq_mut')


snpinfo_line = {
    'snp_id':fields.String,
    'snp_chr':fields.String,
    'snp_coordinate':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'ref_freq':fields.String,
    'alt_freq':fields.String,
    'location':fields.String,
    'identifier':fields.String,
    'ldsnp':fields.Integer,
    'mutation_rela':fields.Integer,
    'gain_count':fields.String,
    'loss_count':fields.String
}

snpinfo = {
    'snpinfo':fields.Nested(snpinfo_line),
    'snpinfo_count':fields.Integer
}

class SnpInfo(Resource):
    @marshal_with(snpinfo)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('query_snp', type=str)
        parser.add_argument('page')
        args = parser.parse_args()
        page=args['page']
        query_snp = args['query_snp']
        per_page=15
        record_skip = (int(page) - 1) * int(per_page)
        condition = {}
        if query_snp=="summary":
            snpinfo=mongo.db.snp_summary.find().skip(record_skip).limit(per_page)
            snpinfo_count=mongo.db.snp_summary.find().count()
        elif query_snp.startswith('rs'):
            condition = {'snp_id':query_snp}
            snpinfo = mongo.db.snp_summary.find(condition)
            snpinfo_count=mongo.db.snp_summary.find(condition).count()
        else:
            snpinfo={}
            snpinfo_count=0
        return {'snpinfo': list(snpinfo),'snpinfo_count':snpinfo_count}

api.add_resource(SnpInfo,'/api/snpinfo')

catalog_line={
    'snp_id':fields.String(attribute='SNPS'),
    'risk_allele':fields.String(attribute='STRONGEST_SNP-RISK_ALLELE'),
    'risk_allele_fre':fields.String(attribute='RISK_ALLELE_FREQUENCY'),
    'disease':fields.String(attribute='DISEASE/TRAIT'),
    'reported_gene':fields.String(attribute='REPORTED_GENE'),
    'p_value':fields.String(attribute='P-VALUE'),
    'or_beta':fields.String(attribute='OR_or_BETA'),
    'ci95':fields.String(attribute='CI_95_TEXT'),
    'pubmed_id':fields.String(attribute='PUBMEDID'),
    'pubmed_link':fields.String(attribute='LINK')
}

catalog_list={
    'catalog_list':fields.Nested(catalog_line),
    'catalog_count':fields.Integer
}

class GwasCatalog(Resource):
    @marshal_with(catalog_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        print(search_ids)
        if search_ids:
            condition={'SNPS':search_ids}
            catalog_list = mongo.db.gwas_catalog_alternative.find(condition)
            catalog_count = mongo.db.gwas_catalog_alternative.find(condition).count()
        else:
            catalog_list={}
            catalog_count=0
        return {'catalog_list':list(catalog_list),'catalog_count':catalog_count}

api.add_resource(GwasCatalog,'/api/gwas_catalog')

tag_info = {
    'population':fields.String,
    'ld_start':fields.String,
    'ld_end':fields.String,
}
relate_tag_info = {
    'population':fields.String,
    'relate_tag_chr':fields.String,
    'relate_tag_ld_start':fields.String,
    'relate_tag_ld_end':fields.String,
    'd_prime':fields.String,
    'r2':fields.String
}
ld_info_id = {
    'snp_id':fields.String,
    'snp_chr':fields.String(attribute='chrome'),
    'snp_position':fields.String(attribute='position'),
    'is_tag':fields.String,
    'is_ld':fields.String,
    'location':fields.String,
    'rela_tag':fields.String,
    'relate_tag_pos': fields.String,
}

ld_info = {
    '_id':fields.Nested(ld_info_id),
    'tag_info':fields.Nested(tag_info),
    'relate_tag_info':fields.Nested(relate_tag_info),
    'catalog_info':fields.Nested(catalog_line)
}
ld_info_list = {
    'ld_list':fields.Nested(ld_info),
    'ld_item_lenth':fields.Integer
}
class LDinfo(Resource):
    @marshal_with(ld_info_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        print(search_ids)
        #condition = {}
        match = {'$match':{
            'snp_id':search_ids}
        }
        group = {'$group':{
            '_id':{'snp_id':'$snp_id',
                   'chrome':'$chrome',
                   'position':'$position',
                   'is_tag':'$is_tag',
                   'is_ld':'$is_ld',
                   'location':'$location',
                   'rela_tag':'$rela_tag',
                   'relate_tag_pos':'$relate_tag_pos'},
            'tag_info':{'$push':{
                'population':'$population',
                'ld_start':'$ld_start',
                'ld_end':'$ld_end'
            }},
            'relate_tag_info':{'$push':{
                'population':'$population',
                'relate_tag_chr':'$relate_tag_chr',
                'relate_tag_ld_start':'$relate_tag_ld_start',
                'relate_tag_ld_end':'$relate_tag_ld_end',
                'd_prime':'$d_prime',
                'r2':'$r2'
            }}
        }}
        lookup={'$lookup':{
            'from':'gwas_catalog_alternative',
            'localField':'_id.rela_tag',
            'foreignField':'SNPS',
            'as':'catalog_info'
        }}
        pipline = [match,group,lookup]
        ld_list = mongo.db.ld_region.aggregate(pipline)
        ld_item_lenth = mongo.db.ld_region.find({'snp_id':search_ids}).count()
        return {'ld_list':list(ld_list),'ld_item_lenth':ld_item_lenth}

api.add_resource(LDinfo,'/api/ldinfo')

mutation_line={
    'chrome':fields.String,
    'position':fields.String,
    'mut_id':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'pathology':fields.String,
    'snp_rela':fields.Integer,
    'snp_id':fields.String,
    'location':fields.String,
    'resource':fields.String,
    'pubmed_id':fields.String,
    'gain_count':fields.String,
    'loss_count':fields.String
}

count_group={
    '_id':fields.String,
    'count':fields.Integer
}

mutation_summary={
    'mutation_summary_list':fields.Nested(mutation_line),
    'mutation_summary_count':fields.Nested(count_group)
}

class MutationSummary(Resource):
    @marshal_with(mutation_summary)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mut_id', type=str)
        parser.add_argument('page')
        parser.add_argument('chrome')
        parser.add_argument('location')
        parser.add_argument('resource')
        parser.add_argument('snp_rela')
        parser.add_argument('pubmed_id')
        parser.add_argument('histology')
        parser.add_argument('pathology')
        parser.add_argument('target_effection')
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
            condition['identifier']={'$regex':args['gene'],'$options':'$i'}
        if args['chrome']!='All' and args['chrome']:
            condition['chrome']=args['chrome']
        if args['location'] != 'All'and args['location']:
            condition['location']=args['location']
        if args['resource']!='All' and args['resource']:
            condition['resource']=args['resource'].lower()
        if args['histology'] and args['histology'] != 'All':
            histology_dict['pathology']={'$regex':args['histology'],'$options':'$i'}
            match_histology={'$match':histology_dict}
        if args['pathology'] and args['pathology']!='All':
            pathology_dict['pathology']={'$regex':args['pathology'],'$options':'$i'}
            match_pathology={'$match':pathology_dict}
        if args['mut_id']:
            mut_id=args['mut_id']
            if mut_id.startswith('COS') or re.match('[0-9]*',mut_id):
                condition['mut_id']=args['mut_id']
        if args['snp_rela']:
            condition['snp_rela']=args['snp_rela']
        if args['pubmed_id']:
            condition['pubmed_id']={'$exists':True}
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

        print(condition)
        print(histology_dict)
        print(pathology_dict)

        if condition or histology_dict or pathology_dict:
            if args['target_effection']=="1":
                mutation_summary_list=mongo.db.mutation_summary_addtarget.aggregate(pipline)
            else:
                mutation_summary_list=mongo.db.mutation_summary.aggregate(pipline)
        else:
            if args['target_effection']=="1":
                mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
            else:
                mutation_summary_list=mongo.db.mutation_summary_addtarget.find(condition).skip(record_skip).limit(per_page)
        if args['target_effection']=="1":
            mutation_summary_count=mongo.db.mutation_summary_addtarget.aggregate(pipline_count)
            print(mutation_summary_count)
        else:
            mutation_summary_count=mongo.db.mutation_summary.aggregate(pipline_count)
            #print('empty')
        #print(str(mutation_summary_count))
        return{'mutation_summary_list':list(mutation_summary_list),'mutation_summary_count':list(mutation_summary_count)}

api.add_resource(MutationSummary,'/api/mutation_summary')

snp_line={
    'snp_id':fields.String,
    'snp_chr':fields.String,
    'snp_coordinate':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'ref_freq':fields.String,
    'alt_freq':fields.String,
    'location':fields.String,
    'identifier':fields.String,
    'ldsnp':fields.Integer,
    'mutation_rela':fields.Integer,
    'gain_count':fields.String,
    'loss_count':fields.String
}

snp_summary_list={
    'snp_summary_list':fields.Nested(snp_line),
    'snp_summary_count':fields.Integer
}

class SnpSummary(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('snp_id', type=str)
        parser.add_argument('page')
        parser.add_argument('chrome')
        parser.add_argument('location')
        parser.add_argument('identifier')
        parser.add_argument('gmaf')
        parser.add_argument('ldsnp')
        parser.add_argument('mutation_rela')
        parser.add_argument('gene')
        args = parser.parse_args()
        #print(args['chrome'])
        page=1
        per_page = 15
        record_skip = (int(page)-1)*per_page
        condition = {}
        pipline = []
        print(args['page'])
        print(record_skip)
        print(args)
        if args['page']:
            page=args['page']
            record_skip = (int(page)-1)*per_page
        if args['gene']:
            condition['identifier']={'$regex':args['gene'],'$options':'$i'}
        if args['chrome'] != 'All' and args['chrome']:
            condition['snp_chr'] = args['chrome']
        if args['snp_id']:
            condition['snp_id']={'$regex':args['snp_id'],'$options':'$1'}
        if args['identifier']:
            condition['identifier']={'$regex':args['identifier'],'$options':'$i'}
        if args['location']!='All' and args['location']:
            condition['location']=args['location']
        if args['ldsnp']:
            condition['ldsnp']=args['ldsnp']
        if args['mutation_rela']:
            condition['mutation_rela']=args['mutation_rela']
        if args['gmaf'] !='All' and args['gmaf']:
            condition['alt_freq']={'$gt':args['gmaf'][1:]}
        print(condition)
        snp_summary_list = mongo.db.snp_summary.find(condition).skip(record_skip).limit(per_page)
        snp_summary_count = mongo.db.snp_summary.find(condition).count()
        print(str(snp_summary_count))
        return {'snp_summary_list':list(snp_summary_list),'snp_summary_count':snp_summary_count}

api.add_resource(SnpSummary,'/api/snp_summary')


cosmic_line = {
    'ID_NCV':fields.String,
    'snp_rela':fields.String,
    'Primary_histology':fields.String(attribute='Primary histology'),
    'chrome':fields.String,
    'Mutation_somatic_status':fields.String(attribute='Mutation somatic status'),
    'Primary_site':fields.String(attribute='Primary site'),
    'PUBMED_PMID':fields.String,
    'SNP':fields.String,
    'snp_id':fields.String,
    'position':fields.String,
    'alt':fields.String,
    'ref':fields.String,
    'location':fields.String,
}
cosmic_list={
    'cosmic_list':fields.Nested(cosmic_line),
    'data_length':fields.Integer
}

class CosmicInfo(Resource):
    @marshal_with(cosmic_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page')
        args = parser.parse_args()
        search_ids = args['search_ids']
        page=args['page']
        per_page=30
        print(page)
        print(search_ids)
        #skip_records = per_page * (page - 1)
        record_skip = (int(page) - 1) * per_page
        print(search_ids)
        if search_ids == 'summary':
            cosmic_list = mongo.db.cosmic_summary.find().skip(record_skip).limit(per_page)
            cosmic_count = mongo.db.cosmic_summary.find().count()
        elif search_ids:
            condition = {'snp_id':search_ids}
            cosmic_list=mongo.db.cosmic_summary.find(condition)
            cosmic_count=mongo.db.cosmic_summary.find(condition).count()
        else:
            cosmic_list={}
            cosmic_count=0
        return {'cosmic_list':list(cosmic_list),'data_length':cosmic_count}

api.add_resource(CosmicInfo,'/api/cosmicinfo')

clinvar_line={
    'chrome':fields.String,
    'position':fields.String,
    'clinvar_id':fields.String,
    'disease':fields.String,
    'snp_rela':fields.String,
    'snp_id':fields.String,
    'ref':fields.String,
    'alt':fields.String,
    'location':fields.String
}
clinvar_list={
    'clinvar_list':fields.Nested(clinvar_line),
    'data_length':fields.Integer
}

class ClinvarInfo(Resource):
    @marshal_with(clinvar_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page')
        args = parser.parse_args()
        search_ids = args['search_ids']
        per_page=15
        page=args['page']
        skip_records=(int(page) - 1) * per_page
        if search_ids == 'summary':
            clinvar_list = mongo.db.clinvar_summary.find().skip(skip_records).limit(per_page)
            clinvar_count = mongo.db.clinvar_summary.find().count()
        elif search_ids:
            condition = {'snp_id': search_ids}
            clinvar_list = mongo.db.clinvar_summary.find(condition)
            clinvar_count = mongo.db.clinvar_summary.find(condition).count()
        else:
            clinvar_list={}
            clinvar_count=0
        return {'clinvar_list': list(clinvar_list), 'data_length': clinvar_count}


api.add_resource(ClinvarInfo, '/api/clinvarinfo')


enrich_line={
    'mirna_id':fields.String,
    'variate_id':fields.String,
    'alt':fields.String,
    'ref':fields.String,
    'enrich_type':fields.String,
    'effection':fields.String,
    'csv_file':fields.String,
    'dot_file':fields.String,
    'chet_file':fields.String,
    'emap_file':fields.String
}

enrich_result_list={
    'enrich_result_list':fields.Nested(enrich_line),
    'enrich_result_count':fields.Integer
}

class EnrichResult(Resource):
    @marshal_with(enrich_result_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('mirna_id', type=str)
        parser.add_argument('variate_id')
        args = parser.parse_args()
        condition={}
        search=0
        if args['mirna_id']:
            search=1
            condition['mirna_id']=args['mirna_id']
        if args['variate_id']:
            search=1
            condition['variate_id']=args['variate_id']
        if search:
            enrich_result_list = mongo.db.enrich_summary.find(condition)
            enrich_result_count = mongo.db.enrich_summary.find(condition).count()
        else:
            enrich_result_list={}
            enrich_result_count=0
        return {'enrich_result_list':list(enrich_result_list),'enrich_result_count':enrich_result_count}

api.add_resource(EnrichResult,'/api/enrich_result')


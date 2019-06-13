import flask_restful


from miRNASNP3 import app, api
from miRNASNP3.core import mongo

from flask_restful import Resource, fields, marshal_with, reqparse, marshal

site_info = {
    'site_start':fields.String,
    'site_end':fields.String,
    'g_duplex':fields.String,
    'g_binding':fields.String,
    'g_open':fields.String,
    'au_content':fields.String,
    'pair3p':fields.String,
    'tgs_score':fields.String,
    'pro_exac':fields.String,
    'pro_bino':fields.String
}
gain_hit_info = {
    'mir_id':fields.String,
    'snp_id':fields.String,
    'gene_symbol':fields.String,
    'gene_acc':fields.String,
    'enst_id':fields.String,
    'utr3_pos':fields.String,
    'site_count':fields.Integer,
    'predict_info':fields.List(fields.Nested(site_info)),
    'effect':fields.String
}
gain_hit_list = {
    'gain_hit_list':fields.List(fields.Nested(gain_hit_info)),
    'data_lenth':fields.Integer
}

class GainHits(Resource):
    @marshal_with(gain_hit_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids',type = str)
        #parser.add_argument('page', type = int, default = 1)
        #parser.add_argument('per_page',type = int,default = 30)
        args = parser.parse_args()
        #page = args['page']
        #per_page = args['per_page']
        search_ids = args['search_ids']
        page=1
        per_page=30
        record_skip = (page-1)*per_page
        condition = {}
        if search_ids:
            if search_ids.lower().startswith('hsa'):
                condition = {'mir_id': search_ids}
            elif args['search_ids'].lower().startswith('mir'):
                mir_id = 'hsa'+search_ids
                condition = {'mir_id': mir_id}
            elif args['search_ids'].lower().startswith('rs'):
                condition = {'snp_id': search_ids}
        gain_hit_list = mongo.db.gain_snpseed_03.find(condition).skip(record_skip).limit(per_page)
        data_lenth = mongo.db.gain_snpseed_03.find(condition).count()
        return {'gain_hit_list':list(gain_hit_list),'data_lenth':data_lenth}

api.add_resource(GainHits, '/api/gain_hit')

loss_hit_info = {
    'mir_id':fields.String,
    'snp_id':fields.String,
    'gene_symbol':fields.String,
    'gene_acc':fields.String,
    'enst_id':fields.String,
    'utr3_pos':fields.String,
    'site_count':fields.Integer,
    'predict_info':fields.List(fields.Nested(site_info)),
    'effect':fields.String,
    'experiment_valid':fields.String,
    'gene_correlation':fields.String
}
loss_hit_list = {
    'loss_hit_list':fields.List(fields.Nested(loss_hit_info)),
    'data_lenth': fields.Integer
}

class LossHits(Resource):
    @marshal_with(loss_hit_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        #parser.add_argument('page', type=int, default=1)
        #parser.add_argument('per_page', type=int, default=30)
        args = parser.parse_args()
        #page = args['page']
        #per_page = args['per_page']
        search_ids = args['search_ids']
        page=1
        per_page=30
        record_skip = (page - 1) * per_page
        condition = {}
        if args['search_ids'] is None:
            return {'hit_list': None}
        if search_ids.lower().startswith('hsa'):
            condition = {'mir_id':search_ids}
        elif search_ids.lower().startswith('mir'):
            mir_id = 'hsa-' + search_ids
            condition = {'mir_id': mir_id}
        elif search_ids.lower().startswith('rs'):
            condition = {'snp_id':search_ids}
        loss_hit_list = mongo.db.loss_snpseed_03.find(condition).skip(record_skip).limit(per_page)
        data_lenth = mongo.db.loss_snpseed_03.find(condition).count()
        return {'loss_hit_list': list(loss_hit_list),'data_lenth':data_lenth}
        #return hit_list
api.add_resource(LossHits,'/api/loss_hit')

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



mirinfo_line = {
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
    'pre_strand':fields.String,
    'harpin_seq':fields.String,
}

mirinfo = {
    'mirinfo':fields.Nested(mirinfo_line)
}

class SearchMir(Resource):
    @marshal_with(mirinfo)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        condition = {}
        if search_ids:
            condition = {'mir_id':search_ids}
        mirinfo = mongo.db.mirinfo.find_one(condition)
        return {'mirinfo':mirinfo}

api.add_resource(SearchMir,'/api/mirinfo')

mir_summary = {
    'mir_id':fields.String,
    'target_gene_count':fields.String,
    'snp_count':fields.String,
    'mutation_count':fields.String,
    'mir_info':fields.Nested(mirinfo_line)
}

mir_summary_list = {
    'mir_summary_list':fields.Nested(mir_summary)
}

class MirSummary(Resource):
    @marshal_with(mir_summary_list)
    def get(self):
        lookup = {
            '$lookup':{
                'from': 'mirinfo',
                'localField': 'mir_id',
                'foreignField': 'mir_id',
                'as': 'mir_info'
            }}
        match = {
            '$match':{
                'mir_id':'hsa-miR-1914-3p'
            }
        }
        pipline = [lookup,match]
        mir_summary_list = mongo.db.mir_summary.aggregate(pipline)
        return {'mir_summary_list':list(mir_summary_list)}

api.add_resource(MirSummary,'/api/mir')

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
    'vtype':fields.String
}

snpinfo = {
    'snpinfo':fields.Nested(snpinfo_line)
}

class SnpInfo(Resource):
    @marshal_with(snpinfo)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('query_snp', type=str)
        args = parser.parse_args()
        query_snp = args['query_snp']
        condition = {}
        if query_snp:
            condition = {'snp_id':query_snp}
        snpinfo = mongo.db.snpinfo.find(condition)
        return {'snpinfo': list(snpinfo)}

api.add_resource(SnpInfo,'/api/snpinfo')

tag_info = {
    'population':fields.String,
    'ld_start':fields.String,
    'ld_end':fields.String,
}
relate_tag_info = {
    'population':fields.String,
    'relate_tag_chr':fields.String,
    'relate_tag_pos':fields.String,
    'relate_tag_ld_start':fields.String,
    'relate_tag_ld_end':fields.String,
    'd_prime':fields.String,
    'r2':fields.String
}
ld_info_id = {
'snp_id':fields.String,
    'snp_chr':fields.String,
    'snp_position':fields.String,
    'is_tag':fields.String,
    'is_ld':fields.String,
    'location':fields.String,
    'rela_tag':fields.String,
}
ld_info = {
    '_id':fields.Nested(ld_info_id),
    'tag_info':fields.Nested(tag_info),
    'relate_tag_info':fields.Nested(relate_tag_info)
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
            'snp_id':search_ids,
            'is_tag':'1'}}
        group = {'$group':{
            '_id':{'snp_id':'$snp_id',
                   'snp_chr':'$snp_chr',
                   'snp_position':'$snp_position',
                   'is_tag':'$is_tag',
                   'is_ld':'$is_ld',
                   'location':'$location',
                   'rela_tag':'$rela_tag'},
            'tag_info':{'$push':{
                'population':'$population',
                'ld_start':'$ld_start',
                'ld_end':'$ld_end'
            }},
            'relate_tag_info':{'$push':{
                'population':'$population',
                'relate_tag_chr':'$relate_tag_chr',
                'relate_tag_pos':'$relate_tag_pos',
                'relate_tag_ld_start':'$relate_tag_ld_start',
                'relate_tag_ld_end':'$relate_tag_ld_end',
                'd_prime':'$d_prime',
                'r2':'$r2'
            }}
        }}
        pipline = [match,group]
        ld_list = mongo.db.ld.aggregate(pipline)
        ld_item_lenth = mongo.db.ld.find({'snp_id':search_ids}).count()
        return {'ld_list':list(ld_list),'ld_item_lenth':ld_item_lenth}

api.add_resource(LDinfo,'/api/ldinfo')



snp_summary = {
    'snp_id':fields.String,
    'locate':fields.String,
    'identifier':fields.String,
    'target_gain':fields.Integer,
    'target_loss':fields.Integer,
    'snp_info':fields.Nested(snpinfo_line)
}

snp_summary_list = {
    'snp_summary_list':fields.Nested(snp_summary)
}

class SnpSummary(Resource):
    @marshal_with(snp_summary_list)
    def get(self):
        lookup = {'$lookup':{
            'from':'snpinfo',
            'localField':'snp_id',
            'foreignField':'snp_id',
            'as':'snp_info'
        }}
        match = {'$match':{
            'snp_id':'rs1034533798'
        }}
        pipline = [lookup,match]
        snp_summary_list = mongo.db.snp_summary.aggregate(pipline)

        return {'snp_summary_list':list(snp_summary_list)}

api.add_resource(SnpSummary,'/api/snp')

'''
test_fields = {
    'fields1': fields.String,
    'fields2': fields.Integer,
    'fieldsx': fields.String(attribute='fields3'),
}


class FuzzyFoo(Resource):
    @marshal_with(test_fields)
    def get(self):
        a = {'fields1': 'abc', 'fields2': 1, 'fields3': 'ABC'}
        return a

api.add_resource(FuzzyFoo, '/api/test')


lncrna_snp_fields = {
    'chromosome': fields.String(attribute='chr'),
    'start': fields.Integer,
    'end': fields.Integer,
    'strand': fields.String,
    'lnc': fields.String,
    'snp': fields.String(attribute='dbsnp'),
    'ID': fields.Integer,
}

class LncRNASNP(Resource):
    @marshal_with(lncrna_snp_fields)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('ID', type=int)
        args = parser.parse_args()
        if args['ID']:
            lncrna_snp = mongo.db.SNP_lnc_relate.find_one({'ID': args['ID']})
        else:
            lncrna_snp = mongo.db.SNP_lnc_relate.find_one()
        app.logger.debug("lncrna_snp={}".format(lncrna_snp))
        return lncrna_snp

api.add_resource(LncRNASNP, '/api/lncrna_snp')


lncrna_snp_list_fields = {
    'lncrna_snp_list':  fields.List(fields.Nested(lncrna_snp_fields)),
    'records_number': fields.Integer
}

class LncRNASNPList(Resource):
    @marshal_with(lncrna_snp_list_fields)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('page', type=int, default=1)
        parser.add_argument('per_page', type=int, default=30)
        parser.add_argument('lncrna')
        args = parser.parse_args()
        page = args['page']
        per_page = args['per_page']
        record_skip = (page - 1) * per_page
        condition = {}
        if args['lncrna']:
            condition = {"lnc": args['lncrna']}
        lncrna_snp_list = mongo.db.SNP_lnc_relate.find(condition).skip(record_skip).limit(per_page)
        records_number = mongo.db.SNP_lnc_relate.find().count()
        print("test")
        print(records_number)
        return {"lncrna_snp_sfs": 1,"records_number":records_number}
api.add_resource(LncRNASNPList, '/api/lncrna_snp_list')
'''

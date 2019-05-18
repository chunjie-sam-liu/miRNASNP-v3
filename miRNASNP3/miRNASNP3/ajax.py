import flask_restful


from miRNASNP3 import app, api
from miRNASNP3.core import mongo

from flask_restful import Resource, fields, marshal_with, reqparse, marshal

gain_hit_info = {
    'mir_id':fields.String,
    'snp_id':fields.String,
    'utr3_pos':fields.String,
    'query':fields.String,
    'score':fields.String,
    'energy':fields.String,
    'utr_map_start':fields.String,
    'utr_map_end':fields.String,
    'effect':fields.String
}
hit_list = {
    'hit_list':fields.List(fields.Nested(gain_hit_info))
}

class GainHits(Resource):
    @marshal_with(hit_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids',type = str)
        args = parser.parse_args()
        if args['search_ids'] is None:
            return {'hit_list':None}
        if args['search_ids'].lower().startswith('hsa'):
            mir_id = args['search_ids']
            gain_hit = mongo.db.target_gain_test.find({'mir_id': mir_id}).limit(50)
        elif args['search_ids'].lower().startswith('mir'):
            mir_id = 'hsa'+args['search_ids']
            gain_hit = mongo.db.target_gain_test.find({'mir_id': mir_id}).limit(50)
        elif args['search_ids'].lower().startswith('rs'):
            snp_id = args['search_ids']
            gain_hit = mongo.db.target_gain_test.find_one({'snp_id': snp_id})
        else:
            gain_hit ={'mir_id':'tmir','snp_id':'tsnp','utr3_pos':'tutr','query':'tquery','score':'tscore','energy':'tenergy','effect':'tgian'}
        app.logger.debug("gain_hit={}".format(gain_hit))
        #gain_hit=[{'mir_id':'tmir','snp_id':'tsnp','utr3_pos':'tutr','query':'tquery','score':'tscore','energy':'tenergy','effect':'tgian'},
         #         {'mir_id':'let-7a-3p','snp_id':'rs779353569','utr3_pos':'chr1:3457-9876(+)','query':'ACGT-atgc','score':'147.0','energy':'51.9','effect':'gian'}]
        return {'hit_list':gain_hit}

api.add_resource(GainHits, '/api/gain_hit')


class LossHits(Resource):
    @marshal_with(hit_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        if args['search_ids'] is None:
            return {'hit_list': None}
        if args['search_ids'].lower().startswith('hsa'):
            mir_id = args['search_ids']
            loss_hit = mongo.db.target_loss_test.find_one({'mir_id': mir_id})
        elif args['search_ids'].lower().startswith('mir'):
            mir_id = 'hsa' + args['search_ids']
            loss_hit = mongo.db.target_loss_test.find_one({'mir_id': mir_id})
        elif args['search_ids'].lower().startswith('rs'):
            snp_id = args['search_ids']
            loss_hit = mongo.db.target_loss_test.find_one({'snp_id': snp_id})
        else:
            loss_hit = [{'mir_id': 'tmir', 'snp_id': 'tsnp', 'utr3_pos': 'tutr', 'query': 'tquery', 'score': 'tscore','energy': 'tenergy', 'effect': 'tloss'},
                        {'mir_id': 'let-7a-3p-o', 'snp_id': 'rs779353569','utr3_pos': 'chr1:3457-9876(-)','query': 'ACGT-atgc', 'score': '147.0', 'energy': '51.9', 'effect': 'loss'}]
        return {'hit_list': list(loss_hit)}
        #return hit_list
api.add_resource(LossHits,'/api/loss_hit')

mir_ifo = {
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
    'browse_list':fields.List(fields.Nested(mir_ifo))
}

class BrowseMir(Resource):
    @marshal_with(browse_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('chr',type=str)
        #parser.add_argument('vtype',type=list)
        #parser.add_argument('loc_region',type=list)
        args = parser.parse_args()
        browse_list = []
        if args['chr']:
            chrome = args['chr']
         #   for chrome in args['chr']:
            browse_list_temp = mongo.db.browserY.find({'mir_chr':chrome})
            browse_list.extend(browse_list_temp)
        else:
            browse_list = [{'mir_id':'hsa-mir-3690','mir_acc':'MI0023561','mir_chr':'chrY','mir_start':'1293918','mir_end':'1293992',
                        'mir_strand':'+','location':'Premir','count_snp':20,'snp_info':['rs1198477790','rs1281005500','rs765405423'],
                        'count_mutation':0,'mutation_info':['no_count']}]
        return {'browse_list':list(browse_list)}

api.add_resource(BrowseMir,'/api/browsemir')



mirinfo_line = {
    'mir_id':fields.String,
    'mir_acc':fields.String,
    'mir_pos':fields.String,
    'mir_type':fields.String,
    'mature_seq':fields.String,
    'precusor':fields.String,
    'express_profile':{'LIHC':fields.Integer,
                       'BRCA':fields.Integer},
    'mir_structure':fields.String
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
        mirinfo = {'mir_id':'init_id'}
        if args['search_ids']:
            mirinfo = mongo.db.mirna.find_one({'mir_id':args['search_ids']})
        else:
            mirinfo = {'mir_id':'no_id'}

        return {'mirinfo':mirinfo}

api.add_resource(SearchMir,'/api/mirinfo')


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

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
    'gain_hit_list':fields.List(fields.Nested(gain_hit_info))
}

class GainHits(Resource):
    @marshal_with(gain_hit_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids',type = str)
        args = parser.parse_args()
        if args['search_ids'] is None:
            return {'hit_list':None}
        if args['search_ids'].lower().startswith('hsa'):
            mir_id = args['search_ids']
            gain_hit_list = mongo.db.gain_snpseed_03.find({'mir_id': mir_id})
        elif args['search_ids'].lower().startswith('mir'):
            mir_id = 'hsa'+args['search_ids']
            gain_hit_list = mongo.db.gain_snpseed_03.find({'mir_id': mir_id})
        elif args['search_ids'].lower().startswith('rs'):
            snp_id = args['search_ids']
            gain_hit_list = mongo.db.gain_snpseed_03.find({'snp_id': snp_id})
        else:
            gain_hit_list ={'mir_id':'tmir','snp_id':'tsnp','utr3_pos':'tutr','query':'tquery','score':'tscore','energy':'tenergy','effect':'tgian'}

        return {'gain_hit_list':list(gain_hit_list)}

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
    'loss_hit_list':fields.List(fields.Nested(loss_hit_info))
}

class LossHits(Resource):
    @marshal_with(loss_hit_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        loss_hit_list = [{'mir_id': 'tmir', 'snp_id': 'tsnp', 'utr3_pos': 'tutr', 'effect': 'tloss'}]
        if args['search_ids'] is None:
            return {'hit_list': None}
        if args['search_ids'].lower().startswith('hsa'):
            mir_id = args['search_ids']
            loss_hit_list = mongo.db.loss_snpseed_03.find({'mir_id': mir_id})
        elif args['search_ids'].lower().startswith('mir'):
            mir_id = 'hsa' + args['search_ids']
            loss_hit_list = mongo.db.loss_snpseed_03.find({'mir_id': mir_id})
        elif args['search_ids'].lower().startswith('rs'):
            snp_id = args['search_ids']
            loss_hit_list = mongo.db.loss_snpseed_03.find({'snp_id': snp_id})

        return {'loss_hit_list': list(loss_hit_list)}
        #return hit_list
api.add_resource(LossHits,'/api/loss_hit')

browse_ifo = {
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
    'browse_list':fields.List(fields.Nested(browse_ifo))
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
            browse_list_temp = mongo.db.browseY.find({'mir_chr':chrome})
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
        mirinfo = {'mir_id':'init_id'}
        if args['search_ids']:
            mirinfo = mongo.db.mirinfo.find_one({'mir_id':args['search_ids']})
        else:
            mirinfo = {'mir_id':'no_id'}

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
    'freqence':fields.String,
    'gwas_tag':fields.String,
    'loc_in_ld':fields.String,
    'relate_clinvar':fields.String,
    'relate_cosmic':fields.String
}

snpinfo = {
    'snpinfo':fields.Nested(snpinfo_line)
}

class SnpInfo(Resource):
    @marshal_with(snpinfo)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        print(args['search_ids'])
        snpinfo = {'snp_id': args['search_ids']}
        if args['search_ids']:
            snpinfo = mongo.db.snpinfo.find_one({'snp_id': args['search_ids']})
        else:
            mirinfo = {'snp_id': 'no_id'}

        return {'snpinfo': snpinfo}

api.add_resource(SnpInfo,'/api/snpinfo')

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

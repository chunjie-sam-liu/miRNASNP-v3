import flask_restful


from miRNASNP3 import app, api
from miRNASNP3.core import mongo

from flask_restful import Resource, fields, marshal_with, reqparse, marshal

'''
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
        parser.add_argument('page', type = int, default = 1)
        #parser.add_argument('per_page',type = int,default = 30)
        args = parser.parse_args()
        #page = args['page']
        #per_page = args['per_page']
        search_ids = args['search_ids']
        page=args['page']
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
        parser.add_argument('page', type=int, default=1)
        #parser.add_argument('per_page', type=int, default=30)
        args = parser.parse_args()
        #page = args['page']
        #per_page = args['per_page']
        search_ids = args['search_ids']
        page=args['page']
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
'''
site_info={
    'seed_length':fields.String,
    'site_end':fields.String,
    'dg_duplex':fields.String,
    'dg_binding':fields.String,
    'dg_open':fields.String,
    'tgs_au':fields.String,
    'tgs_pairing3p':fields.String,
    'tgs_score':fields.String,
    'prob_exac':fields.String,
    'prob_binomal':fields.String,
    'align':fields.String,
}

gainsite_id_info={
        'mirna_id':fields.String,
        'snp_id':fields.String,
        'gene':fields.String,
        'utr_chr':fields.String,
        'utr_start':fields.String,
        'utr_end':fields.String,
        'utr_strand':fields.String,
        'utr_length':fields.String,
        'enst_id':fields.String,
        'acc':fields.String,
}
gain_target={
    'site_info':fields.Nested(site_info),
    '_id':fields.Nested(gainsite_id_info),
    'site_num':fields.Integer,
}

count_info={
    '_id':fields.String,
    'count':fields.String,
}

gain_targte_list={
    'gain_target_list':fields.Nested(gain_target),
    'gain_target_count':fields.Nested(count_info)
}

class GainTargets_Seed(Resource):
    @marshal_with(gain_targte_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        search_ids = args['search_ids']
        page = args['page']
        per_page = 30
        record_skip = (page - 1) * per_page
        condition = {}
        print(search_ids)
        if args['search_ids'] is None:
            return {'hit_list': None}
        if search_ids.lower().startswith('hsa'):
            condition = {'mirna_id': search_ids}
        elif search_ids.lower().startswith('mir'):
            mir_id = 'hsa-' + search_ids
            condition = {'mirna_id': mir_id}
        elif search_ids.lower().startswith('rs'):
            condition = {'snp_id': search_ids}
        match={'$match':condition}
        group={
            '$group':{
                '_id':{
                    'snp_id':'$snp_id',
                    'mirna_id':'$mirna_id',
                    'gene':'$gene',
                    'utr_chr':'$utr_chr',
                    'utr_start':'$utr_start',
                    'utr_end':'$utr_end',
                    'utr_strand':'$utr_strand',
                    'utr_length':'$utr_length',
                    'enst_id':'$enst_id',
                    'acc':'$acc',
                },
                'site_num':{'$sum':1 },
                'site_info':{
                    '$push':{
                        'site_end':'$site_end',
                        'seed_length':'$seed_length',
                        'dg_duplex':'$dg_duplex',
                        'dg_binding':'$dg_binding',
                        'dg_open':'$dg_open',
                        'tgs_au':'$tgs_au',
                        'tgs_pairing3p':'$tgs_pairing3p',
                        'tgs_score':'$tgs_score',
                        'prob_exac':'$prob_exac',
                        'align':'$align'
                    }
                }
            }
        }
        skip={'$skip':record_skip}
        limit={'$limit':per_page}
        count={'$group':{
            '_id':'null',
            'count':{'$sum':1}
        }}
        pipline=[match,group,skip,limit]
        pipline_count=[match,group,count]
        gain_target_list=mongo.db.snvseed_gain_target_siteinfo.aggregate(pipline)
        gain_target_count=mongo.db.snvseed_gain_target_siteinfo.aggregate(pipline_count)
        return {'gain_target_list':list(gain_target_list),
                'gain_target_count':list(gain_target_count)}

api.add_resource(GainTargets_Seed,'/api/gain_target_seed')

gain_site_mut_id_info={
        'mirna_id':fields.String,
        'mut_id':fields.String(attribute='cosmic_id'),
        'gene':fields.String,
        'utr_chr':fields.String,
        'utr_start':fields.String,
        'utr_end':fields.String,
        'utr_strand':fields.String,
        'utr_length':fields.String,
        'enst_id':fields.String,
        'acc':fields.String,
}
gain_target_mut={
    'site_info':fields.Nested(site_info),
    '_id':fields.Nested(gain_site_mut_id_info),
    'site_num':fields.Integer,
}

gain_targte_list_mut={
    'gain_target_list_mut':fields.Nested(gain_target_mut),
    'gain_target_count_mut':fields.Nested(count_info)
}

class GainTargets_Seed_Mut(Resource):
    @marshal_with(gain_targte_list_mut)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        search_ids = args['search_ids']
        page = args['page']
        per_page = 30
        record_skip = (page - 1) * per_page
        condition = {}
        print(search_ids)
        if args['search_ids'] is None:
            return {'hit_list': None}
        if search_ids.lower().startswith('hsa'):
            condition = {'mirna_id': search_ids}
        elif search_ids.lower().startswith('mir'):
            mir_id = 'hsa-' + search_ids
            condition = {'mirna_id': mir_id}
        match={'$match':condition}
        group={
            '$group':{
                '_id':{
                    'cosmic_id':'$cosmic_id',
                    'mirna_id':'$mirna_id',
                    'gene':'$gene',
                    'utr_chr':'$utr_chr',
                    'utr_start':'$utr_start',
                    'utr_end':'$utr_end',
                    'utr_strand':'$utr_strand',
                    'utr_length':'$utr_length',
                    'enst_id':'$enst_id',
                    'acc':'$acc',
                },
                'site_num':{'$sum':1 },
                'site_info':{
                    '$push':{
                        'site_end':'$site_end',
                        'seed_length':'$seed_length',
                        'dg_duplex':'$dg_duplex',
                        'dg_binding':'$dg_binding',
                        'dg_open':'$dg_open',
                        'tgs_au':'$tgs_au',
                        'tgs_pairing3p':'$tgs_pairing3p',
                        'tgs_score':'$tgs_score',
                        'prob_exac':'$prob_exac',
                        'align':'$align'
                    }
                }
            }
        }
        skip={'$skip':record_skip}
        limit={'$limit':per_page}
        count={'$group':{
            '_id':'null',
            'count':{'$sum':1}
        }}
        pipline=[match,group,skip,limit]
        pipline_count=[match,group,count]
        gain_target_list_mut=mongo.db.cosmic_seed_gain_target_siteinfo.aggregate(pipline)
        gain_target_count_mut=mongo.db.cosmic_seed_gain_target_siteinfo.aggregate(pipline_count)
        return {'gain_target_list_mut':list(gain_target_list_mut),
                'gain_target_count_mut':list(gain_target_count_mut)}

api.add_resource(GainTargets_Seed_Mut,'/api/gain_target_seed_mut')



losssite_id_info={
        'mirna_id':fields.String,
        'snp_id':fields.String,
        'gene':fields.String,
        'utr_chr':fields.String,
        'utr_start':fields.String,
        'utr_end':fields.String,
        'utr_strand':fields.String,
        'utr_length':fields.String,
        'enst_id':fields.String,
        'acc':fields.String,
        'experiment_valid':fields.String,
        'expression_corelation':fields.String,

}
loss_target={
    'site_info':fields.Nested(site_info),
    '_id':fields.Nested(losssite_id_info),
    'site_num':fields.Integer,
}

loss_targte_list={
    'loss_target_list':fields.Nested(loss_target),
    'loss_target_count':fields.Nested(count_info)
}

class LossTargets_Seed(Resource):
    @marshal_with(loss_targte_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        search_ids = args['search_ids']
        page = args['page']
        per_page = 30
        record_skip = (page - 1) * per_page
        condition = {}
        print(search_ids)
        if args['search_ids'] is None:
            return {'hit_list': None}
        if search_ids.lower().startswith('hsa'):
            condition = {'mirna_id': search_ids}
        elif search_ids.lower().startswith('mir'):
            mir_id = 'hsa-' + search_ids
            condition = {'mirna_id': mir_id}
        elif search_ids.lower().startswith('rs'):
            condition = {'snp_id': search_ids}
        match={'$match':condition}
        group={
            '$group':{
                '_id':{
                    'snp_id':'$snp_id',
                    'mirna_id':'$mirna_id',
                    'gene':'$gene',
                    'utr_chr':'$utr_chr',
                    'utr_start':'$utr_start',
                    'utr_end':'$utr_end',
                    'utr_strand':'$utr_strand',
                    'utr_length':'$utr_length',
                    'enst_id':'$enst_id',
                    'acc':'$acc',
                    'experiment_valid':'$experiment_valid',
                    'expression_corelation':'$expression_corelation'
                },
                'site_num':{'$sum':1 },
                'site_info':{
                    '$push':{
                        'site_end':'$site_end',
                        'seed_length':'$seed_length',
                        'dg_duplex':'$dg_duplex',
                        'dg_binding':'$dg_binding',
                        'dg_open':'$dg_open',
                        'tgs_au':'$tgs_au',
                        'tgs_pairing3p':'$tgs_pairing3p',
                        'tgs_score':'$tgs_score',
                        'prob_exac':'$prob_exac',
                        'align':'$align'
                    }
                }
            }
        }
        skip={'$skip':record_skip}
        limit={'$limit':per_page}
        count={'$group':{
            '_id':'null',
            'count':{'$sum':1}
        }}
        pipline=[match,group,skip,limit]
        pipline_count=[match,group,count]
        loss_target_list=mongo.db.snvseed_loss_target_siteinfo.aggregate(pipline)
        loss_target_count=mongo.db.snvseed_loss_target_siteinfo.aggregate(pipline_count)
        return {'loss_target_list':list(loss_target_list),
                'loss_target_count':list(loss_target_count)}

api.add_resource(LossTargets_Seed,'/api/loss_target_seed')

loss_site_mut_id_info={
        'mirna_id':fields.String,
        'mut_id':fields.String(attribute='cosmic_id'),
        'gene':fields.String,
        'utr_chr':fields.String,
        'utr_start':fields.String,
        'utr_end':fields.String,
        'utr_strand':fields.String,
        'utr_length':fields.String,
        'enst_id':fields.String,
        'acc':fields.String,
        'experiment_valid':fields.String,
        'expression_corelation':fields.String,

}
loss_target_mut={
    'site_info':fields.Nested(site_info),
    '_id':fields.Nested(loss_site_mut_id_info),
    'site_num':fields.Integer,
}

loss_targte_list_mut={
    'loss_target_list_mut':fields.Nested(loss_target_mut),
    'loss_target_count_mut':fields.Nested(count_info)
}

class LossTargets_Seed_Mut(Resource):
    @marshal_with(loss_targte_list_mut)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        search_ids = args['search_ids']
        page = args['page']
        per_page = 30
        record_skip = (page - 1) * per_page
        condition = {}
        print(search_ids)
        if args['search_ids'] is None:
            return {'hit_list': None}
        if search_ids.lower().startswith('hsa'):
            condition = {'mirna_id': search_ids}
        elif search_ids.lower().startswith('mir'):
            mir_id = 'hsa-' + search_ids
            condition = {'mirna_id': mir_id}
        match={'$match':condition}
        group={
            '$group':{
                '_id':{
                    'cosmic_id':'$cosmic_id',
                    'mirna_id':'$mirna_id',
                    'gene':'$gene',
                    'utr_chr':'$utr_chr',
                    'utr_start':'$utr_start',
                    'utr_end':'$utr_end',
                    'utr_strand':'$utr_strand',
                    'utr_length':'$utr_length',
                    'enst_id':'$enst_id',
                    'acc':'$acc',
                    'experiment_valid':'$experiment_valid',
                    'expression_corelation':'$expression_corelation'
                },
                'site_num':{'$sum':1 },
                'site_info':{
                    '$push':{
                        'site_end':'$site_end',
                        'seed_length':'$seed_length',
                        'dg_duplex':'$dg_duplex',
                        'dg_binding':'$dg_binding',
                        'dg_open':'$dg_open',
                        'tgs_au':'$tgs_au',
                        'tgs_pairing3p':'$tgs_pairing3p',
                        'tgs_score':'$tgs_score',
                        'prob_exac':'$prob_exac',
                        'align':'$align'
                    }
                }
            }
        }
        skip={'$skip':record_skip}
        limit={'$limit':per_page}
        count={'$group':{
            '_id':'null',
            'count':{'$sum':1}
        }}
        pipline=[match,group,skip,limit]
        pipline_count=[match,group,count]
        loss_target_list_mut=mongo.db.cosmic_seed_loss_target_siteinfo.aggregate(pipline)
        loss_target_count_mut=mongo.db.cosmic_seed_loss_target_siteinfo.aggregate(pipline_count)
        return {'loss_target_list_mut':list(loss_target_list_mut),
                'loss_target_count_mut':list(loss_target_count_mut)}

api.add_resource(LossTargets_Seed_Mut,'/api/loss_target_seed_mut')

site_info_line={
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
    'prob_exac':fields.String(attribute='prob_exxac'),
    'align_1':fields.String,
    'align_2':fields.String,
    'align_3':fields.String,
    'align_4':fields.String,
    'align_5':fields.String,
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
}
utr_info_line={
    'gene_symbol':fields.String,
    'position':fields.String,
    'enst_id':fields.String,
    'acc':fields.String
}
snv_utr_loss={
    'snp_id':fields.String,
    'mirna_id':fields.String,
    'gene_symbol':fields.String,
    'experiment_valid':fields.Integer,
    'expr_corelation':fields.String,
    'snp_info':fields.Nested(snp_info_line),
    'utr_info':fields.Nested(utr_info_line),
    'site_info':fields.Nested(site_info_line)
}

snv_utr_loss_list={
    'snv_utr_loss_list':fields.Nested(snv_utr_loss),
    'snv_utr_loss_count':fields.Integer
}

class SnvUtrLoss(Resource):
    @marshal_with(snv_utr_loss_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        parser.add_argument('page', type=int, default=1)
        args = parser.parse_args()
        search_ids = args['search_ids']
        page = args['page']
        per_page = 30
        record_skip = (page - 1) * per_page
        condition = {}
        print(search_ids)
        if search_ids:
            condition={'snp_id':search_ids}
            snv_utr_loss_list=mongo.db.snvutr_loss.find(condition).skip(record_skip).limit(per_page)
            snv_utr_loss_count=mongo.db.snvutr_loss.find(condition).count()
        else:
            snv_utr_loss_list={}
            snv_utr_loss_count=0
        return {'snv_utr_loss_list':list(snv_utr_loss_list),'snv_utr_loss_count':snv_utr_loss_count}

api.add_resource(SnvUtrLoss,'/api/snvutr_loss')

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
    'snp_detail':fields.List(fields.String)
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

class SearchPremir(Resource):
    @marshal_with(mirinfo)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        condition = {}
        if search_ids:
            condition = {'pre_id': search_ids}
        mirinfo = mongo.db.mirinfo.find_one(condition)
        return {'mirinfo': mirinfo}
api.add_resource(SearchPremir,'/api/premirinfo')

mir_cluster5k={
    'pre_id':fields.String,
    'cluster5k_id':fields.String
}
mir_cluster10k={
    'pre_id':fields.String,
    'cluster10k_id':fields.String,
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
    'mirinfo':fields.Nested(mirinfo_line)
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
                'from':'premir_cluster',
                'localField':'cluster10k_id',
                'foreignField':'cluster10k_id',
                'as':'cluster10k'
            }}
            lookup_cluster5k={'$lookup':{
                'from':'premir_cluster',
                'localField':'cluster5k_id',
                'foreignField':'cluster5k_id',
                'as':'cluster5k'
            }}
            lookup_mirinfo={'$lookup':{
                'from':'mirinfo',
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

mir_summary = {
    'mirna_id':fields.String,
    'snp_in_seed':fields.String,
    'snp_in_matue':fields.String,
    'cosmic_in_seed':fields.String,
    'cosmic_in_matue':fields.String,
    'clinvar_in_seed':fields.String,
    'clinvar_in_matue':fields.String,
    'mir_info':fields.Nested(mirinfo_line)
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
        #print(mirna_id)
        pipline=[]
        condition={}
        '''
        if chrome=="ALL":
            match_chr={}
        else:
            match_chr={'$match':{
                
            }}
            '''
        if mirna_id:
            match_mir={'$match':{
                'mirna_id':mirna_id
            }}
            pipline.append(match_mir)
            condition['mirna_id']=mirna_id
        lookup = {
            '$lookup':{
                'from': 'mirinfo',
                'localField': 'mirna_id',
                'foreignField': 'mir_id',
                'as': 'mir_info'
            }}
        limit={'$limit':per_page}
        skip={'$skip':record_skip}
        pipline = pipline+[lookup,skip,limit]
        mirna_summary_list = mongo.db.mature_snp_mut_count.aggregate(pipline)
        mirna_summary_count=mongo.db.mature_snp_mut_count.find(condition).count()
        return {'mirna_summary_list':list(mirna_summary_list),
                'mirna_summary_count':mirna_summary_count}

api.add_resource(MirSummary,'/api/mirna_summary')

primir_summary={
    'primir_id':fields.String,
    'snp_in_pri':fields.String,
    'cosmic_in_pri':fields.String,
    'clinvar_in_pri':fields.String,
    'mir_info':fields.Nested(mirinfo_line)
}

primir_summary_list={
    'primir_summary_list':fields.Nested(primir_summary),
    'primir_summary_count':fields.Integer
}

class PrimirSummary(Resource):
    @marshal_with(primir_summary_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('page', type=int, default=1)
        parser.add_argument('chrome', type=str)
        parser.add_argument('mirna_id')
        args = parser.parse_args()
        page = args['page']
        chrome = args['chrome']
        mirna_id = args['mirna_id']
        per_page = 15
        record_skip = (page - 1) * per_page
        print(page)
        pipline = []
        condition = {}
        '''
        if chrome=="ALL":
            match_chr={}
        else:
            match_chr={'$match':{

            }}
            '''
        if mirna_id:
            match_mir = {'$match': {
                'primir_id': mirna_id
            }}
            pipline.append(match_mir)
            condition['mirna_id'] = mirna_id
        lookup = {
            '$lookup': {
                'from': 'mirinfo',
                'localField': 'primir_id',
                'foreignField': 'pre_id',
                'as': 'mir_info'
            }}
        limit = {'$limit': per_page}
        skip = {'$skip': record_skip}
        pipline = pipline+[lookup, skip, limit]
        primir_summary_list = mongo.db.primir_snp_mut_count.aggregate(pipline)
        primir_summary_count = mongo.db.primir_snp_mut_count.find(condition).count()
        return {'primir_summary_list': list(primir_summary_list),
                'primir_summary_count': primir_summary_count}

api.add_resource(PrimirSummary, '/api/primir_summary')

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
    'snp_chr':fields.String(attribute='chrome'),
    'snp_position':fields.String(attribute='position'),
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
            'snp_id':search_ids}
        }
        group = {'$group':{
            '_id':{'snp_id':'$snp_id',
                   'chrome':'$chrome',
                   'position':'$position',
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
        ld_list = mongo.db.ld_region.aggregate(pipline)
        ld_item_lenth = mongo.db.ld_region.find({'snp_id':search_ids}).count()
        return {'ld_list':list(ld_list),'ld_item_lenth':ld_item_lenth}

api.add_resource(LDinfo,'/api/ldinfo')

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
        if search_ids:
            condition={'SNPS':search_ids}
            catalog_list = mongo.db.gwas_catalog_alternative.find(condition)
            catalog_count = mongo.db.gwas_catalog_alternative.find(condition).count()
        else:
            catalog_list={}
            catalog_count=0
        return {'catalog_list':list(catalog_list),'catalog_count':catalog_count}

api.add_resource(GwasCatalog,'/api/gwas_catalog')

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
        per_page=30
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
    'snp_id':fields.String(attribute='smp_id'),
    'mut_id':fields.String,
    'gain_go':fields.Integer,
    'loss_go':fields.Integer,
    'gain_kegg':fields.Integer,
    'loss_kegg':fields.Integer
}

enrich_result_list={
    'enrich_result_list':fields.Nested(enrich_line),
    'enrich_result_count':fields.Integer
}

class EnrichResult(Resource):
    @marshal_with(enrich_result_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        if search_ids:
            condition={'mirna_id':search_ids}
            enrich_result_list = mongo.db.gl_pathway_check_mir.find(condition)
            enrich_result_count = mongo.db.gl_pathway_check_mir.find(condition).count()
        else:
            enrich_result_list={}
            enrich_result_count=0
        return {'enrich_result_list':list(enrich_result_list),'enrich_result_count':enrich_result_count}

api.add_resource(EnrichResult,'/api/enrich_result')

expression_line={
    'mirna_id':fields.String(attribute='name'),
    'normal':fields.String,
    'cancer_types':fields.String,
    'site':fields.String,
    'tumor':fields.String,
    'acc':fields.String(attribute='gene')
}

mir_expr_list={
    'mir_expr_list':fields.Nested(expression_line),
    'mir_expr_count':fields.Integer
}

class mirExpression(Resource):
    @marshal_with(mir_expr_list)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search_ids', type=str)
        args = parser.parse_args()
        search_ids = args['search_ids']
        if search_ids:
            condition = {'name': search_ids}
            mir_expr_list = mongo.db.mirna_expression_tcga.find(condition)
            mir_expr_count = mongo.db.mirna_expression_tcga.find(condition).count()
        else:
            mir_expr_list = {}
            mir_expr_count = 0
        return {'mir_expr_list': list(mir_expr_list), 'mir_expr_count': mir_expr_count}

api.add_resource(mirExpression,'/api/mir_expression')
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

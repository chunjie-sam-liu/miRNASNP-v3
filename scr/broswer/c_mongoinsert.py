import pymongo,sys
import codecs

def import_files(input_file_local):
    in_dict = {}
    with open(input_file_local) as infile:
        line = infile.readline()
        while line:
            if line.startswith('mir'):
                ids = line.strip().split()
            else:
                value = line.strip().split()
                for i in range(0,len(ids)):
                    in_dict[ids[i]] = value[i]
                db.browserY.insert_one(in_dict)
                in_dict = {}
                #print(in_dict)
            line = infile.readline()

client=pymongo.MongoClient('mongodb://211.67.31.244:26906')
db = client.mirnasnp
au = db.authenticate('mirnasnp_admin','mirnasnp_access',mechanism='SCRAM-SHA-1')
if au:
    print("Auth db success!")
else:
    print("Auth db failed!")

import_files(sys.argv[1])

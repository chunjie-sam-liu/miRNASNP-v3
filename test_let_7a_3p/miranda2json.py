import json,sys

def miranda2json(result):
    mj_dict = {}
    i = 0
    with open("miranda2json.out","a") as out:
        with open(result,"r") as res:
            line = res.readline().strip()
            while line:
                if line.startswith('Forward'):
                    i += 1
                    query = res.readline()
                    query1 = res.readline()
                    query2 = res.readline()
                    energy = res.readline()
                    nonsense = res.readline()
                    hitinfo = res.readline().split()
                    mj_dict['hit_id'] = i
                    mj_dict['query'] = query+query1+query2
                    mj_dict['mir_id'] = hitinfo[0][1:]
                    mj_dict['utr3_pos'] = hitinfo[1]
                    mj_dict['score'] = hitinfo[2]
                    mj_dict['energy'] = hitinfo[3]
                    mj_dict['utr_map_start'] = hitinfo[6]
                    mj_dict['utr_map_end'] = hitinfo[7]
                    json.dump(mj_dict,out)
                    mj_dict = {}
                line = res.readline().strip()
            
if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("###The save miranda result file to json format###")
        print("-----------------------------------------------------------")
        print("usage:python "+sys.argv[0]+" miranda_result_file")
    else:
        miranda2json(sys.argv[1])





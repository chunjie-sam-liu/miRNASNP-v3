import json

def getMirid():
    with open("/home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/mir_name.json") as infile:
        mir_name_dict = json.load(infile)
        return mir_name_dict

def outJson():
    mir_name_dict = getMirid()
#        out.write("mir_id\tmir_acc\tmir_chr\tmir_start\tmir_end\tmir_strand\tmir_snp\tsnp_location\tlocation\n")
    items = {}
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_mir") as infile:
        line = infile.readline()
        while line:
            nline = line.strip().split()
            subdic = {}
            #print(nline[11])
            mir_id = nline[11].split(':')[1]
            item_key = mir_id+':'+nline[14]
            if item_key not in items.keys():
                subdic['mir_acc'] = mir_name_dict[mir_id]['mir_acc']
                subdic['mir_chr'] = mir_name_dict[mir_id]['mir_chr']
                subdic['mir_start'] = mir_name_dict[mir_id]['mir_start']
                subdic['mir_end'] = mir_name_dict[mir_id]['mir_end']
                subdic['mir_strand'] = mir_name_dict[mir_id]['mir_strand']
                subdic['mir_snp'] = [nline[2]]
                subdic['location'] = nline[14]
                items[item_key] = subdic
            else:
                items[item_key]['mir_snp'].append(nline[2])
            line = infile.readline()
    return items

def outTable():
    items = outJson()
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_mir.txt","a") as out:
        out.write("mir_id\tmir_acc\tmir_chr\tmir_start\tmir_end\tmir_strand\tlocation\tcount_snp\tsnp_info\n")
        for keys in items.keys():
            item = items[keys]
            mirid = keys.split(':')[0]
            out.write(mirid+'\t'+item['mir_acc']+'\t'+item['mir_chr']+'\t'+item['mir_start']+'\t'+item['mir_end']+'\t'+item['mir_strand']+'\t'\
                      +item['location']+'\t'+str(len(item['mir_snp']))+'\t'+','.join(item['mir_snp'])+'\n')

outTable()

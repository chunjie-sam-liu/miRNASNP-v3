import json

def getMirid():
    with open("/home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/mir_name.json") as infile:
        mir_name_dict = json.load(infile)
        return mir_name_dict

def outJson():
    mir_name_dict = getMirid()
#        out.write("mir_id\tmir_acc\tmir_chr\tmir_start\tmir_end\tmir_strand\tmir_snp\tsnp_location\tlocation\n")
    items = {}
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_flank") as infile:
        line = infile.readline()
        while line:
            nline = line.strip().split()
            subdic = {}
            mir_id = nline[11].split(':')[2]
            flank_location = nline[11].split(':')[1]
            item_key = mir_id+':'+flank_location
            if item_key not in items.keys():
                subdic['mir_id'] = mir_id
                subdic['flank_location'] = flank_location
                subdic['mir_acc'] = mir_name_dict[mir_id]['mir_acc']
                subdic['mir_chr'] = mir_name_dict[mir_id]['mir_chr']
                subdic['mir_start'] = mir_name_dict[mir_id]['mir_start']
                subdic['mir_end'] = mir_name_dict[mir_id]['mir_end']
                subdic['mir_strand'] = mir_name_dict[mir_id]['mir_strand']
                subdic['mir_snp'] = [nline[2]]
                subdic['location'] = 'flank'
                items[item_key] = subdic
            else:
                items[item_key]['mir_snp'].append(nline[2])
            line = infile.readline()
    return items

def outTable():
    items = outJson()
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/compteXY/y_snp_in_flank.txt","a") as out:
        out.write("mir_id\tmir_acc\tmir_chr\tmir_start\tmir_end\tmir_strand\tlocation\tupstream\tupstram_snp\tdownstream\tdownstream_snp\n")
        premir = []
        for keys in items.keys():
            mirid = keys.split(':')[0]
            if mirid not in premir:
                premir.append(mirid)
                upart = items[mirid+':upstream']
                downpart = items[mirid+':downstream']
                out.write(mirid+'\t'+upart['mir_acc']+'\t'+upart['mir_chr']+'\t'+upart['mir_start']+'\t'+upart['mir_end']+'\t'+upart['mir_strand']+'\t'+upart['location']+'\t'+str(len(upart['mir_snp']))\
                          +'\t'+','.join(upart['mir_snp'])+'\t'+str(len(downpart['mir_snp']))+'\t'+','.join(downpart['mir_snp'])+'\n')
                
outTable()

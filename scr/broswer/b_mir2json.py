import json,re

with open("/home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/mir_name.json","a") as out:
    mir_dict = {}
    with open("/home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/grch38p12_hsa.gff3") as infile:
        for line in infile:
            if line.startswith('chr'):
                nline = line.strip().split()
                mir_id = re.findall(r'Name=(hsa-.*);g',nline[8])[0]
                mir_acc = re.findall(r'ID=(MI.*);A',nline[8])[0]
                print(mir_acc)
                mir_dict[mir_id] = mir_acc
    #    json.dump(mir_dict,out)
                



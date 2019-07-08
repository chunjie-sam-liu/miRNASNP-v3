import json

with open("/home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/mongotable/snp_in_seed.json","a") as out:
    temp_json={}
    with open("/home/fux/fux/miRNASNP3/map_mir_snp/map_seed_02/mongotable/snp_in_seed_4666.rela.snv") as infile:
        for line in infile:
            if line.startswith('chr'):
                nline=line.strip().split()
                if nline[2] in temp_json.keys():
                    temp_json[nline[2]].append(line.strip())
                else:
                    temp_json[nline[2]]=[line.strip()]
        json.dump(temp_json,out)

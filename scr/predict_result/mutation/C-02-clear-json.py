import json

with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-mm.json") as infile:
    info_dict=json.load(infile)

with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-st-insec-sm-clear-info","a") as out:
    with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-st-insec-sm-clear") as infile:
        for line in infile:
            nline=line.strip().split()
            lkey=nline[0]+'#'+nline[1]+'#'+nline[2]+'#'+nline[3]
            infos=info_dict[lkey]
            for info in infos:
                out.write(line.strip()+'\t'+info+'\n')
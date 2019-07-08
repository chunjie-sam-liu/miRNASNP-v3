import json,re

with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-st-insec-sm-clear-info.json","a") as out:
    temp_json={}
    with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-st-insec-sm-clear-info") as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            lkey=nline[5]+'_'+nline[4]
            if lkey in temp_json.keys():
                temp_json[lkey].append(nline[3])
            else:
                temp_json[lkey]=[nline[3]]
        json.dump(temp_json,out)
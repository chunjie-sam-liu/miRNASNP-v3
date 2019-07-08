import json

with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-st-insec-sm-clear-info.json") as infile:
    insec_dict=json.load(infile)

with open("/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_unin_wm_2652.json") as infile:
    unin_dict=json.load(infile)

with open("/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_clinvar_02","a") as out:
    temp_json={}
    for k in insec_dict.keys():
        gene=k.split('_')[0]
        if gene in unin_dict.keys():
            temp_json[k]=list(set(insec_dict[k])-set(unin_dict[gene]))
    json.dump(temp_json,out)

with open("/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_clinvar_02.stat","a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')
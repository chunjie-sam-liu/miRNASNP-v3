import json,sys,re

f=sys.argv[1]
filename=f.split('.')[0]
mirna=f.split('_')[0]

unin_path="/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_unin_wm_2652_json/"
insec_path="/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/sm_insec_st_info_json/"
out_path="/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_gain/"

with open(insec_path+f) as infile:
    insec_dict=json.load(infile)

with open(unin_path+mirna+".json") as infile:
    unin_dict=json.load(infile)
 
with open(out_path+filename+".json","a") as out:
    temp_json={}
    for k in insec_dict.keys():
        mirna_id=k.split('_')[0]
        if mirna_id in unin_dict.keys():
            temp_json[k]=list(set(insec_dict[k])-set(unin_dict[mirna_id]))
    json.dump(temp_json,out)

with open(out_path+"seed_cosmic_gain.stat","a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')
import sys,json,re

f=sys.argv[1]
filename=f.split('.')[0]
mirna=f.split('_')[0]

insec_path="/home/fux/fux/miRNASNP3/predict_result/seed_target/wt_insec_wm_clear_info_json/"
unin_path="/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/st_unin_sm_json/"
out_path="/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss/"

with open(insec_path+mirna+".json") as infile:
    insec_dict=json.load(infile)

with open(unin_path+f) as infile:
    unin_dict=json.load(infile)

with open(out_path+filename+".json","a") as out:
    temp_json={}
    for k in unin_dict.keys():
        mirna_id=k.split('_')[0]
        if mirna_id in insec_dict.keys():
            temp_json[f]=list(set(insec_dict[mirna_id])-set(unin_dict[k]))
    json.dump(temp_json,out)

with open("/home/fux/fux/miRNASNP3/Gain_Loss/seed_cosmic_loss.stat","a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')
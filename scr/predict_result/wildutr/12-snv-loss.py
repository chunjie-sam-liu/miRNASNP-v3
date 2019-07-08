import json,os,sys

wt_insec_wm="/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear_info_json/"
st_unin_sm="/home/fux/fux/miRNASNP3/predict_result/altutr/st_unin_sm_json/"

out_path="/home/fux/fux/miRNASNP3/Gain_Loss/utr_loss_02/"

f=sys.argv[1]

def getInsec(f):
    with open(wt_insec_wm+f) as infile:
        insec_dict=json.load(infile)
        return insec_dict
def getUnin(f):
    with open(st_unin_sm+f) as infile:
        unin_dict=json.load(infile)
        return unin_dict

files=os.listdir(wt_insec_wm)

#for f in files:
insec_dict=getInsec(f)
unin_dict=getUnin(f)
with open(out_path+f,"a") as out:
    temp_json={}
    for k in insec_dict.keys():
        if k in unin_dict.keys():
            temp_json[k]=list(set(insec_dict[k])-set(unin_dict[k]))
    json.dump(temp_json,out)
with open(out_path+f+".stat","a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')
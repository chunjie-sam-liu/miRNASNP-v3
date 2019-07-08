import json,sys,re,os

out_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/wm_insec_wt_chr/"
in_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear/"

files=os.listdir(in_path)

def getJson():
    with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/truncate_wildutr_03.key.json") as infile:
        key_dict=json.load(infile)
        return key_dict

def getTruncate(f):
    with open("/home/fux/fux/miRNASNP3/predict_result/wildutr/wildutr_mm_json/"+f+".json") as infile:
        truncate_dict=json.load(infile)
        return truncate_dict

key_dict=getJson()

for f in files:
    fi=f.split('.')[0]
    truncate_dict=getTruncate(fi)
    with open("/home/fux/fux/miRNASNP3/predict_result/wildutr/wt_intersect_wm_clear/"+f) as infile:
        for line in infile:
            nline=re.split(r'\t|#',line.strip())
            lkey=nline[0]+'#'+nline[1]+'#'+nline[2]+'#'+nline[3]+'#'+nline[4]
            ninfo=truncate_dict[lkey].split('\t')
            gkey=ninfo[2]+':'+ninfo[3]+'-'+ninfo[4]+'#'+ninfo[1]
            ngene=key_dict[gkey]
            with open(out_path+ninfo[2],"a") as out:
                for item_ngene in ngene:
                    out.write(item_ngene+'#'+nline[3]+'\n')
    



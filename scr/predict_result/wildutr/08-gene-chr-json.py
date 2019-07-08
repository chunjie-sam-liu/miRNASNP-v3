import json,os,sys

in_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/wm_insec_wt_chr/"
out_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/wm_insec_wt_gene_json_chr/"

#files=os.listdir(in_path)

#for f in files:
with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=line.strip().split('#')
            lkey=nline[2]+'_'+nline[5]
            if lkey in temp_json.keys():
                temp_json[lkey].append(nline[8])
            else:
                temp_json[lkey]=[nline[8]]
        json.dump(temp_json,out)
                    

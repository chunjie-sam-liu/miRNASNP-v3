import json,sys

with open("/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_unin_wm_2652.json") as infile:
    wt_unin_wm=json.load(infile)

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        st_insec_sm=json.load(infile)
        for k in st_insec_sm.keys():
            gene=k.split('_')[0]
            if gene in wt_unin_wm.keys():
                temp_json[k]=list(set(st_insec_sm[k])-set(wt_unin_wm[gene]))
            else:
                print("unmatch gene:"+gene)
        json.dump(temp_json,out)
with open(sys.argv[3],"a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')

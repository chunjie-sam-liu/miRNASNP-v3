import json,os
'''
in_path="/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_intersect_wm_2652_chr_except/"

files=os.listdir(in_path)

with open("/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_intersect_wm_2652_chr_except.json","a") as out:
    temp_json={}
    for f in files:
        with open(in_path+f) as infile:
            for line in infile:
                nline=line.strip().split()
                if nline[1] in temp_json.keys():
                    temp_json[nline[1]].append(nline[0])
                else:
                    temp_json[nline[1]]=[nline[0]]
    json.dump(temp_json,out)
'''

with open("/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_intersect_wm_2652_chr_except.json") as infile:
    temp_json=json.load(infile)
with open("/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_intersect_wm_2652_chr_except.stat","a") as out:
    for mir in temp_json.keys():
        gene_count=len(list(set(temp_json[mir])))
        newline=mir+'\t'+str(gene_count)
        out.write(newline+'\n')
import json,re

with open("/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_clinvar_02") as infile:
    gain_dict=json.load(infile)

with open("/home/fux/fux/miRNASNP3/Gain_Loss/utr_gain_clinvar_info_02","a") as out:
    with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-st-insec-sm-clear-info") as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            lkey=nline[5]+'_'+nline[4]
            if lkey in gain_dict.keys():
                if nline[3] in gain_dict[lkey]:
                    out.write(line)
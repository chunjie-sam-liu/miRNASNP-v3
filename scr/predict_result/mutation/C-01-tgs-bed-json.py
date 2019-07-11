import re,json

with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-tgs.bed","a") as outbed:
    with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-tgs.json","a") as outjson:
        temp_json={}
        with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-tgs-alturt.res") as infile:
            for line in infile:
                if line.startswith("chr"):
                    nline=re.split(r'\t|#|:',line.strip())
                    strand=re.split(r'\(|\)',nline[1])[1]
                    if strand=='-':
                        site_start=int(nline[10])-int(nline[14])
                        site_end=int(nline[10])-int(nline[13])
                    else: 
                        site_start=int(nline[9])+int(nline[13])
                        site_end=int(nline[9])+int(nline[14])
                    newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[11]+'#'+nline[6]+'#'+nline[3]
                    lkey=nline[0]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[11]+'#'+nline[6]+'#'+nline[3]
                    if lkey in temp_json.keys():
                        temp_json[lkey].append(line.strip())
                    else:
                        temp_json[lkey]=[line.strip()]
                        outbed.write(newline+'\n')
            json.dump(temp_json,outjson)
import json,os,re

table_path="/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar_mm_table_suply"
files=os.listdir(table_path)

with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-mm.bed","a") as outbed:
    with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar-mm.json","a") as outjson:
        temp_json={}
        for f in files:
            with open("/home/fux/fux/miRNASNP3/predict_result/mutation_altutr/clinvar_mm_table_suply/"+f) as infile:
                for line in infile:
                    if line.startswith('hsa-'):
                        nline=line.strip().split('\t')
                        nutr=re.split(r'#|:',nline[25])
                       # print(nutr)
                        strand=re.split(r'\(|\)',nutr[2])[1]
                        if strand=='-':
                            site_start=int(nutr[11])-int(nline[11])
                            site_end=site_start+int(nline[12])
                        else:
                            site_end=int(nline[11])+int(nutr[10])
                            site_start=site_end-int(nline[12])
                        newline=nline[2]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[0]+'#'+nline[1]+'#'+nline[7]
                        lkey=nline[2]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[0]+'#'+nline[1]+'#'+nline[7]
                        if lkey in temp_json.keys():
                            temp_json[lkey].append(line.strip())
                        else:
                            temp_json[lkey]=[line.strip()]
                            outbed.write(newline+'\n')
        json.dump(temp_json,outjson)
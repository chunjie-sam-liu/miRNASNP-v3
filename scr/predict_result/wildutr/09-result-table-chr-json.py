import json,sys

in_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/result_table/"
out_path="/home/fux/fux/miRNASNP3/predict_result/wildutr/result_table_chr/"

with open(sys.argv[2],"a") as outjson:
        temp_json={}
        with open(sys.argv[1]) as infile:
            for line in infile:
                if line.startswith('hsa-'):
                    nline=line.strip().split()
                    site_end=int(nline[3])+int(nline[6])
                    site_start=site_end-int(nline[7])
                    #newline=nline[2]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[0]+'#'+nline[1]
                    lkey=nline[2]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[0]+'#'+nline[1]
                    if lkey in temp_json.keys():
                        temp_json[lkey].append(line.strip())
                    else:
                        temp_json[lkey]=[line.strip()]
                    #outbed.write(newline+'\n')
            json.dump(temp_json,outjson)
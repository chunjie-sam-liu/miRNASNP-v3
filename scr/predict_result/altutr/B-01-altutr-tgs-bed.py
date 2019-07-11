import json,sys,re

json_path="/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_json/"
bed_path="/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr_bed/"
in_path="/home/fux/fux/miRNASNP3/predict_result/altutr/Targetscan/tga_altutr_compltet_chr/"

f=sys.argv[1]
fi=f.split('.')[0]

with open(json_path+fi+".json","a") as jsonout:
    temp_json={}
    with open(bed_path+f,"a") as bedout:
        with open(in_path+f) as infile:
            for line in infile:
                nline=re.split(r':|#|\t',line.strip())
                strand=re.split(r'\(|\)',nline[1])[1]
                if strand=='-':
                    site_start=int(nline[10])-int(nline[14])
                    site_end=int(nline[10])+int(nline[13])
                else:
                    site_start=int(nline[9])+int(nline[13])
                    site_end=int(nline[9])+int(nline[14])
                newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[11]+'#'+nline[6]+'#'+nline[3]
                newkey=nline[0]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[11]+'#'+nline[6]+'#'+nline[3]
                if newkey in temp_json.keys():
                    temp_json[newkey].append(line.strip())
                else:
                    temp_json[newkey]=[line.strip()]
                    bedout.write(newline+'\n')
            json.dump(temp_json,jsonout)

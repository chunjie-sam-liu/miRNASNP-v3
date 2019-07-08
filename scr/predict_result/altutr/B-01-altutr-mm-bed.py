import sys,json

def getTruncate():
    with open("/home/fux/fux/miRNASNP3/map_utr3_snp/map_utr_02/freq/truncate_altutr_03.key.json") as infile:
        truncate_json=json.load(infile)
        return truncate_json

truncate_json=getTruncate()

with open(sys.argv[2],"a") as jsonout:
    temp_json={}
    with open(sys.argv[3],"a") as bedout:
        with open(sys.argv[1]) as infile:
            for line in infile:
                #print(line)
                nline=line.strip().split()
                truncate_key=nline[2]+':'+nline[3]+'-'+nline[4]+'('+nline[5]+')'+'#'+nline[1]
                if truncate_key not in truncate_json.keys():
                    print(truncate_key)
                    print(line.strip())
                truncate=truncate_json[truncate_key].split()
                strand=nline[4]
                if strand=='-':
                    site_start=int(truncate[1])-int(nline[11])
                    site_end=site_start+int(nline[12])
                else:
                    site_end=int(truncate[0])+int(nline[11])
                    site_start=site_end-int(nline[12])
                newline=nline[2]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[0]+'#'+nline[1]+'#'+nline[7]
                newkey=nline[2]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[0]+'#'+nline[1]+'#'+nline[7]
                if newkey in temp_json.keys():
                    temp_json[newkey].append(line.strip()+'\t'+truncate_json[truncate_key])
                else:
                    temp_json[newkey]=[line.strip()+'\t'+truncate_json[truncate_key]]
                    bedout.write(newline+'\n')
            json.dump(temp_json,jsonout)
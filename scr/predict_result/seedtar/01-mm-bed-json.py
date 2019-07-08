import json,sys

with open(sys.argv[2],"a") as bedout:
    with open(sys.argv[3],"a") as jsonout:
        temp_json={}
        with open(sys.argv[1]) as infile:
            for line in infile:
                if line.startswith ("hsa"):
                    nline=line.strip().split()
                    strand=nline[4]
                    if strand=='-':
                        site_start=int(nline[3])-int(nline[10])
                        site_end=site_start+int(nline[11])
                    else:
                        site_end=int(nline[2])+int(nline[10])
                        site_start=site_end-int(nline[11])
                    newline=nline[1]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[0]+'#'+nline[6]
                    newkey=nline[1]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[0]+'#'+nline[6]
                    if newkey in temp_json.keys():
                        temp_json[newkey].append(line.strip())
                    else:
                        temp_json[newkey]=[line.strip()]
                        bedout.write(newline+'\n')
        json.dump(temp_json,jsonout)
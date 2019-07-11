import sys,json

with open(sys.argv[3],"a") as jsonout:
    temp_json={}
    with open(sys.argv[2],"a") as bedout:
        with open(sys.argv[1]) as infile:
            for line in infile:
                if line.startswith("hsa"):
                    nline=line.strip().split()
                    strand=nline[5]
                    if strand=='-':
                        site_start=int(nline[4])-int(nline[11])
                        site_end=site_start+int(nline[12])
                    else:
                        site_end=int(nline[3])+int(nline[11])
                        site_start=site_end-int(nline[12])
                    newline=nline[2]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[0]+'#'+nline[1]+'#'+nline[7]
                    newkey=nline[2]+'#'+str(site_start)+'#'+str(site_end)+'#'+nline[0]+'#'+nline[1]+'#'+nline[7]
                    if newkey in temp_json.keys():
                        temp_json[newkey].append(line.strip())
                    else:
                        temp_json[newkey]=[line.strip()]
                        bedout.write(newline+'\n')
            json.dump(temp_json,jsonout)

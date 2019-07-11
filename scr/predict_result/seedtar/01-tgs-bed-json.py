import json,sys,re

with open(sys.argv[2],"a") as bedout:
    with open(sys.argv[3],"a") as jsonout:
        temp_json={}
        with open(sys.argv[1]) as infile:
            for line in infile:
                if line.startswith('chr'):
                    nline=re.split(r':|#|\t',line.strip())
                    strand=re.split(r'\(|\)',nline[1])[1]
                    position=re.split(r'\(|\)',nline[1])[0].split('-')
                    if strand=='-':
                        site_start=int(position[1])-int(nline[9])
                        site_end=int(position[1])-int(nline[8])
                    else:
                        site_start=int(position[0])+int(nline[8])
                        site_end=int(position[0])+int(nline[9])
                    if nline[6].startswith('hsa'):
                        mirna=nline[6]
                    else:
                        mirna="hsa-"+nline[6]
                    newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+mirna+'#'+nline[3]
                    newkey=nline[0]+'#'+str(site_start)+'#'+str(site_end)+'#'+mirna+'#'+nline[3]
                    if newkey in temp_json.keys():
                        temp_json[newkey].append(line.strip())
                    else:
                        temp_json[newkey]=[line.strip()]
                        bedout.write(newline+'\n')
            json.dump(temp_json,jsonout)

import sys,re,json

with open(sys.argv[2],"a") as out:
    temp_json={}
    with open(sys.argv[1]) as infile:
        for line in infile:
            if line.startswith('chr'):
                nline=re.split(r':|#|\t',line.strip())
                nl=line.strip().split()
                strand=re.split(r'\(|\)',nline[1])[1]
                position=re.split(r'\(|\)',nline[1])[0].split('-')
                if strand=='-':
                    site_start=int(position[1])-int(nline[7])
                    site_end=site_start+int(nline[8])
                else:
                    site_end=int(position[0])+int(nline[7])
                    site_start=site_end-int(nline[8])
                newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nl[0]
                out.write(newline+'\n')
                lkey=nline[0]+'_'+str(site_start)+'_'+str(site_end)+'_'+nl[0]
                if lkey in temp_json.keys():
                    temp_json[lkey].append(line.strip())
                else:
                    temp_json[lkey]=[line.strip()]
with open(sys.argv[3],"a") as outj:
    json.dump(temp_json,outj)
            
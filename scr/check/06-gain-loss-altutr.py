import sys,json,re

#params1:intersect clear file
#params2:out file
#params3:info json file
#params4:unin gene file

with open(sys.argv[3]) as infile:
    info_json=json.load(infile)

with open(sys.argv[4]) as infile:
    unin_dict=[]
    for line in infile:
        unin_dict.append(line.strip())

with open(sys.argv[2],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nl=line.strip().split()
            mirna=nl[1]
            if mirna not in unin_dict:
                lkey=nl[0]+'_'+nl[1]+'_'+nl[2]
                infos=info_json[lkey]
                for info in infos:
                    out.write(line.strip()+'\t'+info+'\n')
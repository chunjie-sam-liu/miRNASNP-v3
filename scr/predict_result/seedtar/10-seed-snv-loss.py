import sys,json

with open(sys.argv[1]) as infile:
    insec_dict=json.load(infile)

with open(sys.argv[2]) as infile:
    unin_dict=json.load(infile)

with open(sys.argv[3],"a") as out:
    temp_json={}
    for k in unin_dict.keys():
        mirna=k.split('_')[0]
        if mirna in insec_dict.keys():
            temp_json[k]=list(set(insec_dict[mirna])-set(unin_dict[k]))
    json.dump(temp_json,out)

with open(sys.argv[4],"a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')

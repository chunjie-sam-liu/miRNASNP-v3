import json,sys

with open(sys.argv[1]) as infile:
    insec_dict=json.load(infile)

with open(sys.argv[2]) as infile:
    unin_dict=json.load(infile)

with open(sys.argv[3],"a") as out:
    temp_json={}
    for k in insec_dict.keys():
        mirna=k.split('_')[0]
        temp_json[k]=list(set(insec_dict[k])-set(unin_dict[mirna]))
    json.dump(temp_json,out)

with open(sys.argv[4],"a") as out:
    for k in temp_json.keys():
        newline=k+'\t'+str(len(temp_json[k]))
        out.write(newline+'\n')
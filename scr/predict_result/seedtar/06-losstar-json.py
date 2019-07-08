import json,sys

in_path="/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_loss_4666/"
out_path="/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_loss_4666_json/"
stat_path="/home/fux/fux/miRNASNP3/Gain_Loss/In_seed_loss_4666_json.stat"
with open("/home/fux/fux/miRNASNP3/predict_result/mir_wild/wt_intersect_wm_2652_chr_except.json") as infile:
    chr_excep=json.load(infile)

f=sys.argv[1]

with open(out_path+f+".json","a") as out:
    temp_json={}
    with open(in_path+f) as infile:
        for line in infile:
            nline=line.strip().split()
            if nline[0] in chr_excep.keys():
                if nline[0] in chr_excep[nline[0]]:
                    pass
                else:
                    if f in temp_json.keys():
                        temp_json[f].append(nline[1])
                    else:
                        temp_json[f]=[nline[1]]
            else:
                if f in temp_json.keys():
                    temp_json[f].append(nline[1])
                else:
                    temp_json[f]=[nline[1]]
        json.dump(temp_json,out)

with open(stat_path,"a") as out:
    line=f+'\t'+str(len(temp_json[f]))
    out.write(line+'\n')


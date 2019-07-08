import sys,json,re

with open(sys.argv[2]) as infile:
    loss_dict=json.load(infile)

with open(sys.argv[3],"a") as out:
    with open(sys.argv[1]) as infile:
        for line in infile:
            nline=re.split(r'#|\t',line.strip())
            if nline[0].endswith('_alt') or nline[0]=="chrUn_GL000195v1":
                pass
            else:
                for k in loss_dict.keys():
                    mirna=k.split('_')[0]
                    snp_id=k.split('_')[1]
                    if nline[3]==mirna:
                        if nline[4] in loss_dict[k]:
                            out.write(line.strip()+'\t'+snp_id+'\n')
import json

def getNmlist():
    nm_list = []
    with open("total_grch38.txt") as infile:
        line = infile.readline()
        while line:
            nmid = line.strip().split()[1]
#            print(nmid)
            nm_list.append(nmid)
            line = infile.readline()
        return nm_list

nm_list = getNmlist()
fa_dict = {}
item = 0

with open("total_grch38.fa.json","a") as out:
    with open("nm_grch38_utr3.fa") as infile:
        line = infile.readline()
        while line:
            if line.startswith('>'):
                pos = line.strip()[1:]
                pos = pos.split('#')[0]
                if pos in nm_list:
                    if pos not in fa_dict.keys():
                        item += 1
                        fa_dict[pos] = infile.readline().strip()
            line = infile.readline()
        print(item)
        json.dump(fa_dict,out)

for nmid in nm_list:
  if nmid not in fa_dict.keys():
     print(nmid)

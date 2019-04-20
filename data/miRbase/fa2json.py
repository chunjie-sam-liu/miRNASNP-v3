import json

with open("mature.fa.json","a") as faj:
    fa_dict = {}
    item = 0
    with open("mature.fa") as fa:
        line = fa.readline().strip()
        while line:
            if line.startswith('>'):
                fa_dict[line] = fa.readline().strip()
                item += 1
            line = fa.readline().strip()
        json.dump(fa_dict,faj)
        print(item)
  

import sys

def haSnp():
    with open("snp_in_seedregion") as sis:
        snp_list = []
        for line in sis:
            cursnp = line.strip().split()[3]
            snp_list.append(cursnp)
        return snp_list

def unLoss():
    unloss = []
    with open("share_unloss_2") as ul:
        for line in ul:
            unloss.append(line)
        return unloss

def tarLoss():
    tloss = []
    with open("wm_insect_wt_1","r") as wm_ins_wt:
        for line in wm_ins_wt:
            line = line.strip()
            for snp in snp_list:
                newline = line+"\t"+snp+'\n'
                if newline in unloss:
                    continue
                else:
                    tloss.append(newline)
        uniq_tloss = list(set(tloss))
        return uniq_tloss

def outPut(outfiles):
    with open(outfiles,"a") as outfile:
        for line in uniq_tloss:
            outfile.write(line)

if __name__ == '__main__':
    snp_list = haSnp()
    unloss = unLoss()
    uniq_tloss = tarLoss()
    outPut(sys.argv[1])

       

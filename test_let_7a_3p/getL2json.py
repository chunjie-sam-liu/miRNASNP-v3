import json,sys,re

def getJson(infiles):
    with open(infiles) as infile:
        mydict = json.load(infile)
        return mydict

def haSnp(hitinfo):
    with open("snp_in_seedregion") as sis:
        snp_list = []
        for line in sis:
            cursnp = line.strip().split()[3]
            line = hitinfo.split()
            mirid = line[0][5:]
            utrid = grch38_utr3[line[1]]
            newline = utrid+':'+mirid+'\t'+line[6]+'\t'+line[7]+'\t'+cursnp+'\n'
            if newline in glist:
                snp_list.append(cursnp)
            else:
                continue
        return snp_list

def getGlist(glfile):
    glist = []
    with open(glfile,"r") as gl:
        for line in gl:
            glist.append(line)
        return glist

def getGlistpartial(glfile):
    glistp = []
    with open(glfile,"r") as gl:
        for line in gl:
            line = line.strip().split()
            newline = line[0]+'\t'+line[1]+'\t'+line[2]+'\n'
            glistp.append(newline)
        return glistp 

def checkGL(hitinfo):
    line = hitinfo.split()
    mirid = line[0][5:]
    utrid = grch38_utr3[line[1]]
    newline = utrid+':'+mirid+'\t'+line[6]+'\t'+line[7]+'\n'
    if newline in glistp:
        return 1
    else:
        return 0

def outJson(miranda_infile,outfile):
    with open(outfile,"a") as out:
        mj_dict = {}
        with open(miranda_infile,"r") as res:
            line = res.readline().strip()
            while line:
                if line.startswith('Forward'):
                    query = res.readline()
                    query1 = res.readline()
                    query2 = res.readline()
                    energy = res.readline()
                    nonsense = res.readline()
                    hitinfo = res.readline()
                    if checkGL(hitinfo):
                        mj_dict['snp_cause_loss'] = haSnp(hitinfo)
                        hitinfo = hitinfo.split()
                        mj_dict['mir_id'] = hitinfo[0][1:]
                        mj_dict['utr3_pos'] = hitinfo[1]
                        mj_dict['query'] = query+query1+query2
                        mj_dict['score'] = hitinfo[2]
                        mj_dict['energy'] = hitinfo[3]
                        mj_dict['utr_map_start'] = hitinfo[6]
                        mj_dict['utr_map_end'] = hitinfo[7]
                        json.dump(mj_dict,out)
                        mj_dict = {}
                line = res.readline().strip()

if __name__ == '__main__':
    if len(sys.argv)!=4:
        print("### covert loss hits info to json format ###")
        print("---------------------------------------------------")
        print("usage:python "+sys.argv[0]+" Loss_file miranda_wild_res outfile")
    else:
        grch38_utr3 = getJson("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3.json")
        glist = getGlist(sys.argv[1])
        glistp = getGlistpartial(sys.argv[1])
        outJson(sys.argv[2],sys.argv[3])


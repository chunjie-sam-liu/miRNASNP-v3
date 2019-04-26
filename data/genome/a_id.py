import json

def getGrch38():
    with open("grch38_utr3.json") as infile:
        grch38_utr3 = json.load(infile)
        return grch38_utr3

def getIdconverter():
    with open("/home/fux/fux/miRNASNP3/test_let_7a_3p/ID_convert.jaon") as infile:
        id_convert = json.load(infile)
        return id_convert

def outNmseq(outch):
    with open("nm_grch38_utr3.fa","a") as out:
        out.write(outch+'\n')
def outNnmseq(outch):
    with open("nnm_grch38_utr3.fa","a") as out:
        out.write(outch+'\n')
def outNbiomart(outch):
    with open("nbiomart_grch38_utr3.fa","a") as out:
        out.write(outch+'\n')
def outStatutr(outch):
    with open("stat_grch38_utr3","a") as out:
        out.write(outch+'\n')


def fixId():
    with open("re_grch38_utr3.fa") as infile:
        line = infile.readline()
        while line:
            grchid = line.strip()[1:]
            utrid = grch38_utr3[grchid]
            enst = utrid.split('.')[0]
        #    print(enst)
            if enst in id_convert.keys():
                symbol = id_convert[enst]
                seq = infile.readline().strip()
                seq_len = len(seq)
                if len(symbol) == 2:
                    newid = grchid+'#'+enst+'#'+symbol[0]+'#'+symbol[1]+'#'+str(seq_len)
                    newid_stat = grchid+'\t'+enst+'\t'+symbol[0]+'\t'+symbol[1]+'\t'+str(seq_len)
                    outNmseq('>'+newid)
                    outNmseq(seq)
                    outStatutr(newid_stat)
                else:
                    newid = grchid+'#'+enst+'#'+symbol[0]+'#'+str(seq_len)
                    newid_stat = grchid+'\t'+enst+'\t'+symbol[0]+'\t0\t'+str(seq_len)
                    outStatutr(newid_stat)
                    outNnmseq('>'+newid)
                    outNnmseq(seq)
            else:
                seq = infile.readline().strip()
                seq_len = len(seq)
                newid = grchid+'#'+enst+'#'+str(seq_len)
                newid_stat = grchid+'\t'+enst+'\tno_biomart\t0\t'+str(seq_len)
                outStatutr(newid_stat)
                outNbiomart('>'+newid)
                outNbiomart(seq)
            line = infile.readline()  
if __name__ == '__main__':
    grch38_utr3 = getGrch38()
    id_convert = getIdconverter()
    fixId()


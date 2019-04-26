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


def fixId():
    with open("re_grch38_utr3.fa") as infile:
        line = infile.readline()()
        while line:
            grchid = line.strip()[1:]
            utrid = grch38_utr3[grchid]
            enst = utrid.split('\.')[0]
            if enst in id_convert.keys():
                symbol = id_convert[enst]
                seq = infile.readline().strip()
                seq_len = len(seq)
                if len(symbol) == 2:
                    newid = grchid+'#'+enst+'#'+symbol[0]+'#'symbol[1]+'#'+str(seq_len)
                    outNmseq('>'+newid)
                    outNmseq(seq)
                else:
                    newid = grchid+'#'+enst+'#'+symbol[0]+'#'+str(seq_len)
                    outNmseq('>'+newid)
                    outNnmseq(seq)
            else:
                seq = infile.readline().strip()
                seq_len = len(seq)
                newid = grchid+'#'+enst+'#'+str(seq_len)
                outNbiomart('>'+newid)
                outNbiomart(seq)  
if __name__ == '__main__':
    grch38_utr3 = getGrch38()
    id_convert = getIdconverter()
    fixId()


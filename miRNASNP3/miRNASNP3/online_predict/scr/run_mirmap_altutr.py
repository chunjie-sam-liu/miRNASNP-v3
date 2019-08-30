import sys,json

sys.path.append('/home/fux/tools/miRmap-1.1/src')

import mirmap
import mirmap.library_link

#ENST00000371582(-)
#ENST00000371582 = 'AAGAAAGATACTCATTTATAGTTACGTTCATTTCAGGTTAAACATGAAAGAAGCCTGGTTACTGATTTgtataaaatgtactcttaaagtataaaatataaggtaAGGTAAATTTCATGCATCTTTTTATGAAGACCACCTATTTTATATTTCAAATTAAATAATTTTAAAGTTGCTGGCCTAATGAGCAATGTTCTCAATTTTCGTTTTCATTTTGCTGTATTGAGACCTATAAATAAATGTATATTTTTTTTTGCATAAAGTA'
#.upper().complementary.invert which not work
#seq_target = "".join(map(lambda x:RULE3[x],ENST00000371582.upper()))[::-1]

#params1: a mirna sequence
#params2: output file

#usage: the script will predict all target in 34116 trancript of the provided mirna sequence

def outPut(outfile):
    with open(sys.argv[2],"a") as out:
        out.write(outfile+'\n')

def getMirseq():
    seq_target_dict = {}
    with open("/home/fux/refdata/miRNASNP3/muture.fa.hsa.json") as infile:
        seq_mirna_dict = json.load(infile)
        return seq_mirna_dict

def mirmapredict(seq_mirna,seq_target):
    seq_target_1 = "".join(map(lambda x:RULE2[x],seq_target.upper()))
    mim = mirmap.mm(seq_target_1, seq_mirna)
    mim.find_potential_targets_with_seed(allowed_lengths=[6,7], allowed_gu_wobbles={6:0,7:0},allowed_mismatches={6:0,7:0}, take_best=True)

    if  len(mim.end_sites) != 0:
        mim.eval_tgs_au(with_correction=False)
        mim.eval_tgs_pairing3p(with_correction=False)
        mim.eval_tgs_position(with_correction=False)
        mim.eval_tgs_score(with_correction=False)
#mim.eval_score()
        mim.libs = mirmap.library_link.LibraryLink('/home/fux/tools/miRmap-1.1/libs/lib-archlinux-x86_64')
        mim.exe_path = '/home/fux/tools/miRmap-1.1/libs/exe-archlinux-x86_64'
        mim.dg_duplex
        mim.dg_open
        mim.dg_binding
        mim.prob_exact
        mim.eval_score
        outPut(mim.report())


def predict(tarseq):
        seq_target=tarseq
        for k in seq_mirna_dict.keys():
                seq_mirna = seq_mirna_dict[k]
                        #seq_mirna = 'CUGUACAACCUUCUAGCUUUCC'
                headline = '>'+k
                outPut(headline)
                mirmapredict(seq_mirna,seq_target)

if __name__ == '__main__':
    #usage python2 $0 mirfile outfile
    #mirfile should be fasta file
    reload(sys)
    sys.setdefaultencoding('utf-8')
    RULE1={"A":"U","C":"G","G":"C","U":"A"}
    RULE2={"A":"A","C":"C","G":"G","T":"U","N":"N"}
    RULE3={"A":"U","C":"G","G":"C","T":"A"}
    tarseq=sys.argv[1]
    seq_mirna_dict = getMirseq()
    predict(tarseq)

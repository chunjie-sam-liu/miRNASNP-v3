import json

def getMirseq():
    with open("wild_hsa_mir.fa.json") as mirj:
        mirseq_dict = json.load(mirj)
        return mirseq_dict

def getxySeq():
   with open("xy_wildmir.fa","a") as wildout:
       with open("xy_snp_in_mirseed") as infile:
           sum_id = []
           for line in infile:
               line = line.strip().split()
               mir_id = line[11].split(':')[1]
               if mir_id not in sum_id:
                   sum_id.append(mir_id)
                   mir_seq = mirseq_dict[mir_id]
                   wildout.write(">"+mir_id+"\n")
                   wildout.write(mir_seq+"\n")

if __name__ == '__main__':
    mirseq_dict = getMirseq()
    getxySeq()


           

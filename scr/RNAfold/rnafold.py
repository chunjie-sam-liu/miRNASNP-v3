import json,re

def getMature():
    with open("/home/fux/fux/miRNASNP3/data/miRbase/muture.fa.hsa.json") as infile:
        mature_dict = json.load(infile)
        return mature_dict

def getHarpin():
    with open("/home/fux/fux/miRNASNP3/data/miRbase/hairpin.fa.json") as infile:
        harpin_dict = json.load(infile)
        i = 0
        for mir in harpin_dict.keys():
            if mir.startswith('hsa'):
                i += 1
                with open("/home/fux/fux/miRNASNP3/RNAfold/hairpin/"+mir+".fa","a") as out:
                    out.write('>'+mir+'\n')
                    out.write(harpin_dict[mir]+'\n')
        print("mir:"+str(i))
      

def outSrc(f,cmd):
    with open("rnafold_"+f+".sh","a") as out:
        out.write(cmd+'\n')

def plotrna(plot_dict,pre_id,pre_start,pre_end):
    cmd_2 = []
#    print(plot_dict)
    for mir in plot_dict.keys():
        s = int(plot_dict[mir][0]) - int(pre_start)
        e = int(plot_dict[mir][1]) - int(pre_start)
        cmd_2.append(s)
        cmd_2.append(e)
    cmd1 = "RNAfold < /home/fux/fux/miRNASNP3/RNAfold/hairpin/"+pre_id+".fa >/home/fux/fux/miRNASNP3/RNAfold/wild_pdf_2652/"+pre_id+".fold"
    cmd_2.sort()
 #   print(cmd_2)
    if len(cmd_2) ==2:
        cmd_2_1 = '1 '+str(cmd_2[0])+' 8 GREEN omark '+str(int(cmd_2[0])+1)+' '+str(int(cmd_2[1])+1)+' 8 RED omark '+str(int(cmd_2[1])+2)+' '+str(int(pre_end)-int(pre_start)+1)+' 8 GREEN omark'
    elif len(cmd_2) ==4:
        cmd_2_1 = '1 '+str(cmd_2[0])+' 8 GREEN omark '+str(int(cmd_2[0])+1)+' '+str(int(cmd_2[1])+1)+' 8 RED omark '+str(int(cmd_2[1])+2)+' '+str(cmd_2[2])+' 8 GREEN omark '+str(int(cmd_2[2])+1)+' '+str(int(cmd_2[3])+1)+' 8 RED omark '+str(int(cmd_2[3])+2)+' '+str(int(pre_end)-int(pre_start)+1)+' 8 GREEN omark'
    cmd2 = "RNAplot --pre \""+cmd_2_1+"\"</home/fux/fux/miRNASNP3/RNAfold/wild_pdf_2652/"+pre_id+".fold"
    cmd3 = "ps2pdf /home/fux/fux/miRNASNP3/RNAfold/wild_pdf_2652/"+pre_id+"_ss.ps /home/fux/fux/miRNASNP3/RNAfold/wild_pdf_2652/"+pre_id+".pdf"
    outSrc(pre_id,cmd1+'\n'+cmd2+'\n'+cmd3)
    #print(cmd2)

with open("/home/fux/fux/miRNASNP3/data/miRbase/hsa.gff3") as infile:
    line = infile.readline()
    plot_dict = {}
    item = 0
#    getHarpin()
    while line:
        if line.startswith('#'):
            print(line)
        else:
            nline = line.strip().split()
            if nline[2] == 'miRNA_primary_transcript':
                item += 1
                if plot_dict:
                    plotrna(plot_dict,pre_id,pre_start,pre_end)
                    plot_dict = {}
             #   print(nline[8])
                pre_id = re.findall(r'Name=(.*)',nline[8])[0]
                pre_start = nline[3]
                pre_end = nline[4]
            elif nline[2] == 'miRNA':
                mir_id = re.findall(r';Name=(.*);Derives_from',nline[8])[0]
                plot_dict[mir_id] = [nline[3],nline[4]] 
        line = infile.readline()
    plotrna(plot_dict,pre_id,pre_start,pre_end)                  
    print(item) 

#getHarpin()


import sys,re

out_path="/home/fux/fux/miRNASNP3/predict_result/mutation_altmir/tgs_altmir_mir240_bed/"


with open(sys.argv[1]) as infile:
    for line in infile:
        if line.startswith('chr'):
            nline=re.split(r':|#|\t',line.strip())
            strand=re.split(r'\(|\)',nline[1])[1]
            position=re.split(r'\(|\)',nline[1])[0].split('-')
            if strand =='-':
                site_start=int(position[1])-int(nline[10])
                site_end=int(position[1])-int(nline[9])
            else:
                site_start=int(position[0])+int(nline[9])
                site_end=int(position[0])+int(nline[10])
            newline=nline[0]+'#'+nline[6]+'#'+nline[7]+'#'+nline[3]+'\t'+str(site_start)+'\t'+str(site_end)
            filename=nline[6]+'_'+nline[7]
            with open(out_path+filename,"a") as out:
                out.write(newline+'\n')
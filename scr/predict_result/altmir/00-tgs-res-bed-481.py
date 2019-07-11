import sys,re

out_path="/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mir_bed_481_mirs/"

with open(sys.argv[1]) as infile:
    for line in infile:
        if line.startswith('chr'):
            nline=re.split(r':|#|\t',line.strip())
            strand=re.split(r'\(|\)',nline[1])[1]
            position=re.split(r'\(|\)',nline[1])[0].split('-')
            if strand =='-':
                site_start=int(position[1])-int(nline[12])
                site_end=int(position[1])-int(nline[11])
            else:
                site_start=int(position[0])+int(nline[11])
                site_end=int(position[0])+int(nline[12])
            newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+nline[6]+'#'+nline[7]+'#'+nline[3]
            filename=nline[6]+'_'+nline[7]
            with open(out_path+filename,"a") as out:
                out.write(newline+'\n')
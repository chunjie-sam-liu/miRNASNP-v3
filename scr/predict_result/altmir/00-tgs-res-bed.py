import sys,re

out_path="/home/fux/fux/miRNASNP3/predict_result/altmir/tgs_altmir_mir_bed_1992_mirs/"

with open(sys.argv[1]) as infile:
    for line in infile:
        nline=re.split(r':|#|\t',line.strip())
        if nline[6].startswith('hsa'):
            filename=nline[6]
        else:
            filename='hsa-'+nline[6]
        mirna=filename.split('_')[0]
        snp_id=filename.split('_')[1]
        strand=re.split(r'\(|\)',nline[1])[1]
        position=re.split(r'\(|\)',nline[1])[0].split('-')
        if strand == '-':
            site_start=int(position[1])-int(nline[8])
            site_end=int(position[1])-int(nline[7])
        else:
            site_start=int(position[0])+int(nline[7])
            site_end=int(position[0])+int(nline[8])
        newline=nline[0]+'\t'+str(site_start)+'\t'+str(site_end)+'\t'+mirna+'#'+snp_id+'#'+nline[3]
        with open(out_path+filename,"a") as out:
            out.write(newline+'\n')
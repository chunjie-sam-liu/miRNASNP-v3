import re


def findMir(snploc):
	print("snploc:" + snploc + "\n")
	with open("/home/fux/fux/miRNASNP3/data/miRbase/remap_ncbi/mature.gff3") as mirfile:
		while 1:
			line = mirfile.readline()
			if not line:
				print("error:incorrecr mirfile or snp dose't in mirna!")
				break
			mir = re.split(r"[\t,;,=]",line)
			if int(snploc)>=int(mir[3]) and int(snploc)<int(mir[4]):     #如果要比较大小，确保变量类型为int,字符型变量比较大小是按位比较的
				print("mir3:"+mir[3]+"\t"+"mir4:"+mir[4]+"\n")
				return mir

with open("snp_in_seedregion_b.anno","a") as annofile:
	with open("snp_in_seedregion") as snpfile:
		while 1:
			line = snpfile.readline().strip("\n")
			if not line:
				break
			loci = line.split()[1]
			mir =  findMir(loci)
			if not mir:
				print("findMir return none!")
				break
			#add mir[15] mir_name
			annoline = line +"\t" +  mir[0] + "\t"+ mir[2] + "\t" + mir[3] + "\t" + mir[4] + "\t" + mir[6] + "\t" + mir[9] + "\t"+ mir[15] +"\n"
			annofile.write(annoline)

"""
snpmirid=open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/mir_have_seefsnp").read().splitlines()
	
with open("snp_in_seedregion_mature.fa","a") as snpmir_seq:
	with open("/home/fux/fux/miRNASNP3/data/miRbase/mature.fa") as mature_seq:
		line1 = mature_seq.readline()
		while line1:
			ishomo = re.match(r'^>hsa.*',line1) 
			if ishomo:
				mirid = line1.split()[1]
				if mirid in snpmirid:
					line2 = mature_seq.readline()
					snpmir_seq.write(line1+line2)
			line1 = mature_seq.readline()

with open("snp_in_seedregion.exception.anno","a") as annofile:
        with open("snp_in_seedregion.exce") as snpfile:
                while 1:
                        line = snpfile.readline().strip("\n")
                        if not line:
                                break
                        loci = line.split()[1]
                        mir =  findMir(loci)
                        if not mir:
                                print("findMir return none!")
                                break
                        #add mir[15] mir_name
                        annoline = line +"\t" +  mir[0] + "\t"+ mir[2] + "\t" + mir[3] + "\t" + mir[4] + "\t" + mir[6] + "\t" + mir[9] + "\t"+ mir[15] +"\n"
                        annofile.write(annoline)
"""

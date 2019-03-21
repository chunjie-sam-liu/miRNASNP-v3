import re,sys

with open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/mirseed_has_snp") as mirlist:
	check = mirlist.read()
	with open("/home/fux/fux/miRNASNP3/map_mir_snp/seedregion/mirseed_has_snp.fa","a") as out:
		with open("/home/fux/fux/miRNASNP3/data/miRbase/mature.fa") as infile:
			mirhead = infile.readline()
			while mirhead:
				if mirhead.startswith('>'):
					mirid = re.split(r'\s',mirhead)[0][1:]
					if mirid in check:
						out.write(mirhead)
						seq = infile.readline()
						out.write(seq)
				mirhead = infile.readline()


	

  	

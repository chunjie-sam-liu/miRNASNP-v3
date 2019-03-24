import os,json

for root,dirs,files in os.walk("/home/fux/fux/miRNASNP3/data/dbsnp/VCF"):
	for fi in files:
		if fi.endswith('.pvcf'):	
			with open(fi+".json","w") as out:
				dbsnp_dict = {}
				with open("../"+fi) as pvcf:
					line = pvcf.readline()
					while(line):
						if line.startswith('#'):
							line = pvcf.readline().strip()
							continue
						rs = line.split('\t')[2]
						dbsnp_dict[rs] = line
						#break
						line = pvcf.readline().strip()
				json.dump(dbsnp_dict,out)



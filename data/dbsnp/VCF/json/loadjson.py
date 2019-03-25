import json,os,re

#for root,dirs,files in os.walk("/home/fux/fux/miRNASNP3/data/dbsnp/VCF/json"):
#	for fi in files:
#		if fi.endswith('.pvcf.json'):
#			with open(fi) as fjson:
#				chr_dict = json.load(fjson)
#				chrRegex = re.compile(r'NC_0*([1-9]*0?)')
#				chrid = chrRegex.search(fi).group(1)
#				with open("/home/fux/fux/miRNASNP3/map_utr3_snp/snp_in_utr.chr"+chrid+".vcf","a") as out:
#					with open("/home/fux/fux/miRNASNP3/map_utr3_snp/snp_in_utr.chr"+chrid) as snp:
#						line =  snp.readline().strip()
#						while(line):
#							snpid = line.split('\t')[3]
#							out.write(chr_dict[snpid])
							
with open("NC_000022.11.pvcf.json") as fjson:
	chr_dict = json.load(fjson)
	chrRegex = re.compile(r'NC_0*([1-9]*0?)')
	chrid = chrRegex.search("NC_000022.11.pvcf.json").group(1)
	with open("/home/fux/fux/miRNASNP3/map_utr3_snp/vcf_b/snp_in_utr3.chr"+chrid+".vcf","a") as out:
		with open("/home/fux/fux/miRNASNP3/map_utr3_snp/snp_in_utr3.chr"+chrid) as snp:
			line =  snp.readline().strip()
			while(line):
				snpid = line.split('\t')[3]
				out.write(chr_dict[snpid])

						

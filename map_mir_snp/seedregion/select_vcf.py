import re
with open("snp_in_seedregion.sum","a") as out: 
	with open("snp_in_seedregion_final.vcf") as vcf:
		line = vcf.readline().strip()
		while line:
			item = line.split()
			gene = re.findall(r";GENEINFO=(.+?);",item[7])
			vc = re.findall(r";VC=([A-Z]+)",item[7])
			if not gene:
				gene = "non"
			else:
				gene = gene[0]
			if not vc:
				vc = "non"
			else:
				vc = vc[0]
			newline = item[0] + "\t" + item[1] + "\t"+ item[2] + "\t" + item[3] + "\t" + item[4] + "\t" + gene + "\t" + vc + "\n"
			out.write(newline)
#			print(gene)
			line = vcf.readline().strip()



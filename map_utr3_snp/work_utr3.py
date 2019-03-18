import re,os

def findUtr(snploc):
	with open("/home/fux/fux/miRNASNP3/data/genome/grch38_utr3.bed") as mirfile:
		#print("look for" + "\t"+ snploc + "\n")
		while 1:
			line = mirfile.readline()
			if not line:
				print("error:incorrecr mirfile or snp dose't in mirna!")
				break
			utr = re.split(r"[\t,;,=]",line)
			if snploc>=utr[1] and snploc<utr[2]:
				return utr
def getVcf(snpid,ch):
	chrom={'chr1':'NC_000001.11','chr2':'NC_000002.12','chr3':'NC_000003.12','chr4':'NC_000004.12','chr5':'NC_000005.10','chr6':'NC_000006.12',\
		'chr7':'NC_000007.14','chr8':'NC_000008.11','chr9':'NC_000009.12','chr10':'NC_000010.11','chr11':'NC_000011.10','chr12':'NC_000012.12',\
		'chr13':'NC_000013.11','chr14':'NC_000014.9','chr15':'NC_000015.10','chr16':'NC_000016.10','chr17':'NC_000017.11','chr18':'NC_000018.10',\
		'chr19':'NC_000019.10','chr20':'NC_000020.11','chr21':'NC_000021.9','chr22':'NC_000022.11','chrX':'NC_000023.11','chrY':'NC_000024.10'}
	vcfile = chrom[ch]+".pvcf"
	cmd = "grep"+"\t"+ snpid + "\t/home/fux/fux/miRNASNP3/data/dbsnp/VCF/" + vcfile + ">>snp_in_utr3.vcf"
	os.system(cmd)
	

with open("snp_in_utr3.anno","a") as annofile:
	with open("snp_in_utr3") as snpfile:
		while 1:
			line = snpfile.readline().strip("\n")
			if not line:
				break
			snp  = line.split()
			utr =  findUtr(snp[1])
			if not utr:
				print("findMir return none!")
				break
			annoline = line +"\t" +  utr[0] + "\t"+ utr[1] + "\t" + utr[2] + "\t" + utr[3] + "\t" + utr[5]
			annofile.write(annoline)
			getVcf(snp[3],snp[0])


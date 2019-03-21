import re,sys


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
	
def getAnno(infile,outfile):
	with open(outfile,"a") as annofile:
		with open(infile) as snpfile:
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

if __name__ == '__main__':
	if len(sys.argv)>3:
		print("usage: python work_utr3.py infile outfile\n")
	getAnno(sys.argv[1],sys.argv[2])

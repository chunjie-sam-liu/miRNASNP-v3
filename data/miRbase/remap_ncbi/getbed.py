import re

item = 0
with open("mirflanks.b.bed","a") as newbed:
	with open("grch38p12_hsa.gff3.primary") as gff3:
		for line in gff3:
			if line:
				item+=1
				line = line.strip()
				if line.startswith('#') or line.startswith('NW_'):
					continue
				line = line.split('\t')
				mirid = re.findall(r';Name=(.*);gbkey=',line[8])[0]
				newline1 = line[0]+'\t'+str(int(line[3])-1000)+'\t'+line[3]+'\t'+line[2]+":upstream:"+mirid+'\t0\t'+line[6]+'\n'
				newline2 = line[0]+'\t'+line[4]+'\t'+str(int(line[4])+1000)+'\t'+line[2]+":downstream:"+mirid+'\t0\t'+line[6]+'\n'
				newbed.write(newline1+newline2)
#				print(line[8]+'\n')
		print("items:"+str(item))				

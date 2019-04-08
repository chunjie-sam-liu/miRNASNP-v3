import re

with open("altmir_hit.txt","a") as hit:
	hit.write("mirid\tutr_chr\tutr_start-end\tutr_strand\thit_counts\n")
	chit=0
	with open("s1_miranda_altmir_res_02.txt") as res:
		for line in res:
			if line:	
				if line.startswith('Performing Scan:'):
					mirid = line.split()[2]
					sloc = line.split()[4]
					hit.write(mirid+'\t')
					scan = re.split(r':|\(|\)',sloc)
					hit.write(scan[0]+'\t'+scan[1]+'\t'+scan[2]+'\t')
				elif line.startswith('>'):
					chit+=1
				elif line.startswith('Complete'):
					hit.write(str(chit-1)+'\n')
					chit=0
					
				
#			print(line)	
		


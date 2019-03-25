import os,re

with open("mir_seed_2_8.txt","a") as mirseed:
	RULE1={"A":"U","C":"G","G":"C","U":"A"}
	with open("wild_mir.fa") as mirseq:
		line = mirseq.readline().strip()
		while(line):
			if line.startswith('>'):
				mirid = re.split(r'\s',line)[0][1:]
				cmd1 = "grep -w "+ mirid + " mature.gff3"
#				print(cmd1 +'\n')
				output = os.popen(cmd1)
				mirinfo = output.read().strip().split()
#				print(mirinfo)
#				print("\n")
				curseq = mirseq.readline().strip()
				if mirinfo[6] == '-':
					new_seq = "".join(map(lambda x:RULE1[x],curseq))[::-1]
					seed_seq = new_seq[1:8] #from 1 to 7
				else:
					seed_seq = curseq[1:8]
				mirseed.write(mirid[4:]+"\t"+seed_seq+"\t9606"+"\n")
				line = mirseq.readline().strip()
			

import re,os


def getMir(rs):
#	print("start grep")
	cmd1 = "grep -w "+ rs + " snp_mir_relate"
	output = os.popen(cmd1)
	mirsnp = output.read().strip().split('\t')
	dist = int(mirsnp[1]) -int(mirsnp[10])  #loci of snp -- loci of mir start_base
	mir = {'id':mirsnp[14],'distance':dist,'strand':mirsnp[12]}
	RULE1={"A":"U","C":"G","G":"C","U":"A"}
#	RULE2={"A":"A","C":"C","G":"G","U":"T"} 
	with open("wild_mir.fa") as wildseq:
		check_mir = wildseq.readline().strip()
		while check_mir:
			if check_mir.startswith('>'):
				mirid = re.split(r'\s',check_mir)[0][1:]
				if mirid == mir['id']: #warning hsa-miR-573 in hsa-miR-5739 --cause error 
					curseq = wildseq.readline().strip()
					if mir['strand'] == '-':
						new_seq = "".join(map(lambda x:RULE1[x],curseq))[::-1] #fit snp
					else:
						new_seq = curseq
					mir['seq'] = new_seq
					return mir
			check_mir = wildseq.readline().strip()


item = 0
with open("alter_mir.fa","a") as alter:
	RULE1={"A":"U","C":"G","G":"C","U":"A"}
	RULE2={"A":"A","C":"C","G":"G","T":"U"}
	with open("snv") as snv:
		cursnp = snv.readline().strip()
		while cursnp:
			cursnpinfo = cursnp.split('\t')
#			print("get rs:"+cursnpinfo[2])
			mir = getMir(cursnpinfo[2])
#			print(mir)
			ref = RULE2[cursnpinfo[3]]
			alt = cursnpinfo[4].split(',')
			item+=len(alt)
			for curalt in alt:
				seq = list(mir['seq'])
#				print("seq:" + str(seq)+"\n"+"ref:"+ref+">"+curalt+" curseq:" + seq[mir['distance']])
				if seq[mir['distance']] == ref:
					seq[mir['distance']] = RULE2[curalt]
					if mir['strand'] == '-':
						altseq = "".join(map(lambda x:RULE1[x],seq))[::-1]
					else:
						altseq = ''.join(seq)
					alter.write(">"+mir['id']+"_"+cursnpinfo[2]+"\n")
					alter.write(altseq + "\n")
			cursnp = snv.readline().strip()
					
			
print("Count items:"+str(item)) 
			

	
	 	

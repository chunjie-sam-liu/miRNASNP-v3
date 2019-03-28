import re,os,json

RULE1={"A":"T","C":"G","G":"C","T":"A"}
#RULE2={"A":"A","C":"C","G":"G","T":"U"}

def getDict():
	with open("utr3.json") as wildseq:
		utr3_dict = json.load(wildseq)
		return utr3_dict

utr3_dict = getDict()	

def getRelat():
	with open("snp_utr3_relate.json") as rel:
		snp_utr3_relate_dict = json.load(rel)
		return snp_utr3_relate_dict

snp_utr3_relate_dict = getRelat()

def getUtr(rs):
#       print("start grep")
#	cmd1 = "grep -w "+ rs + " snp_utr3_relate"
#	output = os.popen(cmd1)
	
	utr3snp = snp_utr3_relate_dict[rs].split('\t')
	dist = int(utr3snp[1]) -int(utr3snp[9])  #loci of snp -- loci of mir start_base ; for utr3 
	utr3len = int(utr3snp[10])-int(utr3snp[9])
	dicid = utr3snp[8]+":"+utr3snp[9]+"-"+utr3snp[10]+"("+utr3snp[12]+")"
	utr3 = {'id':utr3snp[11],'distance':dist,'strand':utr3snp[12],'dict_id':dicid}
	curseq = utr3_dict[dicid].upper()
	if not curseq:
#		print("no utr3seq been found\n")
		return NONE
	if utr3['strand'] == '-':
#		print("wildseq"+curseq)
		new_seq = "".join(map(lambda x:RULE1[x],curseq))[::-1]
	else:
		new_seq = curseq
	utr3['seq'] = new_seq
	return utr3


item = 0
with open("alter_utr3.fa","a") as alter:
	with open("snv.utr3") as snv:
		cursnp = snv.readline().strip()
		while cursnp:
			cursnpinfo = cursnp.split('\t')
#			print("get rs:"+cursnpinfo[2])
			utr3 = getUtr(cursnpinfo[2])
#			print(utr3)
			ref = cursnpinfo[3]
			alt = cursnpinfo[4].split(',')
			item+=len(alt)
			for curalt in alt:
				seq = list(utr3['seq'])
				if utr3['strand'] == '-':
#					print("ref:"+ref+">"+curalt+" curseq:" + seq[utr3['distance']-1])
					if seq[utr3['distance']-1] == ref:
						seq[utr3['distance']-1] = curalt
						altseq = "".join(map(lambda x:RULE1[x],seq))[::-1]
				else:
#					print("ref:"+ref+">"+curalt+" curseq:" + seq[utr3['distance']])
					if seq[utr3['distance']] == ref:
						seq[utr3['distance']] = curalt
						altseq = ''.join(seq)
				alter.write(">"+utr3['dict_id']+"_"+cursnpinfo[2]+"_"+utr3['id']+"\n")
				alter.write(altseq + "\n")
			cursnp = snv.readline().strip()
					
print("Count items:"+str(item)) 
			

	
	 	

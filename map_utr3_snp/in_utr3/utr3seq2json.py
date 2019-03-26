import re,json

with open("utr3.json","a") as ujson:
	utr_dict={}
	with open("utr3.fa") as seqs:
		line = seqs.readline().strip()
		while line:
			if line.startswith('>'):
				utr3 = line[1:]
				utr_dict[utr3] = seqs.readline().strip()
			line = seqs.readline().strip()
	json.dump(utr_dict,ujson)

import re,json

def getUtr():
	with open("utr3.json") as ujson:
		utr_dict = json.load(ujson)
		return utr_dict

utr_dict=getUtr()
new_dict= {}

with open("utr3_02.json","a") as ujson:
	with open("utr3.bed") as ubed:
		line = ubed.readline().strip()
		while line:
			line = line.split()
			utrkey = line[0]+":"+line[1]+"-"+line[2]+"("+line[5]+")"
			utrid = line[3] 
			new_dict[utrid] = utr_dict[utrkey]
			line = ubed.readline().strip()
	json.dump(new_dict,ujson)

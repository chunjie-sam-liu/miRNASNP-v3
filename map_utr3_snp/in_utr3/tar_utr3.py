import re,json

def getJson():
	with open("utr3_02.json") as ujson2:
		utr_dict = json.load(ujson2)
		return utr_dict

utr_dict = getJson()

with open("targetscan_utr3.txt","a") as tar:
	for key in utr_dict.keys():
		line = key +"\t9606\t"+utr_dict[key]+'\n'
		tar.write(line) 

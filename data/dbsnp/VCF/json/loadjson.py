import json

with open("chr24.json") as infile:
	chr24_dict = json.load(infile)
	print(len(chr24_dict))

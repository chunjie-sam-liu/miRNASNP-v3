import json

surj = {}

with open("snp_utr3_relate.json","a") as sur:
	with open("snp_utr3_relate") as infile:
		for line in infile:
			if line:
				rs = line.split()[3]
				surj[rs] = line.strip()
	json.dump(surj,sur)

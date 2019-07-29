#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys,re
import linecache

with open(sys.argv[2],"a") as out:
    head = 'utr_info\tsite_count\tsite_end\tseed_length\tseed_mismatch\tseed_gu\tdg_duplex\
           \tdg_binding\tdg_open\ttgs_au\ttgs_position\ttgs_pairing3p\ttgs_score\tprob_exac\
           \tprob_binomial\talign\n'
    out.write(head)
    with open(sys.argv[1]) as infile:
        line = infile.readline()
        item = {}
        while line:
            if line.startswith(">"):
                item['utr_info']=line.strip()[1:]
                item['site_count'] = 0
               # out.write(line)
            else:
                line01 = infile.readline().strip()
                line02 = infile.readline().strip()
                line03 = infile.readline().strip()
                line04 = infile.readline().strip()
                line05 = infile.readline().strip()
                line06 = infile.readline().strip()
                line07 = infile.readline().strip()
                line08 = infile.readline().strip()
                line09 = infile.readline().strip()
                line10 = infile.readline().strip()
                line11 = infile.readline().strip()
                line12 = infile.readline().strip()
                item['site_count'] += 1
                item['site_end'] = line.split()[1]
                item['seed_length'] = len(line03)-1
                item['dg_duplex'] = line05.split()[3]
                item['dg_binding'] = line06.split()[3]
                #print(line07.split())
                #print("01:"+line01)
                #print("02:"+line02)
                #print("03:"+line03)
                #print("04:"+line04)
                #print("05:"+line05)
                #print("06:"+line06)
                #print("07:"+line07)
                #print("08:"+line08)
                #print("09:"+line09)
                #print("10:"+line10)
                #print("11:"+line11)
                #print("12:"+line12)
                #print("13:"+line13)
                item['dg_open']= line07.split()[3]
                item['tgs_au'] = line08.split()[2]
                item['tgs_position'] = line09.split()[2]
                item['tgs_pairing3p'] = line10.split()[2]
                item['tgs_score'] = line11.split()[2]
                item['prob_exac'] = line12.split()[2]
                item['align'] = line.strip()+'#'+line01+'#'+line02+'#'+line03+'#'+line04
                site_line = item['utr_info']+'\t'+str(item['site_count'])+'\t'+item['site_end']+'\t'+str(item['seed_length'])+'\t0\t0\t'+item['dg_duplex']+'\t'+item['dg_binding']+'\t'+item['dg_open']+'\t'+item['tgs_au']+'\t'+item['tgs_position']+'\t'+item['tgs_pairing3p']+'\t'+item['tgs_score']+'\t'+item['prob_exac']+'\t'+item['align']
                out.write(site_line+'\n')
            line = infile.readline()
                
                
                
             

import sys,re


def getfreq(inch):
  #  print(inch)
    freq = re.findall(r';FREQ=(.*?);',inch)
    if freq:
        freq = freq[0]
        freq_list = freq.split('|')
        freq_dict = {}
        for f in freq_list:
            nfreq = f.split(':')
            freq_dict[nfreq[0]] = nfreq[1]
    else:
        freq = re.findall(r';FREQ=(.*)$',inch)
        if freq:
            freq = freq[0]
            freq_list = freq.split('|')
            freq_dict = {}
            for f in freq_list:
                nfreq = f.split(':')
                freq_dict[nfreq[0]] = nfreq[1]
        else:
            freq_dict = {}
    return freq_dict



with open(sys.argv[1]) as infile:
    for line in infile:
        nline = line.strip().split()
        freq = getfreq(nline[7])
   #     print(freq)
        if freq:
            for f in freq.keys():
                with open(f,"a") as out:
                    newline = nline[2]+'\t'+nline[3]+'\t'+nline[4]+'\t'+freq[f]+'\t'+f
                    out.write(newline+'\n')
        else:
            with open("no_freq","a") as out:
                newline = nline[2]+'\t'+nline[3]+'\t'+nline[4]+'\tnofreq'
                out.write(newline+'\n')

import re,sys

seq=sys.argv[1]
match_pattern=sys.argv[2]

def fold2match(seq,match_pattern):
    p=re.compile("\(\.*\)")
#seq='GGCACCCACCCGUAGAACCGACCUUGCGGGGCCUAUCGCCGCACACAAGCUCGUGUCUGUGGGUCCGUGUC'
    lseq=len(seq)#70
#match_pattern='(((((..(((((((((..(((.((((.(((((.....))).).).)))).)))..)))))))))..)))))'

    for m in p.finditer(match_pattern):
        c=m.group()
        s=m.start()#31
        if len(c)%2==0:
            print(len(c))#6
            lupstream=int(len(c)/2)+m.start() #34
            l1=seq[0:lupstream]#截取时不会截取尾字符
            l2=match_pattern[0:lupstream]
            l3=[]
            l4=match_pattern[lupstream:][::-1]
            l5=seq[lupstream:][::-1]
        
            ldownstream=len(seq)-lupstream-1#35
        #print(str(ldownstream)+'\t'+str(lupstream))
            lmatch=min(len(l1), len(l4))-1 #l1-34 l4-36  lenght:34 index:33
            ldiff=len(l1)-len(l4)
            pdiff=' '*abs(ldiff)
            if ldiff<0:
                l1=pdiff+l1
                l2=pdiff+l2
            else:
                l4=pdiff+l4
                l5=pdiff+l5
        #print(str(len(match_pattern)))       
        #print(str(lmatch))
        #print(match_pattern[lmatch])
        #print(match_pattern[lseq-lmatch])
            while lmatch>=0:
        #    print(str(lmatch))
                if match_pattern[lmatch]=='(' and match_pattern[lseq-lmatch-3]==')': #34 35--0 69
                    l3.append('|')
                else:
                    l3.append(' ')
                lmatch=lmatch-1             
        #print(l1+'\n'+l2+'\n'+pdiff+''.join(l3)[::-1]+'\n'+l4+'\n'+l5+'\n') 
            return l1+'\n'+pdiff+''.join(l3)[::-1]+'\n'+l5+'\n'
        else:
            lupstream=int((len(c)-1)/2)+m.start()
            l1=seq[0:lupstream]
            l2=match_pattern[0:lupstream]
            l3=[]
            l4=match_pattern[lupstream+1:][::-1]
            l5=seq[lupstream+1:][::-1]
            ldownstream=len(seq)-lupstream-2
            lmatch=min(len(l1), len(l4))-1
            ldiff=len(l1)-len(l4)
            pdiff=' '*abs(ldiff)
            if ldiff<0:
                l1=pdiff+l1
                l2=pdiff+l2
            else:
                l4=pdiff+l4
                l5=pdiff+l5
            while lmatch>=0:
        #    print(str(lmatch))
                if match_pattern[lmatch]=='(' and match_pattern[lseq-lmatch-3]==')': #34 35--0 69
                    l3.append('|')
                else:
                    l3.append(' ')
                lmatch=lmatch-1
        #print(l1+'\n'+l2+'\n'+pdiff+''.join(l3)[::-1]+seq[lupstream]+'\n'+l4+'\n'+l5+'\n')
            return l1+'\n'++pdiff+''.join(l3)[::-1]+seq[lupstream]+'\n'++l5+'\n'
    

import re,json,sys

def takeFirst(elem):
    return elem[1]

def transfer_binary(seqlen,start,end):
    bseq='0'+'0'*int(start)+'1'*(int(end)-int(start))+'0'*(int(seqlen)-int(end))
    return bseq

def fix_position(pos_list):
    pos_fina=[]
    for pos in pos_list:
        if pos:
            pos_fina.append([int(pos[0])+1,int(pos[1])-1])
    #print("pos fina:")
    #print(pos_fina)
    return pos_fina

def transfer_loc(bseq,list_min):
    ##print("start transfer location to pos list:")
    ##print("bseq:")
    ##print(bseq)
    ##print("list min:")
    #   #print(list_min)
    pos=[]
    pos_item=[]
    pos_fina=[]
    for i in range(1,len(bseq)):
        if bseq[i]=='0' and bseq[i-1]=='1':
            end=i
            pos_item.append([start,end])
        elif bseq[i]=='1' and i==len(bseq)-1 and bseq[i-1]!='0':
            end=i
            pos_item.append([start,end+1])
        elif bseq[i]=='1' and bseq[i-1]=='0':
            start=i
    if pos_item:
        for pos in pos_item:
            pos_fina.append([pos[0]+int(list_min)-1,pos[1]+int(list_min)-1])
    else:
        pos_fina=[]
    #print("pos_fina:")
    #print(pos_fina)       
    return pos_fina
'''
test_bseq='00011111110000000000001100'
list_min=30
p=transfer_loc(test_bseq,list_min)

'''
def list_to_binary_string(mylist):
    #print("list to binary:")
    #print(mylist)
    list_min=mylist[0][0]
    list_max=mylist[0][1]
    for l in mylist:
        if l[0]<list_min:
            list_min=l[0]
        if l[1]>list_max:
            list_max=l[1]
    #print("list_max:")
    #print(list_max)
    #print("list_min:")
    #print(list_min)
    seqlen=int(list_max)-int(list_min)+1 #gff 1-base 
    tmp_seq='0'+'0'*seqlen
    for l in mylist:
        bseq=transfer_binary(seqlen,int(l[0])-int(list_min),int(l[1])-int(list_min) )
        ##print("curbseq:")
        ##print(bseq)
        tmp_seq_a=[]
        for i in range(0,seqlen):
            if int(tmp_seq[i])+int(bseq[i])>0:
                tmp_seq_a.append('1')
            else:
                tmp_seq_a.append('0')
        tmp_seq=''.join(tmp_seq_a)
        ##print("cur_temp_seq:")
        ##print(tmp_seq)
    tmp_seq=''.join(tmp_seq_a)
        #tmp_seq=str(tmp_seq_a)
    ##print(tmp_seq_a)
    ##print("tmp_seq:")
    ##print(tmp_seq)

    return [tmp_seq,list_min,list_max]

def region_merge(list1,list2): #list1+list2 
    #print("region merge:")
    #print(" list1:")
    #print(list1)
    #print("list2:")
    #print(list2)
    if list1:
        n_bl1=list_to_binary_string(list1)
    else:
        n_bl2=list_to_binary_string(list2)
        merge_pos=transfer_loc(''.join(n_bl2[0]),n_bl2[1])
        return merge_pos
    if list2:
        n_bl2=list_to_binary_string(list2)
    else:
        n_bl1=list_to_binary_string(list1)
        merge_pos=transfer_loc(''.join(n_bl1[0]),n_bl1[1])
        return merge_pos
    
        
    list_min=min(int(n_bl1[1]),int(n_bl2[1]))
    list_max=max(int(n_bl1[2]),int(n_bl2[2]))

    bl1='0'*(int(n_bl1[1])-list_min)+n_bl1[0]+'0'*(list_max-int(n_bl1[2]))
    bl2='0'*(int(n_bl2[1])-list_min)+n_bl2[0]+'0'*(list_max-int(n_bl2[2]))
    bl3=[]
    merge_pos=[]
    #print("bl1:")
    #print(bl1)
    #print("bl2:")
    #print(bl2)
    for i in range(0,int(list_max)-int(list_min)):
        if int(bl1[i])+int(bl2[i])>0:
            bl3.append('1')
        else:
            bl3.append('0')
    merge_pos=transfer_loc(''.join(bl3),list_min)
    ##print("merge_pos:")
    ##print(merge_pos)
    return merge_pos
    
def region_insect(list1,list2): #list2-list1
    #print("region intersect:")
    if list1:
        n_bl1=list_to_binary_string(list1)
    else:
        return list1
    if list2:
        n_bl2=list_to_binary_string(list2)
    else:
        return list1
    ##print("region intersect:")
    ##print(" list1:")
    ##print(list1)
    ##print("list2:")
    ##print(list2)
    bl3=[]
    insec_pos=[]
    list_min=min(int(n_bl1[1]),int(n_bl2[1]))
    list_max=max(int(n_bl1[2]),int(n_bl2[2]))
    bl1='0'*(int(n_bl1[1])-list_min)+n_bl1[0]+'0'*(list_max-int(n_bl1[2]))
    bl2='0'*(int(n_bl2[1])-list_min)+n_bl2[0]+'0'*(list_max-int(n_bl2[2]))
    ##print("bl1:")
    ##print(bl1)
    ##print("bl2:")
    ##print(bl2)
    for i in range(0,len(bl1)):
        if bl1[i]=='0' and bl2[i]=='1':
            bl3.append('1')
        else:
            bl3.append('0')
    insec_pos=transfer_loc(''.join(bl3),list_min)
    insec_pos_fina=[]
    #print("insec pos:")
    #print(insec_pos)
    ##print("insec_pos_fina:")
    ##print(insec_pos_fina)
    return insec_pos


'''
test_l2b=[[0,0],[2,9],[12,19]]
test_insec=[[1,5],[7,10]]
t1=list_to_binary_string(test_l2b)
t2=transfer_loc(t1[0],t1[1])
t3=region_insect(test_l2b,test_insec)


'''
class Gene(list):
    def __init__(self,gene_id='',gene_name='',gene_type='',genome_start='',genome_end='',genome_chr='',source='',genome_strand='',\
    exonic=[],intronic=[],three_utr=[],five_utr=[],start_codon=[],stop_codon=[],cds=[],unknown=[],out_file=''):
        self.gene_id=gene_id
        self.gene_name=gene_name
        self.gene_type=gene_type
        self.genome_chr=genome_chr
        self.genome_start=genome_start
        self.genome_end=genome_end
        self.source=source
        self.genome_strand=genome_strand
        self.exonic=exonic
        self.intronic=intronic
        self.three_utr=three_utr
        self.five_utr=five_utr
        self.start_codon=start_codon
        self.stop_codon=stop_codon
        self.cds=cds
        self.unknown=unknown
        self.out_file=out_file

    def define_exon(self):
        exon_list=[]
        exon_merge=region_merge(exon_list,self.exonic)
        self.exonic=exon_merge
        #print("exon_merge:")
        #print(exon_merge)

    def define_cds(self):
        cds_list=[]
        cds_merge=region_merge(cds_list,self.cds)
        self.cds=cds_merge
        if self.exonic:
            cds_reduce=region_insect(self.exonic,self.cds)
            self.cds=cds_reduce
        self.cds=fix_position(self.cds)
        #print("cds region:")
        #print(self.cds)
        

    def define_start_codon(self):
        start_codon_list=[]
        start_codon_merge=region_merge(start_codon_list,self.start_codon)
        self.start_codon=start_codon_merge
        #print("start_codon list:")
        #print(self.start_codon)
        if self.exonic:
            start_codon_reduce_exon=region_insect(self.exonic,self.start_codon)
            self.start_codon=start_codon_reduce_exon
        #print("start codon exclude exon:")
        #print(self.start_codon)
        if self.cds and self.start_codon:
            start_codon_reduce_cds=region_insect(self.cds,self.start_codon)
            self.start_codon=start_codon_reduce_cds
        self.start_codon=fix_position(self.start_codon)
        #print("start codon exclude cds:")
        #print(self.start_codon)

    def define_stop_codon(self):
        stop_codon_list=[]
        stop_codon_merge=region_merge(stop_codon_list,self.stop_codon)
        self.stop_codon=stop_codon_merge
        if self.exonic:
            stop_codon_reduce_exon=region_insect(self.exonic,self.stop_codon)
            self.stop_codon=stop_codon_reduce_exon
        if self.cds and self.stop_codon:
            stop_codon_reduce_cds=region_insect(self.cds,self.stop_codon)
            self.stop_codon=stop_codon_reduce_cds
        self.stop_codon=fix_position(self.stop_codon)
        #print("stop region:")
        #print(self.stop_codon)

    def define_three_utr(self):
        three_utr_list=[]
        three_utr_merge=region_merge(three_utr_list,self.three_utr)
        self.three_utr=three_utr_merge
        if self.exonic:
            three_utr_reduce_exon=region_insect(self.exonic,self.three_utr)
            self.three_utr=three_utr_reduce_exon
        if self.cds and self.three_utr:
            three_utr_reduce_cds=region_insect(self.cds,self.three_utr)
            self.three_utr=three_utr_reduce_cds
        if self.start_codon and self.three_utr:
            three_utr_reduce_startcondon=region_insect(self.start_codon,self.three_utr)
            self.three_utr=three_utr_reduce_startcondon
        if self.stop_codon and self.three_utr:
            three_utr_reduce_endcondon=region_insect(self.stop_codon,self.three_utr)
            self.three_utr=three_utr_reduce_endcondon
        self.three_utr=fix_position(self.three_utr)
        #print("three utr region:")
        #print(self.three_utr)

    def define_five_utr(self):
        five_utr_list=[]
        five_utr_merge=region_merge(five_utr_list,self.five_utr)
        self.five_utr=five_utr_merge
        if self.exonic:
            five_utr_reduce_exon=region_insect(self.exonic,self.five_utr)
            self.five_utr=five_utr_reduce_exon
        if self.cds and self.five_utr:
            five_utr_reduce_cds=region_insect(self.cds,self.five_utr)
            self.five_utr=five_utr_reduce_cds
        if self.start_codon and self.five_utr:
            five_utr_reduce_startcondon=region_insect(self.start_codon,self.five_utr)
            self.five_utr=five_utr_reduce_startcondon
        if self.stop_codon and self.five_utr:
            five_utr_reduce_endcondon=region_insect(self.stop_codon,self.five_utr)
            self.five_utr=five_utr_reduce_endcondon
        self.five_utr=fix_position(self.five_utr)
        #print("five utr region:")
        #print(self.five_utr)

    def define_intronic(self):
        intron_list=[]
        intron_merge=region_merge(intron_list,self.intronic)
        self.intronic=intron_merge
        if self.exonic:
            intron_reduce_exon=region_insect(self.exonic,self.intronic)
            self.intronic=intron_reduce_exon
        if self.cds and self.intronic:
            intron_reduce_cds=region_insect(self.cds,self.intronic)
            self.intronic=intron_reduce_cds
        if self.start_codon and self.intronic:
            intron_reduce_start_codon=region_insect(self.start_codon,self.intronic)
            self.intronic=intron_reduce_start_codon
        if self.stop_codon and self.intronic:
            intron_reduce_stop_codon=region_insect(self.stop_codon,self.intronic)
            self.intronic=intron_reduce_stop_codon
        if self.three_utr and self.intronic:
            intron_reduce_three_utr=region_insect(self.three_utr,self.intronic)
            self.intronic=intron_reduce_three_utr
        if self.five_utr and self.intronic:
            intron_reduce_five_utr=region_insect(self.five_utr,self.intronic)
            self.intronic=intron_reduce_five_utr
        self.intronic=fix_position(self.intronic)
        #print("intronic region:")
        #print(self.intronic)

    def define_unknown(self):
        self.unknown=[[self.genome_start,self.genome_end]]
        if self.exonic:
            unknown_reduce_exon=region_insect(self.exonic,self.unknown)
            self.unknown=unknown_reduce_exon
        if self.cds and self.unknown:
            unknown_reduce_cds=region_insect(self.cds,self.unknown)
            self.unbkown=unknown_reduce_cds
        if self.start_codon and self.unknown:
            unknown_reduce_start_codon=region_insect(self.start_codon,self.unknown)
            self.known=unknown_reduce_start_codon
        if self.stop_codon and self.unknown:
            unknown_reduce_stop_codon=region_insect(self.stop_codon,self.unknown)
            self.unknown=unknown_reduce_stop_codon
        if self.three_utr and self.unknown:
            unknown_reduce_three_utr=region_insect(self.three_utr,self.unknown)
            self.unknown=unknown_reduce_three_utr
        if self.five_utr and self.unknown:
            unknown_reduce_five_utr=region_insect(self.five_utr,self.unknown)
            self.unknown=unknown_reduce_five_utr
        if self.intronic and self.unknown:
            unknown_reduce_intron=region_insect(self.intronic,self.unknown)
            self.unknown=unknown_reduce_intron
        self.unknown=fix_position(self.unknown)
        #print("unknown region:")
        #print(self.unknown)

    def report_gene(self):
        with open(self.out_file+'.gene.gff3',"a") as out:
            gene_line=self.genome_chr+'\t'+self.source+'\tgene\t'+self.genome_start+'\t'+self.genome_end+\
        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
            out.write(gene_line+'\n')
        with open(self.out_file+'.gene_proteincoding.gff3',"a") as out:
            if self.exonic:
                #print("#print self.exonic:")
                #print(self.exonic)
                region='Exonic'
                for exon in self.exonic:
                    if exon[0]<=exon[1]:
                        exon_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(exon[0])+'\t'+str(exon[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(exon_line+'\n')
            if self.cds:
                #print("#print self.cds:")
                region='CDS'
                for cds in self.cds:
                    if cds[0]<=cds[1]:
                        cds_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(cds[0])+'\t'+str(cds[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(cds_line+'\n')
            if self.start_codon:
                #print("#print self.start_codon:")
                region='start_codon'
                for start_codon in self.start_codon:
                    if start_codon[0]<=start_codon[1]:
                        start_codon_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(start_codon[0])+'\t'+str(start_codon[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(start_codon_line+'\n')
            if self.stop_codon:
                #print("#print self.stop_codon:")
                region="stop_codon"
                for stop_codon in self.stop_codon:
                    if stop_codon[0]<=stop_codon[1]:
                        stop_codon_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(stop_codon[0])+'\t'+str(stop_codon[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(stop_codon_line+'\n')
            if self.three_utr:
                #print("#print self.three_utr:")
                region="three_utr"
                for three_utr in self.three_utr:
                    if three_utr[0]<=three_utr[1]:
                        three_utr_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(three_utr[0])+'\t'+str(three_utr[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(three_utr_line+'\n')
            if self.five_utr:
                #print("#print self.five_utr:")
                region="five_utr"
                for five_utr in self.five_utr:
                    if five_utr[0]<=five_utr[1]:
                        five_utr_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(five_utr[0])+'\t'+str(five_utr[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(five_utr_line+'\n')
            if self.intronic:
                #print("#print self.intronic:")
                region="intronic"
                for intron in self.intronic:
                    if intron[0]<=intron[1]:
                        intron_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(intron[0])+'\t'+str(intron[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(intron_line+'\n')
            if self.unknown:
                #print("#print self.others:")
                region='others'
                for unknown in self.unknown:
                    if unknown[0]<=unknown[1]:
                        unknown_line=self.genome_chr+'\t'+self.source+'\t'+region+'\t'+str(unknown[0])+'\t'+str(unknown[1])+\
                        '\t.\t'+self.genome_strand+'\t.\t'+"ID="+self.gene_id+';gene_name='+self.gene_name+';gene_tyep='+self.gene_type
                        out.write(unknown_line+'\n')

def parse_X9(X9):
    x9_dict={}
    ##print(X9)
    for item in X9.split(';'):
        nitem=item.split('=')
        ##print(nitem)
        x9_dict[nitem[0]]=nitem[1]
    ##print(x9_dict)
    return x9_dict

def parse_gene(transcript_list,out_file):
    if transcript_list[0][2]!='gene':
        print(transcript_list[0])
        sys.exit("Error gene start!")
        #print("error gene!")
        #return 0

    gene_x9_dict= parse_X9(transcript_list[0][8])
    if gene_x9_dict['gene_type'] =="protein_coding":
        #print("come a protein coding gene!")
        ##print(transcript_list)
        exonic=[]
        cds=[]
        start_codon=[]
        stop_codon=[]
        three_utr=[]
        five_utr=[]
        intronic=[]
        ##print("1")
        for i in range(1,len(transcript_list)):
            ##print(transcript_list[i])
            i_x9_dict=parse_X9(transcript_list[i][8])
            ##print(i_x9_dict)
            if i_x9_dict['transcript_type']=="protein_coding":
                if transcript_list[i][2]=="exon":
                    exonic.append([transcript_list[i][3],transcript_list[i][4]])
                elif transcript_list[i][2]=='CDS':
                    cds.append([transcript_list[i][3],transcript_list[i][4]])
                elif transcript_list[i][2]=='start_codon':
                    start_codon.append([transcript_list[i][3],transcript_list[i][4]])
                elif transcript_list[i][2]=="stop_codon":
                    stop_codon.append([transcript_list[i][3],transcript_list[i][4]])
                elif transcript_list[i][2]=="five_prime_UTR":
                    five_utr.append([transcript_list[i][3],transcript_list[i][4]])
                elif transcript_list[i][2]=="three_prime_UTR":
                    three_utr.append([transcript_list[i][3],transcript_list[i][4]])
                elif transcript_list[i][2]=="transcript":
                    intronic.append([transcript_list[i][3],transcript_list[i][4]])
                #else:
                    #print()
                #else:unknown
            #else:unknown
        #print("curGene:exon:")
        #print(exonic)
        curGene=Gene(gene_id=gene_x9_dict['gene_id'],gene_name=gene_x9_dict['gene_name'],gene_type=gene_x9_dict['gene_type'],\
        genome_start=transcript_list[0][3],genome_end=transcript_list[0][4],genome_chr=transcript_list[0][0],\
        source=transcript_list[0][1],genome_strand=transcript_list[0][6],exonic=exonic,cds=cds,start_codon=start_codon,stop_codon=stop_codon,
        three_utr=three_utr,five_utr=five_utr,intronic=intronic,out_file=out_file)
        if exonic:
            #print("parse exon")
            #print(gene_id)
            #print(exonic)
            curGene.define_exon()
        if cds:
            #print("parse cds")
            curGene.define_cds()
        if start_codon:
            #print("parse start codon")
            curGene.define_start_codon()
        if stop_codon:
            #print("parse stop codon")
            curGene.define_stop_codon()
        if three_utr:
            #print("parse three utr")
            curGene.define_three_utr()
        if five_utr:
            #print("parse five utr")
            curGene.define_five_utr()
        if intronic:
            #print("parse intronic")
            curGene.define_intronic()
        #print("parse unknown")
        curGene.define_unknown()
        curGene.report_gene()
        #sys.exit("parse gene done!")
    else:
        curGene=Gene(gene_id=gene_x9_dict['gene_id'],gene_name=gene_x9_dict['gene_name'],gene_type=gene_x9_dict['gene_type'],\
        genome_start=transcript_list[0][3],genome_end=transcript_list[0][4],genome_chr=transcript_list[0][0],\
        source=transcript_list[0][1],genome_strand=transcript_list[0][6],out_file=out_file)
        curGene.report_gene()
   



                    

#out_file="/workspace/fux/miRNASNP3/mapping_snp_gencode/parse_gencode_gff3/parse_01"
out_file=sys.argv[2]
gff3_file=sys.argv[1]

with open(gff3_file) as infile:
    for i in range(0,1):
        annotation=infile.readline()
        ##print(annotation)  
    line=infile.readline()
    nline=line.strip().split()
    transcript_list=[nline]
    ##print(line.strip())
    x9_dict=parse_X9(nline[8])
    gene_id=x9_dict['gene_id']
    gene_name=x9_dict['gene_name']
    gene_type=x9_dict['gene_type']
    line=infile.readline()
    while line:
        if not line.startswith('#'):
            nline=line.strip().split()
            ##print(line.strip())
            x9_dict=parse_X9(nline[8])
            if x9_dict['gene_id']==gene_id and x9_dict['gene_name']==gene_name and x9_dict['gene_type']==gene_type:
                transcript_list.append(nline)
            else:
                ##print(transcript_list)
                parse_gene(transcript_list,out_file)
                nline=line.strip().split()
                transcript_list=[nline]
                x9_dict=parse_X9(nline[8])
                gene_id=x9_dict['gene_id']
                gene_name=x9_dict['gene_name']
                gene_type=x9_dict['gene_type']
        line=infile.readline()
    parse_gene(transcript_list,out_file)

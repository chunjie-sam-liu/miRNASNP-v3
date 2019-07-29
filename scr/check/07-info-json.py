#import json,sys

#with open(sys.argv[2],"a") as out:
 #   with open(sys.argv[1]) as infile:
  #      temp_dict={}
   #     for line in infile:
    #        temp_json={}
     #       nline=line.strip().split('\t')
      #      if nline[0].startswith('hsa'):
       #         temp_json['mirna_id']=nline[0]
        #        temp_json['mm_starts']=nline[1]
         #       temp_json['mm_end']=nline[2]
          #      temp_json['tgs_start']=nline[4]
           #     temp_json['tgs_end']=nline[5]
            #    temp_json['dg_duplex']=nline[12]
             #   temp_json['dg_binding']=nline[13]
              #  temp_json['dg_open']=nline[14]
               # temp_json['tgs_au']=nline[15]
                temp_json['tgs_score']=nline[18]
                temp_json['prob_exac']=nline[19]
                nalign=nline[20].split('#')
                temp_json['align_1']=nalign[0]
                temp_json['align_2']=nalign[1]
                temp_json['align_3']=nalign[2]
                temp_json['align_4']=' '*(len(nalign[1])-len(nalign[3]))+nalign[3]
                temp_json['align_5']=' '*(len(nalign[1])-len(nalign[4]))+nalign[4]
                temp_dict[temp_id]=temp_json
                temp_id+=1
        json.dump(temp_dict,out)
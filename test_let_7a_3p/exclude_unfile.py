import sys


def getUnfile(infiles):
    unfile_list = []
    with open(infiles) as infile:
        for line in infile:
            unfile_list.append(line)
        return unfile_list

def processExclude(infiles): 
    with open(infiles) as infile:
        exclude_list = []
        for line in infile:
            if line in unfile_list:
                continue
            else:
                exclude_list.append(line)
        return exclude_list

def outPut(outfiles):
    with open(outfiles,"a") as outfile:
        for line in exclude_list:
            outfile.write(line)

if len(sys.argv)!=4:
    print("\n###The script exclude un_file items from infile,also remove replicate###" )
    print("---------------------------------------------------------------------------")
    print("usage:python "+sys.argv[0]+" un_file infile outfile\n")
else:
    unfile_list = getUnfile(sys.argv[1])
    exclude_list = list(set(processExclude(sys.argv[2])))
    outPut(sys.argv[3])
    


    



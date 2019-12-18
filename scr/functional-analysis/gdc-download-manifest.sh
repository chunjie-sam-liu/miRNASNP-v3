#!/usr/bin/env bash
# @AUTHOR: Chun-Jie Liu
# @CONTACT: chunjie.sam.liu.at.gmail.com
# @DATE: 2019-11-08 14:42:35
# @DESCRIPTION:

# Number of input parameters


manifest=$1
[[ ! -z $2 ]] && thread=$2 || thread=20
param=$#


function usage {
	if [ "$param" -lt 1 ]; then
		echo "Usage:"
		echo "	bash gdc_download.sh manifest.csv parallel_number(default 20)"
		exit 1
	fi

	if [ ! -f $manifest ]; then
		echo "Error: First argument must be manifest file"
		echo "Usage:"
		echo "	bash gdc_download.sh manifest.csv parallel_number(default 20)"
		exit 1
	fi
}

usage


# Make fifo
tmp_fifofile='/tmp/$$.fifo'
mkfifo $tmp_fifofile
exec 6<>$tmp_fifofile
rm -rf $tmp_fifofile

for (( i=0; i < $thread; i++ ))
do
	echo ""
done>&6

# All file id
fileID=()
while read line;do name=(${line//"\t"/ }); fileID+=(${name[0]}); done < $manifest

# echo ${#fileID[@]}

# All task table with
Total=${#fileID[@]}
for (( i=0; i < $Total; i++ ));
do
	read -u6
	{
		# echo ${fileID[i]}
		# sleep 5
		# Download data 20 parallel
		gdc-client download ${fileID[i]}
		echo "">&6
	}&

done
wait
exec 6>&-

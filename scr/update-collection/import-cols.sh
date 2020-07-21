#!/usr/bin/env bash
# @AUTHOR: Chun-Jie Liu
# @CONTACT: chunjie.sam.liu.at.gmail.com
# @DATE: 2020-07-21 15:40:55
# @DESCRIPTION:

# Number of input parameters



for col in `find /home/liucj/tmp/mirnasnp3/dump-data/mirnasnp -name \*.bson`;
do
  col_name=`basename ${col}`
  col_name=${col_name%.bson}
  cmd="mongorestore -h localhost --port port -u username -p passwd -d dbname -c ${col_name} ${col} &"
  echo ${cmd}
  eval ${cmd}
done
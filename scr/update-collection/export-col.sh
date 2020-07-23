#!/usr/bin/env bash
# @AUTHOR: Chun-Jie Liu
# @CONTACT: chunjie.sam.liu.at.gmail.com
# @DATE: 2020-07-21 14:34:28
# @DESCRIPTION:

# Number of input parameters

cols=$(grep -v '#' /home/fux/pro-fu/db-mir-snp/web/miRNASNP3/scr/redundancy/target_effect_tables_scripts.sh |grep -v 'seed_loss_4666' | awk '{print $3}')

for col in ${cols[@]};
do
  cmd="mongodump -h localhost --port port -u username -p passwd -d dbname -c $col -o /home/liucj/tmp/mirnasnp3/dump-data"
  echo ${cmd}
  eval ${cmd} &
done

wait


for bson in `find /home/liucj/tmp/mirnasnp3/dump-data/mirnasnp -type f`;
do
  cmd="nohup cs cp 10 ${bson} /home/liucj/tmp/mirnasnp3/dump-data/mirnasnp 1>${bson}.log 2>${bson}.log &"
  eval ${cmd}
done

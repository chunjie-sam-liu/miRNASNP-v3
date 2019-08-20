#!/bin/bash
startTime=`date +"%s.%N"`
   bash /home/fux/fux/github/miRNASNP3/scr/check/gaintar_zero/customer-gain-loss.sh
endTime=`date +"%s.%N"` 
startTimeS1=$(echo $startTime | cut -d '.' -f 1)
startTimeS2=$(echo $startTime | cut -d '.' -f 2)
endTimeS1=$(echo $endTime | cut -d '.' -f 1)
endTimeS2=$(echo $endTime | cut -d '.' -f 2)
echo "RunTime:"`expr  $endTimeS1 - $startTimeS1`.`expr $endTimeS2 - $startTimeS2`"s"
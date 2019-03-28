#check chrom
#awk '{if($1!~/^#/)print $1}' grch38p12_hsa.bed|uniq >chrom.format 

#awk '{if($7~/+/)print $1"\t"$3"\t"$4+1"\t"$4+7;else if($7~/-/)print $1"\t"$3"\t"$5-7"\t"$5-1;}' mature.gff3 >grch38p12.seedregion.bed

grep 'miRNA:' mir.b.bed|awk '{if($5~/+/)print $1"\t"$2+1"\t"$2+7"\t"$4"\t"$5"\t"$6;else{print $1"\t"$3-7"\t"$3-1"\t"$4"\t"$5"\t"$6;}}'  >mirseed.b.bed

awk -F'\t' 'OFS="\t"{if($20>=0.7)print $0}' CosmicNCV.tsv >CosmicNCV_filter.tsv

#!/usr/bin/perl

open IN,"miranda.sample2";
open OUT,">>miranda_df_res.txt";


my $item=0;
my @hit;
my $printhit='';

while(<IN>){
	if(/^Performing Scan:/){
		$item=1;
		@curhit=split(/:|-|\t|\s/,$_);
		$hit[0]=$curhit[3];
		$hit[1]=$curhit[4];
		$hit[2]=$curhit[5];
		$hit[3]=$curhit[7];
		$hit[4]=$curhit[8];
		$hit[5]=$curhit[9];
		}
	elsif($item == 1){
		if(/^>chr/){
			@curhit=split(/\t|\s/,$_);
			$hit[6]=$curhit[2];
			$hit[7]=$curhit[3];
			$hit[8]=$curhit[4];
			$hit[9]=$curhit[5];
			$hit[10]=$curhit[6];
			$hit[11]=$curhit[7];
			$hit[12]=$curhit[9];
			$hit[13]=$curhit[10];
			$printhit=join("\t", @hit);
#			print join(";",@curhit);
			print OUT $printhit,"\n";
			}
	elsif(/^Complete/){
		$item=0;
			}
		}
	}	

close IN;
close OUT;


		


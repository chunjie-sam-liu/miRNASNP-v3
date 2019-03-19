#!/usr/bin/perl

open IN,"dedup_maranda_res.txt";
open OUT,">>dedup_maranda_res_b.txt";
#open ERR,">>error.txt";

my $curmir='';

while(<IN>){
	if(/^Read Sequence:/){
		if($curmir){
			print OUT $curmir;
			$curmir='';
			}
		else{
			$curmir=$_;
		}
		}
	else{
		$curmir='';
	}
}


	

#!/usr/bin/perl

if(@ARGV != 2){
	print("usage: perl $0 inputfile outfile\n");
	}

open IN,"$ARGV[0]";
open OUT,">>$ARGV[1]";
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


	

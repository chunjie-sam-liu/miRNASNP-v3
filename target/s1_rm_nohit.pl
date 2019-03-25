#!/usr/bin/perl

if(@ARGV != 2){
	print("usage: perl $0 input_file output_file\n") 
	}
open RES,"$ARGV[0]";
open OUT,">>$ARGV[1]";
open NOTE,">>summery.txt";

my $item=0;
my $curmir='';
my @temp=();
my $rmitem=0;
my $collecitem=0;

while(<RES>){
	if(/^Read Sequence:/){
		if($curmir){
                	print OUT $curmir;
                	$curmir='';
                	@temp=();
			push @temp,$_;
                	}
		else{
			$item=1;
			$curmir=$_;
			push @temp,$_;
		}
		}
	else{
		$curmir='';
		if($item ==1){
			push @temp,$_;
			if(/^Complete/){
				if(@temp == 7){
					@temp=();
					$rmitem+=1;
					}
				elsif(@temp >7){
					print OUT @temp;
					$collecitem+=1;
					@temp=();
					}
				else{
					print NOTE "exception!";
					print NOTE @temp;
					@temp=();
				}
				$item=0;
				}
			
			}
	}
	}

print NOTE "remove items:",$rmitem,"\tcollect items:",$collecitem,"\n";

close RES;
close OUT;
close NOTE;


		
	
		
		

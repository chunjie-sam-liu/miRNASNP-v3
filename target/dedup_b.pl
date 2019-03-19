#!/usr/bin/perl

open IN,"miranda_split_res.txt";
open OUT,">>dedup_maranda_res.txt";
open ERR,">>error.txt";

my @curmir=('',1);
my $countitem=0;
my $dedup=0;

while(<IN>){
	if($dedup>0){
		$dedup-=1;
                next;
		}
        elsif(/^Read Sequence:/){
                if($curmir[0]){
			if($curmir[0] == $curmir[1]){
				$dedup=$countitem;
				next;
			}
                        print OUT $curmir[0];
			print OUT $_;
			$curmir[1]=$curmir[0];
                        $curmir[0]='';
                        $countitem=2;
                        }
                else{
                        $curmir[0]=$_;
                        $countitem+=1;
                }
                }
        else{
		if($dedup>0){
			print ERR $dedup,"\t",@curmir;
			break;
			}
                if($curmir[0]){
			print OUT $curmir[0];
			$curmir[0]='';
			}
			print OUT $_;
                $countitem+=1;

        }
}

close IN;
close OUT;
close ERR;

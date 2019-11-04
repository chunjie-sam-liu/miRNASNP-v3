"use strict";

angular.module('miRNASNP3')
    .controller('PremirDetailController', PremirDetailController);

function PremirDetailController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log("PremirDetailController loaded");
    //$scope.search_ids='hsa-mir-99b';
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.search_ids=$routeParams.search_ids;
    $scope.wild=1;
    $scope.fetch_premir=function(){
        $scope.a="letter in fetch_premir";
        $http({
            //url:base_url+base_url+'/api/premir_info',
            url:base_url+'/api/premir_info',
            method:'GET',
            params:{search_ids:$scope.search_ids}
        }).then(function (response) {
            console.log(response);
            $scope.premir_fun=0;
            $scope.premir_disease=0;
            $scope.premir_info = response.data.premir_info[0];
            if($scope.premir_info.cluster5k_id.length==0){
                $scope.premir_info.cluster5k='Null'
            }else{
                $scope.premir_info.cluster5k=''
                for(var i=0;i<$scope.premir_info.cluster5k_id.length;i++){
                    $scope.premir_info.cluster5k+= $scope.premir_info.cluster5k_id[i].join(', ')+';'
                }
                $scope.premir_info.cluster5k.substring(0,$scope.premir_info.cluster5k.length-1)
            }
            console.log($scope.premir_info.cluster5k)
            if($scope.premir_info.cluster10k_id.length==0){
                $scope.premir_info.cluster10k='Null'
            }else{
                $scope.premir_info.cluster10k=''
                for(var i=0;i<$scope.premir_info.cluster10k_id.length;i++){
                    $scope.premir_info.cluster10k+= $scope.premir_info.cluster10k_id[i].join(', ')+';'
                }
                $scope.premir_info.cluster10k.substring(0,$scope.premir_info.cluster10k.length-1)
            }
            console.log($scope.premir_info.cluster10k)
            if($scope.premir_info.host_gene.length==0){
                $scope.premir_info.host='Intergenic'
            }else{
                $scope.premir_info.host=''
                for(var i=0;i<$scope.premir_info.host_gene.length;i++){
                    $scope.premir_info.host+=$scope.premir_info.host_gene[i]+'; '
                }
                $scope.premir_info.host.substring(0,$scope.premir_info.host.length-1)
            }
            console.log($scope.premir_info.host)
            var pre_acc=[]
            var pre_pos=[]
            var mature={}

            for (var i=0;i<$scope.premir_info.mirinfo.length;i++){
                pre_acc.push($scope.premir_info.mirinfo[i].pre_acc)
                pre_pos.push($scope.premir_info.mirinfo[i].pre_chr+':'+$scope.premir_info.mirinfo[i].pre_start+'-'+$scope.premir_info.mirinfo[i].pre_end+'['+$scope.premir_info.mirinfo[i].pre_strand+']')
                if(mature.hasOwnProperty($scope.premir_info.mirinfo[i].mir_id)){
                    mature[$scope.premir_info.mirinfo[i].mir_id]['acc'].push($scope.premir_info.mirinfo[i].mir_acc)
                    mature[$scope.premir_info.mirinfo[i].mir_id]['pos'].push($scope.premir_info.mirinfo[i].mir_chr+':'+$scope.premir_info.mirinfo[i].mir_start+'-'+$scope.premir_info.mirinfo[i].mir_end+'['+$scope.premir_info.mirinfo[i].mir_strand+']')
                    mature[$scope.premir_info.mirinfo[i].mir_id]['seq']=$scope.premir_info.mirinfo[i].matureSeq
                }else{
                    mature[$scope.premir_info.mirinfo[i].mir_id]={}
                    mature[$scope.premir_info.mirinfo[i].mir_id]['acc']=[$scope.premir_info.mirinfo[i].mir_acc]
                    mature[$scope.premir_info.mirinfo[i].mir_id]['pos']=[$scope.premir_info.mirinfo[i].mir_chr+':'+$scope.premir_info.mirinfo[i].mir_start+'-'+$scope.premir_info.mirinfo[i].mir_end+'['+$scope.premir_info.mirinfo[i].mir_strand+']']
                    mature[$scope.premir_info.mirinfo[i].mir_id]['seq']=$scope.premir_info.mirinfo[i].matureSeq
                }
            }
            var pre_acc_list=Array.from(new Set(pre_acc)).join('; ')
            var pre_pos_list=Array.from(new Set(pre_pos)).join('; ')
            console.log(pre_acc_list)
            console.log(pre_pos_list)
            $scope.premir_info.pre_acc_list=pre_acc_list
            $scope.premir_info.pre_pos_list=pre_pos_list
            console.log(mature)
            var mature_array=[]
            for(var m in mature){
                mature[m]['mature_id']=m
                mature[m]['acc_list']=Array.from(new Set(mature[m]['acc'])).join('; ')
                mature[m]['pos_list']=Array.from(new Set(mature[m]['pos'])).join('; ')
                mature[m]['matureSeq']=mature[m]['seq']
                mature_array.push(mature[m])
            }
            $scope.premir_info.mature=mature_array
            console.log($scope.premir_info.mature)
            console.log($scope.premir_info.pre_acc_list)
            console.log($scope.premir_info.pre_pos_list)
            if($scope.premir_info.mirset_v9.length!=0){
                var mirset_v9=$scope.premir_info.mirset_v9[0]
                $scope.premir_info.Function=''
                $scope.premir_info.HMDD=''
                if(mirset_v9.Function){
                    $scope.premir_fun=1
                    
                for (var  i=0;i<mirset_v9.Function.length;i++){
                    $scope.premir_info.Function+=(mirset_v9.Function[i]+'; ')
                }}
                if(mirset_v9.HMDD){
                    $scope.premir_disease=1
                   
                for (var  i=0;i<mirset_v9.HMDD.length;i++){
                    $scope.premir_info.HMDD+=(mirset_v9.HMDD[i]+'; ')
                }}
                console.log($scope.premir_fun)
                console.log($scope.premir_disease)
                $scope.premir_info.function=$scope.premir_info.Function.slice(0,$scope.premir_info.Function.length-2)
                $scope.premir_info.disease=$scope.premir_info.HMDD.slice(0,$scope.premir_info.HMDD.length-2)

            }
            var mature_position=$scope.premir_info.mature_position;
            var color_option="1-"+String($scope.premir_info.sequence.length)+":lime";
            for(var i=0;i<mature_position.length;i++) {
                var mcolor = String(Number(mature_position[i][0]) + 1) + '-' + String(Number(mature_position[i][1]) + 1) + ':red';
                color_option = color_option + ' ' + mcolor
            }
                var container = new fornac.FornaContainer("#rna_ss_wild", {'applyForce': true,'allowPanningAndZooming':true,'initialSize':[554,330]});
                //var options = {'sequence':$scope.premirinfo[0].harpin_seq};
                var options = {
                    'structure': $scope.premir_info.dotfold,
                    'sequence': $scope.premir_info.sequence
                };
                console.log(color_option);
                container.addRNA(options.structure, options);
                container.addCustomColorsText(color_option);
                $scope.color_option=color_option;

        });
        $http({
            url:base_url+'/api/mirnago',
            method:'GET',
            params:{precursor_id:$scope.search_ids}
        }).then(function(response){
            console.log(response)
            $scope.mirnago_list=response.data.mirnago_list;
            $scope.mirnago_count=response.data.mirnago_count;
            if($scope.mirnago_count){
                $(function(){
                    $("#pre").append("<tr>"+
                    "<th style="+"\"font-size: 18px;font-weight:bold\"" +" rowspan="+String($scope.mirnago_count+1)+"> QuickGo function</th>"+
                    "<th colspan="+"2"+" class="+"info"+" style="+"width: 25%"+">GO term</th>"+
                    "<th colspan="+"3"+" class="+"info"+" style="+"width: 45%"+">GO name</th>"+
                    "<th colspan="+"4"+" class="+"info"+" style="+"width: 25%"+">Reference</th>"+   
                    "</tr>")
                    for(var i=0;i<$scope.mirnago_count;i++){
                        $("#pre").append("<tr>"+
                        "<td colspan="+"2"+"><a target=\"blank\" href=\"http://amigo.geneontology.org/amigo/term/"+$scope.mirnago_list[i].go_id+"\"</a>"+$scope.mirnago_list[i].go_id+"</td>"+
                        "<td colspan="+"3"+">"+$scope.mirnago_list[i].go_name+"</td>"+
                        "<td colspan="+"4"+">"+$scope.mirnago_list[i].reference+"</td>")+"</tr>"
                    }
                })
            }
        })
    };
    $scope.fetch_premir();

    $scope.structure_effection_snp=function (snp_id,click_alt) {
        $scope.primir_mut_count=0;
        $http({
            //url:base_url+base_url+'/api/primir_altseq',
            url:base_url+'/api/primir_altseq',
            method:'GET',
            params:{search_ids:snp_id}
        }).then(function (response) {
            console.log(response);
            $scope.primir_alt_list=response.data.primir_alt_list;
            $scope.primir_alt_count=response.data.primir_alt_count;
            //var container = new fornac.FornaContainer("#rna_ss_alt", {'applyForce': true,'allowPanningAndZooming':true,'initialSize':[300,300]});
                //var options = {'sequence':$scope.premirinfo[0].harpin_seq};
            if($scope.primir_alt_list[0].alt.length==1){
                var index_alt=0;
                $scope.primir_alt_info=$scope.primir_alt_list[0];
                $scope.snp_single=1;
                $scope.snp_multi=0;
            }
            else {
                $scope.primir_alt_info=$scope.primir_alt_list[0];
                console.log($scope.primir_alt_info);
                $scope.primir_alt_info.alt=$scope.primir_alt_info.alt.split(',');
                $scope.snp_single=0;
                $scope.snp_multi=1;
                if (click_alt) {
                    for (var i = 0; i < $scope.primir_alt_list.length; i++) {
                        if ($scope.primir_alt_list[i].curalt == click_alt) {
                            var index_alt = i;
                        }
                    }
                } else {
                    index_alt = 0
                }
            }
            var container = new fornac.FornaContainer("#rna_ss_alt", {'applyForce': true,'allowPanningAndZooming':true,'initialSize':[554,330]});
            var options = {
                'structure': $scope.primir_alt_list[index_alt].dotfold,
                'sequence': $scope.primir_alt_list[index_alt].pre_altseq
            };
                var color_option=$scope.color_option+' '+$scope.primir_alt_list[index_alt].rela_loc+':yellow'
                container.addRNA(options.structure, options);
                container.addCustomColorsText(color_option);
        })

    };
    $scope.structure_effection_mut=function(mut_id){
        $scope.primir_alt_count=0;
      $http({
          //url:base_url+base_url+'/api/primir_altseq_mut',
          url:base_url+'/api/primir_altseq_mut',
          method:'Get',
          params:{mut_id:mut_id}
      }).then(function(response){
          console.log(response);
          $scope.primir_mut_list=response.data.primir_mut_list[0];
          $scope.primir_mut_count=response.data.primir_mut_count;
          if($scope.primir_mut_count==1){
              var container = new fornac.FornaContainer("#rna_ss_mut", {'applyForce': true,'allowPanningAndZooming':true,'initialSize':[554,330]});
            var options = {
                'structure': $scope.primir_mut_list.dotfold,
                'sequence': $scope.primir_mut_list.pre_altseq
            };
                var color_option=$scope.color_option+' '+$scope.primir_mut_list.rela_loc+':yellow';
                container.addRNA(options.structure, options);
                container.addCustomColorsText(color_option);
          }
      })
    }
}

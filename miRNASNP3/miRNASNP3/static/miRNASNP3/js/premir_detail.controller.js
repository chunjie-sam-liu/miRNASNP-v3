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
            $scope.premir_info = response.data.premir_info[0];
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

'use strict;'

angular.module('miRNASNP3')
    .controller('KeyController', KeyController);

function KeyController($scope,$routeParams,$http,$filter,$window,miRNASNP3Service) {
    console.log("KeyController loaded");
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    var mirna_key = [];
    var mirna_key_uniq = [];
    var premir_key = [];
    var premir_key_uniq = [];
    $scope.query_mirna = $routeParams.mirna_id;
    $scope.fetch_mirna_list=function(){
        $http({
            url:base_url+'/api/mirna_key',
            //url:base_url+'/api/mirna_key',
            method:'GET',
            params:{mirna_id:$scope.query_mirna}
        }).then(function (response) {
            console.log(response);
            $scope.mirna_key_list=response.data.mirna_key_list;
            $scope.premir_key_list=response.data.premir_key_list;
            if ($scope.mirna_key_list.length==0){
                $scope.mirna_number=0;
            }
            else {
                
                for (var i = 0; i < $scope.mirna_key_list.length; i++) {
                    mirna_key.push($scope.mirna_key_list[i].mir_id)
                }
                mirna_key.sort();
                
                for (var i = 0; i < mirna_key.length; i++) {
                    if (mirna_key[i] !== mirna_key[i - 1]) {
                        mirna_key_uniq.push(mirna_key[i])
                    }
                }
            }
            if ($scope.premir_key_list.length==0){
                $scope.premir_number=0;
            }
            else {
                
                for (var i = 0; i < $scope.premir_key_list.length; i++) {
                    premir_key.push($scope.premir_key_list[i].pre_id)
                }
                premir_key.sort();
               
                for (var i = 0; i < premir_key.length; i++) {
                    if (premir_key[i] !== premir_key[i - 1]) {
                        premir_key_uniq.push(premir_key[i])
                    }
                }
            }
            if($scope.mirna_number+$scope.premir_number==0){
                $scope.error=1
            }else{
                if(mirna_key_uniq.length == 1 & premir_key_uniq.length == 0){
                    $scope.option_key = 0;
                    window.open("#!/mirna?mirna_id=" + $scope.query_mirna, "_self")
                }else if(mirna_key_uniq.length == 0 & premir_key_uniq.length == 1){
                    $scope.option_key = 0;
                    window.open("#!/premir_detail?search_ids=" + $scope.query_mirna, "_self")
                }else{
                    $scope.option_key = 1;
                    $scope.mirna_keys = mirna_key_uniq
                    console.log($scope.mirna_keys)
                    $scope.premir_keys=premir_key_uniq
                    console.log($scope.premir_keys)
                }
            }

        })
    };
    $scope.fetch_mirna_list()
}


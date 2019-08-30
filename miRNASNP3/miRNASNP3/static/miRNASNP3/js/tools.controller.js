"use strict";
angular.module('miRNASNP3')
    .controller('ToolsController', ToolsController)
    .controller('Predict_UTR_ResultController',Predict_UTR_ResultController)
    .controller('Predict_MIR_ResultController',Predict_MIR_ResultController)
    .controller('PredictStructureController',PredictStructureController);


function ToolsController($scope,$http,$routeParams,$window,miRNASNP3Service) {
    console.log("ToolsController loaded");
    $scope.flash_message=false;
    $scope.flash_message1=false;
    $scope.predict_altutr = function () {
        $scope.loading = true;
        var wildutr_sequence = $("#wildutr_sequence").val();
        var snputr_sequence = $("#snputr_sequence").val();
        if (!wildutr_sequence) {
            $scope.flash_message = "Please input wild sequence!";
            return;
        } else {
            $scope.flash_message = null;
            window.open("#!/predict_result_utr?wild_seq=" + wildutr_sequence + "&snp_seq=" + snputr_sequence, "_self")
        }
    };
        $scope.load_altutr=function(){
            $("#wildutr_sequence").val("TTCTTTCTATTTTATTATCTGGGACATATTTAAATACAAACATATTCAGA");
            $("#snputr_sequence").val("TTCTTTCTATTTTATTATCTGGGACGTATTTAAATACAAACATATTCAGA");
    };
    $scope.predict_altmir=function(){
        $scope.loading=true;
        var wildmir_sequence = $("#wildmir_sequence").val();
        var snpmir_sequence = $("#snpmir_sequence").val();
        if (!wildmir_sequence) {
            $scope.flash_message1 = "Please input wild sequence!";
            return;
        } else {
            $scope.flash_message1 = null;
            window.open("#!/predict_result_mir?wild_seq=" + wildmir_sequence + "&snp_seq=" + snpmir_sequence, "_self")
        }
    };
    $scope.load_altmir=function(){
            $("#wildmir_sequence").val("CCUGCUGGUCAGGAGUGGAUACUG");
            $("#snpmir_sequence").val("CCUGCUAGUCAGGAGUGGAUACUG");
    };
    $scope.predict_structure=function () {
        console.log("predic structure");
        $scope.loading=true;
        var wildmir_str_seq=$("#wildmir_str_seq").val();
        console.log(wildmir_str_seq);
        var snp_val=$("#snps").val();
        var snps=snp_val.replace(/\n/g,'|||');
        console.log(snps);
        if(!wildmir_str_seq){
            $scope.flash_message2 = "Please input wild sequence";
            return;
        }else{
            $scope.flash_message2=null;
            console.log("open window");
            window.open("#!/predict_structure?wild_seq="+wildmir_str_seq+"&snps="+snps,"_self")
        }
    };
    $scope.load_structure=function () {
        $("#wildmir_str_seq").val("CCUGCUGGUCAGGAGUGGAUACUG");
        $("#snps").val("G4T\nG15A")
    }
}

function Predict_UTR_ResultController($scope,$http,$routeParams,$window,miRNASNP3Service){
    console.log("PredictionResultController loaded");
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.loading=1;
    console.log($scope.loading);
    $("[data-toggle='popover']").popover();
    var condition={};
    $scope.no_result=0;
    if ($routeParams.wild_seq){
        condition['wild_seq']=$routeParams.wild_seq
    }
    if($routeParams.snp_seq){
        condition['alt_seq']=$routeParams.snp_seq
    }
    $http({
        url:base_url+'/api/prediction',
        //url:'/api/prediction',
        method:'POST',
        data:condition
    }).then(function (response) {
        console.log(response);
        $scope.result_altutr=response.data.result_altutr;
        $scope.loading=false;
        if(Number($scope.result_altutr.wild_result.length)+Number($scope.result_altutr.alt_result.length)==0){
            $scope.no_result=1;
        }
    })
}

function Predict_MIR_ResultController($scope,$http,$routeParams,$window,miRNASNP3Service){
    console.log("PredictionResultController loaded");
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $("[data-toggle='popover']").popover();
    var condition={};
    $scope.loading=1;
    $scope.no_result=0;
    if ($routeParams.wild_seq){
        condition['wild_seq']=$routeParams.wild_seq
    }
    if($routeParams.snp_seq){
        condition['alt_seq']=$routeParams.snp_seq
    }
    $http({
        url:base_url+'/api/prediction_altmir',
        //url:'/api/prediction_altmir',
        method:'POST',
        data:condition
    }).then(function (response) {
        console.log(response);
        $scope.loading=false;
        $scope.result_altmir=response.data.result_altmir;
        if(Number($scope.result_altmir.wild_result.length)+Number($scope.result_altmir.alt_result.length)==0){
            $scope.no_result=1;
        }
    })
}

function PredictStructureController($scope,$http,$routeParams,$window,miRNASNP3Service){
    console.log("PredictStructureController loaded");
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $("[data-toggle='popover']").popover();
    var condition={};
    $scope.loading=1;
    $scope.no_result=0;
    if ($routeParams.wild_seq){
        condition['wild_seq']=$routeParams.wild_seq
    }
    if($routeParams.snps){
        condition['snps']=$routeParams.snps
    }
    $http({
        url:base_url+'/api/prediction_structure',
        method:'POST',
        data:condition
    }).then(function (response) {
        console.log(response);
        $scope.loading=false;
        $scope.result_structure=response.data.result_structure;
        if($scope.result_structure.result_wild.length) {
            var container = new fornac.FornaContainer("#rna_wild", {
                'applyForce': true,
                'allowPanningAndZooming': true,
                'initialSize': [300, 300]
            });
            var options = {
                'structure': $scope.result_structure.result_wild[0].dotfold,
                'sequence': $scope.result_structure.result_wild[0].seq
            };
            //var color_option=$scope.primir_mut_list.rela_loc+':yellow';
            container.addRNA(options.structure, options);
            //container.addCustomColorsText(color_option);
        }
    });
    $scope.snps_structure=function(snp){
        var snp_list=$scope.result_structure.result_alt;
        var snp_index=0;
        for (var i=0;i<snp_list.length;i++){
            if (snp_list[i].query==snp){
                snp_index=i;
            }
        }
        var container = new fornac.FornaContainer("#rna_alt", {
                'applyForce': true,
                'allowPanningAndZooming': true,
                'initialSize': [300, 300]
            });
            var options = {
                'structure': $scope.result_structure.result_alt[snp_index].dotfold,
                'sequence': $scope.result_structure.result_alt[snp_index].seq
            };
            var color_option=$scope.result_structure.result_alt[snp_index].position+':yellow';
            container.addRNA(options.structure, options);
            container.addCustomColorsText(color_option);
    }
}
"use strict";
angular.module('miRNASNP3')
    .controller('ToolsController', ToolsController)
    .controller('Predict_UTR_ResultController',Predict_UTR_ResultController)
    .controller('Predict_MIR_ResultController',Predict_MIR_ResultController)
    .controller('PredictStructureController',PredictStructureController);


function ToolsController($scope,$http,$routeParams,$window,miRNASNP3Service) {
    console.log("ToolsController loaded");
    $scope.flash_message_altutr=false;
    $scope.flash_message_altmir=false;
    $scope.flash_message_stru=false;
    var flag_altutr=0;
    var flag_altmir=0;
    var flag_stru=0;

    $(".input-xs:text").each(function () {
        jQuery(this).change(function () {
          jQuery(this).val(jQuery.trim(jQuery(this).val()));
        })
      })
    
    function format_sequence(s){
        if(!s.match(/[ATGCatgc]*/)&!s.match(/[AUGCaugc]*/)){
            return 1
        }else{
            return 0
        }
    }

    $scope.close_invalid=function(){
        $scope.alert_altutr=0;
        $scope.alert_altmir=0;
        $scope.alert_struc=0

    }

    $scope.predict_altutr = function () {
        flag_altutr=0;
        $scope.loading = true;
        var wildutr_sequence = $.trim($("#wildutr_sequence").val());
        
        if ((/^[ATGCatgc]*$/g.test(wildutr_sequence)||/^[AUGCaugc]*$/g.test(wildutr_sequence))&&wildutr_sequence.length<5000) {
            //alert("Invalid input");
            flag_altutr += 0;
            console.log("predict altutr")
            //history.back();
        }else{
            flag_altutr+=1
        }
        var snputr_sequence = $.trim($("#snputr_sequence").val());
        if ((/^[ATGCatgc]*$/g.test(snputr_sequence)||/^[AUGCaugc]*$/g.test(snputr_sequence)||!snputr_sequence)&&snputr_sequence.length<5000) {
            flag_altutr += 0;
            console.log("predict altutr")
            //history.back();
        }else{
            flag_altutr+=1
        }
        
        //flag_altutr=format_sequence(wildutr_sequence)+format_sequence(snputr_sequence)
        console.log(flag_altutr)
        if(flag_altutr==0){
            console.log(flag_altutr)
        if (!wildutr_sequence) {
            $scope.flash_message_altutr = "Please input wild sequence!";
            return;
        } else {
            $scope.flash_message_altutr = null;
            window.open("#!/predict_result_utr?wild_seq=" + wildutr_sequence + "&snp_seq=" + snputr_sequence, "_self")
        }
    }else{
        $scope.flash_message_altutr = "Invalid input!";
    }
    };
        $scope.load_altutr=function(){
            $("#wildutr_sequence").val("TTCTTTCTATTTTATTATCTGGGACATATTTAAATACAAACATATTCAGA");
            $("#snputr_sequence").val("TTCTTTCTATTTTATTATCTGGGACGTATTTAAATACAAACATATTCAGA");
    };

    $scope.predict_altmir=function(){
        $scope.loading=true;
        flag_altmir=0
        var wildmir_sequence = $.trim($("#wildmir_sequence").val());
        if ((/^[ATGCatgc]*$/g.test(wildmir_sequence)||/^[AUGCaugc]*$/g.test(wildmir_sequence))&&wildmir_sequence.length<30) {
            //alert("Invalid input");
            flag_altmir += 0;
            console.log("predict allmir")
            //history.back();
        }else{
            flag_altmir+=1
            console.log("wildseq invalid")
        }
        var snpmir_sequence = $.trim($("#snpmir_sequence").val());
        if ((/^[ATGCatgc]*$/g.test(snpmir_sequence)||/^[AUGCaugc]*$/g.test(snpmir_sequence)||!snpmir_sequence)&&snpmir_sequence.length<30) {
            flag_altmir += 0;
            console.log("predict altmir")
            //history.back();
        }else{
            flag_altmir+=1
            console.log("snpseq invalid")
        }
        if(flag_altmir==0){
        if (!wildmir_sequence) {
            $scope.flash_message_altmir = "Please input wild sequence!";
            return;
        } else {
            $scope.flash_message_altmir = null;
            window.open("#!/predict_result_mir?wild_seq=" + wildmir_sequence + "&snp_seq=" + snpmir_sequence, "_self")
        }
    }else{
        $scope.flash_message_altmir = "Invalid input!";
    }
    };
    $scope.load_altmir=function(){
            $("#wildmir_sequence").val("CCUGCUGGUCAGGAGUGGAUACUG");
            $("#snpmir_sequence").val("CCUGCUAGUCAGGAGUGGAUACUG");
    };
    $scope.predict_structure=function () {
        console.log("predic structure");
        $scope.loading=true;
        flag_stru=0
        var structure_regex=/^[AUGCTaugct][0-9]+[AUGCTaugct]$/g
        var wildmir_str_seq=$.trim($("#wildmir_str_seq").val());
        if ((/^[ATGCatgc]*$/g.test(wildmir_str_seq)||/^[AUGCaugc]*$/g.test(wildmir_str_seq))&&wildmir_str_seq.length<200) {
            flag_stru += 0;
            console.log("predict altmir")
            //history.back();
        }else{
            flag_stru+=1
            console.log("snpseq invalid")
        }
        var snp_val=$.trim($("#snps").val());
        //console.log(snp_val)
        var snp_list=snp_val.split('\n')
        console.log(snp_list)
        for(var i=0;i<snp_list.length;i++){
            console.log(i)
            console.log(snp_list[i].match(structure_regex))
            var snp_curitem=$.trim(snp_list[i]);
            //必须有上面那一句，否则通不过
            if (structure_regex.test(snp_curitem)) {
                var location=snp_curitem.match(/([0-9]+)/)[1]
                if(Number(location)<wildmir_str_seq.length){
                    flag_stru += 0;
                console.log("snp format valid")
                }else{
                    flag_stru += 1;
                    console.log("Mapping of SNP beyond sequence range!")
                }
            
            }else{
                flag_stru+=1
                console.log("snp format invalid")
                console.log(snp_list[i])
            }
        }
        var snps=snp_val.replace(/\n/g,'|||');
        console.log(snps);
        if(flag_stru==0){
        if(!wildmir_str_seq){
            $scope.flash_message_stru = "Please input wild sequence";
            return;
        }else{
            $scope.flash_message_stru=null;
            console.log("open window");
            window.open("#!/predict_structure?wild_seq="+wildmir_str_seq+"&snps="+snps,"_self")
        }
    }else{
        $scope.flash_message_stru = "Invalid input!";
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
    $scope.wild_seq=$routeParams.wild_seq
    $scope.snp_seq=$routeParams.snp_seq
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
        //url:base_url+base_url+'/api/prediction',
        url:base_url+'/api/prediction',
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
        //url:base_url+base_url+'/api/prediction_altmir',
        url:base_url+'/api/prediction_altmir',
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
        //url:base_url+base_url+'/api/prediction_structure',
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
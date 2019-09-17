"use strict";

angular.module('miRNASNP3')
    .controller('SnpSummaryController',SnpSummaryController);

function SnpSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log('SnpSummaryController loaded');
    $("[data-toggle='popover']").popover();
    

    var condition = {};
    var page=1
    var ip_address='/api/snp_summary';
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    
    $scope.flag_identifier=0;
    var gene=$routeParams.gene
    console.log('gene')
   

    $scope.clear = function () {
        $scope.seed = 0;
        $scope.mature = 0;
        $scope.premir = 0;
        $scope.utr3 = 0;
    };
    $scope.seed = 1;
    $scope.show_one = function (refer) {
        console.log(refer);
        $scope.clear();
        if (refer == "seed") {
            $scope.seed = 1;
            $scope.class_seed = "ative";
        }
        if (refer == "mature") {
            $scope.mature = 1;
            $scope.class_mature = "ative";
        }
        if (refer == "premir") {
            $scope.premir = 1;
            $scope.class_premir = "ative";
        }
        if (refer == "utr3") {
            $scope.utr3 = 1;
            $scope.class_utr3 = "ative"
        }
    }

    //for input genes 
    function addAnnotationInputKeyupHandler(){
        var $query_iden_summary = $("#query_iden_summary");
        $query_iden_summary.keyup(function () {
            console.log("addAnnotationInputKeyupHandler");
            clearValidationStyles(this);
            //var query_iden_summary = this.value.trim();
            var query_iden_summary = $.trim($('#query_iden_summary').val())
            if (query_iden_summary != '') {
                checkAnnotationInput(query_iden_summary.toLowerCase(), this);
            }
        });
    }

    //----------------------------------------------------------------
    // clear validation styles
    function clearValidationStyles(obj) {
        console.log("clearValidationStyles")
        var $parent = $(obj).parent();
        console.log($parent)
        $parent.children('label').text('');
        $parent.removeClass('has-error').removeClass('has-success');
        $parent.children('span')
            .removeClass('glyphicon-remove-sign')
            .removeClass('glyphicon-ok-sign');
        $scope.flag_identifier=0;        
    }
    // --------------------------------------------------------------

    // check input in backend
    function checkAnnotationInput(annotation, obj, url) {
        console.log("checkAnnotationInput")
        url=  '/api/snp_summary_gene?gene=';
        $.getJSON(url+annotation, function(data){
            console.log(data)
            if(data.gene_query.length > 0){
                showSuccess(obj,'');
            }else{
                showError(obj, 'No match for ['+ annotation +']')
            }
        });
    }
    //---------------------------------------------------------------

    // show success to query
    function showSuccess(obj, msg) {
        clearValidationStyles(obj);
        var $parent = $(obj).parent();
        $parent.addClass('has-success');
        $parent.children('span').addClass('glyphicon-ok-sign');
        $parent.children('label').text(msg);
        $scope.flag_identifier=0;   
    }
    // --------------------------------------------------------------

    // show errors
    function showError(obj, msg) {
        clearValidationStyles(obj);
        var $parent = $(obj).parent();
        $parent.addClass('has-error');
        $parent.children('span').addClass('glyphicon-remove-sign');
        $parent.children('label').text('Error: ' + msg);
        $scope.flag_identifier=1;
    }
    // --------------------------------------------------------------
     // search autocomplete
     function check_input_autocomplete(){
         console.log("check_input_autocomplete")
        $("#query_iden_summary").autocomplete({
            autoFocus: true,
            source: function(request, response){
                //var url = '/api/snp_summary_gene?gene=' + request.term.trim();
                var url = base_url+'/api/snp_summary_gene?gene=' + request.term.trim();
                $.getJSON(
                    url,
                    function(data){
                        console.log(data)
                        response($.map(data.gene_list, function(item){
                            console.log(item)
                           // var genes=[] 
                            //for(var i=0;i<item.gene_list.length;i++){
                             //   genes.push(item.gene_list[i].gene_symbol)
                            //}
                            return item.gene_symbol}))

                    }
                );
            },
            select: function(event, ui){
                showSuccess(this);
            }
        });
    }
    addAnnotationInputKeyupHandler()
    check_input_autocomplete()


    $scope.fetch_snp_summary=function(){
        var flag_snp=0;
        //var flag_identifier=0;
        $scope.initial=1;
        condition['chrome']='All';
        condition['location']='All';
        condition['gmaf']='All';
        condition['ldsnp']='';
        condition['mutation_rela']='';
        condition['page']=1;
        
        console.log(page)
       // console.log($scope.initial)
       // console.log($scope.snp_summary_count)
        $scope.snp_summary_count=0;
        if(gene){
            condition['gene']=gene
        }
        //var chr = $("#chr option:selected").text();
        //if (chr!="All"){
        //    condition["chrome"]=chr
        //}
        //var location=$("#location option:selected").val();
        //if(location!="All"){
         //   condition['location']=location
        //}
        var gmaf=$("#gmaf option:selected").text();
        if(gmaf!="All"){
            condition['gmaf']=gmaf
        }
        
        
        var query_snp_summary =$.trim($('#query_snp_summary').val());
        if (/[@#\$%\^&\*<>\.]+/g.test(query_snp_summary)) {
                alert("Invalid input");
                flag_snp = 1;
                history.back();
              
            }
        if(flag_snp==0){
            condition['snp_id'] =query_snp_summary
        }
        var query_iden_summary=$.trim($('#query_iden_summary').val());
        if (/[@#\$%\^&\*<>\.]+/g.test(query_iden_summary)) {
            alert("Invalid input");
            $scope.flag_identifier = 1;
            history.back();
         
        }
        if($scope.flag_identifier==0){
            condition['identifier']=query_iden_summary
        }
        

        if ($("#ldsnp").is(":checked")){
            condition["ldsnp"]=1
        }

        //if ($("#mutation_rela").is(":checked")){
         //   condition['mutation_rela']=1
        //}
        if(flag_snp==0 && $scope.flag_identifier==0){
            $http({
                //url:base_url+base_url+ip_address,
                url:base_url+'/api/snp_summary_seed',
                method:'GET',
                params:condition,
            }).then(function(response){
                console.log(response);
                $scope.initial=0;
                var seed_list=response.data.snp_seed_list;
                $scope.seed_count=response.data.snp_seed_count;
                
                for(var i=0;i<seed_list.length;i++){
                    if(Number(seed_list[i].ref_freq)==0.0){seed_list[i].ref_freq=0}
                    if(Number(seed_list[i].alt_freq)==0.0){seed_list[i].alt_freq=0}
                    if(seed_list[i].location=='mirseed'){seed_list[i].location="seed";}
                    if(seed_list[i].gain_count){seed_list[i].gain_count=parseInt(seed_list[i].gain_count).toLocaleString()}
                    if(seed_list[i].loss_count){seed_list[i].loss_count=parseInt(seed_list[i].loss_count).toLocaleString()}
                }
                $scope.seed_list=seed_list;
                

            })
            $http({
                //url:base_url+base_url+ip_address,
                url:base_url+'/api/snp_summary_mature',
                method:'GET',
                params:condition,
            }).then(function(response){
                $scope.initial=0;
                var mature_list=response.data.snp_mature_list;
                $scope.mature_count=response.data.snp_mature_count;
                for(var i=0;i<mature_list.length;i++){
                    if(Number(mature_list[i].ref_freq)==0.0){mature_list[i].ref_freq=0}
                    if(Number(mature_list[i].alt_freq)==0.0){mature_list[i].alt_freq=0}
                }
                $scope.mature_list=mature_list;
            })
            $http({
                //url:base_url+base_url+ip_address,
                url:base_url+'/api/snp_summary_premir',
                method:'GET',
                params:condition,
            }).then(function(response){
                $scope.initial=0;
                var premir_list=response.data.snp_premir_list;
                $scope.premir_count=response.data.snp_premir_count;
                for(var i=0;i<premir_list.length;i++){
                    if(Number(premir_list[i].ref_freq)==0.0){premir_list[i].ref_freq=0}
                    if(Number(premir_list[i].alt_freq)==0.0){premir_list[i].alt_freq=0}
                }
                $scope.premir_list=premir_list;

            })
            $http({
                //url:base_url+base_url+ip_address,
                url:base_url+'/api/snp_summary_utr3',
                method:'GET',
                params:condition,
            }).then(function(response){
                $scope.initial=0;
                console.log($scope.initial)
                var utr3_list=response.data.snp_utr3_list;
                $scope.utr3_count=response.data.snp_utr3_count;
                for(var i=0;i<utr3_list.length;i++){
                    if(Number(utr3_list[i].ref_freq)==0.0){utr3_list[i].ref_freq=0}
                    if(Number(utr3_list[i].alt_freq)==0.0){utr3_list[i].alt_freq=0}
                    if(utr3_list[i].location=='UTR3'){utr3_list[i].location="3'UTR";}
                    if(utr3_list[i].gain_count){utr3_list[i].gain_count=parseInt(utr3_list[i].gain_count).toLocaleString()}
                    if(utr3_list[i].loss_count){utr3_list[i].loss_count=parseInt(utr3_list[i].loss_count).toLocaleString()}
                }
                $scope.utr3_list=utr3_list
            })

        }else{
            alert("Invalid input");
            history.back();
           
            
        }
    }
    $scope.fetch_snp_summary()
    

    $scope.update_page=function(page,location){
        console.log(location)
        var flag_snp=0;
       // var flag_identifier=0;
        condition['chrome']='All';
        condition['location']=location;
        condition['gmaf']='All';
        condition['ldsnp']='';
        condition['mutation_rela']='';
        if(page){
            condition['page']=page;
        }
        console.log(page)
       // console.log($scope.initial)
       // console.log($scope.snp_summary_count)
        if(gene){
            condition['gene']=gene
        }
        var chr = $("#chr option:selected").text();
        if (chr!="All"){
            condition["chrome"]=chr
        }
       // var location=$("#location option:selected").val();
        //if(location!="All"){
         //   condition['location']=location
        //}
        var gmaf=$("#gmaf option:selected").text();
        if(gmaf!="All"){
            condition['gmaf']=gmaf
        }
        
        
        var query_snp_summary =$.trim($('#query_snp_summary').val());

        if (/[@#\$%\^&\*<>\.]+/g.test(query_snp_summary)) {
            alert("Invalid input");
            flag_snp = 1;
            history.back();
           
        }
        if(flag_snp==0){
            condition['snp_id'] =query_snp_summary
        }
        var query_iden_summary=$.trim($('#query_iden_summary').val());
        if (/[@#\$%\^&\*<>\.]+/g.test(query_iden_summary)) {
            alert("Invalid input");
            flag_snp = 1;
            history.back();
           
        }
        if($scope.flag_identifier==0){
            condition['identifier']=query_iden_summary
        }
        

        if ($("#ldsnp").is(":checked")){
            condition["ldsnp"]=1
        }

        if ($("#mutation_rela").is(":checked")){
            condition['mutation_rela']=1
        }
        if(flag_snp==0 && $scope.flag_identifier==0){
            /*$http({
                //url:base_url+base_url+ip_address,
                url:base_url+'/api/snp_summary',
                method:'GET',
                params:condition,
            }).then(function(response){
                console.log(response);
                $scope.initail=0;
                switch(location){
                    case 'mirseed':
                        {
                            var seed_list=response.data.snp_seed_list;
                            for(var i=0;i<seed_list.length;i++){
                                if(Number(seed_list[i].ref_freq)==0.0){seed_list[i].ref_freq=0}
                                if(Number(seed_list[i].alt_freq)==0.0){seed_list[i].alt_freq=0}
                                if(seed_list[i].location=='mirseed'){seed_list[i].location="seed";}
                                if(seed_list[i].gain_count){seed_list[i].gain_count=parseInt(seed_list[i].gain_count).toLocaleString()}
                                if(seed_list[i].loss_count){seed_list[i].loss_count=parseInt(seed_list[i].loss_count).toLocaleString()}
                            }
                            $scope.seed_list=seed_list
                            //$scope.seed_count=response.data.snp_summary_count;
                            break;
                        }
                    case 'mature':
                        {
                            var mature_list=response.data.snp_mature_list;
                            for(var i=0;i<mature_list.length;i++){
                                if(Number(mature_list[i].ref_freq)==0.0){mature_list[i].ref_freq=0}
                                if(Number(mature_list[i].alt_freq)==0.0){mature_list[i].alt_freq=0}
                            }
                            $scope.mature_list=mature_list
                            //$scope.mature_count=response.data.snp_summary_count;
                            break;
                        }
                    case 'pre-miRNA':
                        {
                            var premir_list=response.data.snp_premir_list;
                            for(var i=0;i<premir_list.length;i++){
                                if(Number(premir_list[i].ref_freq)==0.0){premir_list[i].ref_freq=0}
                                if(Number(premir_list[i].alt_freq)==0.0){premir_list[i].alt_freq=0}
                            }
                            $scope.premir_list=premir_list
                            //$scope.premir_count=response.data.snp_summary_count;
                            break;
                        }
                    case 'UTR3':
                        {
                            var utr3_list=response.data.snp_utr3_list;
                            for(var i=0;i<utr3_list.length;i++){
                                if(Number(utr3_list[i].ref_freq)==0.0){utr3_list[i].ref_freq=0}
                                if(Number(utr3_list[i].alt_freq)==0.0){utr3_list[i].alt_freq=0}
                                if(utr3_list[i].location=='UTR3'){utr3_list[i].location="3'UTR";}
                                if(utr3_list[i].gain_count){utr3_list[i].gain_count=parseInt(utr3_list[i].gain_count).toLocaleString()}
                                if(utr3_list[i].loss_count){utr3_list[i].loss_count=parseInt(utr3_list[i].loss_count).toLocaleString()}
                            }
                            $scope.utr3_list=utr3_list
                            //$scope.utr3_count=response.data.snp_summary_count;
                            break;
                        }
                }
                //$scope.snp_summary_list=response.data.snp_summary_list;
                //$scope.snp_summary_count=response.data.snp_summary_count;
                
            })*/
            switch(location){
                case 'mirseed':
                    {
                        $http({
                            url:base_url+'/api/snp_summary_seed',
                            method:'GET',
                            params:condition
                        }).then(function(response){
                            $scope.initial=0;
                            var seed_list=response.data.snp_seed_list;
                            for(var i=0;i<seed_list.length;i++){
                                if(Number(seed_list[i].ref_freq)==0.0){seed_list[i].ref_freq=0}
                                if(Number(seed_list[i].alt_freq)==0.0){seed_list[i].alt_freq=0}
                                if(seed_list[i].location=='mirseed'){seed_list[i].location="seed";}
                                if(seed_list[i].gain_count){seed_list[i].gain_count=parseInt(seed_list[i].gain_count).toLocaleString()}
                                if(seed_list[i].loss_count){seed_list[i].loss_count=parseInt(seed_list[i].loss_count).toLocaleString()}
                            }
                            $scope.seed_list=seed_list
                        })

                        //$scope.seed_count=response.data.snp_summary_count;
                        break;
                    }
                case 'mature':
                    {
                        $http({
                            url:base_url+'/api/snp_summary_mature',
                            method:'GET',
                            params:condition
                        }).then(function(response){
                            $scope.initial=0;
                            var mature_list=response.data.snp_mature_list;
                            for(var i=0;i<mature_list.length;i++){
                                if(Number(mature_list[i].ref_freq)==0.0){mature_list[i].ref_freq=0}
                                if(Number(mature_list[i].alt_freq)==0.0){mature_list[i].alt_freq=0}
                        }
                        $scope.mature_list=mature_list
                        //$scope.mature_count=response.data.snp_summary_count;
                        })
                        break;
                    }
                case 'pre-miRNA':
                    {
                        $http({
                            url:base_url+'/api/snp_summary_premir',
                            method:'GET',
                            params:condition
                        }).then(function(response){
                            $scope.initial=0;
                            var premir_list=response.data.snp_premir_list;
                            for(var i=0;i<premir_list.length;i++){
                            if(Number(premir_list[i].ref_freq)==0.0){premir_list[i].ref_freq=0}
                            if(Number(premir_list[i].alt_freq)==0.0){premir_list[i].alt_freq=0}
                        }
                            $scope.premir_list=premir_list
                        //$scope.premir_count=response.data.snp_summary_count;
                        })
                        break;
                    }
                case 'UTR3':
                    {
                        $http({
                            url:base_url+'/api/snp_summary_utr3',
                            method:'GET',
                            params:condition
                        }).then(function(response){
                            $scope.initial=0;
                            var utr3_list=response.data.snp_utr3_list;
                        for(var i=0;i<utr3_list.length;i++){
                            if(Number(utr3_list[i].ref_freq)==0.0){utr3_list[i].ref_freq=0}
                            if(Number(utr3_list[i].alt_freq)==0.0){utr3_list[i].alt_freq=0}
                            if(utr3_list[i].location=='UTR3'){utr3_list[i].location="3'UTR";}
                            if(utr3_list[i].gain_count){utr3_list[i].gain_count=parseInt(utr3_list[i].gain_count).toLocaleString()}
                            if(utr3_list[i].loss_count){utr3_list[i].loss_count=parseInt(utr3_list[i].loss_count).toLocaleString()}
                        }
                        $scope.utr3_list=utr3_list
                        //$scope.utr3_count=response.data.snp_summary_count;
                        })
                        break;
                    }
            }  
        }
    }
    $scope.reset_query=function(){
        clearValidationStyles($('#query_iden_summary'))
    }
}
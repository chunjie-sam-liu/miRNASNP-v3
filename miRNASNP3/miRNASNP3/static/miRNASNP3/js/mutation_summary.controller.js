"use strict";

angular.module('miRNASNP3')
    .controller('MutationSummaryController',MutationSummaryController);

function MutationSummaryController($scope,$routeParams,$http,$filter,miRNASNP3Service) {
    console.log('MutationSummaryController loaded');
    $("[data-toggle='popover']").popover();
    $(document).ready(function () {
        $('.selectpicker').selectpicker();
    });
    var page=1;
    var condition={};
    var base_url = miRNASNP3Service.getAPIBaseUrl();
    var gene=$routeParams.gene
 
    $scope.initial=1;
    $scope.flag_identifier=0;
    console.log(gene)

    function renew_mut_summary_tab(){
        $('#seed').removeClass('active')
        $('#premir').removeClass('active')
        $('#utr3').removeClass('active')
    }

    $scope.clear = function () {
        $scope.seed = 0;
        $scope.mature = 0;
        $scope.premir = 0;
        $scope.utr3 = 0;
    };
    $scope.show_one = function (refer) {
        console.log(refer);
        $scope.clear();
        renew_mut_summary_tab()
        if (refer == "seed") {
            $scope.seed = 1;
            $scope.class_seed = "active";
        }
        if (refer == "mature") {
            $scope.mature = 1;
            $scope.class_mature = "active";
        }
        if (refer == "premir") {
            $scope.premir = 1;
            $scope.class_premir = "active";
         //   var $obj=$("#premir_tab")
          //  tab_click($obj)
        }
        if (refer == "utr3") {
            $scope.utr3 = 1;
            $scope.class_utr3 = "active"
          //  var $obj=$("#utr3_tab")
           // tab_click($obj)
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
        $("#search_button").removeAttr('disabled');        
    }
    // --------------------------------------------------------------

    // check input in backend
    function checkAnnotationInput(annotation, obj, url) {
        console.log("checkAnnotationInput")
        url='/api/mutation_summary_gene?gene=';
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
        $("#search_button").removeAttr('disabled');  
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
        $("#search_button").prop("disabled", true);
    }
    // --------------------------------------------------------------
     // search autocomplete
     function check_input_autocomplete(){
         console.log("check_input_autocomplete")
        $("#query_iden_summary").autocomplete({
            autoFocus: true,
            source: function(request, response){
                var  url= base_url+'/api/mutation_summary_gene?gene=' + request.term.trim();
                //url = '/api/mutation_summary_gene?gene=' + request.term.trim();
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

    function check_input_autocomplete_phenotype(){
        console.log("check_input_autocomplete_phenotype")
       $("#query_phenotype_summary").autocomplete({
           autoFocus: true,
           source: function(request, response){
               var url = base_url+'/api/mutation_summary_phenotype?phenotype=' + request.term.trim();
               //url = '/api/mutation_summary_gene?gene=' + request.term.trim();
               $.getJSON(
                   url,
                   function(data){
                       console.log(data)
                       response($.map(data.phenotype_list, function(item){
                           console.log(item)
                          // var genes=[] 
                           //for(var i=0;i<item.gene_list.length;i++){
                            //   genes.push(item.gene_list[i].gene_symbol)
                           //}
                           return item.phenotype}))

                   }
               );
           },
           select: function(event, ui){
               //showSuccess(this);
           }
       });
   }
   check_input_autocomplete_phenotype()
    $scope.fetch_mutation_summary=function(){
        $scope.mutation_summary_count=0;
        $scope.clear()
        $scope.seed_count=0;
        $scope.mature_count=0;
        $scope.premir_count=0;
        $scope.utr3_count=0;
        $scope.initial=1;
        $scope.alert_invalid=0;
        $scope.flag_identifier=0;
        $scope.flag_phenotype=0;
       // condition['chrome']='All';
        //condition['location']='All';
        condition['resource']='All';
        //condition["snp_rela"]='';
       // condition['pubmed_id']='';
        condition['page']=1
        //var chr = $("#chr option:selected").text();
        //if (chr!="All"){
        //    condition["chrome"]=chr
        //}
        //var location=$("#location option:selected").val();
        //if(location!="All"){
        //    condition['location']=location
        //}
        var resource=$("#resource option:selected").text();
        if(resource!="All"){
            condition['resource']=resource
        }
    
        
        var query_iden_summary=$.trim($('#query_iden_summary').val());
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_iden_summary)) {
            $scope.flag_identifier = 1;
            $scope.alert_invalid=1;
            $scope.initial=0;
            $('#alert_invalid').show()
         
        }else{
            condition['gene']=query_iden_summary
        }

        var query_phenotype_summary=$.trim($('#query_phenotype_summary').val());
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_phenotype_summary)) {
            $scope.flag_phenotype = 1;
            $scope.alert_invalid=1;
            $scope.initial=0;
            $('#alert_invalid').show()
         
        }else{
            condition['pathology']=query_phenotype_summary
        }


        $('#histology').change(function(){
           console.log("change histology")
            condition['histology']=$('#histology').selectpicker('val')
        });
        
        if (gene){
            condition['gene']=gene
        }
        //if ($("#snp_rela").is(":checked")){
         //   condition["snp_rela"]=1
        //}
        //if ($("#is_pubmed").is(":checked")){
        //    condition['pubmed_id']=1
        //}
        

        //condition['target_effection']=$scope.target_effection;
        console.log(condition)
        console.log('Start search')
        console.log($scope.initial)
        if($scope.flag_identifier==0 && $scope.flag_phenotype==0){
            $http({
                
                url:base_url+'/api/mutation_summary_seed',
                method:'GET',
                params:condition
            }).then(function(response){
                //$scope.initial=0;
                console.log(response)
                $scope.seed_list=response.data.mutation_seed_list;
                if(response.data.mutation_seed_count.length!=0){
                    $scope.seed_count=response.data.mutation_seed_count[0].count;
                    $scope.clear()
                    renew_mut_summary_tab()
                    $scope.seed=1;
                    $('#seed').addClass('active')
                }
                if(response.data.mutation_seed_count.length==0){
                    $scope.seed_nonitem=1
                }
                var data_list=$scope.seed_list
            for(var i=0;i<data_list.length;i++){
                data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                if(data_list[i].location=='mirseed'){data_list[i].location='seed'}
                data_list[i].gain_count_initial=data_list[i].gain_count
                data_list[i].loss_count_initial=data_list[i].loss_count
                data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
            }
            })
           /* $http({
                
                url:base_url+'/api/mutation_summary_mature',
                method:'GET',
                params:condition
            }).then(function(response){
                $scope.initial=0;
                console.log(response)
                $scope.mature_list=response.data.mutation_mature_list;
                if(response.data.mutation_mature_count.length!=0){$scope.mature_count=response.data.mutation_mature_count[0].count;}
                var data_list=$scope.mature_list
            for(var i=0;i<data_list.length;i++){
                data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
            }
            })*/
            $http({
                
                url:base_url+'/api/mutation_summary_premir',
                method:'GET',
                params:condition
            }).then(function(response){
                //$scope.initial=0;
                console.log(response)
                $scope.premir_list=response.data.mutation_premir_list;
                if(response.data.mutation_premir_count.length!=0){$scope.premir_count=response.data.mutation_premir_count[0].count;}
                else{$scope.premir_nonitem=1}
                if($scope.premir_count>0 & $scope.seed_count==0){
                    $scope.utr3=0;
                    $('#utr3').removeClass('active')
                    $scope.premir=1;
                    $('#premir').addClass('active')
                }
                
                var data_list=$scope.premir_list
            for(var i=0;i<data_list.length;i++){
                data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                if(data_list[i].location=='mirseed'){data_list[i].location='seed'}
                //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
            }
            })
            $http({
                
                url:base_url+'/api/mutation_summary_utr3',
                method:'GET',
                params:condition
            }).then(function(response){
                $scope.initial=0;
                console.log(response)
                $scope.utr3_list=response.data.mutation_utr3_list;
                if(response.data.mutation_utr3_count.length!=0){$scope.utr3_count=response.data.mutation_utr3_count[0].count;}
                else{$scope.utr3_nonitem=1}
                if($scope.utr3_count>0&$scope.seed_count==0&$scope.premir_count==0){
                    $scope.utr3=1
                    $('#utr3').addClass('active')
                }
                var data_list=$scope.utr3_list
            for(var i=0;i<data_list.length;i++){
                data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
            }
            })
        }
    }
        
    $scope.fetch_mutation_summary()

    $scope.update_page=function(page,location){
        condition['chrome']='All';
        condition['location']='All';
        condition['resource']='All';
        condition["snp_rela"]='';
        condition['pubmed_id']='';
        condition['page']=page

        if (gene){
            condition['gene']=gene
        }
        //var chr = $("#chr option:selected").text();
        //if (chr!="All"){
        //    condition["chrome"]=chr
       // }
        //var location=$("#location option:selected").val();
        //if(location!="All"){
         //   condition['location']=location
       // }
        var resource=$("#resource option:selected").text();
        if(resource!="All"){
            condition['resource']=resource
        }
    
        
        $('#histology').change(function(){
           console.log("change histology")
            condition['histology']=$('#histology').selectpicker('val')
        });
        $('#pathology').change(function(){
        condition['pathology']=$('#pathology').selectpicker('val')
        })
    
       // if ($("#snp_rela").is(":checked")){
        //    condition["snp_rela"]=1
        //}
        //if ($("#is_pubmed").is(":checked")){
        //    condition['pubmed_id']=1
        //}
        
        switch(location){
            case 'mirseed':
                {
                $http({
                    
                    url:base_url+'/api/mutation_summary_seed',
                    method:'GET',
                    params:condition
                }).then(function(response){
                    console.log(response)
                    $scope.initial=0;
                    $scope.seed_list=response.data.mutation_seed_list;
                    $scope.seed_count=response.data.mutation_seed_count[0].count;
                    var data_list=$scope.seed_list
                for(var i=0;i<data_list.length;i++){
                    data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                    if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                    if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                    //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                    if(data_list[i].location=='mirseed'){data_list[i].location='seed'}
                    data_list[i].gain_count_initial=data_list[i].gain_count
                    data_list[i].loss_count_initial=data_list[i].loss_count
                    data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                    data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                }
                })
                break;
            }
            /*case 'mature':
                {
                    $http({
                        
                        url:base_url+'/api/mutation_summary_mature',
                        method:'GET',
                        params:condition
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.mature_list=response.data.mutation_mature_list;
                        $scope.mature_count=response.data.mutation_mature_count[0].count;
                        var data_list=$scope.mature_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                    }
                    })
                    break;  
                }*/
            case 'pre-miRNA':
                {
                    $http({
                        
                        url:base_url+'/api/mutation_summary_premir',
                        method:'GET',
                        params:condition
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.premir_list=response.data.mutation_premir_list;
                        $scope.premir_count=response.data.mutation_premir_count[0].count;
                        var data_list=$scope.premir_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].location=='mirseed'){data_list[i].location='seed'}
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                    }
                    })
                    break; 
                }
            case 'UTR3':
                {
                    $http({
                        
                        url:base_url+'/api/mutation_summary_utr3',
                        method:'GET',
                        params:condition
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.utr3_list=response.data.mutation_utr3_list;
                        $scope.utr3_count=response.data.mutation_utr3_count[0].count;
                        var data_list=$scope.utr3_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                    }
                    })  
                }

        }
        //condition['target_effection']=$scope.target_effection;
        console.log(condition)
    }

    $scope.reset=function(){
        condition=[]
        $scope.clear()
        renew_mut_summary_tab()
        clearValidationStyles($('#query_iden_summary'))
        $scope.currentPage_seed=1
        $scope.currentPage_premir=1
        $scope.currentPage_utr3=1
        $('#histology').selectpicker('val','All')
        condition['histology']='All'
        condition['pathology']='All'
        $http({
                
            url:base_url+'/api/mutation_summary_seed',
            method:'GET',
            params:condition
        }).then(function(response){
            $scope.initial=0;
            console.log(response)
            $scope.seed_list=response.data.mutation_seed_list;
            if(response.data.mutation_seed_count.length!=0){$scope.seed_count=response.data.mutation_seed_count[0].count;}
            var data_list=$scope.seed_list
        for(var i=0;i<data_list.length;i++){
            data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
            if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
            if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
            //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
            data_list[i].gain_count_initial=data_list[i].gain_count
            data_list[i].loss_count_initial=data_list[i].loss_count
            data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
            data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
        }
        })
        $http({
                
            url:base_url+'/api/mutation_summary_premir',
            method:'GET',
            params:condition
        }).then(function(response){
            $scope.initial=0;
            console.log(response)
            $scope.premir_list=response.data.mutation_premir_list;
            if(response.data.mutation_premir_count.length!=0){$scope.premir_count=response.data.mutation_premir_count[0].count;}
            var data_list=$scope.premir_list
        for(var i=0;i<data_list.length;i++){
            data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
            if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
            if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
            //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
            //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
            //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
        }
        })
        $http({
            
            url:base_url+'/api/mutation_summary_utr3',
            method:'GET',
            params:condition
        }).then(function(response){
            $scope.initial=0;
            console.log(response)
            $scope.utr3_list=response.data.mutation_utr3_list;
            if(response.data.mutation_utr3_count.length!=0){$scope.utr3_count=response.data.mutation_utr3_count[0].count;}
            var data_list=$scope.utr3_list
        for(var i=0;i<data_list.length;i++){
            data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
            if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
            if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
            if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
            data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
            data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
        }
        })
        $scope.seed=1;
        $('#seed').addClass('active')
        
    }
    $scope.close_invalid=function(){
        $scope.alert_invalid=0;
        //$scope.alert_nonitem=0;
        $scope.seed_nonitem=0;
        $scope.premir_nonitem=0;
        $scope.utr3_nonitem=0;
    }
}
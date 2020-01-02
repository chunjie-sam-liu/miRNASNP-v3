"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$routeParams,$window,miRNASNP3Service,$route) {
    console.log("HomeController loaded");
    $(".alert").alert();    

    $(document).keyup(function(event){
        if(event.keyCode ==13){
            $("#search_button").trigger("click");
        }
    });
    
    $scope.close_invalid=function(){
        $scope.alert_invalid=0;
        $scope.alert_nonitem=0;
    }

    var base_url = miRNASNP3Service.getAPIBaseUrl();
    var mir1_regex=/-/
    var mir2_regex=/[0-9]/
    var mir3_regex=/^[(mir)(hsa)(let)]/i
    var snp_regex=/^rs[0-9]+$/i
    var gene_regex=/^[0-9a-zA-Z]+$/

    $scope.search_query = function () {
        var flag = 0;
        $scope.alert_nonitem=0;
        $scope.alert_invalid=0;
        var query_item = $.trim($('#search').val());
        console.log(query_item); 
        if(/[@#\$%\^&\*<>\.\\\/]+/g.test(query_item)){
            flag = 1;
            $scope.alert_invalid=1;
            $('#alert_invalid').show()
            //window.open( "#!/", "_self");
            console.log($scope.alert_invalid)
                }
        
        if (flag == 0) {
            console.log("flag==0");
            if (snp_regex.test(query_item)) {
                console.log("a rs");
                $scope.filter_snp(query_item)
            }
            else if (mir1_regex.test(query_item)&&mir2_regex.test(query_item)&&mir3_regex.test(query_item)) {
                console.log("a mir")
                $scope.filter_mirna(query_item)
            }
            else if(gene_regex.test(query_item)){
                console.log('a gene')
                $scope.filter_alias(query_item)
            }
            else{
                console.log("unknown")
                $scope.alert_invalid=1;
                $('#alert_invalid').show()
            }
        }
    }

        $scope.filter_alias = function (query_item) {
            var has_snp=0;
            var has_phenotype=0;  
            $http({
                url:base_url+'/api/snp_summary_gene',
                method:'GET',
                params:{gene:query_item}
            }).then(function(response){
                var gene_query_snp=response.data.gene_query
                if(gene_query_snp.length){has_snp=1}
                $http({
                    url:base_url+'/api/mutation_summary_gene',
                    method:'GET',
                    params:{gene:query_item}
                }).then(function(response){
                    var gene_query_phenotype=response.data.gene_query
                    if(gene_query_phenotype.length){has_phenotype=1}
                    if(!has_snp && !has_phenotype){
                        $scope.alert_nonitem=1;
                        $('#alert_nonitem').show()
                    }else{
                        window.open("#!/gene?query_gene="+query_item+"&has_snp="+has_snp+"&has_phenotype="+has_phenotype,"_self");
                    }
                })

            })
        };
        $scope.filter_snp = function (query_snp) {
            $http({
                url:base_url+'/api/snp_summary',
                //url:base_url+'/api/snp_summary',
                method:'GET',
                params:{snp_id:query_snp},
            }).then(function(response){
                console.log(response);
                $scope.snp_summary_list=response.data.snp_summary_list;
                $scope.snp_summary_count=response.data.snp_summary_count;
                if($scope.snp_summary_count==0){
                    console.log('noitem!')
                    $scope.alert_nonitem=1;
                    $('#alert_nonitem').show()
                }else{
                    window.open( "#!/snp_summary?snp_id=" + query_snp, "_self");
                }
        })}
        $scope.filter_mirna = function (query_mirna) {
            $http({
                url:base_url+'/api/mirna_key',
                //url:base_url+'/api/mirna_key',
                method:'GET',
                params:{mirna_id:query_mirna}
            }).then(function (response) {
                console.log(response);
                $scope.mirna_key_list=response.data.mirna_key_list;
                $scope.premir_key_list=response.data.premir_key_list;
                if ($scope.mirna_key_list.length==0 & $scope.premir_key_list.length==0){
                    console.log('noitem!')
                    $scope.alert_nonitem=1;
                    $("#alert_nonitem").show()
                }else{
                    window.open("#!/key?mirna_id=" + query_mirna, "_self")
                }
        })}
        $scope.nav_snp=function(){
            console.log('click navigation!')
            // invalid $route.reload()
            $route.reload('#!/snp_summary');
        }
        $scope.nav_phenotype=function(){
            console.log('click navigation!')
            // invalid $route.reload()
            $route.reload('#!/mutation_summary');
        }
        $scope.nav_mature=function(){
            console.log('click mature miRNA navigation!')
            // invalid $route.reload()
            $route.reload('#!/mirna_summary');
        }
        $scope.nav_premir=function(){
            console.log('click navigation!')
            // invalid $route.reload()
            $route.reload('#!/primir_summary');
        }


    }

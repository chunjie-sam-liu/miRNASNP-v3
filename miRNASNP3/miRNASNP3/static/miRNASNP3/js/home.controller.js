"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$routeParams,$window,miRNASNP3Service) {
    console.log("HomeController loaded");
    $(".alert").alert();    

    $(document).keyup(function(event){
        if(event.keyCode ==13){
            $("#search_button").trigger("click");
        }
    });
    
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $scope.search_query = function () {
        var flag = 0;
        $scope.alert_nonitem=0;
        $scope.alert_invalid=0;
        var query_item = $.trim($('#search').val());
        console.log(query_item);
        if (/[@#\$%\^&\*<>\.]+/g.test(query_item)) {  
            flag = 1;
            $scope.alert_invalid=1;
            $('#alert_invalid').show()
            //window.open( "#!/", "_self");
            console.log($scope.alert_invalid)
                }
        
        if (flag == 0) {
            console.log("flag==0");
            if (query_item.indexOf('rs')==0) {
                console.log("a rs");
                $scope.filter_snp(query_item)
            }
            if (query_item.indexOf('hsa')==0||query_item.indexOf("miR")==0||query_item.indexOf("let")==0||query_item.indexOf("mir")==0) {
                console.log("a mir")
                $scope.filter_mirna(query_item)
            }
            if(!(query_item.indexOf("rs")==0)&&!(query_item.indexOf("hsa")==0 || query_item.indexOf("miR")==0|| query_item.indexOf("let")==0||query_item.indexOf("mir")==0)){
                console.log('unknown')
                $scope.filter_alias(query_item)
            }
        }
    }

        $scope.filter_alias = function (query_item) {  
                window.open("#!/gene?query_gene="+query_item,"_self");
        };
        $scope.filter_snp = function (query_snp) {
            $http({
                url:base_url+'/api/snp_summary',
                //url:'/api/snp_summary',
                method:'GET',
                params:{snp_id:query_snp},
            }).then(function(response){
                console.log(response);
                $scope.snp_summary_list=response.data.snp_summary_list;
                $scope.snp_summary_count=response.data.snp_summary_count;
                if($scope.snp_summary_count.length==0){
                    console.log('noitem!')
                    $scope.alert_nonitem=1;
                    $('#alert_nonitem').show()
                }else{
                    window.open( "#!/snp?snp_id=" + query_snp, "_self");
                }
        })}
        $scope.filter_mirna = function (query_mirna) {
            $http({
                url:base_url+'/api/mirna_key',
                //url:'/api/mirna_key',
                method:'GET',
                params:{mirna_id:query_mirna}
            }).then(function (response) {
                console.log(response);
                $scope.mirna_key_list=response.data.mirna_key_list;
                if ($scope.mirna_key_list.length==0){
                    console.log('noitem!')
                    $scope.alert_nonitem=1;
                    $("#alert_nonitem").show()
                }else{
                    window.open("#!/key?mirna_id=" + query_mirna, "_self")
                }
        })}


    }

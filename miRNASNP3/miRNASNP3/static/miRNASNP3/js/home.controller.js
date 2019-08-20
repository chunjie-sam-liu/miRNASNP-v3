"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$routeParams,$window) {
    console.log("HomeController loaded");
    $(".alert").alert();
    var snp_pattern = /^rs[0-9]*/i;
    var mir_pattern = /(^hsa|^mir|^let)/i;
    var cosmic_pattern = /^COS[0-9]*/i;
    //var gene_pattern = //;
    var flag = 0;

    $scope.search_query = function () {
        var query_item = $('#search').val();
        console.log(query_item);
        if (/[@#\$%\^&\*<>\.]+/g.test(query_item)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            console.log("flag==0");
            if (snp_pattern.test(query_item)) {
                console.log("a rs");
                $scope.filter_snp(query_item)
            } else if (cosmic_pattern.test(query_item)) {
                $scope.filter_cosmic(query_item)
            } else if (mir_pattern.test(query_item)) {
                $scope.filter_mirna(query_item)
            } else if (query_item.indexOf("ENST") == 0) {
                $scope.filter_transcript(query_item)
            } else {
                $scope.filter_alias(query_item)
            }
        }
    };
        $scope.filter_alias = function (query_item) {

        };
        $scope.filter_snp = function (query_snp) {
            window.open( "#!/snp?snp_id=" + query_snp, "_self");
        };
        $scope.filter_transcript = function (query_enst) {
            window.open("#!/enst?enst=" + query_enst, "_self")
        };
        $scope.filter_mirna = function (query_mirna) {
            window.open("#!/key?mirna_id=" + query_mirna, "_self")
        };
        $scope.filter_cosmic = function (query_cosmic) {
            window.open("#!/cosmic?cosmic_id=" + query_cosmic, "_self")
        };
}

angular.module('miRNASNP3')
    .controller('NavController', NavController);

function NavController($scope,$http,$routeParams,$window){
    console.log("NavController loaded");
    $(".alert").alert();
    var snp_pattern = /^rs[0-9]*/i;
    var mir_pattern = /(^hsa|^mir|^let)/i;
    var cosmic_pattern = /^COS[0-9]*/i;
    //var gene_pattern = //;
    var flag = 0;

    $scope.search_nav_query = function () {
        var query_nav_item = $('#nav_search').val();
        console.log(query_nav_item);
        if (/[@#\$%\^&\*<>\.]+/g.test(query_nav_item)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            console.log("flag==0");
            if (snp_pattern.test(query_nav_item)) {
                console.log("a rs");
                $scope.filter_snp(query_nav_item)
            } else if (cosmic_pattern.test(query_nav_item)) {
                $scope.filter_cosmic(query_nav_item)
            } else if (mir_pattern.test(query_nav_item)) {
                $scope.filter_mirna(query_nav_item)
            } //else if () {
                //$scope.filter_transcript(query_nav_item)
            //}
        else {
                $scope.filter_alias(query_nav_item)
            }
        }
    };
        $scope.filter_alias = function (query_item) {

        };
        $scope.filter_snp = function (query_snp) {
            window.open( "#!/snp?snp_id=" + query_snp, "_self");
        };
        $scope.filter_transcript = function (query_enst) {
            window.open("#!/enst?enst=" + query_enst, "_self")
        };
        $scope.filter_mirna = function (query_mirna) {
            window.open("#!/key?mirna_id="+query_mirna,"_self")
            //window.open("#!/mirna?mirna_id=" + query_mirna, "_self")
        };
        $scope.filter_cosmic = function (query_cosmic) {
            window.open("#!/cosmic?cosmic_id=" + query_cosmic, "_self")
        };
}


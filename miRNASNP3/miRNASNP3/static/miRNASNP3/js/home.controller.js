"use strict";

angular.module('miRNASNP3')
    .controller('HomeController', HomeController);

function HomeController($scope,$http,$routeParams,$window) {
    console.log("HomeController loaded");
    var snp_pattern = /^rs[0-9]*/;
    var mir_pattern = /^hsa/;
    var mutation_pattern = /COS[0-9]*/;
    var gene_pattern = /[a-z]/;
    var flag = 0;

    $scope.search_query = function () {
        var query_item = $('#search').val();
        console.log(query_item);
        if (/[@#\$%\^&\*]+/g.test(query_item)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            console.log("flag==0");
            if (query_item.indexOf("rs") == 0) {
                console.log("a rs");
                $scope.filter_snp(query_item)
            } else if (query_item.indexOf("COSN") == 0) {
                $scope.filter_cosmic(query_item)
            } else if (query_item.indexOf("hsa") == 0 || query_item.indexOf("mir") == 0 || query_item.indexOf("miR") == 0) {
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
            window.open("#!/mirna?mirna_id=" + query_mirna, "_self")
        };
        $scope.filter_cosmic = function (query_cosmic) {
            window.open("#!/cosmic?cosmic_id=" + query_cosmic, "_self")
        };
}
       /*
        $scope.$watch('search_ids',function (newVal) {
            if(newVal==""){
                window.alert("Enpty input")
            }
            else if(snp_pattern.test(newVal)){
                window.open("#!/search_summary","_parent")
            }
            else if (mir_pattern.test(newVal)){
                window.open("#!/search_summary_mir","_parent")
            }
        })
    }
}
*/


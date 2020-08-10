"use strict";

angular.module('miRNASNP3')
    .controller('MutationController', MutationController);

function MutationController($scope, $routeParams, $http, miRNASNP3Service) {
    console.log("MutationController loaded")
    function up(x, y) { return x[1] - y[1] }
    var base_url = miRNASNP3Service.getAPIBaseUrl();

    $("[data-toggle='popover']").popover();

    // var base_url=miRNASNP3Service.getAPIBaseUrl();
    $scope.query_mutation = $routeParams.mut_id;
    var location = $routeParams.location;
    console.log($routeParams.mut_id);
    console.log($routeParams.location)
    var page = 1;

    var one = $routeParams.one;
    var two = $routeParams.two;
    var three = $routeParams.three;
    var four = $routeParams.four;
    var five = $routeParams.five;
    var six = $routeParams.six;
    var seven = $routeParams.seven;
    var eight = $routeParams.eight;
    var nine =  $routeParams.nine
    var location = $routeParams.location;

    $scope.clear = function () {
        $scope.one = 0;
        $scope.two = 0;
        $scope.three = 0;
        $scope.four = 0;
        $scope.five = 0;
        $scope.six = 0;
        $scope.seven = 0;
        $scope.eight=0;
        $scope.nine=0;
        };
    $scope.clear()
    $scope.one=1;
    $scope.show_one = function (refer) {
        console.log(refer);
        $scope.clear()
        if (refer == "one") {
            $scope.one = 1;
            $scope.class_one = "active";
        }
        if (refer == "two") {
            $scope.two = 1;
            $scope.class_two = "active";
        }
        if (refer == "three") {
            $scope.three = 1;
            $scope.class_three = "active";
        }
        if (refer == "four") {
            $scope.four = 1;
            $scope.class_four = "active"
        }
        if (refer == "five") {
            $scope.five = 1;
            $scope.class_five = "active"
        }
        if (refer == "six") {
            $scope.six = 1;
            $scope.class_six = "active"
        }
        if (refer == "seven") {
            $scope.seven = 1;
            $scope.class_seven = "active"
        }
        if (refer == "eight") {
            $scope.eight = 1;
            $scope.class_eight = "active"
        }
        if (refer == "nine") {
            $scope.nine = 1;
            $scope.class_nine = "active"
        }
    };
    if (one) { $scope.show_one('one'); $('#one').addClass('active') }
    else if (two) { $scope.show_one('two'); $('#two').addClass('active') }
    else if (three) { $scope.show_one('three'); $('#three').addClass('active') }
    else if (four) { $scope.show_one('four'); $('#four').addClass('active') }
    else if (five) { $scope.show_one('five'); $('#five').addClass('active') }
    else if (six) { $scope.show_one('six'); $('#six').addClass('active') }
    else if (seven) { $scope.show_one('seven'); $('#seven').addClass('active') }
    else if (eight) { $scope.show_one('eight'); $('#eight').addClass('active') }
    else if (nine) { $scope.show_one('nine'); $('#nine').addClass('active') }

    function distinct(a) {
        let arr = a
        let result = []
        let obj = {}
        for (let i of arr) {
            if (!obj[i]) {
                result.push(i)
                obj[i] = 1
            }
        }
        return result
        }
    console.log(location)

    $scope.fetch_target_gain_mut = function (page) {
        console.log($scope.query_mutation);
        var flag = 0;
        var query_gene_gain = $.trim($('#search_gene').val());
        console.log(query_gene_gain)
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            $http({
                //!apache_url!//url:base_url+base_url+'/api/mut_seed_gain',
                url:base_url+ '/api/mut_seed_gain',
                method: 'GET',
                params: { mut_id: $scope.query_mutation, page: page, gene: query_gene_gain }
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_gain_list = response.data.mut_seed_gain_list;
                    $scope.mut_seed_gain_count = response.data.mut_seed_gain_count;
                    var site_array = $scope.mut_seed_gain_list
                    for (var i = 0; i < site_array.length; i++) {
                        if (site_array[i].expr_corelation) {
                            site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2)
                        }
                        if(site_array[i].utr_info.acc.length>1){
                            var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                            site_array[i].utr_info.acc=deduplicate_arr
                        }
                        site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                        site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                        site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                        site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                        site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                        site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)

                    }
                })
        }
    };
    //$scope.fetch_target_gain_mut(page);

    $(document).ready(function () {
        var flag = 0;
        $('#search_gene').on('input propertychange', function () {
            $scope.currentPage_seedgain_mut = 1
            var query_gene_gain = $.trim($('#search_gene').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if (flag == 0) {
                console.log(query_gene_gain)
                $http({
                    //!apache_url!//url:base_url+base_url+'/api/mut_seed_gain',
                    url:base_url+ '/api/mut_seed_gain',
                    method: 'GET',
                    params: { mut_id: $scope.query_mutation, page: page, gene: query_gene_gain }
                }).then(
                    function (response) {
                        console.log(response);
                        $scope.mut_seed_gain_list = response.data.mut_seed_gain_list;
                        $scope.mut_seed_gain_count = response.data.mut_seed_gain_count + 1;
                        var site_array = $scope.snp_seed_gain_list
                        for (var i = 0; i < site_array.length; i++) {
                            if (site_array[i].expr_corelation) {
                                site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2)
                            }
                            if(site_array[i].utr_info.acc.length>1){
                                var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                                site_array[i].utr_info.acc=deduplicate_arr
                            }
                            site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                            site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                            site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                            site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                            site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                            site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)

                        }
                    })
            }
        });
    });

    $scope.fetch_target_loss_mut = function (page) {
        var flag = 0;
        var query_gene_loss = $.trim($('#search_gene_loss').val());
        console.log(query_gene_loss)
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            $http({
                //!apache_url!//url:base_url+base_url+'/api/mut_seed_loss',
                url:base_url+ '/api/mut_seed_loss',
                method: 'GET',
                params: { mut_id: $scope.query_mutation, page: page, gene: query_gene_loss }
            }).then(
                function (response) {
                    console.log(response);
                    $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                    $scope.mut_seed_loss_count = response.data.mut_seed_loss_count;
                    var site_array = $scope.mut_seed_loss_list
                    for (var i = 0; i < site_array.length; i++) {
                        site_array[i].has_cor = 1
                        if (site_array[i].expr_corelation) {
                            if (site_array[i].expr_corelation == 'Not significant') { site_array[i].expr_corelation = "0.00" }
                            else { site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2) }
                        }
                        if (site_array[i].mirna_expression[0]) {
                            if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                        } else { site_array[i].has_cor = 0 }
                        if (site_array[i].gene_expression[0]) {
                            if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                        } else { site_array[i].has_cor = 0 }
                        if(site_array[i].utr_info.acc.length>1){
                            var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                            site_array[i].utr_info.acc=deduplicate_arr
                        }
                        site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                        site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                        site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                        site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                        site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                        site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)

                    }
                })
        }
    };
    //$scope.fetch_target_loss_mut(page);
    $(document).ready(function () {
        var flag = 0;
        $('#search_gene_loss').on('input propertychange', function () {
            $scope.currentPage_seedloss_mut = 1
            var query_gene_loss = $.trim($('#search_gene_loss').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if (flag == 0) {
                console.log(query_gene_loss)
                $http({
                    //url:base_url+base_url+'/api/mut_seed_loss',
                    url:base_url+ '/api/mut_seed_loss',
                    method: 'GET',
                    params: { mut_id: $scope.query_mutation, page: page, gene: query_gene_loss }
                }).then(
                    function (response) {
                        console.log(response);
                        $scope.mut_seed_loss_list = response.data.mut_seed_loss_list;
                        $scope.mut_seed_loss_count = response.data.mut_seed_loss_count + 1;
                        var site_array = $scope.mut_seed_loss_list
                        console.log("site_array")
                        console.log(site_array)
                        for (var i = 0; i < site_array.length; i++) {
                            site_array[i].has_cor = 1
                            if (site_array[i].expr_corelation) {
                                if (site_array[i].expr_corelation == 'Not significant') { site_array[i].expr_corelation = "0.00" }
                                else { site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2) }
                            }
                            if (site_array[i].mirna_expression[0]) {
                                if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                            } else { site_array[i].has_cor = 0 }
                            if (site_array[i].gene_expression[0]) {
                                if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                            } else { site_array[i].has_cor = 0 }
                            if(site_array[i].utr_info.acc.length>1){
                                var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                                site_array[i].utr_info.acc=deduplicate_arr
                            }
                            site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                            site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                            site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                            site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                            site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                            site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)

                        }
                        console.log("update loss for query gene")
                    })
            }
        });
    });

    $scope.fetch_utr_gain_mut = function (page) {
        $http({
            //url:base_url+base_url+'/api/mut_utr_gain',
            url:base_url+ '/api/mut_utr_gain',
            method: 'GET',
            params: { mut_id: $scope.query_mutation, page: page }
        }).then(function (response) {
            console.log(response)
            $scope.mut_utr_gain_list = response.data.mut_utr_gain_list;
            $scope.mut_utr_gain_count = response.data.mut_utr_gain_count;
            var site_array = $scope.mut_utr_gain_list
            for (var i = 0; i < site_array.length; i++) {
                if (site_array[i].expr_corelation) {
                    site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2)
                }
                if(site_array[i].utr_info.acc.length>1){
                    var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                    site_array[i].utr_info.acc=deduplicate_arr
                }
                site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
            }
        })
    }
    //$scope.fetch_utr_gain_mut(page)

    $scope.fetch_utr_loss_mut = function (page) {
        $http({
            //url:base_url+base_url+'/api/mut_utr_loss',
            url:base_url+ '/api/mut_utr_loss',
            method: 'GET',
            params: { mut_id: $scope.query_mutation, page: page }
        }).then(function (response) {
            console.log(response)
            $scope.mut_utr_loss_list = response.data.mut_utr_loss_list;
            $scope.mut_utr_loss_count = response.data.mut_utr_loss_count;
            var site_array = $scope.mut_utr_loss_list
            for (var i = 0; i < site_array.length; i++) {
                site_array[i].has_cor = 1
                if (site_array[i].expr_corelation) {
                    if (site_array[i].expr_corelation == 'Not significant') { site_array[i].expr_corelation = "0.00" }
                    else { site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2) }
                }
                if (site_array[i].mirna_expression[0]) {
                    if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                } else { site_array[i].has_cor = 0 }
                if (site_array[i].gene_expression[0]) {
                    if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                } else { site_array[i].has_cor = 0 }
                if(site_array[i].utr_info.acc.length>1){
                    var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                    site_array[i].utr_info.acc=deduplicate_arr
                }
                site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
                site_array[i].utr_info.position = site_array[i].utr_info.chr + ':' + site_array[i].utr_info.start + '-' + site_array[i].utr_info.end + '(' + site_array[i].utr_info.strand + ')'
            }
        })
    }
    //$scope.fetch_utr_loss_mut(page)

    $scope.fetch_target_gain_snv = function (page) {
        console.log("fetch_target_gain");
        var flag = 0;
        var query_gene_gain = $.trim($('#search_gene_snv').val());
        console.log(query_gene_gain)
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            $http({
                //url:base_url+base_url+'/api/snp_seed_gain',
                url:base_url+ '/api/snp_seed_gain',
                method: 'GET',
                params: { snp_id: $scope.query_snp, page: page, gene: query_gene_gain }
            }).then(
                function (response) {
                    console.log(response);
                    $scope.snp_seed_gain_list = response.data.snp_seed_gain_list;
                    $scope.snp_seed_gain_count = response.data.snp_seed_gain_count;
                    var site_array = $scope.snp_seed_gain_list
                    for (var i = 0; i < site_array.length; i++) {
                        site_array[i].has_cor = 1
                        if (site_array[i].expr_corelation) {
                            site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2)
                        }
                        if (site_array[i].mirna_expression[0]) {
                            if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                        } else { site_array[i].has_cor = 0 }
                        if (site_array[i].gene_expression[0]) {
                            if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                        } else { site_array[i].has_cor = 0 }
                        if(site_array[i].utr_info.acc.length>1){
                            var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                            site_array[i].utr_info.acc=deduplicate_arr
                        }
                        site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                        site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                        site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                        site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                        site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                        site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
                    }
                })
        }
    };
    //$scope.fetch_target_gain_snv(page);

    $(document).ready(function () {
        var flag = 0;
        $('#search_gene_snv').on('input propertychange', function () {
            $scope.currentPage_seedgain_snv = 1
            var query_gene_gain = $.trim($('#search_gene_snv').val());
            console.log(query_gene_gain)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_gain)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if (flag == 0) {
                console.log(query_gene_gain)
                $http({
                    //url:base_url+base_url+'/api/snp_seed_gain',
                    url:base_url+ '/api/snp_seed_gain',
                    method: 'GET',
                    params: { snp_id: $scope.query_snp, page: page, gene: query_gene_gain }
                }).then(
                    function (response) {
                        console.log(response);
                        $scope.snp_seed_gain_list = response.data.snp_seed_gain_list;
                        $scope.snp_seed_gain_count = response.data.snp_seed_gain_count + 1;
                        var site_array = $scope.snp_seed_gain_list
                        for (var i = 0; i < site_array.length; i++) {
                            site_array[i].has_cor = 1
                            if (site_array[i].expr_corelation) {
                                site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2)
                            }
                            if (site_array[i].mirna_expression[0]) {
                                if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                            } else { site_array[i].has_cor = 0 }
                            if (site_array[i].gene_expression[0]) {
                                if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                            } else { site_array[i].has_cor = 0 }
                            if(site_array[i].utr_info.acc.length>1){
                                var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                                site_array[i].utr_info.acc=deduplicate_arr
                            }
                            site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                            site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                            site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                            site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                            site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                            site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
                        }
                    })
            }
        });
    });

    $scope.fetch_target_loss_snv = function (page) {
        var flag = 0;
        var query_gene_loss = $.trim($('#search_gene_loss_snv').val());
        console.log(query_gene_loss)
        if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
            alert("Invalid input");
            flag = 1;
            history.back();
        }
        if (flag == 0) {
            $http({
                //url:base_url+base_url+'/api/snp_seed_loss',
                url:base_url+ '/api/snp_seed_loss',
                method: 'GET',
                params: { snp_id: $scope.query_snp, page: page, gene: query_gene_loss }
            }).then(
                function (response) {
                    console.log(response);
                    $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                    $scope.snp_seed_loss_count = response.data.snp_seed_loss_count;
                    var site_array = $scope.snp_seed_loss_list
                    for (var i = 0; i < site_array.length; i++) {
                        site_array[i].has_cor = 1
                        if (site_array[i].expr_corelation) {
                            if (site_array[i].expr_corelation == 'Not significant') { site_array[i].expr_corelation = "0.00" }
                            else { site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2) }
                        }
                        if (site_array[i].mirna_expression[0]) {
                            if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                        } else { site_array[i].has_cor = 0 }
                        if (site_array[i].gene_expression[0]) {
                            if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                        } else { site_array[i].has_cor = 0 }
                        if(site_array[i].utr_info.acc.length>1){
                            var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                            site_array[i].utr_info.acc=deduplicate_arr
                        }
                        site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                        site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                        site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                        site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                        site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                        site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
                    }
                });
        }
    };
    //$scope.fetch_target_loss_snv(page);

    $(document).ready(function () {
        var flag = 0;
        $('#search_gene_loss_snv').on('input propertychange', function () {
            $scope.currentPage_seedloss_snv = 1
            var query_gene_loss = $.trim($('#search_gene_loss_snv').val());
            console.log(query_gene_loss)
            if (/[@#\$%\^&\*<>\.\\\/\(\)]+/g.test(query_gene_loss)) {
                alert("Invalid input");
                flag = 1;
                history.back();
            }
            if (flag == 0) {
                console.log(query_gene_loss)
                $http({
                    //url:base_url+base_url+'/api/snp_seed_loss',
                    url:base_url+ '/api/snp_seed_loss',
                    method: 'GET',
                    params: { snp_id: $scope.query_snp, page: page, gene: query_gene_loss }
                }).then(
                    function (response) {
                        console.log(response);
                        $scope.snp_seed_loss_list = response.data.snp_seed_loss_list;
                        $scope.snp_seed_loss_count = response.data.snp_seed_loss_count + 1;
                        var site_array = $scope.snp_seed_loss_list
                        for (var i = 0; i < site_array.length; i++) {
                            site_array[i].has_cor = 1
                            if (site_array[i].expr_corelation) {
                                if (site_array[i].expr_corelation == 'Not significant') { site_array[i].expr_corelation = "0.00" }
                                else { site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2) }
                            }
                            if (site_array[i].mirna_expression[0]) {
                                if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                            } else { site_array[i].has_cor = 0 }
                            if (site_array[i].gene_expression[0]) {
                                if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                            } else { site_array[i].has_cor = 0 }
                            if(site_array[i].utr_info.acc.length>1){
                                var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                                site_array[i].utr_info.acc=deduplicate_arr
                            }
                            site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                            site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                            site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                            site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                            site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                            site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
                        }
                    })
            }
        });
    });

    $scope.fetch_snv_utr_loss = function (page) {
        $http({
            //url:base_url+base_url+'/api/snv_utr_loss',
            url:base_url+ '/api/snv_utr_loss',
            method: 'Get',
            params: { snp_id: $scope.query_snp, page: page }
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_loss_list = response.data.utr_loss_list;
            $scope.snv_utr_loss_count = response.data.utr_loss_count;
            var site_array = $scope.snv_utr_loss_list
            for (var i = 0; i < site_array.length; i++) {
                site_array[i].has_cor = 1
                if (site_array[i].expr_corelation) {
                    if (site_array[i].expr_corelation == 'Not significant') { site_array[i].expr_corelation = "0.00" }
                    else { site_array[i].expr_corelation = Number(site_array[i].expr_corelation).toFixed(2) }
                }
                if (site_array[i].mirna_expression[0]) {
                    if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                } else { site_array[i].has_cor = 0 }
                if (site_array[i].gene_expression[0]) {
                    if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                } else { site_array[i].has_cor = 0 }
                if(site_array[i].utr_info.acc.length>1){
                    var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                    site_array[i].utr_info.acc=deduplicate_arr
                }
                site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
            }
        })
    };
    //$scope.fetch_snv_utr_loss(page);

    $scope.fetch_snv_utr_gain = function (page) {
        $http({
            //url:base_url+base_url+'/api/snv_utr_gain',
            url:base_url+ '/api/snv_utr_gain',
            method: 'GET',
            params: { snp_id: $scope.query_snp, page: page }
        }).then(function (response) {
            console.log(response);
            $scope.snv_utr_gain_list = response.data.utr_gain_list;
            $scope.snv_utr_gain_count = response.data.utr_gain_count
            var site_array = $scope.snv_utr_gain_list
            for (var i = 0; i < site_array.length; i++) {
                site_array[i].has_cor = 1
                /*if(site_array[i].expr_corelation){
                    site_array[i].expr_corelation=Number(site_array[i].expr_corelation).toFixed(2)
                }*/
                if (site_array[i].mirna_expression[0]) {
                    if (Number(site_array[i].mirna_expression[0].exp_mean) == 0) { site_array[i].mirna_expression[0] = 0; site_array[i].has_cor = 0 }
                } else { site_array[i].has_cor = 0 }
                if (site_array[i].gene_expression[0]) {
                    if (Number(site_array[i].gene_expression[0].exp_mean) == 0) { site_array[i].gene_expression[0] = 0; site_array[i].has_cor = 0 }
                } else { site_array[i].has_cor = 0 }
                if(site_array[i].utr_info.acc.length>1){
                    var deduplicate_arr=distinct(site_array[i].utr_info.acc)
                    site_array[i].utr_info.acc=deduplicate_arr
                }
                site_array[i].site_info.dg_binding = Number(site_array[i].site_info.dg_binding).toFixed(2)
                site_array[i].site_info.dg_duplex = Number(site_array[i].site_info.dg_duplex).toFixed(2)
                site_array[i].site_info.dg_open = Number(site_array[i].site_info.dg_open).toFixed(2)
                site_array[i].site_info.prob_exac = Number(site_array[i].site_info.prob_exac).toFixed(2)
                site_array[i].site_info.tgs_score = Number(site_array[i].site_info.tgs_score).toFixed(2)
                site_array[i].site_info.tgs_au = Number(site_array[i].site_info.tgs_au).toFixed(2)
            }
        })
    };
    //$scope.fetch_snv_utr_gain(page);

    $scope.modal_expression = function (exp, title,expr_type) {
        echarts.init(document.getElementById('expression')).dispose();
        var myChart = echarts.init(document.getElementById('expression'));
        var series_list = []
        if(expr_type=='miRNA'){
            var expression_unit='RSEM'
        }
        if(expr_type=='gene'){
            var expression_unit='RSEM'
        }
        $scope.expression = exp[0];
        $scope.exp_item = title;
        console.log($scope.expression);
        var gene_expr = $scope.expression.exp_df;
        var cancer_types = ['cancer_type'];
        var expr = [expression_unit];

        for (var cancer in gene_expr) {
            var source_data = {}
            var labelOption = {}
            if (gene_expr[cancer] && Number(gene_expr[cancer]) != 0) {
                labelOption = {
                    normal: {
                        show: true,
                        position: 'top',
                        distance: 5,
                        align: 'left',
                        verticalAlign: 'middle',
                        rotate: 90,
                        formatter: '{name|{a}}',
                        fontSize: 8,
                        rich: {
                            name: {
                                color: '#000000',
                                textBorderColor: '#000000'
                            }
                        }
                    }
                };
                source_data['data'] = [gene_expr[cancer]]
                series_list.push(source_data)
                cancer_types.push(cancer)
                expr.push(gene_expr[cancer])
                source_data['label'] = labelOption;
                source_data['name'] = cancer;
                source_data['type'] = 'bar';
                source_data['barGap'] = 0.2;
                source_data['barWidth'] = 23
            }

        }
        //source_data_expr.sort(up)
        console.log(series_list)

        myChart.setOption({
            //dataset:{
            //    source:[cancer_types,expr]
            //},
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: expression_unit,
                    nameTextStyle: {
                        align: 'left',
                        fontSize: 12,
                        fontWeight: 'bold',
                    }
                }
            ],
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: series_list,
            color: ['#600000', '#ff79bc', '#930093', '#b15bff', '#000093', '#46a3ff', '#005757', '#1afd9c', '#007500',
                '#b7ff4a', '#737300', '#ffdc35', '#ff8000', '#ff9d6f', '#984b4b', '#c2c287', '#408080', '5a5aad',
                '#6c3365', '	#ff5151', '#820041', '#ff00ff', '#3a006f', '#0000c6', '#66b3ff', '#00a600', '#ce0000',
                '#b15bff', '#00db00', '#796400', '#004b97', '#f9f900', '#bb3d00'],
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            series: series_list,
            grid: {
                x: 45,
                y: 35,
                x2: 30,
                y2: 20,
                borderWidth: 1
            },
        });
    };

    var RULE1 = {
        'A': 'U',
        'T': 'A',
        'C': 'G',
        'G': 'C',
        'N': 'N'
    }

    $scope.modal_gain_site=function(site){
        $scope.modal_header="Target gain";
        $scope.target_gain=1;
        $scope.target_loss=0;
        $scope.modal_site=site;
        if(!site.mut_info.curalt){site.mut_info.curalt=site.mut_info.alt}
        if(site.mut_info.curalt.length==1){
         var align8=site.site_info.align8;
		var distance=align8.length-site.mut_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }else{
            if(site.strand=='-'){
                var align8=site.site_info.align8;
                var distance=align8.length-site.mut_info.distance-1;
                var curalt_len=site.mut_info.curalt.length
                $scope.align8_pre=align8.substring(0,distance);
                $scope.align8_letter=align8.substring(distance,distance+curalt_len);
                $scope.align8_later=align8.substring(distance+curalt_len,align8.length);
            }else{
                console.log(site)
                var align8=site.site_info.align8;
                //var distance=align8.length-site.mut_info.distance-1;
                var distance=align8.length-site.mut_info.distance
                var curalt_len=site.mut_info.curalt.length
                $scope.align8_pre=align8.substring(0,distance-curalt_len);
                $scope.align8_letter=align8.substring(distance-curalt_len,distance);
                $scope.align8_later=align8.substring(distance,align8.length);
            }
        }
        }

    $scope.modal_loss_site=function(site){
        $scope.modal_header="Target loss";
        $scope.target_gain=0;
        $scope.target_loss=1;
        $scope.modal_site=site;
        console.log(site)   
        if(!site.mut_info.curalt){site.mut_info.curalt=site.mut_info.alt}
        var align8=site.site_info.align8;
        var align7=site.site_info.align7;
        var distance=align8.length-site.mut_info.distance-1;
        if(site.strand=='-'){
            var distance=align8.length-site.mut_info.distance-1+site.mut_info.curalt.length-site.mut_info.curalt.length;
        }else{
            var distance=align8.length-site.mut_info.distance-1;
        }
        
        if(site.mut_info.ref.length==1){
            $scope.align8_pre=align8.substring(0,distance);
            $scope.align8_letter=align8[distance]
            $scope.align8_later=align8.substring(distance+1,align8.length);
            $scope.align7_pre=align7.substring(0,distance);
            console.log($scope.align7_pre)
            $scope.align7_letter='X';
            $scope.align7_later=align7.substring(distance+1,align7.length);
        }else{
            var ref_len=site.mut_info.ref.length
            distance+=1
            if(site.strand=="-"){
                $scope.align8_pre=align8.substring(0,distance-ref_len);
                $scope.align8_letter=align8.substring(distance-ref_len,distance)
                $scope.align8_later=align8.substring(distance,align8.length);
                $scope.align7_pre=align7.substring(0,distance-ref_len);
                $scope.align7_letter= ('X').repeat(ref_len);
                $scope.align7_later=align7.substring(distance,align7.length);
            }else{
                $scope.align8_pre=align8.substring(0,distance-ref_len);
                $scope.align8_letter=align8.substring(distance-ref_len,distance)
                $scope.align8_later=align8.substring(distance,align8.length);
                $scope.align7_pre=align7.substring(0,distance-ref_len);
                $scope.align7_letter= ('X').repeat(ref_len);
                $scope.align7_later=align7.substring(distance,align7.length);
            }}
            console.log(site)
        }

    $scope.modal_gain_site_snv=function(site){
        $scope.modal_header="Target gain";
        $scope.target_gain=1;
        $scope.target_loss=0;
        $scope.modal_site=site;
        if(site.snp_info.curalt.length==1){
         var align8=site.site_info.align8;
		var distance=align8.length-site.snp_info.distance-1;
		$scope.align8_pre=align8.substring(0,distance);
        $scope.align8_letter=align8[distance];
        $scope.align8_later=align8.substring(distance+1,align8.length);
        }else{
            if(site.strand=='-'){
                var align8=site.site_info.align8;
                var distance=align8.length-site.snp_info.distance-1;
                var curalt_len=site.snp_info.curalt.length
                $scope.align8_pre=align8.substring(0,distance);
                $scope.align8_letter=align8.substring(distance,distance+curalt_len);
                $scope.align8_later=align8.substring(distance+curalt_len,align8.length);
            }else{
                var align8=site.site_info.align8;
                var distance=align8.length-site.snp_info.distance-1;
                var curalt_len=site.snp_info.curalt.length
                $scope.align8_pre=align8.substring(0,distance-curalt_len);
                $scope.align8_letter=align8.substring(distance-curalt_len,distance);
                $scope.align8_later=align8.substring(distance,align8.length);
            }
        }
        }

    $scope.modal_loss_site_snv=function(site){
        $scope.modal_header="Target loss";
        $scope.target_gain=0;
        $scope.target_loss=1;
		$scope.modal_site=site;
        var align8=site.site_info.align8;
        var align7=site.site_info.align7;
        console.log(align7)
        var distance=align8.length-site.snp_info.distance-1;
        if(site.snp_info.ref.length==1){
            $scope.align8_pre=align8.substring(0,distance);
            $scope.align8_letter=align8[distance]
            $scope.align8_later=align8.substring(distance+1,align8.length);
            $scope.align7_pre=align7.substring(0,distance);
            console.log($scope.align7_pre)
            $scope.align7_letter='X';
            $scope.align7_later=align7.substring(distance+1,align7.length);
        }else{
            var ref_len=site.snp_info.ref.length
            distance+=1
            if(site.strand=="-"){
                $scope.align8_pre=align8.substring(0,distance-ref_len);
                $scope.align8_letter=align8.substring(distance-ref_len,distance)
                $scope.align8_later=align8.substring(distance,align8.length);
                $scope.align7_pre=align7.substring(0,distance-ref_len);
                $scope.align7_letter= ('X').repeat(ref_len);
                $scope.align7_later=align7.substring(distance,align7.length);
            }else{
                $scope.align8_pre=align8.substring(0,distance-ref_len);
                $scope.align8_letter=align8.substring(distance-ref_len,distance)
                $scope.align8_later=align8.substring(distance,align8.length);
                $scope.align7_pre=align7.substring(0,distance-ref_len);
                $scope.align7_letter= ('X').repeat(ref_len);
                $scope.align7_later=align7.substring(distance,align7.length);
            }}
            console.log(site)
        }

    $scope.echart_correlation = function (cor) {
        $scope.gene_mir = cor.mir_gene.split('_')[0] + " correlates with " + cor.mir_gene.split('_')[1]+" across 33 cancer types in TCGA.";
        var c = echarts;
        c.init(document.getElementById('correlation')).dispose();
        var cor_echart = c.init(document.getElementById('correlation'));
        var source_data = []
        //var source_data=[["cancer_types", "correlation"]]
        //cor.cor_df.sort(up)
        console.log(cor.cor_df)
        for (var cancer in cor.cor_df) {
            if (cor.cor_df[cancer]) {
                var item = [cancer, Number(cor.cor_df[cancer])]
                source_data.push(item)
            }
        }
        source_data.sort(up)
        source_data.unshift(["cancer_types", "correlation"])
        console.log(source_data)

        var option = {
            dataset: {
                source: source_data
            },

            xAxis: {
                name: 'Correlation',
                min: -1,
                max: 1,
                nameTextStyle: {
                    align: 'right',
                    fontSize: 12,
                    fontWeight: 'bold',
                },
                type: 'value',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    show: true
                },

                /*splitLine:{
                    show:false
                    　　}*/},
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            /*toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    //dataView: {show: true, readOnly: false},
                    //magicType: {show: true, type: ['line', 'bar']},
                    //restore: {show: true},
                    saveAsImage: {show: true}
                }
            },*/
            color: '#0000c6',

            series: [
                {
                    type: 'bar',
                    encode: {
                        x: 'correlation',
                        y: 'cancer_types'
                    },
                    barWidth: 10,
                    barGap: 2
                }],
        };
        cor_echart.setOption(option)
    }

    $scope.modal_gain_site_utr=function(site){
        console.log("a mut in utr cause gain")
        $scope.modal_header="Target gain"
        $scope.target_gain=1
        $scope.target_loss=0
        $scope.modal_site=site
        console.log(site.site_info.distance)
        console.log(site.mut_info.distance) 
        var d_start=Number(site.site_info.align_1.split(' ')[0])
        var over_sequence=0
        if(site.site_info.distance==0&&site.mut_info.distance){
            console.log("distance in mut_info")
            site.site_info.distance=site.mut_info.distance
        }else if(!site.site_info.distance&&!site.mut_info.distance){
            console.log("lack of distance")
            console.log("the alt out of presented sequence")
            over_sequence=1
        }
        var distance=Number(site.site_info.distance)-d_start+1
        if(!site.mut_info.curalt){
            site.mut_info.curalt=site.mut_info.alt
        }
        if(!site.utr_info.position){
            site.utr_info.position=site.utr_info.chr+':'+site.utr_info.start+'-'+site.utr_info.end+'('+site.utr_info.strand+')'
        }
        if(!site.utr_info.strand){
            site.utr_info.strand= site.utr_info.position.split(/[\(\)]/)[1]
        }
        console.log(site)
        console.log(distance)
        
        if(over_sequence){
            $scope.align6_pre=site.site_info.align6
            $scope.align6_letter=''
            $scope.align6_later==''
        }
        else if(site.mut_info.curalt.length==1 && site.mut_info.ref.length==1){
            console.log("single")
           /* if(site.utr_info.strand=='-'){
                distance-=1
            }*/
            $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
            console.log($scope.align6_pre)
            $scope.align6_letter=site.site_info.align6[distance+3]
            console.log($scope.align6_letter)
            $scope.align6_later=site.site_info.align6.substring(Number(distance)+1+3,site.site_info.align6.length)
            console.log($scope.align6_later)
            console.log($scope.modal_site.site_info.alt_display)
        }else if(site.mut_info.curalt.length>1 && site.mut_info.ref.length==1){
            console.log("a insert")
            var curalt_len=site.mut_info.curalt.length
            if(site.utr_info.strand=='-'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-curalt_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3-curalt_len,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+curalt_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+curalt_len,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }
        }else if(site.mut_info.curalt.length==1 && site.mut_info.ref.length>1){
            console.log("a delete")
            if(site.utr_info.strand=='-'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-curalt_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3-curalt_len,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }else{
                distance-=1
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                console.log($scope.align6_pre)
                console.log(site.site_info.align6.length)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+4)
                console.log($scope.align6_letter)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+4,site.site_info.align6.length)
                console.log($scope.align6_later)
                console.log($scope.modal_site.site_info.alt_display)
            }
            }
        
        
    }

    $scope.modal_loss_site_utr=function(site){
        console.log("a mut in utr cause loss")
        $scope.modal_header="Target loss";
        $scope.target_loss=1
        $scope.target_gain=0
        $scope.modal_site=site;
        var d_start=Number(site.site_info.align_1.split(' ')[0])
        var over_sequence=0
        if(site.site_info.distance==0){
            site.site_info.distance=site.site_info.alt_start
        }
        if(!site.mut_info.curalt){
            site.mut_info.curalt=site.mut_info.alt
        }
        if(!site.utr_info.position){
            site.utr_info.position=site.utr_info.chr+':'+site.utr_info.start+'-'+site.utr_info.end+'('+site.utr_info.strand+')'
        }
        if(site.site_info.distance==0&&site.mut_info.distance){
            console.log("distance in mut_info")
            site.site_info.distance=site.mut_info.distance
        }else if(!site.site_info.distance&&!site.mut_info.distance){
            console.log("lack of distance")
            console.log("the alt out of presented sequence")
            over_sequence=1
        }
        console.log(site)
        if(over_sequence){
            $scope.align6_pre=site.site_info.align6
            $scope.align6_letter=''
            $scope.align6_later==''
        }
        else if(site.mut_info.ref.length==1 && site.mut_info.curalt.length==1){
            var distance=Number(site.site_info.distance)-d_start+1
            $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
            $scope.align6_letter=site.site_info.align6[distance+3]
            $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
            $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
            $scope.align7_letter='X'
            $scope.align7_later=site.site_info.align7.substring(Number(distance)+3+1,site.site_info.align7.length)
        }
        else if(site.mut_info.curalt.length>1 && site.mut_info.ref.length==1){
            console.log("a insert")
            var distance=Number(site.site_info.distance)-d_start+1
            var ref_len=site.mut_info.ref.length
            if(site.utr_info.strand=='+'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+ref_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+ref_len,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
                $scope.align7_letter=('X').repeat(ref_len)
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+ref_len+3,site.site_info.align7.length)
            }else{
                //distance=(site.mut_info.curalt.length-site.mut_info.ref.length==1)
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-ref_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)-ref_len+3,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)-ref_len+3)
                $scope.align7_letter=('X').repeat(Number(ref_len))
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+3,site.site_info.align7.length)
            }
        }else if(site.mut_info.curalt.length==1 && site.mut_info.ref.length>1){
            console.log("a delete")
            var distance=Number(site.site_info.distance)-d_start+1
            var ref_len=site.mut_info.ref.length
            if(site.utr_info.strand=='+'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+ref_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+ref_len,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
                $scope.align7_letter=('X').repeat(ref_len)
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+ref_len+3,site.site_info.align7.length)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-ref_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)-ref_len+3,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)-ref_len+3)
                $scope.align7_letter=('X').repeat(Number(ref_len))
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+3,site.site_info.align7.length)
            }
        }
    }

    $scope.modal_gain_site_utr_snv=function(site){
        $scope.modal_header="Target gain"
        $scope.target_gain=1
        $scope.target_loss=0
        $scope.modal_site=site
        var d_start=Number(site.site_info.align_1.split(' ')[0])
        var distance=Number(site.site_info.distance)-d_start+1
        
        /*
        if(site.snp_info.curalt.length==1){
            $scope.align6_pre=site.site_info.align6.substring(0,Number(site.site_info.alt_start)+3)
            $scope.align6_letter=site.site_info.align6.substring(Number(site.site_info.alt_start)+3,Number(site.site_info.alt_end)+3)
            $scope.align6_later=site.site_info.align6.substring(Number(site.site_info.alt_end)+3,site.site_info.align6.length)
            console.log($scope.modal_site.site_info.alt_display)
        }else{
            var curalt_len=site.snp_info.curalt.length
            if(site.utr_info.strand=='-'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+1-curalt_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3-curalt_len+1,Number(distance)+3+1)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3+1)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3+1,Number(distance)+1+curalt_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1+curalt_len,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }
        }*/

        if(site.snp_info.curalt.length==1){
            console.log("single curalt")
            console.log(site)
            if(site.utr_info.strand=='-'){var alt_start=site.site_info.alt_start-1}
            else{var alt_start=site.site_info.alt_end-1}
            $scope.align6_pre=site.site_info.align6.substring(0,Number(alt_start)+3)
            console.log($scope.align6_pre)
            $scope.align6_letter=site.site_info.align6.substring(Number(alt_start)+3,Number(alt_start)+4)
            console.log($scope.align6_letter)
            $scope.align6_later=site.site_info.align6.substring(Number(alt_start)+4,site.site_info.align6.length)
            console.log($scope.align6_later)
            console.log($scope.modal_site.site_info.alt_display)
           
        }else{
            var curalt_len=site.snp_info.curalt.length
            if(site.utr_info.strand=='-'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+1-curalt_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3-curalt_len+1,Number(distance)+3+1)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3+1)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3+1,Number(distance)+1+curalt_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1+curalt_len,site.site_info.align6.length)
                console.log($scope.modal_site.site_info.alt_display)
            }
        }
    }

    $scope.modal_loss_site_utr_snv=function(site){
        $scope.modal_header="Target loss";
        if(site.site_info.loc_start){site.site_info.alt_start=site.site_info.loc_start}
        if(site.site_info.loc_end){site.site_info.alt_start=site.site_info.loc_end}
        $scope.target_loss=1
        $scope.target_gain=0
        $scope.modal_site=site;
        var d_start=Number(site.site_info.align_1.split(' ')[0])
        /*
        if(site.site_info.distance==0){
            site.site_info.distance=site.site_info.alt_start
        }
        if(site.snp_info.ref.length==1){
            var distance=Number(site.site_info.distance)-d_start
            $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
            $scope.align6_letter=site.site_info.align6[distance+3]
            $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
            $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
            $scope.align7_letter='X'
            $scope.align7_later=site.site_info.align7.substring(Number(distance)+3+1,site.site_info.align7.length)
        }
        else{
            var distance=Number(site.site_info.distance)-d_start+1
            var ref_len=site.snp_info.ref.length
            if(site.utr_info.strand=='+'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+ref_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+ref_len,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
                $scope.align7_letter=('X').repeat(ref_len)
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+ref_len+3,site.site_info.align7.length)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-ref_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)-ref_len+3,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)-ref_len+3)
                $scope.align7_letter=('X').repeat(Number(ref_len))
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+3,site.site_info.align7.length)
            }
        }*/
        if(site.site_info.distance==0){
            //site.site_info.distance=site.site_info.alt_start
            if(site.utr_info.strand=='-'){site.site_info.distance=site.site_info.alt_start-1}
            else{site.site_info.distance=site.site_info.alt_end-1}
        }
        if(site.snp_info.ref.length==1){
            console.log(site)
            var distance=Number(site.site_info.distance)-d_start+1
            $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
           // $scope.align6_letter=site.site_info.align6[distance+3]
            $scope.align6_letter=site.site_info.align6.substring(Number(distance+3),Number(distance+4))
            $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+1,site.site_info.align6.length)
            $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
            $scope.align7_letter='X'
            $scope.align7_later=site.site_info.align7.substring(Number(distance)+3+1,site.site_info.align7.length)
        }
        else{
            var distance=Number(site.site_info.distance)-d_start+1
            var ref_len=site.snp_info.ref.length
            if(site.utr_info.strand=='+'){
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)+3,Number(distance)+ref_len+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3+ref_len,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)+3)
                $scope.align7_letter=('X').repeat(ref_len)
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+ref_len+3,site.site_info.align7.length)
            }else{
                $scope.align6_pre=site.site_info.align6.substring(0,Number(distance)-ref_len+3)
                $scope.align6_letter=site.site_info.align6.substring(Number(distance)-ref_len+3,Number(distance)+3)
                $scope.align6_later=site.site_info.align6.substring(Number(distance)+3,site.site_info.align6.length)
                $scope.align7_pre=site.site_info.align7.substring(0,Number(distance)-ref_len+3)
                $scope.align7_letter=('X').repeat(Number(ref_len))
                $scope.align7_later=site.site_info.align7.substring(Number(distance)+3,site.site_info.align7.length)
            }
        }
    }

    $scope.fetch_mutation_details = function (location) {
        var page = 1;
        switch (location) {
            case "Seed":
                {
                    $http({
                        url:base_url+ '/api/mutation_summary_seed',
                        method: 'GET',
                        params: { mut_id: $scope.query_mutation }
                    }).then(function (response) {
                        console.log(response)
                        $scope.initial = 0;
                        $scope.mutation_summary_list = response.data.mutation_seed_list;
                        $scope.mutation_summary_count = response.data.mutation_seed_count[0].count;
                        var data_list = $scope.mutation_summary_list
                        for (var i = 0; i < data_list.length; i++) {
                            //data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                            if (data_list[i].resource == "ClinVar") { data_list[i].url = "https://www.ncbi.nlm.nih.gov/clinvar/variation/" + data_list[i].mut_id }
                            if (data_list[i].resource == "COSMIC") { data_list[i].url = "https://cancer.sanger.ac.uk/cosmic/ncv/overview?id=" + data_list[i].mut_id.replace(/COSN/g, "") }
                            //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                            data_list[i].gain_count = parseInt(data_list[i].gain_count).toLocaleString()
                            data_list[i].loss_count = parseInt(data_list[i].loss_count).toLocaleString()
                            data_list[i].head_identifier = 'miRNA'
                            data_list[i].identifier = data_list[i].mature_id
                            data_list[i].snp_id=data_list[i].snp_id.replace(/\"/g,"")
                        }
                        $scope.mutation_alias = $scope.mutation_summary_list.shift();
                        console.log($scope.mutation_alias)
                        $scope.mutation_alias_count = $scope.mutation_summary_list.length
                        console.log($scope.mutation_alias_count)
                        $scope.query_snp = $scope.mutation_alias.snp_id;
                        if ($scope.mutation_alias.snp_id != 'NA') {
                            $scope.fetch_target_gain_snv(page);
                            $scope.fetch_target_loss_snv(page);
                        }
                        if ($scope.mutation_alias.snp_id == 'NA') {
                            $scope.fetch_target_gain_mut(page);
                            $scope.fetch_target_loss_mut(page);
                        }
                    })
                    break;
                }
            /*case 'pre-miRNA':
                {
                    $http({
                        url:base_url+'/api/mutation_summary_premir',
                        method:'GET',
                        params:{mut_id:$scope.query_mutation}
                    }).then(function(response){
                        console.log(response)
                        $scope.initial=0;
                        $scope.mutation_summary_list=response.data.mutation_premir_list;
                        $scope.mutation_summary_count=response.data.mutation_premir_count[0].count;
                        var data_list=$scope.mutation_summary_list
                    for(var i=0;i<data_list.length;i++){
                        data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                        if(data_list[i].resource=="ClinVar"){data_list[i].url="https://www.ncbi.nlm.nih.gov/clinvar/variation/"+data_list[i].mut_id}
                        if(data_list[i].resource=="COSMIC"){data_list[i].url="https://cancer.sanger.ac.uk/cosmic/ncv/overview?id="+data_list[i].mut_id.replace(/COSN/g,"")}
                        //if(data_list[i].location=="UTR3"){data_list[i].location="3'UTR"}
                        //data_list[i].gain_count=parseInt(data_list[i].gain_count).toLocaleString()
                        //data_list[i].loss_count=parseInt(data_list[i].loss_count).toLocaleString()
                        data_list[i].head_identifier='miRNA'
                    }
                    $scope.mutation_alias=$scope.mutation_summary_list.shift();
                    console.log($scope.mutation_alias)
                    $scope.mutation_alias_count=$scope.mutation_summary_list.length
                    console.log($scope.mutation_alias_count)
                    })
                    break; 
                }*/
            case "3'UTR":
                {
                    $http({
                        url:base_url+ '/api/mutation_summary_utr3',
                        method: 'GET',
                        params: { mut_id: $scope.query_mutation }
                    }).then(function (response) {
                        console.log("mutation detail in UTR3")
                        console.log(response)
                        $scope.initial = 0;
                        $scope.mutation_summary_list = response.data.mutation_utr3_list;
                        $scope.mutation_summary_count = response.data.mutation_utr3_count;
                        var data_list = $scope.mutation_summary_list
                        for (var i = 0; i < data_list.length; i++) {
                            //data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                            if (data_list[i].resource == "ClinVar") { data_list[i].url = "https://www.ncbi.nlm.nih.gov/clinvar/variation/" + data_list[i].mut_id }
                            if (data_list[i].resource == "COSMIC") { data_list[i].url = "https://cancer.sanger.ac.uk/cosmic/ncv/overview?id=" + data_list[i].mut_id.replace(/COSN/g, "") }
                            if (data_list[i].location == "UTR3") { data_list[i].location = "3'UTR" }
                            data_list[i].gain_count = parseInt(data_list[i].gain_count).toLocaleString()
                            data_list[i].loss_count = parseInt(data_list[i].loss_count).toLocaleString()
                            data_list[i].head_identifier = "Gene"
                            data_list[i].identifier = data_list[i].gene
                            data_list[i].snp_id=data_list[i].snp_id.replace(/\"/g,"")
                        }
                        $scope.mutation_alias = $scope.mutation_summary_list.shift();
                        console.log($scope.mutation_alias)
                        $scope.mutation_alias_count = $scope.mutation_summary_list.length
                        console.log($scope.mutation_alias_count)
                        $scope.query_snp = $scope.mutation_alias.snp_id;
                        if ($scope.mutation_alias.snp_id != 'NA') {
                            $scope.fetch_snv_utr_loss(page);
                            $scope.fetch_snv_utr_gain(page);
                        }
                        if ($scope.mutation_alias.snp_id == 'NA') {
                            $scope.fetch_utr_gain_mut(page)
                            $scope.fetch_utr_loss_mut(page)
                        }
                    })
                    break;
                }
                case "UTR3":
                    {
                        $http({
                            url:base_url+ '/api/mutation_summary_utr3',
                            method: 'GET',
                            params: { mut_id: $scope.query_mutation }
                        }).then(function (response) {
                            console.log("mutation detail in UTR3")
                            console.log(response)
                            $scope.initial = 0;
                            $scope.mutation_summary_list = response.data.mutation_utr3_list;
                            $scope.mutation_summary_count = response.data.mutation_utr3_count;
                            var data_list = $scope.mutation_summary_list
                            console.log("for data list")
                            for (var i = 0; i < data_list.length; i++) {
                                //data_list[i].pathology_show=data_list[i].pathology.replace(/,/g,"; ").replace(/_and/g," ").replace(/_/g," ").replace(/\|/g,"; ")
                                if (data_list[i].resource == "ClinVar") { data_list[i].url = "https://www.ncbi.nlm.nih.gov/clinvar/variation/" + data_list[i].mut_id }
                                if (data_list[i].resource == "COSMIC") { data_list[i].url = "https://cancer.sanger.ac.uk/cosmic/ncv/overview?id=" + data_list[i].mut_id.replace(/COSN/g, "") }
                                if (data_list[i].location == "UTR3") { data_list[i].location = "3'UTR" }
                                data_list[i].gain_count = parseInt(data_list[i].gain_count).toLocaleString()
                                data_list[i].loss_count = parseInt(data_list[i].loss_count).toLocaleString()
                                data_list[i].head_identifier = "Gene"
                                data_list[i].identifier = data_list[i].gene
                                data_list[i].snp_id=data_list[i].snp_id.replace(/\"/g,"")
                            }
                            $scope.mutation_alias = $scope.mutation_summary_list.shift();
                            console.log($scope.mutation_alias)
                            $scope.mutation_alias_count = $scope.mutation_summary_list.length
                            console.log($scope.mutation_alias_count)
                            $scope.query_snp = $scope.mutation_alias.snp_id;
                            if ($scope.mutation_alias.snp_id != 'NA') {
                                $scope.fetch_snv_utr_loss(page);
                                $scope.fetch_snv_utr_gain(page);
                            }
                            if ($scope.mutation_alias.snp_id == 'NA') {
                                $scope.fetch_utr_gain_mut(page)
                                $scope.fetch_utr_loss_mut(page)
                            }
                        })
                        break;
                    }
        }
    }
    $scope.fetch_mutation_details(location);
}



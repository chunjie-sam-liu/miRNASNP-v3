'use strict';

angular.module('miRNASNP3')
    .controller('MirnaController', MirnaController);

function MirnaController($scope,$routeParams,$http,$filter) {
    console.log("MirnaController loaded");
    $scope.error = 0;
    $("[data-toggle='popover']").popover();
    $scope.query_mirna = $routeParams.mirna_id;
    console.log($routeParams.mirna_id);
    $scope.clear = function () {
        $scope.one = 0;
        $scope.two = 0;
        $scope.three = 0;
        $scope.four = 0;
        $scope.five = 0;
        $scope.six = 0;
    };
    $scope.one = 1;
    $scope.show_one = function (refer) {
        console.log(refer);
        $scope.clear()
        if (refer == "one") {
            $scope.one = 1;
            $scope.class_one = "ative";
        }
        if (refer == "two") {
            $scope.two = 1;
            $scope.class_two = "ative";
        }
        if (refer == "three") {
            $scope.three = 1;
            $scope.class_three = "ative";
        }
        if (refer == "four") {
            $scope.four = 1;
            $scope.class_four = "ative"
        }
        if (refer == "five") {
            $scope.five = 1;
            $scope.class_five = "ative"
        }
        if (refer == "six") {
            $scope.six = 1;
            $scope.class_six = "ative";
        }
    };
    $scope.fetch_mirna_details = function () {
        $http({
            url: '/api/mirinfo',
            method: 'GET',
            params: {search_ids: $scope.query_mirna}
        }).then(
            function (response) {
                console.log(response);
                $scope.mirinfo = response.data.mirinfo;
            });
    }
    $scope.fetch_mirna_details();

    $scope.fetch_target_gain = function (page) {
        console.log($scope.query_mirna);
    	$http({
			url:'/api/gain_target_seed',
			method: 'GET',
			params: {search_ids: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.gain_target_list = response.data.gain_target_list;
                    $scope.gain_count=response.data.gain_target_count[0].count;
                    var ltl = $scope.gain_target_list;
                    for (var i = 0; i <=ltl.length; i++) {
                    var site_count = ltl[i].site_num;
                    //console.log(site_count);
                    for (var j = 0; j < site_count; j++) {
                        var line=[];
                        var ns = ltl[i].site_info[j].align.split('#');
                        ltl[i].site_info[j].align = ns;
                        }
                }
                $scope.gain_target_list = ltl
                })
            };
    $scope.fetch_target_gain();

    $scope.fetch_target_gain_mut = function (page) {
        console.log($scope.query_mirna);
    	$http({
			url:'/api/gain_target_seed_mut',
			method: 'GET',
			params: {search_ids: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.gain_target_list_mut = response.data.gain_target_list_mut;
                    $scope.gain_count_mut=response.data.gain_target_count_mut[0].count;
                    var ltl = $scope.gain_target_list_mut;
                    for (var i = 0; i <=ltl.length; i++) {
                    var site_count = ltl[i].site_num;
                    //console.log(site_count);
                    for (var j = 0; j < site_count; j++) {
                        var line=[];
                        var ns = ltl[i].site_info[j].align.split('#');
                        ltl[i].site_info[j].align = ns;
                        }
                }
                $scope.gain_target_list_mut = ltl
                })
            };
    $scope.fetch_target_gain_mut();

    $scope.modal_gain_site=function(item){
		$scope.modal_header="Target Gain";
		$scope.modal_site_list=item;
		console.log(item)
	};
     $scope.modal_loss_site=function(item){
		$scope.modal_header="Target Loss";
		$scope.modal_site_list=item;
	};

   $scope.fetch_target_loss = function (page) {
    	$http({
			url:'/api/loss_target_seed',
            method: 'GET',
            params: {search_ids: $scope.query_mirna,page:page}
        }).then(
            function (response) {
                console.log(response);
                $scope.loss_target_list = response.data.loss_target_list;
                $scope.loss_count = response.data.loss_target_count[0].count;
                var ltl = $scope.loss_target_list;
                    for (var i = 0; i <=ltl.length; i++) {
                    var site_count = ltl[i].site_num;
                    //console.log(site_count);
                    for (var j = 0; j < site_count; j++) {
                        var line=[];
                        var ns = ltl[i].site_info[j].align.split('#');
                        ltl[i].site_info[j].align = ns;
                        }
                }
                $scope.loss_target_list = ltl
            });
        };
    $scope.fetch_target_loss();

    $scope.fetch_target_loss_mut = function (page) {
        console.log($scope.query_mirna);
    	$http({
			url:'/api/loss_target_seed_mut',
			method: 'GET',
			params: {search_ids: $scope.query_mirna,page:page}
            }).then(
                function (response) {
                    console.log(response);
                    $scope.loss_target_list_mut = response.data.loss_target_list_mut;
                    $scope.loss_count_mut=response.data.loss_target_count_mut[0].count;
                    var ltl = $scope.loss_target_list_mut;
                    for (var i = 0; i <=ltl.length; i++) {
                    var site_count = ltl[i].site_num;
                    //console.log(site_count);
                    for (var j = 0; j < site_count; j++) {
                        var line=[];
                        var ns = ltl[i].site_info[j].align.split('#');
                        ltl[i].site_info[j].align = ns;
                        }
                }
                $scope.loss_target_list_mut = ltl
                })
            };
    $scope.fetch_target_loss_mut();

    $scope.fetch_enrich_result=function(){
        $http({
            url:'/api/enrich_result',
            method:'Get',
            params:{ search_ids:$scope.query_mirna}
        }).then(function (response) {
            console.log(response);
            $scope.enrich_result_list=response.data.enrich_result_list;
            $scope.enrich_count=response.data.enrich_result_count;
        })
    };
    $scope.fetch_enrich_result();

    $scope.barplot_mir_expression=function() {
        $http({
            url: '/api/mir_expression',
            method: 'Get',
            params: {search_ids: $scope.query_mirna}
        }).then(function (response) {
            console.log(response);
            $scope.mir_expr_list = response.data.mir_expr_list;
            $scope.mir_expr_count = response.data.mir_expr_count;
            var mir_expr = $scope.mir_expr_list;
            var cancer_types=[];
            var normal_expr=[];
            var tumor_expr=[];
            for(var i=0;i<mir_expr.length;i++){
                cancer_types.push(mir_expr[i].cancer_types);
                normal_expr.push(Number(mir_expr[i].normal));
                tumor_expr.push(Number(mir_expr[i].tumor));
            }
            //barplot
            var a = echarts;
            var myChart = a.init(document.getElementById('mirbar'));
            var data = mir_expr;
            myChart.setOption({
                color: ['#003366', '#e5323e'],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    y: '10%',
                    x: '90%',
                    data:['normal','tumor'],
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        data:cancer_types,
                        name:'Cancer Types',
                        nameTextStyle:{
                            align:'center',
                            fontSize:12,
                            fontWeight:'bold',
                        },
                        splitLine:{
　　　　                    show:false
　　                          },
                        position:'bottom',
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:'ICM',
                        nameTextStyle:{
                            align:'left',
                            fontSize:12,
                            fontWeight:'bold',
                        },
                        splitLine:{
　　　　                    show:false
　　                          },
                        position:'bottom'
                    }
                ],
                series: [
                    {
                        name: 'normal',
                        type: 'bar',
                        barGap: 0,
                        data: normal_expr
                    },
                    {
                        name: 'tumor',
                        type: 'bar',
                        data: tumor_expr
                    },
                ],
                //title: [
                  //  {
                   //     text: 'Expression level of ' + $scope.query_mirna,
                     //   left: 'center'
                   // }
                //]
            });
        });
    };
    $scope.barplot_mir_expression()

}


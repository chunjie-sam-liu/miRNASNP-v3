'use strict';

angular.module('miRNASNP3')
    .controller('SearchController', SearchController);

function getPages(currentpage,firstPage,endPage,pageNum){
				var pages = [];
				console.log("f:"+firstPage);console.log("e:"+endPage);
				for(var i=firstPage;i<=endPage;i++){
					pages.push(i);
				}
				console.log(pages);
				return pages;
			}



function SearchController($scope,$http,$filter,$rootScope) {
    console.log("SearchController loaded");
    $scope.search_ids = $rootScope.search_ids;
   // $('#mirseed a').click(function ($scope) {
        //e.preventDefault()
     //   $scope.showchar = "you see"
       // $scope.search_gain()
        //$(this).tab('show')
   // })
    $scope.string2list = function(predict_info){
        $scope.site_info = eval(predict_info)
    }

    $http({
        url:'/api/mirinfo',
        method:'GET',
        params:{search_ids:$scope.search_ids}
    }).then(
        function (response) {
            console.log(response);
            $scope.mirinfo = response.data.mirinfo
        })
    $http({
        url:'/api/snpinfo',
        method:'GET',
        params:{search_ids:$scope.search_ids}
    }).then(
        function(response){
            console.log(response);
            $scope.snpinfo = response.data.snpinfo
        }
    )
    $scope.search_target_gain = function () {
        $scope.showchar = "you see!"
        $http({
        url: '/api/gain_hit',
        method: 'GET',
        params: {search_ids: $scope.search_ids}
    }).then(
        function (response) {
            console.log(response);
            $scope.hit_list_array = response.data.gain_hit_list;
            $scope.pagenum = 5
            var showData = $scope.hit_list_array;
            $scope.$watch('search_ids', function (n, o) {
                if (n == '') {
                    showData = $scope.hit_list_array;
                } else {
                    showData = $filter('filter')($scope.hit_list_array, n);
                }
                $scope.getPages(1);
            });

            $scope.$watch('pagenum', function (n, o) {
                $scope.getPages(1);
            });

            $scope.getPages = function (page) {
                var size = showData.length;
                console.log($scope.hit_list_array);
                $scope.totalPages = size % $scope.pagenum == 0 ? (size / $scope.pagenum) : Math.ceil(size / $scope.pagenum);
                var firspage = 0, endpage = 0;
                if (page < 5) {
                    console.log('第一项');
                    firspage = 1;
                    endpage = 5 > $scope.totalPages ? $scope.totalPages : 5;
                } else {
                    var index = $scope.totalPages - page;
                    if (index < (4)) {
                        console.log('第二项');
                        firspage = $scope.totalPages - 4;
                        endpage = $scope.totalPages;
                    } else {
                        console.log('第三项');
                        firspage = page - 2;
                        endpage = page + 2;
                    }
                }
                $scope.pages = getPages(0, firspage, endpage, 5);
                $scope.page = page;
                var indexS = ($scope.page - 1) * $scope.pagenum;
                var indexE = parseInt(indexS) + parseInt($scope.pagenum);
                var indexEnd = indexE > showData.length ? showData.length : indexE;
                var tableD = []
                for (var s = indexS; s < indexEnd; s++) {
                    tableD.push(showData[s]);
                }
                $scope.data_gain = tableD;
                $scope.records_count = size
            }
            $scope.getPages(1);
        });
    }
    $scope.search_target_loss = function () {
        $http({
        url: '/api/loss_hit',
        method: 'GET',
        params: {search_ids: $scope.search_ids}
    }).then(
        function (response) {
            console.log(response);
            $scope.hit_list_array = response.data.loss_hit_list;
            $scope.pagenum = 5
            var showData = $scope.hit_list_array;
            $scope.$watch('search_ids', function (n, o) {
                if (n == '') {
                    showData = $scope.hit_list_array;
                } else {
                    showData = $filter('filter')($scope.hit_list_array, n);
                }
                $scope.getPages(1);
            });

            $scope.$watch('pagenum', function (n, o) {
                $scope.getPages(1);
            });

            $scope.getPages = function (page) {
                var size = showData.length;
                console.log($scope.hit_list_array);
                $scope.totalPages = size % $scope.pagenum == 0 ? (size / $scope.pagenum) : Math.ceil(size / $scope.pagenum);
                var firspage = 0, endpage = 0;
                if (page < 5) {
                    console.log('第一项');
                    firspage = 1;
                    endpage = 5 > $scope.totalPages ? $scope.totalPages : 5;
                } else {
                    var index = $scope.totalPages - page;
                    if (index < (4)) {
                        console.log('第二项');
                        firspage = $scope.totalPages - 4;
                        endpage = $scope.totalPages;
                    } else {
                        console.log('第三项');
                        firspage = page - 2;
                        endpage = page + 2;
                    }
                }
                $scope.pages = getPages(0, firspage, endpage, 5);
                $scope.page = page;
                var indexS = ($scope.page - 1) * $scope.pagenum;
                var indexE = parseInt(indexS) + parseInt($scope.pagenum);
                var indexEnd = indexE > showData.length ? showData.length : indexE;
                var tableD = []
                for (var s = indexS; s < indexEnd; s++) {
                    tableD.push(showData[s]);
                }
                $scope.data_loss = tableD;
                $scope.records_count = size;
            }
            $scope.getPages(1);
        });
    }
}


function butClick (){
  var obt=document.getElementById("d");
  var odiv=document.getElementById("div");
    if(odiv.style.display=="none"){
       odiv.style.display="block";
      obt.value="-Advance";}
    else{
     odiv.style.display="none";
      obt.value="+Advance";}
}
function butClick1 (){
  var obt1=document.getElementById("d1");
  var odiv1=document.getElementById("div1");
    if(odiv1.style.display=="none"){
       odiv1.style.display="block";
      obt1.value="-variant";}
    else{
     odiv1.style.display="none";
      obt1.value="+variant";}
}function butClick2 (){
  var obt2=document.getElementById("d2");
  var odiv2=document.getElementById("div2");
    if(odiv2.style.display=="none"){
       odiv2.style.display="block";
      obt2.value="-effect";}
    else{
     odiv2.style.display="none";
      obt2.value="+effect";}
}function butClick3 (){
  var obt3=document.getElementById("d3");
  var odiv3=document.getElementById("div3");
    if(odiv3.style.display=="none"){
       odiv3.style.display="block";
      obt3.value="-expression";}
    else{
     odiv3.style.display="none";
      obt3.value="+expression";}
}function butClick4 (){
  var obt4=document.getElementById("d4");
  var odiv4=document.getElementById("div4");
    if(odiv4.style.display=="none"){
       odiv4.style.display="block";
      obt4.value="-other Attribute";}
    else{
     odiv4.style.display="none";
      obt4.value="+other Attribute";}
}

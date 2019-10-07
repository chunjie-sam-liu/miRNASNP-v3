'use strict';

angular.module('miRNASNP3')
    .controller('DocumentController', DocumentController);

function DocumentController($scope) {
    console.log("DocumentController loaded");
  /*  $scope.echart_data_statistics=function(){
      console.log("plot data statistics")
      echarts.init(document.getElementById('data_statistics')).dispose();
    var myChart = echarts.init(document.getElementById('data_statistics'));
    var option = {
      legend: {},
      tooltip: {},
      dataset: {
          source: [
              ["product", "seed", "mature", "pre-miRNA", "3'UTR"],
              ['SNPs',4666 , 17361, 43923, 6358867],
              ['ClinVar variations', 11, 41, 75, 32062],
              ['COSMIC Nonconding Variations', 522, 2114, 5389, 170880]
          ]
      },
  };
  myChart.setOption(option)
    }
  $scope.echart_data_statistics()*/
    
}
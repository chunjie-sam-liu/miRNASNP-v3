'use strict';

angular.module('miRNASNP3')
    .controller('SearchController', SearchController);

function SearchController($scope,$http) {
    $scope.gain_hit_main = {'mir_id':'tmir','snp_id':'tsnp'};
    console.log("SearchController loaded");
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

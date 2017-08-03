angular.module("list.ctrl", [])
.controller('listCtrl', ["$scope", "Codes", "LS",
  function ($scope, Codes, LS) {
  $scope.data = LS.load();
  //console.log("城市地区代码表:", $scope.codes);
  $scope.move = function(index, d){
    // index += d;
    //console.log("移动:", index);
    var dest = index + d;
    var max = $scope.data.length - 1;
    if (dest < 0 || dest > max) {
      return;
    }
    var tmp = $scope.data[dest];
    $scope.data[dest] = $scope.data[index];
    $scope.data[index] = tmp;
    LS.save($scope.data);
  };
  $scope.remove = function(index){
    $scope.data.splice(index, 1);
    LS.save($scope.data);
  };
  $scope.find = {
    keyword: ''
  };
  $scope.getList = function(){
    //console.log("搜索关键词:", $scope.find.keyword);
    $scope.lists = Codes.get($scope.find.keyword);
    //console.log("输出匹配列表:", $scope.lists);
  };
  $scope.add = function(index){
    $scope.data.push($scope.lists[index]);
    LS.save($scope.data);
    $scope.find.keyword = "";
    $scope.lists = [];
    //$scope.lists.splice(index, 1);
    //$scope.data.push({
    //  code: $scope.lists[index].code,
    //  name: $scope.lists[index].name
    //});
    //$scope.data = [
    //  {code: "101010101", name: "长沙"},
    //  {code: "101010101", name: "长沙"}
    //]
  };
}]);

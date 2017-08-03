angular.module("info.ctrl", [])
  .controller('infoCtrl', ["$scope", "$timeout", "$http", "Codes", "LS", function ($scope, $timeout, $http, Codes, LS) {
    $scope.codes = LS.load();
    $scope.times = 90000; // LS.get(), LS.set()
    console.log("codes @LS:", $scope.codes);
    $scope.data = [];
    var info = [];
    // 用于排序的序号检索方法
    var getIndex = function(city){
      for(var i = 0; i < $scope.codes.length; i++){
        if ($scope.codes[i].name == city){
          return i;
        }
      }
      return -1;
    };
    // 转换输出数据
    var result = function () {
      $scope.codes = LS.load(); // 及时响应城市列表的排序
      //{gm: '', wd: '', wk: [{},{},{},{},{}]}
      $scope.data = [];
      for (var i = 0; i < info.length; i++) {
        var m = (new Date()).getMonth() + 1, d = 0;
        $scope.data.push({
          city: info[i].city,
          gm: info[i].ganmao,
          wd: info[i].wendu,
          wk: []
        });
        var cast = info[i].forecast;
        for (var j = 0; j < cast.length; j++) {
          var s = cast[j].date.split("日"); // "date": "29日星期一"
          if (d == 0) d = s[0];
          if (s[0] < d) if (++m > 12) m = 1; // 下一月开始
          // 33／26℃ <== (1)"high": "高温 33℃" (2)"low": "低温 26℃",
          var h = ((cast[j].high.split(" "))[1].split("℃"))[0];
          var l = (cast[j].low.split(" "))[1];
          $scope.data[i].wk.push({
            week: s[1]/*.replace("星期", "周")*/,
            day: m + "月" + s[0] + "日",
            tmp: h + '／' + l,
            fx: cast[j].fengxiang,
            fl: cast[j].fengli,
            type: cast[j].type
          });
        }
      }
      // 数据的排序： 返回值==1(==true)：交换，其他值：不动
      $scope.data.sort(function(a, b){
        // a.city get index = 1
        var a_index = getIndex(a.city);
        var b_index = getIndex(b.city);
        return a_index > b_index; // 应该是: a_index < b_index
        // return getIndex(a.city) > getIndex(b.city);
      });
      //console.log("weather data:", $scope.data);
      $timeout(result, 2000);
    };
    var getInfo = function () {
      info = []; // 初始化
      // http://wthrcdn.etouch.cn/weather_mini?citykey=101020100
      for (var i = 0; i < $scope.codes.length; i++) {
        // promise
        $http.get("http://wthrcdn.etouch.cn/weather_mini", {
          params: {citykey: $scope.codes[i].code}
        }).then(function (resp) {
          info.push(resp.data.data);
        }, function () {
        });
      }
      console.log("weather info:", info);
      $timeout(getInfo, 90000);
    };
    // 监视器:跟踪 codes 城市地区列表变化,更新气象信息
    $scope.$watch('codes', function(nv, ov){
      console.log("update ...", Date.now());
      getInfo();
    }, true);
    //getInfo();
    result();
  }]);
/*
 {
 "yesterday": {
 "date": "2日星期日",
 "high": "高温 33℃",
 "fx": "东北风",
 "low": "低温 26℃",
 "fl": "4-5级",
 "type": "阴"
 },
 "city": "上海",
 "aqi": "36",
 "forecast": [
 {
 "date": "3日星期一",
 "high": "高温 33℃",
 "fengli": "3-4级",
 "low": "低温 26℃",
 "fengxiang": "东南风",
 "type": "中雨"
 },
 {
 "date": "4日星期二",
 "high": "高温 33℃",
 "fengli": "3-4级",
 "low": "低温 27℃",
 "fengxiang": "西南风",
 "type": "小雨"
 },
 {
 "date": "5日星期三",
 "high": "高温 34℃",
 "fengli": "3-4级",
 "low": "低温 26℃",
 "fengxiang": "东南风",
 "type": "中雨"
 },
 {
 "date": "6日星期四",
 "high": "高温 32℃",
 "fengli": "微风级",
 "low": "低温 26℃",
 "fengxiang": "东南风",
 "type": "阴"
 },
 {
 "date": "7日星期五",
 "high": "高温 34℃",
 "fengli": "5-6级",
 "low": "低温 26℃",
 "fengxiang": "南风",
 "type": "小雨"
 }
 ],
 "ganmao": "各项气象条件适宜，发生感冒机率较低。但请避免长期处于空调房间中，以防感冒。",
 "wendu": "31"
 }
 */

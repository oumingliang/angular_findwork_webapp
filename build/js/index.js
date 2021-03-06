'use strict';

angular.module('app', ['ui.router', 'ngCookies', 'validation', 'ngAnimate']);

'use strict';
angular.module('app').value('dict', {}).run(['dict', '$http', function(dict, $http){
  $http.get('data/city.json').success(function(resp){
    dict.city = resp;
  });
  $http.get('data/salary.json').success(function(resp){
    dict.salary = resp;
  });
  $http.get('data/scale.json').success(function(resp){
    dict.scale = resp;
  });
}]);

'use strict';
angular.module('app').config(['$provide', function($provide){
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
    $delegate.post = function(url, data, config) {
      var def = $q.defer();
      $delegate.get(url).success(function(resp) {
        def.resolve(resp);
      }).error(function(err) {
        def.reject(err);
      });
      return {
        success: function(cb){
          def.promise.then(cb);
        },
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    }
    return $delegate;
  }]);
}]);

'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'view/main.html',
    controller: 'mainCtrl'
  }).state('position', {
    url: '/position/:id',
    templateUrl: 'view/position.html',
    controller: 'positionCtrl'
  }).state('company', {
    url: '/company/:id',
    templateUrl: 'view/company.html',
    controller: 'companyCtrl'
  }).state('search', {
    url: '/search',
    templateUrl: 'view/search.html',
    controller: 'searchCtrl'
  }).state('login', {
    url: '/login',
    templateUrl: 'view/login.html',
    controller: 'loginCtrl'
  }).state('register', {
    url: '/register',
    templateUrl: 'view/register.html',
    controller: 'registerCtrl'
  }).state('me', {
    url: '/me',
    templateUrl: 'view/me.html',
    controller: 'meCtrl'
  }).state('post', {
    url: '/post',
    templateUrl: 'view/post.html',
    controller: 'postCtrl'
  }).state('favorite', {
    url: '/favorite',
    templateUrl: 'view/favorite.html',
    controller: 'favoriteCtrl'
  });
  $urlRouterProvider.otherwise('main');
}])

'use strict';
angular.module('app').config(['$validationProvider', function($validationProvider) {
  var expression = {
    phone: /^1[\d]{10}$/,
    password: function(value) {
      var str = value + ''
      return str.length > 5;
    },
    required: function(value) {
      return !!value;
    }
  };
  var defaultMsg = {
    phone: {
      success: '',
      error: '必须是11位手机号'
    },
    password: {
      success: '',
      error: '长度至少6位'
    },
    required: {
      success: '',
      error: '不能为空'
    }
  };
  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);

'use strict';
angular.module('app').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope){
	var companyid=$state.params.id;
	console.log("companyCtrl获取点击的公司id为"+companyid);
  $http.get('data/company.json').success(function(resp){
  	angular.forEach(resp,function(val,key){
	   if(val.id==companyid)
	   	 $scope.company = val;
  	}
  )
   
  });
  
  /*
   
   function getCompany() {
  //	var companyName=$scope.companyName;
    $http.get('data/company.json').success(function(resp){
    	console.log(companyName);
    		angular.forEach(resp,function(val,key){
    			if(val.name==companyName)
 				     $scope.company = val;
    })
  }
   )
   }
   */
  
  
  
  
  
}]);

'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/myFavorite.json').success(function(resp) {
    $scope.list = resp;
  });
}]);

'use strict';
angular.module('app').controller('loginCtrl', ['cache', '$state', '$http', '$scope','$cookies', function(cache, $state, $http, $scope,$cookies){
	$scope.nouser=false;
  $scope.submit = function() {
    $http.post('data/login.json', $scope.user).success(function(resp){
//  	console.log(typeof resp);
    	console.log(document);
	//var strresp =JSON.stringify(resp);
    	var length=resp.length;
    		console.log(length);         // 重写了login.json，把原先的单对象 变成了数组，数组中保存了对象，每个对象保存一个用户的基础信息 欧名亮 20180328 远光软件
    	for(var i=0;i<length;i++){
    		var userobj=resp[i];
    		if(userobj.tel==$scope.user.phone){
    			console.log(userobj.tel);
    			console.log($scope.user.phone);
    			cache.put('id',userobj.id);
          cache.put('name',userobj.name);
          cache.put('image',userobj.image);
//     console.log(cache.get('id'));
          $state.go('main');	
    		} 		
    		else{
    			
    		$scope.nouser=true;	
    		}
    		
    	}
    	
    	}
    	
    	)
    //	document.cookie='id='+encodeURIComponent(resp.id);
   //   $cookies.put('id',resp.id);
     // cache.put('id',resp.id);
     // cache.put('name',resp.name);
     // cache.put('image',resp.image);
//    console.log(cache.get('id'));
     // $state.go('main');
   }
  }
]
);
 

'use strict';
angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/positionList.json').success(function(resp){
    $scope.list = resp;
  });
}]);

'use strict';
angular.module('app').controller('meCtrl', ['$state', 'cache', '$http', '$scope', function($state, cache, $http, $scope){
  if(cache.get('name')) {
    $scope.name = cache.get('name');
    $scope.image = cache.get('image');
  }
  $scope.logout = function() {
    cache.remove('id');
    cache.remove('name');
    cache.remove('image');
    $state.go('main');
  };
}]);

'use strict';
angular.module('app').controller('positionCtrl', ['$log', '$q', '$http', '$state', '$scope', 'cache', function($log, $q, $http, $state, $scope, cache){
  $scope.isLogin = !!cache.get('name');
  $scope.message = $scope.isLogin?'投个简历':'去登录';
  var companyName;
  function getPosition() {
    var def = $q.defer();
    var id=$state.params.id;
    console.log(id);
    $http.get('data/position.json').success(function(resp) {    //删去 路径中参数    { params: {   id: $state.params.id}  }
    	angular.forEach(resp,function(val,key){
    		console.log(val+" "+val.id);
    		if(val.id==id){
    			 $scope.position = val;
    			 $scope.companyName=val.companyName;
    			 companyName=val.companyName;
    			 
    			 console.log($scope.companyName);
    		}	
    	})
 //     $scope.position = resp;
      if(resp.posted) {
        $scope.message = '已投递';
      }
     def.resolve(resp);
    }).error(function(err) {
      def.reject(err);
    });
    return def.promise;
  }
  function getCompany() {
  //	var companyName=$scope.companyName;
    $http.get('data/company.json').success(function(resp){
    	console.log(companyName);
    		angular.forEach(resp,function(val,key){
    			if(val.name==companyName)
 				     $scope.company = val;
    })
  }
   )
   }
  //getPosition().then(function(obj){
  //  getCompany(obj.companyId);
 // });
 getPosition();
 getCompany();
 
  $scope.go = function() {
    if($scope.message !== '已投递') {
      if($scope.isLogin) {
        $http.post('data/handle.json', {
          id: $scope.position.id
        }).success(function(resp) {
          $log.info(resp);
          $scope.message = '已投递';
        });
      } else {
        $state.go('login');
      }
    }
  }
}]);

'use strict';
angular.module('app').controller('postCtrl', ['$http', '$scope', function($http, $scope){
  $scope.tabList = [{
    id: 'all',
    name: '全部'
  }, {
    id: 'pass',
    name: '面试邀请'
  }, {
    id: 'fail',
    name: '不合适'
  }];
  $http.get('data/myPost.json').success(function(res){
    $scope.positionList = res;
  });
  $scope.filterObj = {};
  $scope.tClick = function(id, name) {
    switch (id) {
      case 'all':
        delete $scope.filterObj.state;
        break;
      case 'pass':
        $scope.filterObj.state = '1';
        break;
      case 'fail':
        $scope.filterObj.state = '-1';         
        break;
      default:

    }
  }
}]);

'use strict';
angular.module('app').controller('registerCtrl', ['$interval', '$http', '$scope', '$state', function($interval, $http, $scope, $state){
  $scope.submit = function() {
    $http.post('data/regist.json',$scope.user).success(function(resp){
      $state.go('login');
    });
  };
  var count = 60;
  $scope.send = function() {
    $http.get('data/code.json').success(function(resp){
      if(1===resp.state) {
        count = 60;
        $scope.time = '60s';
        var interval = $interval(function() {
          if(count<=0) {
            $interval.cancel(interval);
            $scope.time = '';
          } else {
            count--;
            $scope.time = count + 's';
          }
        }, 1000);
      }
    });
  }
}]);

'use strict';
angular.module('app').controller('searchCtrl', ['dict', '$http', '$scope', function(dict, $http, $scope){
  $scope.name = '';
  $scope.search = function() {
    $http.get('data/positionList.json?name='+$scope.name).success(function(resp) {
      $scope.positionList = resp;
    });
  };
  $scope.search();
  $scope.sheet = {};
  $scope.tabList = [{
    id: 'city',
    name: '城市'
  }, {
    id: 'salary',
    name: '薪水'
  }, {
    id: 'scale',
    name: '公司规模'
  }];
  $scope.filterObj = {};
  var tabId = '';
  $scope.tClick = function(id,name) {
    tabId = id;
    $scope.sheet.list = dict[id];  //dict是个对象，存放在城市、薪资、人数规模。
    $scope.sheet.visible = true;  //选择版tab被点击时，出现相应的dict 项 
  };
  $scope.sClick = function(id,name) {
    if(id) {
      angular.forEach($scope.tabList, function(item){
        if(item.id===tabId) {
          item.name = name;
        }
      });
      $scope.filterObj[tabId + 'Id'] = id;
    } else {
      delete $scope.filterObj[tabId + 'Id'];
      angular.forEach($scope.tabList, function(item){
        if(item.id===tabId) {
          switch (item.id) {
            case 'city':
              item.name = '城市';
              break;
            case 'salary':
              item.name = '薪水';
              break;
            case 'scale':
              item.name = '公司规模';
              break;
            default:
          }
        }
      });
    }
  }
}]);

'use strict';
angular.module('app').directive('appCompany', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      com: '='
    },
    templateUrl: 'view/template/company.html'
  };
}]);

'use strict';
angular.module('app').directive('appFoot', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/foot.html'
  }
}]);

'use strict';
angular.module('app').directive('appHead', ['cache', function(cache){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/head.html',
    link: function($scope) {
      $scope.name = cache.get('name') || '';
    }
  };
}]);

'use strict';
angular.module('app').directive('appHeadBar', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/headBar.html',
    scope: {
      text: '@'
    },
    link: function($scope) {
      $scope.back = function() {
        window.history.back();
      };
    }
  };
}]);

'use strict';
angular.module('app').directive('appPositionClass', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      com: '='
    },
    templateUrl: 'view/template/positionClass.html',
    link: function($scope) {
      $scope.showPositionList = function(idx) {
        $scope.positionList = $scope.com.positionClass[idx].positionList;
        $scope.isActive = idx;
      }
      $scope.$watch('com', function(newVal){
        if(newVal) $scope.showPositionList(0);
      });
    }
  };
}]);

'use strict';
angular.module("app").directive('appPositionInfo', ['$http', function($http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionInfo.html',
    scope: {
      isActive: '=',
      isLogin: '=',
      pos: '='
    },
    link: function($scope) {
      $scope.$watch('pos', function(newVal) {
        if(newVal) {
          $scope.pos.select = $scope.pos.select || false;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        }
      })
      $scope.favorite = function() {
        $http.post('data/favorite.json', {
          id: $scope.pos.id,
          select: !$scope.pos.select
        }).success(function(resp) {
          $scope.pos.select = !$scope.pos.select;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        });
      }
    }
  }
}]);

'use strict';
angular.module('app').directive('appPositionList', ['$http','cache', function($http,cache){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionList.html',
    scope: {
      data: '=',
      filterObj: '=',
      isFavorite: '='
    },
    link: function($scope) {
      $scope.select = function(item) {
        $http.post('data/myFavorite.json', { 
          id: item.id,
          select: !item.select
        }).success(function(resp){
          item.select = !item.select;
        })
      }
        $scope.name = cache.get('name') || '';
    }
  };
}]);

'use strict';
angular.module('app').directive('appSheet', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      list: '=',
      visible: '=',
      select: '&'
    },
    templateUrl: 'view/template/sheet.html'
  };
}]);

'use strict';
angular.module('app').directive('appTab', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      list: '=',
      tabClick: '&'
    },
    templateUrl: 'view/template/tab.html',
    link: function($scope) {
      $scope.click = function(tab) {
        $scope.selectId = tab.id;
        $scope.tabClick(tab);
      };
    }
  };
}]);

'use strict';
angular.module('app').filter('filterByObj', [function(){
  return function(list, obj) {
    var result = [];
    angular.forEach(list, function(item){
      var isEqual = true;
      for(var e in obj){
        if(item[e]!==obj[e]) {
          isEqual = false;
        }
      }
      if(isEqual) {
        result.push(item);
      }
    });
    return result;
  };
}]);

'use strict';
angular.module('app').service('cache', ['$cookieStore', function($cookieStore){
    this.put = function(key, value){
      $cookieStore.put(key, value);
    };
    this.get = function(key) {
      return $cookieStore.get(key);
    };
    this.remove = function(key) {
      $cookieStore.remove(key);
    };
}]);

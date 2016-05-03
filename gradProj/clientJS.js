/* globals angular*/
/* globals $*/
var app = angular.module('gradProj', []);
var current_user;
var allUsers;
app.controller('loginCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.login = function (user) {
        var id = user.id;
        var req = {
            method: 'GET',
            url: '/login/' + id
        };
        $http(req).then(function (response) {
            if (response.data.length > 0) {
                if (response.data[0].password === user.password) {
                    $(".dashboard").show();
                    $("#loginPage").hide();
                    $(".signup").hide();
                    $(".logout").show();
                    current_user = response.data[0];
                }
                else {
                    
                    $("#warnModal").openModal();
                    $(".warning").html("Incorrect password.");
                }

            } else {
                $("#warnModal").openModal();
                $(".warning").html("Incorrect username.");
            }

        });
    };

}]);

app.controller('signupCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.signup = function () {
        $("#signupPage").show();
        $("#loginPage").hide();
        $(".frontCards").hide();
        $(".fullname").val("");
        $(".username").val("");
        $(".password").val("");
    };

}]);

app.controller('logoutCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.logout = function () {
        current_user = "";
        location.reload();

    };

}]);

app.controller('appCtrl', ['$scope', '$http', function ($scope, $http, form) {
    
    $scope.findProfessor = function () {
        $http.get('/findProf').then(function (response) {
            $scope.results = response.data;
        });
        $(".dashboard").hide();
        $(".findProfessors").show();
    };

    $scope.findUniversity = function () {
        $http.get('/findUni').then(function (response) {
            $scope.results = response.data;
        });
        $(".dashboard").hide();
        $(".findUniversity").show();
    };

    $scope.backToLogin = function (form) {
        $(".dashboard").hide();
        $(".findProfessors").hide();
        $(".findUniversity").hide();
        $("#signupPage").hide();
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $("#loginPage").show();
    };

    $scope.backToHome = function () {
        $(".dashboard").show();
        $(".findProfessors").hide();
        $(".findUniversity").hide();
        $("#signupPage").hide();
        $(".logout").show();
    };

    $scope.addProfessorModal = function () {
        $("#addProfModal").openModal();
        $(".name").val("");
        $("i").removeClass("active");
        $("label").removeClass("active");
    };

    $scope.addUniversityModal = function () {
        $("#addUniModal").openModal();
        $(".name").val("");
        $(".city").val("");
        $(".state").val("");
        $("i").removeClass("active");
        $("label").removeClass("active");
    };

    $scope.addNewUser = function (newUser) {
        var req = {
            method: 'POST',
            url: '/signup',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "newUser": [{
                    "name": newUser.name,
                    "_id": newUser.id,
                    "password": newUser.password
                }]
            }
        };
        $http(req).then(function (response) {
            if (response.data === "Success") {
                $("#signupPage").hide();
                $("#loginPage").show();
            }
        });
    };

    $scope.starRating1 = 0;
    $scope.hoverRating1 = 0;

    $scope.rateProf = function (item) {
        $("#rateProfModal").openModal();
        $scope.prof = item;
    };

    $scope.click1 = function (param) {
        console.log('Click(' + param + ')');
    };

    $scope.mouseHover1 = function (param) {
        console.log('mouseHover(' + param + ')');
        $scope.hoverRating1 = param;
    };

    $scope.mouseLeave1 = function (param) {
        console.log('mouseLeave(' + param + ')');
        $scope.hoverRating1 = param + '*';
    };

    $scope.updateProf = function (prof, rating) {
        var new_rating;
        if (prof.rating === 0) {
            new_rating = Math.round(rating);
        } else {
            new_rating = Math.round((prof.rating + rating) / 2);
        }
        var req = {
            method: 'POST',
            url: '/updateRating',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "prof": prof,
                "rating": new_rating,
                "user": {
                    "name": current_user._id,
                    "rate": rating
                }
            }
        };
        $http(req).then(function (response) {
            $scope.prof.push[response.data];

        });
    };

    $scope.getstars = function (n) {
        return new Array(Math.round(n));
    };
}]);

app.controller('addCtrl', ['$scope', '$http', function ($scope, $http) {
    
    $scope.addProfessor = function (prof) {
        var req = {
            method: 'POST',
            url: '/addProf',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "prof": [{
                    "name": prof.name,
                    "university": prof.university,
                    "department": prof.department
                }]
            }
        };
        $http(req).then(function (response) {
        });
    };

    $scope.data = {
        dept: null,
        availableOptions: [
            { id: '1', name: 'Computer Science' },
            { id: '2', name: 'Electrical Engineering' },
            { id: '3', name: 'Mathemarics' },
            { id: '3', name: 'Pure Science' },
            { id: '3', name: 'Accounting and Business' }
        ],
    };

    $http.get('/findUni').then(function (response) {
        var uniList = response.data;
        $scope.uniData = {
            uni: null,
            availableOptions: uniList,
        };

    });


    $scope.addUniversity = function (uni) {
        var req = {
            method: 'POST',
            url: '/addUni',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                "uni": [{
                    "name": uni.name,
                    "city": uni.city,
                    "state": uni.state
                }]
            }
        };
        $http(req).then(function (response) {


        });
    };
}]);


angular.element(document).ready(function ($http) {
    $(".findProfessors").hide();
    $(".findUniversity").hide();
    $("#signupPage").hide();
    $(".dashboard").hide();
    $(".logout").hide();

});

app.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
        "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \ <img ng-src='{{((hoverValue + _rating) <= $index) && \"/image/star-fill-lg.png\" || \"/image/star-empty-lg.png\"}}' \ ng-Click='isolatedClick($index + 1)' \ ng-mouseenter='isolatedMouseHover($index + 1)' \ ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \ </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            }
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            }

            $scope._rating = $scope.rating;

            $scope.isolatedClick = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };

            $scope.isolatedMouseHover = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = $scope.rating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
});

// app.directive('username', function ($q, $timeout, $http) {
//     return {
//         require: 'ngModel',
//         link: function (scope, elm, attrs, ctrl) {
//             var usernames=[];

//             $http.get('/getAllUsers').then(function (response) {
//                 usernames.push[response.data];
//             });

//             ctrl.$asyncValidators.username = function (modelValue, viewValue) {

//                 if (ctrl.$isEmpty(modelValue)) {
//                     // consider empty model valid
//                     return $q.when();
//                 }

//                 var def = $q.defer();

//                 $timeout(function () {
//                     // Mock a delayed response
//                     if (usernames.indexOf(modelValue) === -1) {
//                         // The username is available
//                         def.resolve();
//                     } else {
//                         def.reject();
//                     }

//                 }, 2000);

//                 return def.promise;
//             };
//         }
//     };
// });

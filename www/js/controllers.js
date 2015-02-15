var instance = angular.module('starter.controllers', [])

instance.factory('data', function () {
    var login = "";
    return login;
});

instance.controller('AppCtrl', function ($scope, $ionicModal, $timeout, data) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function (Data) {
            console.log('Doing login', $scope.loginData.password,$scope.loginData.username);

            var xmlhttp = new XMLHttpRequest();
            var url = "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=login";
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                    var resp = JSON.parse(xmlhttp.responseText);
                    if (resp.length>0){
                        $scope.login = true;
                        $scope.iduser = resp[0].idusers;
                        $scope.username = $scope.loginData.username;
                        alert("Ha iniciado sesión");
                        data = $scope.iduser;
                        console.log(data);

                    }else{
                        $scope.login=false;
                        alert("Usuario incorrecto");
                    }
                }
            }
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("user="+$scope.loginData.username+"&pass="+$scope.loginData.password);


            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    });

instance.controller('CategoriesCtrl', function ($scope) {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=categories";
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                $scope.categories = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    })

    .controller('DetailCtrl', function ($scope, $stateParams) {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=photo&other=" + $stateParams.photoId;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                $scope.photodetail = JSON.parse(xmlhttp.responseText)[0];
                console.log($scope.photodetail.idphotos);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    });

instance.controller('CategorieCtrl', function ($scope, $stateParams) {
        var xmlhttp1 = new XMLHttpRequest();
        var url = "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=categorie&other=" + $stateParams.catId;
        console.log(url);
        xmlhttp1.onreadystatechange = function () {
            if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
                $scope.categorie = JSON.parse(xmlhttp1.responseText);
            }
        }
        xmlhttp1.open("GET", url, true);
        xmlhttp1.send();

        var xmlhttp = new XMLHttpRequest();
        var url = "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=photos&other=" + $stateParams.catId;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                $scope.photos = JSON.parse(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    });

instance.controller("CameraController", function ($scope, $cordovaCamera, data) {

        var xmlhttp = new XMLHttpRequest();
        var url = "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=categ";
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                $scope.categ = JSON.parse(xmlhttp.responseText);
                $scope.selected = $scope.categ[0];
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();




        $scope.takePhoto = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 800,
                targetHeight: 600,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (filePath) {
                $scope.imgURI = filePath;

            }, function (err) {
                // An error occured. Show a message to the user
            });
        }



        $scope.uploadPhotoImage = function () {
            if ($scope.login){
                var options;
                options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName= $scope.imgURI.substr( $scope.imgURI.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";
                options.chunkedMode = false;
                options.headers = {
                    Connection: "close"
                };

                var params = new Object();
                params.photoname = $scope.name;
                params.photodesc = $scope.desc;
                params.iduser = data;
                params.idcat = $scope.selected.value;
                options.params= params;
                console.log(params.photoname,params.photodesc,params.iduser,params.idcat);
                var ft;
                ft= new FileTransfer();
                // TODO: Capa tipo waiting en show
                ft.upload(
                    $scope.imgURI,
                    "http://piserver.dyndns.org/DAW/DIW/eng/webservice/photoservice.php?data=fileupload",
                    win,
                    fail,
                    options,
                    true);


                function win(){
                    // TODO: Capa tipo waiting en hide
                    alert("Envio correcto")
                }

                function fail(error){
                    alert("error: "+error.code)
                }
            }else{
                alert("Debe iniciar sesión para publicar fotos");
            }
        }


    });





//FORUM CONTROLLER
ctrl.controller('ForumCtrl',['$rootScope','$state','$scope','core','quotes','threads','posts',function($rootScope,$state,$scope,core,quotes,threads,posts){

    //Server calls
    $scope.threads = [];
    $scope.newThread = {
        content : []
    };
    $scope.newPost = {};
    threads.getAllThreads().then(
        function getAllThreadsSuccess(data){
            if(typeof data.data.msg != 'string') {
                $scope.threads = data.data;
                $scope.filterThreads();
            }
            else Materialize.toast(data.data.msg,3000,'red lighten-2');
        },function getAllThreadsError(data){
            console.log(data.data);
        }
    );

    //State Variables
    $scope.state = {
        displayThread : false,
        currentThread : {},
        displayPost : false,
        currentPost : {},
        posts : [],
        threads : [],
        addThreadMode : false
    }


    $scope.filterThreads = function(){
        $scope.state.threads = [];
        for (var i = 0; i < $scope.threads.length; i++) {
            if($scope.state.threads.length){
                if($scope.state.threads[0].last_modification < $scope.threads[i].last_modification)
                    $scope.state.threads.unshift($scope.threads[i]);
                else
                    $scope.state.threads.push($scope.threads[i]);
            }else $scope.state.threads.push($scope.threads[i]);
        }

        console.log($scope.state.threads);
    }

    $scope.filterPosts = function(){
        $scope.state.posts = [];
        for (var i = 0; i < $scope.state.currentThread.content.length; i++) {
            if($scope.state.posts.length){
                if($scope.state.posts[0].last_modification < $scope.state.currentThread.content[i].last_modification)
                    $scope.state.posts.unshift($scope.state.currentThread.content[i]);
                else
                    $scope.state.posts.push($scope.state.currentThread.content[i]);
            }else $scope.state.posts.push($scope.state.currentThread.content[i]);
        }
    }

    $scope.displayThread = function(thread){
        $scope.state.displayThread = true;
        $scope.state.currentThread = thread;
        $scope.filterPosts();
        $scope.state.displayPost = false;
        $scope.state.addThreadMode = false;
    }

    $scope.displayPost = function(post){
        $scope.state.displayPost = true;
        $scope.staet.currentPost = post;
        $scope.state.displayThread = false;
        $scope.state.addThreadMode = false;
    }

    $scope.exitThread = function(){
        $scope.state.displayThread = false;
        $scope.state.currentThread = {};
        $scope.state.newThread = {};
        $scope.state.posts = [];
        $scope.newPost = {};
        $scope.state.displayPost = false;
        $scope.state.addThreadMode = false;
    }


    $scope.addThread = function(){
        if($rootScope.logged && !$scope.state.addThreadMode){
            $scope.state.addThreadMode = true;
        }else if($rootScope.logged && $scope.state.addThreadMode){

            $scope.newPost.date = new Date().getTime();
            $scope.newPost.last_modification = new Date().getTime();
            $scope.newPost.author_name = $rootScope.currentUser.name;
            $scope.newPost.author_surname = $rootScope.currentUser.surname;
            $scope.newPost.author_email = $rootScope.currentUser.email;

            $scope.newThread.author_name = $rootScope.currentUser.name;
            $scope.newThread.author_surname = $rootScope.currentUser.surname;
            $scope.newThread.author_email = $rootScope.currentUser.email;
            $scope.newThread.date = new Date().getTime();
            $scope.newThread.last_modification = new Date().getTime();
            $scope.newThread.firstPost = $scope.newPost;

            console.log($scope.newThread);

            threads.addThread($scope.newThread).then(
                function addThreadSuccess(data){
                    if(typeof data.data.msg != 'string'){
                        console.log(data.data);
                        $scope.threads = data.data;
                        $scope.filterThreads();
                        Materialize.toast($scope.newThread.title+' has been created',3000,'teal lighten-2');
                        $scope.exitThread();
                    }else{
                        Materialize.toast(data.data.msg,3000,'red lighten-2');
                    }
                },function addThreadError(data){
                    console.log(data.data);
                }
            )
        }else if(!$rootScope.logged){
            console.log("You're not connected");
            $('#loginModal').modal('open');
        }
    }

    $scope.addPost = function(){
        if($rootScope.logged && !$scope.state.addPostMode){

            $scope.state.addPostMode = true;

        }else if($rootScope.logged && $scope.state.addPostMode){

            $scope.newPost.date = new Date().getTime();
            $scope.newPost.last_modification = new Date().getTime();
            $scope.newPost.author_name = $rootScope.currentUser.name;
            $scope.newPost.author_surname = $rootScope.currentUser.surname;
            $scope.newPost.author_email = $rootScope.currentUser.email;

            $scope.state.currentThread.content.push($scope.newPost);
            $scope.filterPosts();

            threads.updateThread($scope.state.currentThread).then(
                function updateThreadSuccess(data){
                    if(typeof data.data.msg !='string'){
                        $scope.threads = data.data;
                        $scope.filterThreads();
                        Materialize.toast('Your post has been submitted',3000,'teal lighten-2');
                        $scope.state.addPostMode = false;
                    }else Materialize.toast(data.data.msg,3000,'red lighten-2');

                },function updateThreadError(data){
                    console.log(data.data);
                }
            )
        }else if(!$rootScope.logged){
            console.log("You're not connected");
            $('#loginModal').modal('open');
        }
    }

    $scope.deleteThread = function(thread){
        threads.deleteThread(thread).then(
            function deleteThreadSuccess(data){
                if(typeof data.data.msg != 'string'){
                    $scope.threads = data.data;
                    $scope.filterThreads();
                    Materialize.toast(thread.title+' has been deleted',3000,'teal lighten-2');
                    $scope.state.addThreadMode = false;
                }else{
                    Materialize.toast(data.data.msg,3000,'red lighten-2');
                }
            },function deleteThreadError(data){
                console.log(data.data);
            }
        )
    }

}]);

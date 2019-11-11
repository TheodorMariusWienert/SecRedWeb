var sampleJSon = {

    "Channels": [{"name": "Number1", "date": "timestamp"},
        {"name": "Number2", "date": "timestamp"},
        {"name": "Number3", "date": "timestamp"}]
};
var sampleChannel = {

        "subComment": [
            {"content":"1","id":"1","author": "xxx", "date": "timestamp", "votes": "2", "subComment": []},
            {"content":"2","id":"2","author": "yyy", "date": "timestamp", "votes": "0", "subComment": []},
            {
                "content":"3","id":"3", "author": "zzz", "date": "timestamp", "votes": "5", "subComment":
                    [
                        {"content":"3.1","id":"3.1","author": "qqq", "date": "timestamp", "votes": "2", "subComment": []},
                        {"content":"3.2","id":"3.2","author": "www", "date": "timestamp", "votes": "0", "subComment": []},
                        {"content":"3.3","id":"3.3","author": "eee", "date": "timestamp", "votes": "5", "subComment": []}
                    ]
            },
            {"content":"4","id":"4","author": "ttt", "date": "timestamp", "votes": "0", "subComment": []},
        ]


    }
;

var userbool = false;
$(document).ready(function () {
    /*firebase.auth().onAuthStateChanged(function (user) {
        //console.log(user);
        if (user) {

            console.log("user")
            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="Logout"> Logout</button>');

            logout();

            var name,email;

            if (user != null) {
                 name = user.displayName;
                 email = user.email;


            }
            $('#LoginCon').append('<p id="userInfo">'+name+' '+email+'</p>');

        } else {
            console.log("no user")
            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="LoginButtonRed"> Login</button>');
            login();

        }*/

    console.log(sampleJSon);
    printChannels();


});

function printChannels() {
    console.log("printChannelsFunct");

    let channelarr = sampleJSon.Channels;
    console.log(channelarr);
    for (let i in channelarr) {
        console.log(channelarr[i].name)
        let channel = new Channel(channelarr[i].name);
        $("#contentContainer").append(channel.$element);
    }


}

let Channel = function (name) {

    this.name = name;
    console.log("Name of chanell" + this.name);

    this.generateEl = function () {
        this.$element = $('<li id="Channel">' + this.name + '</li>');
        this.$element.on('click', function () {
            console.log("Click on " + name);
            goThroughComments();
        });


    };


    this.generateEl();
};
let Comment= function (data) {
    this.generateEl = function () {
        this.$comment = $('<div>' + data.content + ' ' + data.author + '</div>')
        let upButton = $('<button class="UpButton">+</button>');
        upButton.on('click', function () {
            console.log("plus" + data.id);

        });
        this.$comment.append(upButton);
        let downButton = $('<button class="UpButton">-</button>');
        downButton.on('click', function () {
            console.log("minus" + data.id);

        });
        this.$comment.append(downButton)
    }
    this.generateEl();



}
function goThroughComments(){
    $('#contentContainer').empty();
    let commentarr = sampleChannel.subComment
    let container = $('#contentContainer');
    printComments(commentarr,container)

}
function  printComments(commentarr,container) {
    console.log(commentarr);
    console.log(container);
    for (let i in commentarr) {
        console.log(commentarr[i].content);
        let tempComment= new Comment(commentarr[i]);
        container.append(tempComment.$comment);
        if(commentarr[i].subComment.length){
            let container2 = $('<div class="SubComments">' + this.name + '</div>');
            tempComment.$comment.append(container2)
            printComments(commentarr[i].subComment,container2)
        }
    }


}

function login() {

    $('#LoginButtonRed').click(function () {
        authent();
    });
}

function logout() {
    $('#Logout').click(function () {
        console.log("LogoutButton")
        firebase.auth().signOut().then(function () {
            console.log("Logout Successful");
        }).catch(function (error) {
            console.log("Error :");
            console.log(error);
        });

    })

}

function authent() {
    console.log("redirect Login")
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
        }


        // The signed-in user info.
        var user = result.user;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userbool = true;
        } else {
            userbool = false;
        }
    });


}




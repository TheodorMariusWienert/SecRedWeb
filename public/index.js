var sampleJSon = {

    "Channels": [{"key": "Number1","body":"channel1", "time": "timestamp","totalVotes":0,},
        {"key": "Number2","body":"channel2", "time": "timestamp","totalVotes":53,},
        {"key": "Number3","body":"channel3", "time": "timestamp","totalVotes":-50,},]
};
var sampleChannel = {

        "subComment": [
            {"content": "1", "id": "1", "author": "xxx", "date": "timestamp", "votes": "2", "subComment": []},
            {"content": "2", "id": "2", "author": "yyy", "date": "timestamp", "votes": "0", "subComment": []},
            {
                "content": "3", "id": "3", "author": "zzz", "date": "timestamp", "votes": "5", "subComment":
                    [
                        {
                            "content": "3.1",
                            "id": "3.1",
                            "author": "qqq",
                            "date": "timestamp",
                            "votes": "2",
                            "subComment": []
                        },
                        {
                            "content": "3.2",
                            "id": "3.2",
                            "author": "www",
                            "date": "timestamp",
                            "votes": "0",
                            "subComment": []
                        },
                        {
                            "content": "3.3",
                            "id": "3.3",
                            "author": "eee",
                            "date": "timestamp",
                            "votes": "5",
                            "subComment": []
                        }
                    ]
            },
            {"content": "4", "id": "4", "author": "ttt", "date": "timestamp", "votes": "0", "subComment": []},
        ]


    }
;


$(document).ready(function () {
   $('#contentContainer').empty();

   //todo someweher  $('#contentContainer').append(' <form action="index.html"> Channel Name:<br>  <input type="text" name="firstname" value="Channel Name"> <br> <br> <input type="submit" value="Submit"> </form>');


        console.log(sampleJSon);
        printChannels();/*
     //$("#header").load("header.html");
    firebase.auth().onAuthStateChanged(function (user) {

        //console.log(user);
        if (user) {//Todo to if(user) zurück


            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="Logout"> Logout</button>');



            logout();

            var name, email;
                name = user.displayName;
                email = user.email;


            $('#LoginCon').append('<p id="userInfo">' + name + ' ' + email + '</p>');

        } else {
            console.log("no user");
            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="LoginButtonRed"> Login</button>');
            login();


        }




    });*/
});

function printChannels() {
    console.log("printChannelsFunct");

    let channelarr = sampleJSon.Channels;
    console.log(channelarr);
    for (let i in channelarr) {
        console.log(channelarr[i].name)
        let channel = new Channel(channelarr[i]);
        $("#contentContainer").append(channel.$element);
    }


}

let Channel = function (data) {

    let key = data.key;
    let time=data.time;
    let totalVotes=data.totalVotes;
    let body=data.body
    console.log("Name of chanell" + body);
    this.generateEl = function () {
        this.$element=$('<div class="ChannelDiv"></div>');
        channelDiv = $('<div class="Channel">' +body+ time+totalVotes+ '</div>');
        channelDiv.on('click', function () {
            console.log(key);
            //location.href='channel.html?channelid='+key;

        });
        this.$element.append(channelDiv)
        let radioGroup=$('<div class="RadioGroup"></div>');
        radioGroup.append('<input type="radio"   class="upBut" name="'+key+'" value=1 /> <label for="up">Up</label>');
        radioGroup.append('<input type="radio"   class="downBut" name="'+key+'" value=-1> <label for="down">Down</label>');
        $( radioGroup).click(function() {
            console.log(key);
           console.log($('input[name='+key+']:checked').val());
        });
        this.$element.append(radioGroup);



    };


    this.generateEl();
};


function createNewChannel(email, title, body) {
    // A post entry.
    var postData = {

        userEmail: email,
        title: title,
        body: body,
        votes: 0,

    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('channels').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/channels/' + newPostKey] = postData;
    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
}

function login() {

    $('#LoginButtonRed').click(function () {
        authent();


    });
}

function logout() {
    $('#Logout').click(function () {
        console.log("LogoutButton");
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


        } else {
            //nothing
        }
    });


}//Todo anpassen
function createDatabaseEntryForUser() {

    console.log("create");

            console.log("userright");
            var userId = firebase.auth().currentUser.uid;
            console.log("userid: " +userId);
            var useRef = firebase.database().ref('users/' + userId);

            useRef.transaction(function (currentData) {
                if (currentData === null) {
                    return {
                        email: user.email,
                    };
                } else {
                    console.log('User' + userId + ' already exists.');
                    return; // Abort the transaction.
                }
            }, function (error, committed, snapshot) {
                if (error) {
                    console.log('Transaction failed abnormally!', error);
                } else if (!committed) {
                    console.log('We aborted the transaction (because Users already exists).');
                } else {
                    console.log('User' + userId + ' ada added!');
                }
                console.log("User's data: ", snapshot.val());
            });


}



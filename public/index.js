var channelArr = new Array();
var channelLikes = new Array();


$(document).ready(function () {
    $('#contentContainer').empty();
    $('#homeButton').on('click', function () {
        location.href = 'index.html';
    });


    // getChannels();

    //$("#header").load("header.html");
    firebase.auth().onAuthStateChanged(function (user) {


        if (user) {//Todo to if(user) zurück


            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="Logout"> Logout</button>');
            // createNewChannel();
            $('#createChannelContainer').append(' <div >\n' +
                'Channel name: <input id="channelBody" type="text" placeholder="Channel name" value=""><br>\n' +
                '<button id="submitChannel" >Create Channel</button>\n' +
                '</div>');
            $("#submitChannel").click(function () {
                createNewChannel()
            });


            logout();

            var name, email;
            name = user.displayName;
            email = user.email;

            $('#LoginCon').append('<p id="userInfo">' + name + ' ' + email + '</p>');
            getLikes();


        } else {

            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="LoginButtonRed"> Login</button>');
            login();
            getChannels()


        }


    });


});


function printChannels(data, key) {

    let vote = 0;
    for (let i = 0; i < channelLikes.length; i++) {

        if (channelLikes[i].key === key) {
            vote = channelLikes[i].value;

        }

    }
    let channel = new Channel(data, key, vote);

    $("#contentContainer").append(channel.$element);
    channelArr.push(channel);


}


let Channel = function (data, channelKey, value) {

    this.key = channelKey;

    this.time = data.time;
    //let time="Null";
    this.totalVotes = data.totalVotes;
    //let totalVotes="0";
    this.parent = data.parent;
    this.author = data.userEmail;
    //let parent="-1";
    this.body = data.body;
    this.nr = value;

    this.generateEl = function () {
        this.$element = $('<div class="ChannelDiv" id="' + this.key + '"></div>');
        this.channelDiv = $('<div class="Channel"></div>');
        this.channelDiv.append($('<p class="body"">' + this.body + '</p>'));
        this.channelDiv.append($('<p class="time">' + this.time + '</p>'));
        this.channelDiv.append($('<p class="author">' + this.author + '</p>'));

        this.voteDiv = $('<div class="vote"> votes: ' + this.totalVotes + '</div>');
        let x = this;

        this.channelDiv.on('click', function () {

            location.href = 'channel.html?channelid=' + x.key;

        });


        this.$element.append(this.channelDiv);
        this.$element.append(this.voteDiv);
        this.radioGroup = $('<div class="RadioGroup"></div>');
        if (this.nr > 0) {
            this.radioGroup.append('<input type="radio"   class="upBut" name="' + this.key + '" value=1 checked /> <label for="up">&#8593;</label>');
            this.radioGroup.append('<input type="radio"   class="downBut" name="' + this.key + '" value=-1> <label for="down">&#8595;</label>');
        }
        if (this.nr < 0) {
            this.radioGroup.append('<input type="radio"   class="upBut" name="' + this.key + '" value=1 /> <label for="up">&#8593;</label>');
            this.radioGroup.append('<input type="radio"   class="downBut" name="' + this.key + '" value=-1 checked> <label for="down">&#8595;</label>');

        }
        if (this.nr === 0) {
            this.radioGroup.append('<input type="radio"   class="upBut" name="' + this.key + '" value=1 /> <label for="up">&#8593;</label>');
            this.radioGroup.append('<input type="radio"   class="downBut" name="' + this.key + '" value=-1> <label for="down">&#8595;</label>');

        }


        this.radioGroup.on('click', function () {
            var user = firebase.auth().currentUser;


            if (user) {//Todo to if(user) zurück
                let tempvalue = parseInt($('input[name=' + x.key + ']:checked').val());

                if (x.nr !== tempvalue) {


                    x.nr = tempvalue;
                    setVote(x.key, tempvalue, x.parent);
                }
            } else {
                alert("Login first Please");

            }

        });
        this.$element.append(this.radioGroup);


    };
    this.removeHtML = function () {

        let adress = $('#' + this.key);
        adress.remove();
    };
    //TODO check if already liked
    this.updateVote = function () {
        let temp = $('#' + this.key).children();
        let voteTemp = temp[1];//TODO aufppase
        voteTemp.innerHTML = "votes:" + this.totalVotes;//todo anppase
    };


    this.generateEl();
};


function createNewChannel() {
    var channelName = $('#channelBody').val();
    if (!channelName.replace(/\s/g, '').length || channelName === null) {
        alert("Please enter a name")
        return;
    }


    let userId = firebase.auth().currentUser.uid;
    // A post entry.
    let postData = {

        body: channelName,


    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('users/' + userId + '/channels').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['users/' + userId + '/channels/' + newPostKey] = postData;


    firebase.database().ref().update(updates);
    $('#channelBody').val("");
    return;

}

function getChannels() {
    var channelsO = firebase.database().ref().child('channels');


    channelsO.on('child_added', function (data) {

        printChannels(data.val(), data.key)


    });

    channelsO.on('child_changed', function (data) {

        let tempVotes = data.val().totalVotes;
        let tempKey = data.key;
        channelArr.forEach(elem => {
            if (elem.key === tempKey) {
                elem.totalVotes = tempVotes;
                elem.updateVote();
            }
        })

    });

    channelsO.on('child_removed', function (data) {

        //TODO remove button action
    });


}

function setVote(key, voteNr, parent) {

    let userId = firebase.auth().currentUser.uid;


    let postData = {

        vote: voteNr,
        parent: parent,


    };
    var updates = {};
    updates['users/' + userId + '/commentVotes/' + key] = postData;
    firebase.database().ref().update(updates);

}

function login() {

    $('#LoginButtonRed').click(function () {
        authent();


    });
}

function logout() {
    $('#Logout').click(function () {

        firebase.auth().signOut().then(function () {
            console.log("Logout Successful");
            location.reload();
        }).catch(function (error) {
            console.log("Error :");
            console.log(error);
        });

    })

}

function authent() {

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


}


function getLikes() {
    let userId = firebase.auth().currentUser.uid;


    var channelsO = firebase.database().ref().child('users/' + userId + '/commentVotes');


    channelsO.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            if (childSnapshot.val().parent === -1) {
                let tempKey = childSnapshot.key;

                let tempValue = childSnapshot.val().vote;

                let temp = {
                    key: tempKey,
                    value: tempValue

                };

                channelLikes.push(temp);

            }

        });

        getChannels();
    });

}


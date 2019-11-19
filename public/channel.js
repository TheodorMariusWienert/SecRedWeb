var commentArr = new Array();
var channelKey;
var commentLikes = new Array();
var parentChannel;


$(document).ready(function () {

    channelKey = getUrlVars().channelid;
    $('#homeButton').on('click', function () {
        location.href = 'index.html';
    });


    // getChannels();

    //$("#header").load("header.html");
    firebase.auth().onAuthStateChanged(function (user) {


        if (user) {//Todo to if(user) zurück

            $('#parentChannel').empty();
            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="Logout"> Logout</button>');
            // createNewChannel();
            $('#createCommentContainer').append(' <div >\n' +
                '<input class="createComment" id="commentBody" type="text" placeholder="Comment value" value=""><br>\n' +
                '<button class="createCommentButton" id="createComment" >Create Comment</button>\n' +
                '</div>');
            $("#createComment").click(function () {
                let val = $('#commentBody').val();
                $('#commentBody').val("");
                createNewComment(channelKey, val);

            });


            logout();

            var name, email;
            name = user.displayName;
            email = user.email;

            $('#LoginCon').append('<p id="userInfo">' + name + ' ' + email + '</p>');
            getLikes();


        } else {

            console.log("no user");
            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="LoginButtonRed"> Login</button>');
            login();
            getParentChannel();
            getComments(channelKey);


        }


    });


});


function printComments(data, key) {


    let vote = 0;
    for (let i = 0; i < commentLikes.length; i++) {

        if (commentLikes[i].key === key) {
            vote = commentLikes[i].value;

        }

    }
    let comment = new Comment(data, key, vote);

    let temp = $("#" + data.parent).children();

    let voteTemp = temp[2];//TODO aufppase

    //TODO

    $(voteTemp).append(comment.$element);
    commentArr.push(comment);


}


let Comment = function (data, commentKey, value) {

    this.key = commentKey;
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
        this.$element = $('<div class="comment" id="' + this.key + '"></div>');

        this.commentDiv = $('<div class="CommentDiv"></div>');
        this.commentDiv.append($('<p class="body"">' + this.body + '</p>'));
        this.commentDiv.append($('<p class="time">' + this.time + '</p>'));
        this.commentDiv.append($('<p class="author">' + this.author + '</p>'));
        this.voteDiv = $('<div id="votes"> votes: ' + this.totalVotes + '</div>');
        let x = this;


        this.$element.append(this.commentDiv);
        this.$element.append(this.voteDiv);
        this.subs = $('<div class="subs"> </div>');
        this.$element.append(this.subs);


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
        this.commentDiv.one('click', function () {

            x.subs.empty();
            var user = firebase.auth().currentUser;


            //console.log(user);
            if (user) {
                x.cC = $('<input class="createComment" id="' + x.key + 'Input" type="text" placeholder="Comment name" value=""><br>\n</div>');
                x.button = $('<button class="createCommentButton" id="createComment" >Answer</button>\n');


                x.$element.append(x.cC);
                x.button.on('click', function () {


                    let text = x.cC.val();

                    x.cC.val("");
                    createNewComment(x.key, text);


                });
                x.$element.append(x.button);
            }
            //todo gucken ob er ab hier schon listende
            getComments(x.key);
            x.commentDiv.on('click', function () {
                x.subs.fadeToggle();
                x.button.fadeToggle();
                x.cC.fadeToggle();
            })


        });

        this.radioGroup.on('click', function () {
            var user = firebase.auth().currentUser;


            if (user) {//Todo to if(user) zurück
                let tempvalue = parseInt($('input[name=' + x.key + ']:checked').val());

                if (x.nr !== tempvalue) {


                    x.nr = tempvalue;
                    setVote(x.key, tempvalue, x.parent);
                }
            } else {

                alert("Login first Please")

            }

        });
        this.$element.append(this.radioGroup);


    };
    this.removeHtML = function () {

        let adress = $('#' + this.key);
        adress.remove();
    };
    this.updateVote = function () {
        let temp = $('#' + this.key).children();
        let voteTemp = temp[1];//TODO aufppase

        voteTemp.innerHTML = "votes:" + this.totalVotes;//todo anppase
    };


    this.generateEl();
};


function createNewComment(parentKey, val) {//TODO
    var commenText = val;

    if (!commenText.replace(/\s/g, '').length || commenText === null) {
        alert("Please enter a body")
        return;
    }


    let userId = firebase.auth().currentUser.uid;
    // A post entry.
    let postData = {

        body: commenText,
        parent: parentKey,


    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('users/' + userId + '/comments/').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['users/' + userId + '/comments/' + newPostKey] = postData;


    firebase.database().ref().update(updates);


}

function getComments(tempKey) {
    var commentPath = firebase.database().ref().child('comments/' + tempKey + '/subComments/');


    commentPath.on('child_added', function (data) {

        printComments(data.val(), data.key)


    });

    commentPath.on('child_changed', function (data) {

        let tempVotes = data.val().totalVotes;
        let tempKey = data.key;

        commentArr.forEach(elem => {

            if (elem.key === tempKey) {
                elem.totalVotes = tempVotes;

                elem.updateVote();
            }
        })

    });

    commentPath.on('child_removed', function (data) {
        console.log(data);
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


}


function getUrlVars() {//Thanks https://html-online.com/articles/get-url-parameters-javascript/
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getLikes() {
    let userId = firebase.auth().currentUser.uid;


    var channelsO = firebase.database().ref().child('users/' + userId + '/commentVotes');


    channelsO.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {


            let tempKey = childSnapshot.key;

            let tempValue = childSnapshot.val().vote;

            let temp = {
                key: tempKey,
                value: tempValue

            };

            commentLikes.push(temp);


        });

        getParentChannel();
        getComments(channelKey);

    });

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
        this.channelDiv.append($('<p class="author">author:' + this.author + '</p>'));

        this.voteDiv = $('<div class="vote"> votes: ' + this.totalVotes + '</div>');
        let x = this;
        this.$element.append(this.channelDiv);
        this.$element.append(this.voteDiv);
        this.subs = $('<div class="subs"> </div>');
        this.$element.append(this.subs);
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
                    x.updateVote(tempvalue);
                    setVote(x.key, tempvalue, x.parent);
                }
            } else {
                alert("Login first Please")
                authent();
            }

        });
        this.$element.append(this.radioGroup);


    };
    this.removeHtML = function () {
        console.log("remove" + this.key);
        let adress = $('#' + this.key);
        adress.remove();
    };
    //TODO check if already liked
    this.updateVote = function (value) {
        let temp = $('#' + this.key).children();
        let voteTemp = temp[1];//TODO aufppasen

        if (this.nr === 0) this.totalVotes = this.totalVotes + value;
        else {
            this.nr = value;
            this.totalVotes = this.totalVotes + 2 * value;

        }
        voteTemp.innerHTML = "votes:" + this.totalVotes;//todo anppase
    };


    this.generateEl();
};

function getParentChannel() {

    var channelsO = firebase.database().ref().child('channels/' + channelKey);


    channelsO.once('value', function (data) {

        printChannels(data.val(), data.key);


    });


}

function printChannels(data, key) {


    let vote = 0;
    for (let i = 0; i < commentLikes.length; i++) {

        if (commentLikes[i].key === key) {

            vote = commentLikes[i].value;

        }

    }
    let channel = new Channel(data, key, vote);

    $("#parentChannel").append(channel.$element);
    parentChannel = channel;


}






var channelid;
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

var commentArr = new Array();
var channelKey;


$(document).ready(function () {
    $('#contentContainer').empty();
    channelKey=getUrlVars().channelid;





    // getChannels();

    //$("#header").load("header.html");
    firebase.auth().onAuthStateChanged(function (user) {

        //console.log(user);
        if (user) {//Todo to if(user) zurück


            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="Logout"> Logout</button>');
            // createNewChannel();
            $('#createCommentContainer').append(' <div >\n' +
                'Comment: <input class="createComment" id="commentBody" type="text" placeholder="Comment name" value=""><br>\n' +
                '<button class="createCommentButton" id="createComment" >Create Channel</button>\n' +
                '</div>');
            $("#createComment").click(function(){
                let val =$('#commentBody').val();
                $('#commentBody').empty();
                createNewComment(channelKey,val);

            });




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




    });
    //TODO anpassen
    let channelDiv= $('<div id="'+ channelKey+'">' +channelKey+'</div>');

    let commentDiv = $('<div class="CommentDiv">dummy</div>');
    let voteDiv=$('<div id="votes">dummy</div>');
    channelDiv.append(commentDiv);
   channelDiv.append(voteDiv);
    let subs=$('<div class="subs"> </div>');
    channelDiv.append(subs);
    $('#contentContainer').append(channelDiv);
    //load channelData
    getComments(channelKey);


});


function printComments(data,key) {
    /*  $('#contentContainer').empty();
      console.log("printChannelsFunct");

      let channelarr = arr;
      let keys = Object.keys(arr);
      console.log("channelarr");
      console.log(channelarr);
      console.log("keys");
      console.log(keys);
      for (let i = 0; i < keys.length; i++) {
          console.log(channelarr[keys[i]]);
          let channel = new Channel(channelarr[keys[i]],keys[i]);
         $("#contentContainer").append(channel.$element);
      }
  */
    console.log("Print")
    console.log(data);
    console.log(key);
    let comment = new Comment(data,key);
    console.log(data.parent);
    let temp=$("#"+data.parent).children();
    console.log(temp);
    let voteTemp=temp[2];//TODO aufppase
    console.log(voteTemp);
    console.log("just created");
    console.log(comment);
    $(voteTemp).append(comment.$element);
    commentArr.push(comment);



}



let Comment = function (data,commentKey) {
    console.log("create da comment");
    console.log(data);
    this.key = commentKey;
    this.time=data.time;
    //let time="Null";
    this.totalVotes=data.totalVotes;
    //let totalVotes="0";
    this.parent=data.parent;
    this.author=data.userId;
    //let parent="-1";
    this.body=data.body;
    console.log("Name of comment" + this.body);
    this.generateEl = function () {
        this.$element=$('<div class="comment" id="'+this.key+'"></div>');
        let commentDiv = $('<div class="CommentDiv">' +this.body+',time: '+this.time+ ', author:'+this.author+'</div>');
        let voteDiv=$('<div id="votes"> votes: '+this.totalVotes+'</div>');
        let x =this;







        this.$element.append(commentDiv);
        this.$element.append(voteDiv);
        let subs=$('<div class="subs"> </div>');
        this.$element.append(subs);



        let radioGroup=$('<div class="RadioGroup"></div>');
        radioGroup.append('<input type="radio"   class="upBut" name="'+this.key+'" value=1 /> <label for="up">Up</label>');
        radioGroup.append('<input type="radio"   class="downBut" name="'+this.key+'" value=-1> <label for="down">Down</label>');
        commentDiv.on('click', function () {
            console.log("try for comments"+x.key);
            subs.empty();
            let cC=$('<input class="createComment" id="'+x.key+'Input" type="text" placeholder="Comment name" value=""><br>\n</div>');

            let button=$('<button class="createCommentButton" id="createComment" >Answer</button>\n');


            x.$element.append(cC);
            button.on('click', function () {

                console.log(x.key);

                let text= $('#'+x.key+'Input').val();
                console.log( ('#'+x.key+'Input'));
                console.log(text);
                $('#'+x.key+'Input').empty();
                createNewComment(x.key,text);


            });
            x.$element.append(button);
            //todo gucken ob er ab hier schon listende
            getComments(x.key);



        });
        $(radioGroup).on('click',function() {
            firebase.auth().onAuthStateChanged(function (user) {

                //console.log(user);
                if (user) {//Todo to if(user) zurück
                    let tempvalue=parseInt($('input[name=' + x.key + ']:checked').val());
                    console.log(tempvalue);
                    // console.log(x.nr);
                    if(x.nr!==tempvalue) {
                        console.log("im if");
                        console.log(x.key);

                        x.nr = tempvalue;
                        setVote(x.key, tempvalue, x.parent);
                    }
                }
                else {
                    alert("Login first Please")
                    authent();
                }
            });
        });
        this.$element.append(radioGroup);




    };
    this.removeHtML=function(){
        console.log("remove"+this.key);
        let adress=$('#'+this.key);
        adress.remove();
    };
    this.updateVote=function(){
        let temp=$('#'+this.key).children();
        let voteTemp=temp[1];//TODO aufppase
        console.log("Try Update");
        console.log(voteTemp);
        voteTemp.innerHTML="votes:"+this.totalVotes;//todo anppase
    };


    this.generateEl();
};


function createNewComment(parentKey,val) {//TODO
    var commenText = val;
    console.log("createTHE comm");
    if (!commenText.replace(/\s/g, '').length||commenText===null) {
        alert("Please enter a body")
        return;
    }


    let userId = firebase.auth().currentUser.uid;
    // A post entry.
    let postData = {

        body: commenText,
        parent:parentKey,


    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('users/'+userId+'/comments/').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['users/'+userId+'/comments/'+ newPostKey] = postData;


    firebase.database().ref().update(updates);


}
function getComments(tempKey) {
    var channelsO = firebase.database().ref().child('comments/'+tempKey+'/subComments/');
    /*
        channelsO.once('value').then(function (snapshot){
           console.log(snapshot.val());
            printChannels(snapshot.val())})*

     */

    channelsO.on('child_added', function(data) {

        console.log(data.key);
        printComments(data.val(),data.key)





    });

    channelsO.on('child_changed', function(data) {
        console.log(data.val());
        console.log(commentArr);
        let tempVotes=data.val().totalVotes;
        let tempKey=data.key;
        console.log(data.key);
        commentArr.forEach(elem => {
            console.log(elem);
            console.log(elem.key)
            if(elem.key===tempKey){
                elem.totalVotes=tempVotes;
                console.log("insideIF");
                console.log(elem.totalVotes);
                elem.updateVote();
            }
        })

    });

    channelsO.on('child_removed', function(data) {
        console.log(data);
        //TODO remove button action
    });






}
function setVote(key,voteNr,parent) {
    let userId = firebase.auth().currentUser.uid;


    let postData = {

        vote: voteNr,
        parent:parent,


    };
    var updates = {};
    updates['users/'+userId+'/commentVotes/'+ key] = postData;
    firebase.database().ref().update(updates);

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



/*
function goThroughComments() {
    console.log("go through")
    let commentarr = sampleChannel.subComment;
    let container = $('#contentContainer');
    container.empty();
    printComments(commentarr, container)

}

function printComments(commentarr, container) {

    console.log(commentarr);
    console.log(container);
    for (let i in commentarr) {
        console.log(commentarr[i].content);
        let tempComment = new Comment(commentarr[i]);
        container.append(tempComment.$comment);
        if (commentarr[i].subComment.length) {
            let container2 = $('<div class="SubComments">' + this.name + '</div>');
            tempComment.$comment.append(container2)
            printComments(commentarr[i].subComment, container2)
        }
    }


}*/
function getUrlVars() {//Thanks https://html-online.com/articles/get-url-parameters-javascript/
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}







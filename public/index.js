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
var channelArr = new Array();


$(document).ready(function () {
   $('#contentContainer').empty();





       // getChannels();

     //$("#header").load("header.html");
    firebase.auth().onAuthStateChanged(function (user) {

        //console.log(user);
        if (user) {//Todo to if(user) zurück


            $('#LoginCon').empty();
            $('#LoginCon').append('<button id="Logout"> Logout</button>');
           // createNewChannel();
            $('#createChannelContainer').append(' <div >\n' +
                'Channel name: <input id="channelBody" type="text" placeholder="Channel name" value=""><br>\n' +
                '<button id="submitChannel" >Create Channel</button>\n' +
                '</div>');
            $("#submitChannel").click(function(){
                createNewChannel()
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
    getChannels()


});


function printChannels(data,key) {
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
    let channel = new Channel(data,key);
    $("#contentContainer").append(channel.$element);
    channelArr.push(channel);



}


let Channel = function (data,channelKey) {

    this.key = channelKey;
    this.time=data.time;
    //let time="Null";
    this.totalVotes=data.totalVotes;
    //let totalVotes="0";
    this.parent=data.parent;
    this.author=data.userId;
    //let parent="-1";
    this.body=data.body;
    this.nr=0;
    console.log("Name of chanell" + this.body);
    this.generateEl = function () {
        this.$element=$('<div class="ChannelDiv" id="'+this.key+'"></div>');
        let channelDiv = $('<div class="Channel">' +this.body+',time: '+this.time+ ', author:'+this.author+'</div>');
        let voteDiv=$('<div id="votes"> votes: '+this.totalVotes+'</div>');
        let x =this;

        channelDiv.on('click', function () {
            console.log(x.key);
            location.href='channel.html?channelid='+x.key;

        });





        this.$element.append(channelDiv);
        this.$element.append(voteDiv);
        let radioGroup=$('<div class="RadioGroup"></div>');
        radioGroup.append('<input type="radio"   class="upBut" name="'+this.key+'" value=1 /> <label for="up">Up</label>');
        radioGroup.append('<input type="radio"   class="downBut" name="'+this.key+'" value=-1> <label for="down">Down</label>');

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
    //TODO check if already liked
    this.updateVote=function(){
        let temp=$('#'+this.key).children();
        let voteTemp=temp[1];//TODO aufppase
        voteTemp.innerHTML="votes:"+this.totalVotes;//todo anppase
    };


    this.generateEl();
};


function createNewChannel() {
    var channelName = $('#channelBody').val();
    if (!channelName.replace(/\s/g, '').length||channelName===null) {
        alert("Please enter a name")
        return;
    }


    let userId = firebase.auth().currentUser.uid;
    // A post entry.
    let postData = {

        body: channelName,


    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('users/'+userId+'/channels').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['users/'+userId+'/channels/'+ newPostKey] = postData;


     firebase.database().ref().update(updates);
     $('#channelBody').val("");
       return;

}
function getChannels() {
    var channelsO = firebase.database().ref().child('channels');
/*
    channelsO.once('value').then(function (snapshot){
       console.log(snapshot.val());
        printChannels(snapshot.val())})*

 */

    channelsO.on('child_added', function(data) {

        console.log(data.key);
        printChannels(data.val(),data.key)
       console.log(channelArr);
        console.log(channelArr[0]);



    });

    channelsO.on('child_changed', function(data) {
        console.log(data.val());
        let tempVotes=data.val().totalVotes;
        let tempKey=data.key;
        channelArr.forEach(elem => {
            if(elem.key===tempKey){
                elem.totalVotes=tempVotes;
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



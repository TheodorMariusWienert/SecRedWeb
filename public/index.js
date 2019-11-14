var sampleJSon = {

    "Channels": [{"name": "Number1", "date": "timestamp"},
        {"name": "Number2", "date": "timestamp"},
        {"name": "Number3", "date": "timestamp"}]
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

var userbool = false;
$(document).ready(function () {
   $('#contentContainer').empty();

   //todo someweher  $('#contentContainer').append(' <form action="index.html"> Channel Name:<br>  <input type="text" name="firstname" value="Channel Name"> <br> <br> <input type="submit" value="Submit"> </form>');


        console.log(sampleJSon);
        printChannels();
    //To$("#header").load("header.html");
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
            console.log("click on" + name);
            location.href='channel.html?channelid='+name;

        });
        let upButton = $('<button class="UpButton">+</button>');
        upButton.on('click', function () {
            console.log("plus" );

        });
        this.$element.append(upButton);
        let downButton = $('<button class="UpButton">-</button>');
        downButton.on('click', function () {
            console.log("minus" );

        });
        this.$element.append(downButton);


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




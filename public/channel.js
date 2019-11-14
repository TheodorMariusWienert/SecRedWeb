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

var userbool = false;
$(document).ready(function () {
    $('#contentContainer').empty();
    channelid=getUrlVars()["channelid"];
    console.log(channelid);


    goThroughComments();
    //$("#header").load("header.html");
    //Heys

});



let Comment = function (data) {
    this.generateEl = function () {
        this.$comment = $('<div class="comment">' + data.content + ' ' + data.author + '</div>')
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
        let seeMoreButton = $('<button class="SeeMore">SeeMore</button>');
        seeMoreButton.on('click', function () {
            console.log("SeeMore");

        });
        this.$comment.append(seeMoreButton)
    };
    this.generateEl();


};

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


}
function getUrlVars() {//Thanks https://html-online.com/articles/get-url-parameters-javascript/
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}







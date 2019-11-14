const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createUserInDb = functions.auth.user().onCreate((user) => {

    return admin.database().ref('users/' + user.uid).set({
        email: user.email,
    });

});

exports.deleteUserInDB = functions.auth.user().onDelete((user) => {


    return admin.database().ref('users/' + user.uid).remove();
});

exports.createChannelListener = functions.database.ref('/users/{userId}/channels/{keys}')
    .onCreate((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;
        let thedata=change.val();
        thedata.totalVotes="0";
        console.log(thedata);
/*
        let startVote=0;
        change.ref.child('/totalVotes').set(startVote);*/
        change.ref.parent.parent.parent.parent.child('comments/'+key).update(thedata);
		return  newRef = change.ref.parent.parent.parent.parent.child('channels/'+key).update(thedata);

    });

exports.deleteChannelListener = functions.database.ref('/users/{userId}/channels/{keys}')
    .onDelete((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;

        change.ref.parent.parent.parent.parent.child('comments/'+key).remove();
        return  newRef = change.ref.parent.parent.parent.parent.child('channels/'+key).remove();

    });
exports.createCommentListener = functions.database.ref('/users/{userId}/comments/{keys}')
    .onCreate((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;
        let thedata=change.val()+{totalVotes:0};
        thedata.totalVotes="0";
        let parent=change.val().parent;


        change.ref.parent.parent.parent.parent.child('comments/'+parent+'/'+key).update(thedata);
        return  newRef = change.ref.parent.parent.parent.parent.child('comments/'+key).update(thedata);

    });
exports.deleteCommentListener = functions.database.ref('/users/{userId}/comments/{keys}')
    .onDelete((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;
        let parent=change.val().parent;

        change.ref.parent.parent.parent.parent.child('comments/'+parent+'/'+key).remove();
        return  newRef = change.ref.parent.parent.parent.parent.child('comments/'+key).remove();

    });
exports.createChannelVoteListener = functions.database.ref('/users/{userId}/channelVotes/{keys}')
    .onCreate((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;
        let userId=context.params.userId;
        let vote=change.val().vote;
        let value={number:"0"};
        if(vote<0) value.number="-1";
        if(vote>0) value.number="1";
        //get the data from the exisitng votes
        //star count firbase doc
        //anpassen
        change.ref.parent.parent.parent.parent.child('comments/'+key+'/votes/'+userId).update(value);
        return  newRef = change.ref.parent.parent.parent.parent.child('channels/'+key+'/votes/'+userId).update(value);

    });
exports.updateChannelVoteListener = functions.database.ref('/users/{userId}/channelVotes/{keys}')
    .onUpdate((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;
        let userId=context.params.userId;
        let vote=change.after.val().vote;
        let value={number:0};
        if(vote<0) value.number="-1";
        if(vote>0) value.number="1";
        //get the data from the exisitng votes
        //star count firbase doc
        //anpassen
        change.before.ref.parent.parent.parent.parent.child('comments/'+key+'/votes/'+userId).update(value);
        return  newRef = change.before.ref.parent.parent.parent.parent.child('channels/'+key+'/votes/'+userId).update(value);

    });

exports.createCommentVoteListener = functions.database.ref('/users/{userId}/commentVotes/{keys}')
    .onCreate((change, context) => {
            console.log(change);
            console.log(context);
            let key=context.params.keys;
            let userId=context.params.userId;
            let vote=change.val().vote;
            let value={number:0};
            if(vote<0) value.number="-1";
            if(vote>0) value.number="1";
            let parent=change.val().parent;
            //get the data from the exisitng votes
            //star count firbase doc
            //anpassen
            change.ref.parent.parent.parent.parent.child('comments/'+key+'/votes/'+userId).update(value);
            return  newRef = change.ref.parent.parent.parent.parent.child('comments/'+parent+'/'+key+'/votes/'+userId).update(value);


    });
exports.updateCommentVoteListener = functions.database.ref('/users/{userId}/commentVotes/{keys}')
    .onUpdate((change, context) => {
            console.log(change);
            console.log(context);
            let key=context.params.keys;
            let userId=context.params.userId;
            let vote=change.after.val().vote;
            let value={number:0};
            if(vote<0) value.number="-1";
            if(vote>0) value.number="1";
            let parent=change.after.val().parent;
            //get the data from the exisitng votes
            //star count firbase doc
            //anpassen
            change.before.ref.parent.parent.parent.parent.child('comments/'+key+'/votes/'+userId).update(value);
            return  newRef = change.before.ref.parent.parent.parent.parent.child('comments/'+parent+'/'+key+'/votes/'+userId).update(value);

    });
/*
//Todo if parent =0 auch zu den channels gehen.
//sonst zum PArent
exports.updateCommentTotalVoteUpdater = functions.database.ref('/comments/{key}/votes/{keys}')
    .onWrite((change, context) => {
            console.log(change);
            console.log(context);
            let key=context.params.keys;
            let userId=context.params.userId;
            let vote=change.after.val().vote;
            let value={number:0};
            if(vote<0) value.number=-1;
            if(vote>0) value.number=1;
            //get the data from the exisitng votes
            //star count firbase doc
            //anpassen
            change.before.ref.parent.parent.child('comments/'+key+'/votes/'+userId).update(value);
            return  newRef = change.before.ref.parent.parent.parent.parent.child('channels/'+key+'/votes/'+userId).update(value);

    });*/





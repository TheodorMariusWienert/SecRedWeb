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
        let vParent={parent:-1};
        change.ref.set(vParent);
        let key = context.params.keys;
        let userId=context.params.userId;
        let time=context.timestamp;
        let thedata = change.val();
        thedata.totalVotes = 0;
        console.log(thedata);

        thedata.parent=-1;
        thedata.userId=userId;
        thedata.time=time;
        console.log(thedata);
        admin.database().ref('/users/'+userId+'/email').once('value').then(function(snapshot) {
            console.log(snapshot);

        });

        let updates = {};
        updates['channels/' + key] = thedata;
        updates['comments/' + key] = thedata;
        return change.ref.parent.parent.parent.parent.update(updates);


    });

exports.deleteChannelListener = functions.database.ref('/users/{userId}/channels/{keys}')
    .onDelete((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;

        let updates = {};
        updates['channels/' + key] = null;
        updates['comments/' + key] = null;
        return change.ref.parent.parent.parent.parent.update(updates);


    });
exports.createCommentListener = functions.database.ref('/users/{userId}/comments/{keys}')
    .onCreate((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let thedata = change.val();
        thedata.totalVotes = 0;
        let parent = change.val().parent;

        let userId=context.params.userId;
        let time=context.timestamp;
        thedata.totalVotes = 0;
        console.log(thedata);
        thedata.parent=parent;
        thedata.userId=userId;
        thedata.time=time;

        let updates = {};
        updates['comments/' + parent + '/subComments/' + key] = thedata;
        updates['comments/' + key] = thedata;
        return change.ref.parent.parent.parent.parent.update(updates);



    });
exports.deleteCommentListener = functions.database.ref('/users/{userId}/comments/{keys}')
    .onDelete((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let parent = change.val().parent;

        let updates = {};
        updates['comments/' + parent + '/subComments/' + key] = null;
        updates['comments/' + key] = null;
        return change.ref.parent.parent.parent.parent.update(updates);


    });


/*
exports.createChannelVoteListener = functions.database.ref('/users/{userId}/channelVotes/{keys}')
    .onCreate((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let userId = context.params.userId;
        let vote = change.val().vote;
        let value = {number: "0"};
        if (vote < 0) value.number = -1;
        if (vote > 0) value.number = 1;
        //get the data from the exisitng votes
        //star count firbase doc
        //anpassen
        let updates = {};
        updates['comments/' + key + '/votes/' + userId] = value;
        updates['channels/' + key + '/votes/' + userId] = value;
        return change.ref.parent.parent.parent.parent.update(updates);


    });

exports.updateChannelVoteListener = functions.database.ref('/users/{userId}/channelVotes/{keys}')
    .onUpdate((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let userId = context.params.userId;
        let vote = change.after.val().vote;
        let value = {number: 0};
        if (vote < 0) value.number = -1;
        if (vote > 0) value.number = 1;
        //get the data from the exisitng votes
        //star count firbase doc
        //anpassen
        let updates = {};
        updates['comments/' + key + '/votes/' + userId] = value;
        updates['channels/' + key + '/votes/' + userId] = value;
        return change.before.ref.parent.parent.parent.parent.update(updates);


    });

TODO delete below

exports.createCommentVoteListener = functions.database.ref('/users/{userId}/commentVotes/{keys}')
    .onCreate((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let userId = context.params.userId;
        let vote = change.val().vote;
        let value = {number: 0};
        if (vote < 0) value.number = -1;
        if (vote > 0) value.number = 1;
        let parent = change.val().parent;
        //get the data from the exisitng votes
        //star count firbase doc
        //anpassen
        let updates = {};
        updates['comments/' + key + '/votes/' + userId] = value;
        //updates['comments/' + parent + '/subComments/' + key + '/votes/' + userId] = value;
        return change.ref.parent.parent.parent.parent.update(updates);


    });
    TODO delete below

exports.updateCommentVoteListener = functions.database.ref('/users/{userId}/commentVotes/{keys}')
    .onUpdate((change, context) => {
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let userId = context.params.userId;
        let vote = change.after.val().vote;
        let value = {number: 0};
        if (vote < 0) value.number = -1;
        if (vote > 0) value.number = 1;
        let parent = change.after.val().parent;
        //get the data from the exisitng votes
        //star count firbase doc
        //anpassen
        let updates = {};
        updates['comments/' + key + '/votes/' + userId] = value;
        //updates['comments/' + parent + '/subComments/' + key + '/votes/' + userId] = value;
        return change.before.ref.parent.parent.parent.parent.update(updates);


    });*/

exports.createCommentTotalVoteUpdater = functions.database.ref('/users/{userId}/commentVotes/{keys}')
    .onCreate(async (change, context) => {
        console.log("UpdateCount")
        console.log(change);
        console.log(context);
        let key = context.params.keys;
        let count = parseInt(change.val().vote);
        let value=0;
        let parentKey=change.val().parent;
        let result;

//TODO eigentlich nur im parent die daten notwendig bzw im channel
        await change.ref.update({vote: count});
        console.log(key);
        const voteRef = change.ref.parent.parent.parent.parent.child('comments').child(key).child('totalVotes');
        if (count<0) value =-1;
        if(count>0)value=1;


        await voteRef.transaction(totalVotes => {
            let total = totalVotes;
            let one = value;
            result = one + total;

            return result;
        });
        if(parentKey===-1)
        {
            const voteRef2 = change.ref.parent.parent.parent.parent.child('channels').child(key).child('totalVotes');
            return  voteRef2.transaction(totalVotes => {
                return result;
            });

        }
        else{
            console.log(key);
            console.log(parentKey);

            const voteRef2 = change.ref.parent.parent.parent.parent.child('comments').child(parentKey).child('subComments').child(key).child('totalVotes');
            return  voteRef2.transaction(totalVotes => {
                return result;
            });

        }

    });
exports.updateCommentTotalVoteUpdater = functions.database.ref('/users/{userId}/commentVotes/{keys}')
    .onUpdate(async (change, context) => {
        console.log("UpdateCount")
        console.log(change);
        console.log(context);
        if(change.after.val().vote<=0&&change.before.val().vote<=0||change.after.val().vote>=0&&change.before.val().vote>=0) {
            console.log("same value");
            return;
        }
        let key = context.params.keys;
        let count = parseInt(change.after.val().vote);
        let value=0;


        let parentKey=change.after.val().parent;
        let result;

        await change.after.ref.update({vote: count});
        console.log(key);
         const voteRef = change.after.ref.parent.parent.parent.parent.child('comments').child(key).child('totalVotes');
         console.log(voteRef);
         if (count<0) value =-1;
         if(count>0)value=1;


         await voteRef.transaction(totalVotes => {
            let total = totalVotes;
            let one = 2*value;
            result = one + total;

            return result;
        });
            if(parentKey===-1)
            {
                const voteRef2 = change.after.ref.parent.parent.parent.parent.child('channels').child(key).child('totalVotes');
                return  voteRef2.transaction(totalVotes => {
                    return result;
                });

            }
            else{
                console.log(key);
                console.log(parentKey);

                    const voteRef2 = change.after.ref.parent.parent.parent.parent.child('comments').child(parentKey).child('subComments').child(key).child('totalVotes');
                   return  voteRef2.transaction(totalVotes => {
                                                      return result;
                    });

            }


    });


/*

admin.database().ref('/comments/'+key).once('value').then(function(snapshot) {
    console.log(snapshot);
    console.log(snapshot.val().parent);
    parentKey=snapshot.val().parent;
});*/

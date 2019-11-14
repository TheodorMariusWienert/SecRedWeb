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

		return  newRef = change.ref.parent.parent.parent.parent.child('channels/'+key).update(thedata);

    });
exports.deleteChannelListener = functions.database.ref('/users/{userId}/channels/{keys}')
    .onDelete((change, context) => {
        console.log(change);
        console.log(context);
        let key=context.params.keys;


        return  newRef = change.ref.parent.parent.parent.parent.child('channels/'+key).remove();

    });


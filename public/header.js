$(document).ready(function () {

    console.log("user")
     firebase.auth().onAuthStateChanged(function (user) {

         //console.log(user);
         if (true) {//Todo to if(user) zurück


             $('#LoginCon').empty();
             $('#LoginCon').append('<button id="Logout"> Logout</button>');


             logout();

             var name, email;

             if (user != null) {
                 name = user.displayName;
                 email = user.email;


             }
             $('#LoginCon').append('<p id="userInfo">' + name + ' ' + email + '</p>');

         } else {
             console.log("no user")
             $('#LoginCon').empty();
             $('#LoginCon').append('<button id="LoginButtonRed"> Login</button>');
             login();

         }




     });
});
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
            userbool = true;
        } else {
            userbool = false;
        }
    });


}

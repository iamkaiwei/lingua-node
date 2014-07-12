function checkLoginState(){
  FB.getLoginStatus(function(response) {
    console.log(response.status);

    if (response.status === 'connected') {
      console.log(response.authResponse.accessToken);
    }
    else {
      FB.login(function(user){
        console.log(user.authResponse.accessToken);
      },{scope: 'email, user_birthday'});
    }
  });
}
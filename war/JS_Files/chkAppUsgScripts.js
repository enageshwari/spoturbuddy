

var userID, accessToken;


window.fbAsyncInit = function() 
{
    FB.init({
		appId      : '314413398742873',
		xfbml      : true,
		version    : 'v2.1'
    });

    function OnLoginGetPermission(response)
	{
	  if (response.status == 'connected') 
	  {


		userID = response.authResponse.userID;
 		accessToken = response.authResponse.accessToken;
 		
 		$.ajax({
 			  type: "GET",
 			  url: "chkCurUsr",
 			  data: { action: "getUsgDetails", userID: response.authResponse.userID, accessToken: response.authResponse.accessToken }
 			})
 			.done(function( msg ) {

 				var usgMsg = msg.split(";");
 				document.getElementById("s_usgCnt").innerHTML = " "+usgMsg[0];	
 				document.getElementById("s_lastUsgDate").innerHTML = " "+usgMsg[1];		

 			});
 		
	  }
	}

	FB.getLoginStatus(function(response) 
	{
		if (response.status == 'connected') 
		{
			OnLoginGetPermission(response); 
		} 
		else 
		{
			// Otherwise, show Login dialog first.
			FB.login(function(response) 
			{
				OnLoginGetPermission(response);
				 
			}, {scope: 'user_friends,user_location'});
		}
	});	
};

   (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
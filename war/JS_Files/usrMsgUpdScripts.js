var defMsgVal = "Enter your new message Here ";


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

 		$.ajax({
 			  type: "GET",
 			  url: "chkCurUsr",
 			  data: { action: "getUsrMsg", userID: response.authResponse.userID}
 			})
 			.done(function( msg ) 
 			{

 				if(msg)
 				{
 					document.getElementById("d_prevMsg").innerHTML = "Your current message to this app users: "+msg;	
 				}
 				else
 				{
 					alert("You haven't provide any message so far. Please provide now.");
 				}
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
   
   
   function saveUserMsg()
   {
	
		userMsg = document.getElementById("t_userMsg").value;	


	   $.ajax({
			  type: "POST",
			  url: "chkCurUsr",
			  data: { userID: userID, userMsg: userMsg}
			})
			.done(function( ) 
			{
				alert("Your new message has been posted successfully");	
			});
		
   }
   
	function delDefMsg(objTxtBox_Locn)
	{
		txt_locn_val = objTxtBox_Locn.value;
		objTxtBox_Locn.value = "";
	}

	function chkMsg(objTxtBox_Locn)
	{
		txt_locn_val = objTxtBox_Locn.value;
		if(txt_locn_val == "")
		{
			objTxtBox_Locn.value = defMsgVal;
		}
	}
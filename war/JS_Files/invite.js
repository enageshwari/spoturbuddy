function inviteFrnds() 
{
	/* ask permission before posting every message as the user may wish to provide different access level for different posts */

	FB.login(function(response)
	{
		// get message
		var invite_msg = "Hi! Please share your current city with this App. It would be useful anytime to spot you when I come to your place";
		var app_link = "http://spotyourbuddy.appspot.com/";
		
		// to post
		FB.api('/me/feed', 'post', {message: invite_msg, link: app_link}, function(response)
		{
			if (!response || response.error) 
			{
				// no action
			}
			else 
			{
				alert('\nYour invite has been successfully sent');

				// revoke back the post permissions, so that user will be asked for permissions when he want to post next time 					
				FB.api('/me/permissions/publish_actions', 'delete');
			}

		});
	}, {scope: 'publish_actions'});
 
}

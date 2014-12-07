package p3v3;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.restfb.Connection;
import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.Parameter;
import com.restfb.types.NamedFacebookType;
import com.restfb.types.User;
import com.sun.org.apache.xalan.internal.xsltc.compiler.Pattern;

public class FindFriendServlet1 extends HttpServlet 
{
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{


		String FriendsInfo ="",frndLocation="";
		   

		Logger logger = Logger.getLogger(getClass().getName());

		String userID = request.getParameter("userID");
		String accessToken = request.getParameter("accessToken");
		String givenLocation = request.getParameter("givenLocn");
			
		try 
		{ 
			FacebookClient facebookClient = new DefaultFacebookClient(accessToken);
			
			Connection<User> myFriends = facebookClient.fetchConnection("me/friends", User.class,
					  Parameter.with("fields", "id, name, location"));
 
			givenLocation = givenLocation.toLowerCase();
			 
			for (List<User> listFriends : myFriends) 
			{
				for (User user2 : listFriends) 
				{
					if (user2.getLocation() != null) 
					{
						frndLocation = user2.getLocation().getName();
						frndLocation = frndLocation.toLowerCase();

						if(frndLocation.contains(givenLocation))
						{
							FriendsInfo=FriendsInfo+user2.getId();
							FriendsInfo=FriendsInfo+";"+user2.getName();
							FriendsInfo=FriendsInfo+";"+user2.getLocation().getName()+"/";
						}


					}
				}
			}


			
			response.setContentType("text/html");
			response.getWriter().println(FriendsInfo);

		}
		catch (Exception e)
		{ 
			e.printStackTrace(); 
			logger.severe(e.getMessage());
		} 


	}
}

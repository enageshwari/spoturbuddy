package p3v3;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.Entity;
import com.google.gson.Gson;
import com.restfb.DefaultFacebookClient;
import com.restfb.FacebookClient;
import com.restfb.types.NamedFacebookType;
import com.restfb.types.User;





public class ChkCurUsrServlet extends HttpServlet 
{
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		Logger logger=null;
		User user = null;
		NamedFacebookType curUsrLocn = null;
		Long appUsgCnt;
		Entity curUsrDetails;
		String line = "", action="",r_appUsgCnt="", r_lastAppUsgDate="", r_appUsgDetails="";
		List<String> l_curCity = new ArrayList();
		String userMsg, locnName;
		
		try 
		{ 
			
		    logger = Logger.getLogger(getClass().getName());
		    
		    action = request.getParameter("action");
		    
		    if(action.equals("update"))
		    {
			// update usr's app usg ust, last usg date and time, user name, id and current city info

			String accessToken = request.getParameter("accessToken");
			String userID = request.getParameter("userID");

			FacebookClient facebookClient = new DefaultFacebookClient(accessToken);
			user = facebookClient.fetchObject("me", User.class);
			curUsrLocn = user.getLocation();
			if(curUsrLocn==null)
			{
				locnName="";
				UserDetails ud = new UserDetails(user.getId(), user.getName(),locnName);
				appUsgCnt = ud.storeInDataStore();
				locnName="none";
			}
			else
			{
				locnName =curUsrLocn.getName();
				UserDetails ud = new UserDetails(user.getId(), user.getName(),locnName);
				appUsgCnt = ud.storeInDataStore();

			}

			System.out.println("user locn in servlet:"+locnName+";");
			response.setContentType("text/html");
			response.getWriter().println(user.getName()+";"+locnName+";"+appUsgCnt+";");

			
		    }
		    else if(action.equals("getUsgDetails"))
		    {

			UserDetails ud = new UserDetails();
			String userID = request.getParameter("userID");

			curUsrDetails = ud.retrieveUserDetailsEntity(userID);	

			r_appUsgCnt=(curUsrDetails.getProperty("appUsgCnt")).toString();
			r_lastAppUsgDate=(String)curUsrDetails.getProperty("lastAppUsgDate");

			r_appUsgDetails=r_appUsgCnt+";"+r_lastAppUsgDate+";";
			response.setContentType("text/html");
			response.getWriter().println(r_appUsgDetails);
		    
		    }
		    else if(action.equals("getUniqLocns"))
		    {
			String accessToken = request.getParameter("accessToken");
			String userID = request.getParameter("userID");

			UserDetails ud = new UserDetails();

			l_curCity= ud.getUniqLocns();	


			String jsonCityList = new Gson().toJson(l_curCity);
			response.setContentType("text/html");

			response.getWriter().write(jsonCityList);
				
		    
		    }
		    else if(action.equals("findAppUsrsInACity"))
		    {
			List<HashMap<String,String>> lm_appUser = new ArrayList<HashMap<String,String>>();

			String givenLocation = request.getParameter("locn");

			UserDetails ud = new UserDetails();

			lm_appUser= ud.findAppUsrsInACity(givenLocation);	

			String appUsersList = new Gson().toJson(lm_appUser);
			response.getWriter().write(appUsersList);
				
		    
		    }
		    else if(action.equals("getUsrMsg"))
		    {
			String userID = request.getParameter("userID");

			UserDetails ud = new UserDetails(userID);

			userMsg = ud.getUserPersonalMsg();	

			response.getWriter().write(userMsg);
				
		    
		    }
		    	
		    
		}
		catch (Exception e)
		{ 
			e.printStackTrace();
			logger.severe(e.getMessage());
		} 
	
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String userMsg,userID;
		Logger logger=null;
		
		try 
		{ 
			
			logger = Logger.getLogger(getClass().getName());

			userMsg = request.getParameter("userMsg");
			userID = request.getParameter("userID");

			UserDetails ud = new UserDetails(userID, userMsg);

			ud.saveUserPersonalMsg();	

		}
		catch (Exception e)
		{ 
			e.printStackTrace();
			logger.severe(e.getMessage());
		} 
	
	}	    
		    
}

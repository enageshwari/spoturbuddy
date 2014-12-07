package p3v3;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.Query;
 

public class UserDetails {

	String userID;
	String userName;
	String curCity;
	String userMsg;

	Long ret_appUsgCnt ;
	
	public UserDetails(String userID, String userName, String curCity)
	{
		this.userID = userID;
		this.userName = userName;
		this.curCity = curCity;
		ret_appUsgCnt= new Long(0);
	}
	public UserDetails(String userID, String userMsg)
	{
		this.userID = userID;
		this.userMsg = userMsg;
	
	}
	public UserDetails(String userID)
	{
		this.userID = userID;
	
	}	
	public UserDetails()
	{
		ret_appUsgCnt=new Long(0);
	}


	public Long storeInDataStore()
	{

		Entity retrievedEntity;
		String r_curCity;
		Long r_appUsgCnt;
		String curDate, r_curAppUsgDate;

		retrievedEntity = retrieveUserDetailsEntity(userID);
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		if (retrievedEntity==null)
		{

		  	Entity UserDetailsEntity = new Entity("UserDetailsEntity", userID);
		  	UserDetailsEntity.setProperty("userID", userID);
		  	UserDetailsEntity.setProperty("userName", userName);
		  	UserDetailsEntity.setProperty("curCity", curCity);
		  	UserDetailsEntity.setProperty("appUsgCnt",1);
		  	UserDetailsEntity.setProperty("userMsg","");


			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
			Date date = Calendar.getInstance().getTime();
			curDate = dateFormat.format(date); 
			System.out.println("Add New Entity - CurDate: "+curDate);
		  	UserDetailsEntity.setProperty("lastAppUsgDate","Today - First Time Using this App");
		  	UserDetailsEntity.setProperty("curAppUsgDate",curDate);

		  	ret_appUsgCnt=new Long(1);
		
			datastore.put(UserDetailsEntity);
		
			System.out.println("data newly added");	
		}
		else
		{
			r_curCity=(String)retrievedEntity.getProperty("curCity");
			r_appUsgCnt=(Long)retrievedEntity.getProperty("appUsgCnt");
			r_curAppUsgDate=(String)retrievedEntity.getProperty("curAppUsgDate");

			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
			Date date = Calendar.getInstance().getTime();
			curDate = dateFormat.format(date); 

			System.out.println("Update Entity - CurDate: "+curDate+"Existing curdate in gae datestore: "+r_curAppUsgDate);

			if(!r_curCity.equals(curCity))
			{
				
				retrievedEntity.setProperty("curCity", curCity);
				r_appUsgCnt = r_appUsgCnt +1;

				retrievedEntity.setProperty("appUsgCnt",r_appUsgCnt);

				
				if(!r_curAppUsgDate.equals(curDate))
				{
					retrievedEntity.setProperty("lastAppUsgDate",r_curAppUsgDate);
					retrievedEntity.setProperty("curAppUsgDate",curDate);
				}
				
				
				datastore.put(retrievedEntity);
				System.out.println("data - city and cnt updated");	

				ret_appUsgCnt=r_appUsgCnt;
			}
			else
			{
				System.out.println("curCity equals");

				r_appUsgCnt = r_appUsgCnt +1;
				retrievedEntity.setProperty("appUsgCnt",r_appUsgCnt);
				retrievedEntity.setProperty("curAppUsgDate",r_curAppUsgDate);
				
				System.out.println("gaecurdate "+r_curAppUsgDate);
				System.out.println("today date"+curDate);
				if(!r_curAppUsgDate.equals(curDate))
				{
					System.out.println("last date update");

					retrievedEntity.setProperty("lastAppUsgDate",r_curAppUsgDate);
					retrievedEntity.setProperty("curAppUsgDate",curDate);
				}
				
				
				datastore.put(retrievedEntity);	
				System.out.println("data - appUsgCnt updated");	
				ret_appUsgCnt=r_appUsgCnt;
			}
		}
		return ret_appUsgCnt;
		
	}
	
	
	public void saveUserPersonalMsg()
	{

		Entity retrievedEntity;
	

		retrievedEntity = retrieveUserDetailsEntity(userID);
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		if (retrievedEntity!=null)
		{
		  	retrievedEntity.setProperty("userMsg", userMsg);
		}

		
		datastore.put(retrievedEntity);
	
		System.out.println("msg added/updated");	
		
	}
	
	public Entity retrieveUserDetailsEntity(String userID)  
	{

		Entity UserDetailsEntity;
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

	 	Key userKey = KeyFactory.createKey("UserDetailsEntity", userID);
		try 
		{
			UserDetailsEntity = datastore.get(userKey);
			System.out.println("Data found");

		} 
		catch (EntityNotFoundException e) 
		{
			UserDetailsEntity = null;
			System.out.println("Data not found");

		}
	
	
		return UserDetailsEntity;
	}

	public List<String> getUniqLocns()  
	{
		List<String> l_curCity = new ArrayList();


		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query("UserDetailsEntity");
		q.addProjection(new PropertyProjection("curCity", String.class));
		q.setDistinct(true);
		q.addSort("curCity");

		List<Entity> results = datastore.prepare(q)
                .asList(FetchOptions.Builder.withDefaults());
	
		for (Entity e_curCity : results) 
		{
			String r_curCity = (String) e_curCity.getProperty("curCity");
			l_curCity.add(r_curCity);
		}
		
		return l_curCity;
	}
	
	public String getUserPersonalMsg() 
	{
		String r_userMsg; Entity retrievedEntity;

		retrievedEntity = retrieveUserDetailsEntity(userID);


		r_userMsg = (String) retrievedEntity.getProperty("userMsg");

		if(r_userMsg!=null)
		{	
			return r_userMsg;
		}
		else
		{
			return "";
		}
		
	}	
	
	public List<HashMap<String,String>> findAppUsrsInACity(String givenLocation)  
	{
			    
		List<HashMap<String,String>> lm_appUser = new ArrayList<HashMap<String,String>>();
		String r_locn;

		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query("UserDetailsEntity");


		q.addSort("userName");

		List<Entity> results = datastore.prepare(q).asList(FetchOptions.Builder.withDefaults());

		for (Entity e_appUser : results) 
		{

			givenLocation = givenLocation.toLowerCase();
			r_locn = (String)e_appUser.getProperty("curCity");
			r_locn = r_locn.toLowerCase();

			if(r_locn.contains(givenLocation))
			{
				HashMap<String,String> m_appUser = new HashMap();

				m_appUser.put("userID",(String) e_appUser.getProperty("userID"));

				m_appUser.put("userName",(String) e_appUser.getProperty("userName"));
				m_appUser.put("curCity",(String) e_appUser.getProperty("curCity"));
				m_appUser.put("userMsg",(String) e_appUser.getProperty("userMsg"));

				lm_appUser.add(m_appUser);
			
			}
	
	    	}
		return lm_appUser;

	}
	

}



var userID, accessToken;

var defMsgVal = "Enter your Location Here ";

var uniqCityList, gaeAppUsersList;

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
 			  data: { action: "update", userID: response.authResponse.userID, accessToken: response.authResponse.accessToken }
 			})
 			.done(function( msg ) {
 				//alert(msg);
 				
				var curUserInfo = msg.split(";"); // Delimiter is a string
				//alert("locn in script:"+curUserInfo[1]+";")
				if(curUserInfo[1]=="none")
				{
					alert("Reminder: Please update your current city info in FB profile ");
 			    }
 			});
 		

 		$.ajax({
			  type: "GET",
			  url: "chkCurUsr",
			  data: { action: "getUniqLocns", userID: response.authResponse.userID, accessToken: response.authResponse.accessToken }
			})
			.done(function(jsonCityList) {
				  uniqCityList =  $.parseJSON(jsonCityList)
					fillLocnList('dd_locnList');	

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

   
	function fillLocnList(strDDListID_Locn)
	{
		var locnList = document.getElementById(strDDListID_Locn);
		for (var i in uniqCityList) 
		{
		    var locnOption = document.createElement('option');
		    locnOption.innerHTML = uniqCityList[i];
		    locnOption.value = uniqCityList[i];
		    locnList.appendChild(locnOption);
		    
		}

	}
	
	function expandList(strDDListID_Locn)
	{
		var objDDList_Locn = document.getElementById(strDDListID_Locn);
		var t_locn = document.getElementById("txt_locn").value;

		if(t_locn == "" || t_locn == defMsgVal)
		{
			objDDList_Locn.options.length = 1;
			fillLocnList(strDDListID_Locn);
		}
		objDDList_Locn.size = objDDList_Locn.options.length;
	}

	function updateList(objTxtBox_Locn, strDDListID_Locn)
	{
		var objDDList_Locn = document.getElementById(strDDListID_Locn);
		objDDList_Locn.options.length = 1;

		t_locn = objTxtBox_Locn.value;
		t_locn = t_locn.toLowerCase().replace(/\s+/g, '');			

		var j;
		for(j=0;j< uniqCityList.length; j++)
		{
			var memLocn = uniqCityList[j];
			memLocn = memLocn.toLowerCase().replace(/\s+/g, '');	

			var re1 = new RegExp(t_locn,"i");
			var n1 = memLocn.search(re1);

			if(n1>=0)
			{
			    var locnOption = document.createElement('option');
			    locnOption.innerHTML = uniqCityList[j];
			    locnOption.value = uniqCityList[j];
			    objDDList_Locn.appendChild(locnOption);
			} 

		}
		expandList(strDDListID_Locn);

	}

	function deleteTableContents(objTable) 
	{

		for(var i = objTable.rows.length; i > 0;i--)
		{
			objTable.deleteRow(i -1);
		}

	}
	function sendMessage(userid)
	{
	
		FB.ui({
			method: 'send',
			link: 'http://spotyourbuddy.appspot.com/',
			to:userid,
	 
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
	
	function addAppUsersRow(objTable,name,location,msg,id) 
	{
		var t_name = "Name", t_location = "Location", t_msg="Msg to App Users";
 
		var row_cnt = objTable.rows.length;
				
		var row = objTable.insertRow(row_cnt);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);

		cell1.innerHTML = name;
		cell2.innerHTML = location;
		cell3.innerHTML = msg;
		cell4.innerHTML = id;

		if(name != t_name)
		{

			cell1.style.textDecoration= "underline";
		}

		if(name == t_name)
		{	
			cell1.style.fontWeight= "bold";
		}

		if(location == t_location)
		{	
			cell2.style.fontWeight= "bold";
		}

		if(msg == t_msg)
		{	
			cell3.style.fontWeight= "bold";
		}
		
		cell1.style.width = '400px';
		cell2.style.width = '400px';	
		cell3.style.width = '400px';	

		cell1.style.color = "#160a92";		
		cell4.style.display = "none";
		cell1.onclick = function () {  sendMessage(cell4.innerHTML); };

	}


	function addFrndsRow(objTable,name,location,id) 
	{
		var t_name = "Name", t_location = "Location";
 
		var row_cnt = objTable.rows.length;
				
		var row = objTable.insertRow(row_cnt);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);

		cell1.style.width = '400px';
		cell2.style.width = '400px';	
		
		cell1.innerHTML = name;
		cell2.innerHTML = location;
		cell3.innerHTML = id;

		if(name != t_name)
		{
			cell1.style.textDecoration= "underline";
		}

		if(name == t_name)
		{	
			cell1.style.fontWeight= "bold";
		}

		if(location == t_location)
		{	
			cell2.style.fontWeight= "bold";
		}
	

		cell1.style.color = "#160a92";		
		cell3.style.display = "none";
		cell1.onclick = function () {  sendMessage(cell3.innerHTML); };

	}


	
function findFriends(strFrndsTableID,strSuggestdFrndsTableID) 
{

    	var appUsrFoundFlg=0;
	var objTableFrnds = document.getElementById(strFrndsTableID);
	var objTableSugFrnds = document.getElementById(strSuggestdFrndsTableID);

	deleteTableContents(objTableFrnds);
 	
	var gn_locn = document.getElementById("txt_locn").value;

	if(gn_locn == "" || gn_locn == defMsgVal)
	{
		alert("Please provide the city name to start this search");
	}
	else
	{
		$.ajax({
 			  type: "GET",
 			  url: "findFriends1",
 			  data: { userID:userID, accessToken:accessToken, givenLocn:gn_locn}
 			})
 			.done(function( msg ) 
			{
				var frnds = msg.split("/"); // Delimiter is a string


				if(frnds.length==1)
				{    
					document.getElementById("d_table_frnds").style.display = 'none';

					document.getElementById("table_frnds").style.display = 'none';


				} 
				else if (frnds.length>1)
				{ 			  

					document.getElementById("d_table_frnds").style.display = "initial";

					document.getElementById("table_frnds").style.display = "initial";
					
					addFrndsRow(objTableFrnds, "Name","Location","ID");

					for (var i = 0; i < frnds.length-1; i++)
					{ 
						var frndDetails = frnds[i].split(";"); // Delimiter is a string
						addFrndsRow(objTableFrnds, frndDetails[1],frndDetails[2], frndDetails[0]);
	
					}
				}

	 			findInGAEDatastore(gn_locn, objTableFrnds, strSuggestdFrndsTableID);
					

  			});


	}

}

function findInGAEDatastore(gn_locn, objTableFrnds, strSuggestdFrndsTableID)
{
	var appUsrFoundFlg;
	$.ajax({
		  type: "GET",
		  url: "chkCurUsr",
		  data: { action: "findAppUsrsInACity",  locn:gn_locn }
		})
		.done(function(gaeAppUsers) 
		{

			gaeAppUsersList =  $.parseJSON(gaeAppUsers);
			appUsrFoundFlg=fillAppUsersFromGAE(objTableFrnds,strSuggestdFrndsTableID,gaeAppUsersList);
							

		});


}

function chkIsFrnd(frndID, objTableFrnds) 
{
	var k, foundInTableFlg=0;

	for(k=0;k<objTableFrnds.rows.length;k++)
	{
		if(objTableFrnds.rows[k].cells[2].innerHTML == frndID)
		{
			foundInTableFlg=1; break;
		}
	}
	return foundInTableFlg;
}

function fillAppUsersFromGAE(objTableFrnds,strSuggestdFrndsTableID,gaeAppUsersList)	
{
	var appUsrFoundFlg=0;
	var objTableSugFrnds = document.getElementById(strSuggestdFrndsTableID);
	deleteTableContents(objTableSugFrnds);

	if(objTableSugFrnds.rows.length==0)
	{

		document.getElementById("d_table_suggestdFrnds").style.display = "none";
	}


	for (var i=0;i<gaeAppUsersList.length; i++) 
	{



		if(gaeAppUsersList[i].userID!=userID) // excluding current user
		{
			var chkFrndFlg = chkIsFrnd(gaeAppUsersList[i].userID, objTableFrnds);
			if(chkFrndFlg == 0)
			{	  

				if(objTableSugFrnds.rows.length ==0)
				{
					document.getElementById("d_table_suggestdFrnds").style.display = "initial";													
					addAppUsersRow(objTableSugFrnds, "Name","Location","Msg to App Users","ID");
				}
				if(gaeAppUsersList[i].userMsg==undefined)
					gaeAppUsersList[i].userMsg = '';

				addAppUsersRow(objTableSugFrnds, gaeAppUsersList[i].userName,gaeAppUsersList[i].curCity,gaeAppUsersList[i].userMsg,gaeAppUsersList[i].userID);
				appUsrFoundFlg=1;
			}
		}

	}
				
	if(objTableSugFrnds.rows.length==0 && objTableFrnds.rows.length==0)
	{
		alert("None of your friends nor other App Users lives in this city");
	}
	else if(objTableFrnds.rows.length==0)
	{
		alert("None of your friends lives in this city. Please check other App Users who resides in this city");
	}
}




function ListToTextBox(objDDList_Locn, strTxtBoxID_Locn) 
{

        var objTxtBox_Locn =  	document.getElementById(strTxtBoxID_Locn);
	var selIndex = objDDList_Locn.selectedIndex;

	if(selIndex!=-1)
	{
		shrinkList(objDDList_Locn);
		objTxtBox_Locn.value = objDDList_Locn.options[selIndex].value;

	}	
	if(selIndex==0)
	{
		alert("Please use Tab key to access drop down list");
		objTxtBox_Locn.focus();
	}		

}

function shrinkList(objDDList_Locn)
{
	objDDList_Locn.size = 0;
}

function handleKeyPress(event, objDDList_Locn, strTxtBoxID_Locn) 
{

    var chCode = ('charCode' in event) ? event.charCode : event.keyCode;
    if(chCode == '13') //enter key
    {
	ListToTextBox(objDDList_Locn, strTxtBoxID_Locn); 
    }	
    
}


 



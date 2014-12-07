<div id="txt_list" style="position: relative;">


	<form>
    

	    <input name="txt_locn" type="text" maxlength="50" id="txt_locn" tabindex="2" value= "Enter your Location Here " 
		onfocus="delDefMsg(this)"  onblur="chkMsg(this)" oninput="updateList(this,'dd_locnList')" 		
		style="width: 242px; height:15px;  position: absolute; top: 0px; left: 250px; z-index: 2; " />

	    <select name="dd_locnList" id="dd_locnList" tabindex="3"
		onkeypress="handleKeyPress(event, this,'txt_locn');" onclick="ListToTextBox(this,'txt_locn');" 
		onfocus="expandList('dd_locnList')"  onblur="shrinkList(this)"
		style="position: absolute; top: 0px; left: 250px; z-index: 1; width: 265px;">

			<option value="       " disabled></option>

	    </select>

	     <input type="button" value="Find"  id="button_find"  tabindex="4" 
		Onclick="findFriends('table_frnds','table_suggestdFrnds');" 
		style="position: absolute; top: 0px; left: 650px; width: 240px;"/>
	
	</form>
</div>

<br><br>

<%@include file="frndsList.jsp" %>

<%@include file="appUsersList.jsp" %>



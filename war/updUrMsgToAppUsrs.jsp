<%@include file="header.jsp" %>

<script type = "text/javascript" src="JS_Files/usrMsgUpdScripts.js"></script>


<div id="d_updUrMsg">

	<br><br>

	<p><center><font face="purisa"  size="6" color="#160a92"><b>
		Provide a message about you / the services you offer
	</b></font></center></p>
	
	<br>

	<p><center><font face="purisa"  size="4" color="#160a92"><b>This will be useful if this app user is in need of any services offered by you or your organisation when he travels to the city where you are offering those services</b></font></center></p>

	<br><br>

	<div><center><font face="purisa"  size="3"><p id="d_prevMsg"></p></font></center></div>

	<br><br><br><br>

	<div id="d_updMsg">

		<form>
	    
		    <input name="t_userMsg" type="text" maxlength="50" id="t_userMsg" onfocus="delDefMsg(this)"  onblur="chkMsg(this)" tabindex="2" value= "Enter your new message Here " style="width: 242px; height:15px;  position: absolute; left: 250px; z-index: 2; " />


		    <input type="button" value="Save"  id="button_save"  onClick="saveUserMsg();"tabindex="3"
			style="position: absolute; left: 650px; width: 240px; "/>
	
		</form>
	</div>
    
<br><br>

</div>

<%@include file="footer.jsp" %>
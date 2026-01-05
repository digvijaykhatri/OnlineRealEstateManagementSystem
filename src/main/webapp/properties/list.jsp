<%@ page import="java.util.*,com.realestate.model.Property" %>
<html><body>
<%
List<Property> list = (List<Property>)request.getAttribute("list");
for(Property p:list){
%>
<h3><%=p.getTitle()%></h3>
<p><%=p.getLocation()%> - ₹<%=p.getPrice()%></p>
<p><%=p.getDescription()%></p>
<hr>
<% } %>
</body></html>
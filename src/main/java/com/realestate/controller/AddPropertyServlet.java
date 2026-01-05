package com.realestate.controller;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import com.realestate.model.Property;
import com.realestate.dao.PropertyDAO;
public class AddPropertyServlet extends HttpServlet {
    protected void doPost(HttpServletRequest r, HttpServletResponse s) throws IOException {
        try{
            Property p = new Property();
            p.setTitle(r.getParameter("title"));
            p.setLocation(r.getParameter("location"));
            p.setPrice(Double.parseDouble(r.getParameter("price")));
            p.setDescription(r.getParameter("description"));
            PropertyDAO.addProperty(p);
            s.sendRedirect("admin/dashboard.jsp");
        }catch(Exception e){}
    }
}
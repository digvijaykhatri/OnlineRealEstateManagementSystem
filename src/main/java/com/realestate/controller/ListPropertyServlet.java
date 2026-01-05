package com.realestate.controller;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;
import com.realestate.dao.PropertyDAO;
import com.realestate.model.Property;
public class ListPropertyServlet extends HttpServlet {
    protected void doGet(HttpServletRequest r, HttpServletResponse s) throws IOException {
        try{
            List<Property> list = PropertyDAO.getAll();
            r.setAttribute("list", list);
            r.getRequestDispatcher("properties/list.jsp").forward(r, s);
        }catch(Exception e){}
    }
}
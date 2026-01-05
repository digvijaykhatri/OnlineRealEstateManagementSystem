package com.realestate.dao;
import java.sql.*;
import java.util.*;
import com.realestate.model.Property;
public class PropertyDAO {
    public static void addProperty(Property p) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "insert into property(title,location,price,description) values(?,?,?,?)");
        ps.setString(1, p.getTitle());
        ps.setString(2, p.getLocation());
        ps.setDouble(3, p.getPrice());
        ps.setString(4, p.getDescription());
        ps.executeUpdate();
        con.close();
    }
    public static List<Property> getAll() throws Exception {
        List<Property> list = new ArrayList<>();
        Connection con = DBConnection.getConnection();
        ResultSet rs = con.createStatement().executeQuery("select * from property");
        while(rs.next()){
            Property p = new Property();
            p.setId(rs.getInt("id"));
            p.setTitle(rs.getString("title"));
            p.setLocation(rs.getString("location"));
            p.setPrice(rs.getDouble("price"));
            p.setDescription(rs.getString("description"));
            list.add(p);
        }
        con.close();
        return list;
    }
}
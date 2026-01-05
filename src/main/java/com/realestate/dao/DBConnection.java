package com.realestate.dao;
import java.sql.*;
import com.realestate.util.DBConfig;
public class DBConnection {
    public static Connection getConnection() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(DBConfig.URL, DBConfig.USER, DBConfig.PASS);
    }
}
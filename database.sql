create database realestate_db;
use realestate_db;
create table property(
id int primary key auto_increment,
title varchar(100),
location varchar(100),
price double,
description text
);
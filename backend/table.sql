create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(250),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insert into user(name, contactNumber, email, password, status, role) values('Admin', '517832692', 'nikitos.shorick@gmail.com', 'Nikitosicheck2006.', 'true', 'admin');

create table category(
    id int not null AUTO_INCREMENT,
    name varchar(255) not null,
    primary key(id)
);

create table product(
    id int not null AUTO_INCREMENT,
    name varchar(255) not null,
    categoryId int not null,
    description varchar(255),
    price int,
    status varchar(20),
    primary key(id),
    foreign key(categoryId) references category(id)
);

create table bill(
    id int not null AUTO_INCREMENT,
    uuid varchar(255) not null,
    name varchar(255) not null,
    email varchar(255) not null,
    contactNumber varchar(20) not null,
    paymentMethod varchar(50) not null,
    total int not null,
    productDetails json default null,
    createdBy varchar(255) not null,
    primary key (id)
);

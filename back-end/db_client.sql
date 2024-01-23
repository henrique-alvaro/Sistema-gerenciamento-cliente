create table cliente (
	cod_cliente int primary key,
	nome varchar(45) not null ,
	email varchar(30) not null unique,
	telefone int not null
);
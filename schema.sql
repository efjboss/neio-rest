drop table if exists `templates`;
create table `templates` (
    `name` varchar(64) primary key,
    `data` text not null
);

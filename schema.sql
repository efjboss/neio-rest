drop table if exists `templates`;
create table `templates` (
    `name` varchar(64) primary key,
    `mode` varchar(32) not null default "form",
    `data` text not null
);

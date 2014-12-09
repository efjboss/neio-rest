#!/usr/bin/env sh
virtualenv env
source env/bin/activate
pip install -r reqs
touch db.sqlite
sqlite3 db.sqlite < schema.sql

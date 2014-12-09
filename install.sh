#!/usr/bin/env sh
virtualenv env
pip install -r reqs
touch db.sqlite
sqlite3 db.sqlite < schema.sql

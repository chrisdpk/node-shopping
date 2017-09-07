# node-shopping

## What this is

This is a beginners project in NodeJS.

``` node-shopping ``` is supposed to be a http server (preferably hosted locally) to save a shopping list to a local database.

Future work includes the ability to send the shopping list via e-mail to a specified e-mail.

I started this projects to learn and understand basic NodeJS and Javascript.

I do realize this is neither rocket science nor beautifully designed code. As mentioned this was done for training purposes (and also because I needed a form of shopping list and was tired of sticky notes).

## Requirements

* ```node-sqlite3``` (for saving list entries in a local sqlite db)
* ```formidable``` (for parsing the input field)
* ```html-entities``` (for escaping malicious entities so we prevent stored XSS)
* write access to cwd (to create and edit the sqlite db)


## To-do:
* Upgrade style (in progress)
* Mail list functionality

![Screenshot](https://raw.githubusercontent.com/chrisyou/node-shopping/master/docs/alpha.png)

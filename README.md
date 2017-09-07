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
* Mail list functionality
* Authentication
* HTTPS
* Upgrade style (in progress)
* move db functions to external module
* ...
* Icons

![Screenshot](https://raw.githubusercontent.com/chrisyou/node-shopping/master/docs/ui.png)

## Installation (Linux)

 1. Make sure you have [node installed alongside npm](https://nodejs.org/en/download/).
 2. ```npm install npm@latest -g``` to update npm
 3. ```git clone https://github.com/chrisyou/node-shopping.git && cd node-shopping``` to download this repository into node-shopping
 4. ```npm install``` to download and install dependencies for this project only
 5. ```npm start``` to start the server
 6. Press ```CTRL+C``` to quit at any point

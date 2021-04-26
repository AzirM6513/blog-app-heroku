# Blog App

## Table of Contents
+ [About](#about)
+ [Getting Started](#getting_started)
+ [Usage](#usage)
+ [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>
Blog App used to teach me fundamental concepts in web development.

## Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The only Prerequisite is Node.js

Install using brew (Mac / Linux)
```
brew install node
```

Install on Debian based distros
```
apt install node
```

### Installing

Clone repo via HTTPS
```
git clone https://github.com/AzirM6513/blog-app-heroku.git
```

OR

Clone repo via SSH
```
git clone git@github.com:AzirM6513/blog-app-heroku.git
```

Install project dependencies (inside repo folder)
```
npm install
```

Setup local .env values
1. PORT
2. SECRET
3. MONGODB_URI

For free [MongoDB cluster](https://www.mongodb.com/2)

For seperate repo of front end for testing or forks go to [frontend repo](https://github.com/AzirM6513/Blog-app)

## Usage <a name = "usage"></a>
Login to application using default values given on startup.
Login is persisntant as token info is saved locally.
Click create tab to create a new post.
Click the respective like or dislike buttons to add likes or dislikes.
Click Blog title to get more info.

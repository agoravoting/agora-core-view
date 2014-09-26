# agora-core-view

Agora-core-view contais the whole interface for agora v3, and it's developed
with AngularJS.

# Installation

You need to install node.js. This project has been tested to work with node.js
v0.10.31. You can install it with your favourite package manager (apt-get for
example) or install it from the web and follow the instructions in the README 
(note, it requires gcc-g++ and other dependencies):

    wget http://nodejs.org/dist/v0.10.31/node-v0.10.31.tar.gz
    tar zxf node-v0.10.31.tar.gz
    cd node-v0.10.31
    ./configure && make && sudo make install

After that, you can install the agora-core-view javascript dependencies:

    npm install && bower install

Once that's done, you have 3 simple Grunt commands available:

    grunt serve   #This will run a development server with watch & livereload enabled.
    grunt test    #Run local unit tests.
    grunt build   #Places a fully optimized (minified, concatenated, and more) in /dist

# Generator Note

Agora core view repository, using angular. It's generated using 
https://github.com/cgross/generator-cg-angular , take a look at the README.md 
file in there for more information about the structure and how to create new
angular services, modules, directives, etc.

# Testing (E2E)

First, make sure you environment is up-to-date. The following packages are needed
    protractor
    grunt-protractor-runner

To run a test, type in
    protractor e2e.conf.js

To add more tests, edit the config file e2e.conf.js

Note: ATM, Protractor isn't completely integrated with Grunt, so grunt test will fail.



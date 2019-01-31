#!/bin/bash
sudo service mongod start
npm install
nohup npm run startapi & disown
nohup npm run startangularprod & disown
nohup npm run starthttpredirectprod & disown
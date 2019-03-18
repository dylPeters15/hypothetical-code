#!/bin/bash
cd /hypothetical-code/hypothetical-code
sudo service mongod start
npm install
nohup npm run startapi & disown
nohup npm run startangularprod & disown
nohup npm run starthttpredirectprod & disown
cd -
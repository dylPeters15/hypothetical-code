sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
sudo certbot certonly
#enter 1 - temporary webserver
#enter domain name - vcm-8205.vm.duke.edu
#Shutdown certinstall.js
mkdir ssl -p
#replace the domain name below with yours:
sudo cp /etc/letsencrypt/live/vcm-8205.vm.duke.edu/privkey.pem ssl/privkey.pem
sudo cp /etc/letsencrypt/live/vcm-8205.vm.duke.edu/fullchain.pem ssl/fullchain.pem

#To run with ssl:
#node src/server.js
#sudo ng serve --host vcm-8205.vm.duke.edu --port 443 --disable-host-check --ssl true --ssl-key ssl/privkey.pem --ssl-cert ssl/fullchain.pem
#navigate to https://<domain>
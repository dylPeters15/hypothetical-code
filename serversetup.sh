sudo apt update
#Install git - tutorial from https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/
sudo apt-get install git
git --version
#install node and npm - tutorial from https://github.com/nodesource/distributions/blob/master/README.md#debinstall
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
#install compilers
sudo apt-get install gcc g++ make
#install mongodb - tutorial from https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
mongod --version
mongo -version

#to start Mongodb:
#sudo service mongod start
#to stop Mongodb:
#sudo service mongod stop
#to restart Mongodb:
#sudo service mongod restart
#to open a Mongodb shell:
#mongo
npm install -g @angular/cli
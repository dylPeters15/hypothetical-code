#from https://help.ubuntu.com/community/How%20to%20Create%20a%20Network%20Share%20Via%20Samba%20Via%20CLI%20%28Command-line%20interface/Linux%20Terminal%29%20-%20Uncomplicated%2C%20Simple%20and%20Brief%20Way%21
sudo apt-get update
sudo apt-get install samba
sudo smbpasswd -a dlp22
mkdir /home/dlp22/sambashare
sudo cp /etc/samba/smb.conf ~
sudo nano /etc/samba/smb.conf
#add this to the end of the file (uncommented)
#[sambashare]
#path = /home/dlp22/sambashare
#valid users = dlp22
#read only = no
sudo service smbd restart
testparm

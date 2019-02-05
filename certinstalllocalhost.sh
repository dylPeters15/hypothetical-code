#RUn this:
openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem
#Answer the questions
# Country Name (2 letter code) [AU]:US
# State or Province Name (full name) [Some-State]:North Carolina
# Locality Name (eg, city) []:Durham
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:Hypothetical Code
# Organizational Unit Name (eg, section) []:Hypothetical Code
# Common Name (e.g. server FQDN or YOUR name) []:Hypothetical Code
# Email Address []:<your email>
mkdir ssl -p
mv certificate.pem ssl/fullchain.pem
mv key.pem ssl/privkey.pem

#To run with ssl:
#node src/server.js
#sudo ng serve --port 443 --disable-host-check --ssl true --ssl-key ssl/privkey.pem --ssl-cert ssl/fullchain.pem
#Navigate to https://localhost
#You will need to accept the certificate
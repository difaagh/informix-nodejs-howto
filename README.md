# informix-nodejs-howto

nodejs  Access informix database ( CentOS,Docker)

#Description
This is just a demo/howto process to connect nodejs to informix db.


OS = Linux MachineName 3.10.0-862.2.3.el7.x86_64

#Docker Install

sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate  docker-selinux docker-engine-selinux  docker-engine
sudo yum install -y yum-utils device-mapper-persistent-data  lvm2
sudo yum-config-manager --add-repo  https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce


#Install Nodejs

sudo yum install gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
sudo yum install -y nodejs
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum install yarn

#Install Informix
I am using docker informix image here

docker run -it --name iif_developer_edition --privileged -p 9088:9088 -p 9089:9089 -p 27017:27017 -p 27018:27018 -p 27883:27883 -e LICENSE=accept ibmcom/informix-developer-database:latest


# Download and install  Install Informix CSDK 
(Assume you downloaded CSDK to /tpm folder)
cd /tmp/
tar -xf icsdk_4.10.FC9_LIN_x86_64.tar 
./installclientsdk 
(proceed with default values)


#CentOS Configuration
1. .bash_profile
----------------------

export LD_LIBRARY_PATH=/opt/IBM/informix/lib:/opt/IBM/informix/lib/esql:/opt/IBM/informix/lib/tools:/opt/IBM/informix/lib/cli
export INFORMIXDIR=/opt/IBM/informix
export INFORMIXSQLHOSTS=/usr/local/etc/sqlhosts
export PATH=$PATH:$HOME/bin:$LD_LIBRARY_PATH:/opt/IBM/informix/bin:/opt/IBM/informix/bin
export INFORMIXSERVER=informix
-----------------------

2. hosts
Add informix instance details to hosts file.
you can login to infomrix instance via

>docker exec -it iif_developer_edition bash
>env

Add hosts entry ,indicating informix instance details

-----------------------
#3936192eb89a -->informix docker host name (docker ps will show these )
# 172.17.0.2  -->ip address of informix instance

172.17.0.2 3936192eb89a

------------------------

3. Create '/usr/local/etc/sqlhosts' file

>cat /usr/local/etc/sqlhosts

informix        onsoctcp        3936192eb89a         9088
informix_dr     drsoctcp        3936192eb89a         9089




#Nodejs Sample Project

mkdir /sorce
cd /sorce
npm init 
#fill accordingly

Once done my package.json like below

{
  "name": "informix-nodejs-howto",
  "version": "1.0.0",
  "description": "NodeJS informix Connectivity Demo",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jayaruvan/informix-nodejs-howto.git"
  },
  "keywords": [
    "informix",
    "ceb",
    "centos",
    "docker",
    "nodejs",
    "jayaruvan"
  ],
  "author": "Jayaruvan Dissanayake",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/jayaruvan/informix-nodejs-howto/issues"
  },
  "homepage": "https://github.com/jayaruvan/informix-nodejs-howto#readme"
}


#I'll create index.js with basic settings
#index.js
---
'use strict'
var Informx=require('/usr/lib/node_modules/informix').Informix;

var informix = new Informx({
  database : 'iot@informix',
  username : 'informix',
  password : 'in4mix'
});
 
informix.on('error',function(err){
	console.log('[event:error]',err);
});

informix
  .query( "select tabname from systables where tabname like 'sys%auth';" )
  .then( function ( cursor ) {
    return cursor.fetchAll( { close : true } );
  } )
  .then( function ( results ) {
    console.log( 'results:', results );
  } )
  .catch( function ( err ) {
    console.log( err );
  } );	
  
-----

#runit
node index.js

You shouls see output similar to below

results: [ [ 'systabauth' ],
  [ 'syscolauth' ],
  [ 'sysprocauth' ],
  [ 'sysfragauth' ],
  [ 'sysroleauth' ],
  [ 'sysxtdtypeauth' ],
  [ 'syslangauth' ],
  [ 'sysseclabelauth' ],
  [ 'syssurrogateauth' ] ]
  
  
:) done..

  
  





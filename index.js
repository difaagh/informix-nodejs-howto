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



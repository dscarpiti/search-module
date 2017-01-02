var searchbar = {
	config : {
		url : 'js/tags.json' ,
		event : 'change' ,
		tagAttribute : 'data-tag' ,
		elements : {
			bar : '[data-search="bar"]' ,
			items : '[data-item]' ,
			unfind : '[data-unfind]' , 
			keyMatches : '[data-match="keywords"]' ,
			matchesContainer : '[data-match="container"]' ,
			clearResults : '[data-clear="results"]'
		} ,
		itemsFind : 0 ,
		itemsFindTags : [] ,
		notKeywords : [ 'de' , 'da' , 'do' , 'das' , 'dos' , 'com' , 'sem' , 'para' , 'em' , 'no' , 'na' , 'nos' , 'nas' , 'e' , 'ou' ]
	} ,
	
	load : function( callback ){
		
		var ajax = new XMLHttpRequest();
		
		ajax.onreadystatechange = function() {
			if ( this.readyState == 4 && this.status == 200 ) {
				var dataRES = JSON.parse( this.responseText );
				dataRES = dataRES.items;
				for ( var item in dataRES ){
					document.querySelector( '[data-item="'+ item +'"]' ).dataset.tag = dataRES[ item ].join(';');
				}
				
				if ( callback ){
					callback();
				}
			}
		};
		
		ajax.open( "GET" , searchbar.config.url , true );
		ajax.send();
	} ,
	
	
	error : {
		show : function(){
			document.querySelector( searchbar.config.elements.bar ).className += " has-error";
			document.querySelector( searchbar.config.elements.unfind ).style.display = '';
		} ,
		hide : function(){
			document.querySelector( searchbar.config.elements.bar ).className = document.querySelector( searchbar.config.elements.bar ).className.replace( "has-error" , "" );
			document.querySelector( searchbar.config.elements.unfind ).style.display = 'none';
		}
	} ,
	
	tags : {
		show : function(){
			if( searchbar.config.itemsFindTags.length ){
				document.querySelector( searchbar.config.elements.matchesContainer ).style.display = '';
				var tags = searchbar.config.itemsFindTags.join( ' , ' );
				document.querySelector( searchbar.config.elements.keyMatches ).innerHTML = tags;
			}
		} , 
		hide : function(){
			document.querySelector( searchbar.config.elements.matchesContainer ).style.display = 'none';
		}
	} ,
	
	form : {
		clear : function(){
			document.querySelector( searchbar.config.elements.bar ).value = "";
			searchbar.tags.show();
		} , 
		trigger : function(){
			var event = document.createEvent( 'HTMLEvents' );
			event.initEvent( 'change' , true , false );
			document.querySelector( searchbar.config.elements.bar ).dispatchEvent( event );
		}
	} ,

	init : function(){
		
		document.querySelector( searchbar.config.elements.clearResults ).addEventListener( 'click' , function(){
			searchbar.config.itemsFind = 0;
			searchbar.form.clear();
			searchbar.error.hide();
			searchbar.config.itemsFindTags = [];
			searchbar.form.trigger();
			searchbar.tags.hide();
		});
		
		document.querySelector( searchbar.config.elements.bar ).addEventListener( searchbar.config.event , function( e ){
			var searchString = this.value.trim().toLowerCase().split( " " );

			var itemSearch = document.querySelectorAll( searchbar.config.elements.items );
			var qtd = itemSearch.length;
			searchbar.config.itemsFindTags = [];
			
			
			for (var i = 0; i < qtd; i++) {
				var tag = itemSearch[ i ].getAttribute( searchbar.config.tagAttribute ).toString().toLowerCase();
				var match = false;
				
				for ( var k in searchString ){
					if( !searchbar.config.notKeywords.includes( searchString[ k ] ) ){
						match = match || tag.includes( searchString[ k ] );
						if ( tag.includes( searchString[ k ] ) && !searchbar.config.itemsFindTags.includes( searchString[ k ] ) && searchString[ k ] ){
							searchbar.config.itemsFindTags.push( searchString[ k ] );
						}
					}
				}
				
				if( match ){
					itemSearch[ i ].style.display = '';
					searchbar.config.itemsFind += 1;
				}
				else{
					itemSearch[ i ].style.display = 'none';
				}
			}
			
			if ( !searchbar.config.itemsFind ){
				searchbar.tags.hide();
				searchbar.error.show();
				
				setTimeout( function(){
					
					searchbar.form.clear();
					searchbar.error.hide();
					searchbar.form.trigger();
					
				} , 3000 );
			}
			else {
				searchbar.form.clear();
				searchbar.error.hide();
			}
			
			searchbar.config.itemsFind = 0;
			
		});
		
		console.log( 'searchbar: started' );
	}
};

searchbar.load( searchbar.init );
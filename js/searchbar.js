var searchbar = {
	config : {
		url : 'js/searchbar.config.json' ,
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
		notKeywords : []
	} ,
	
	load : function( callback ){
		
		var ajax = new XMLHttpRequest();
		
		ajax.onreadystatechange = function() {
			if ( this.readyState == 4 && this.status == 200 ) {
				var dataRES = JSON.parse( this.responseText );
				items = dataRES.items;
				searchbar.config.notKeywords = dataRES.notKeywords;
				for ( var item in items ){
					document.querySelector( '[data-item="'+ item +'"]' ).dataset.tag = items[ item ].join(';');
				}
				
				if ( callback ){
					callback();
				}
			}
		};
		
		ajax.open( "GET" , searchbar.config.url , true );
		ajax.send();
	} ,
	
	queryElements : function(){
		searchbar.config.elements.bar = document.querySelector( searchbar.config.elements.bar );
		searchbar.config.elements.unfind = document.querySelector( searchbar.config.elements.unfind );
		searchbar.config.elements.keyMatches = document.querySelector( searchbar.config.elements.keyMatches );
		searchbar.config.elements.matchesContainer = document.querySelector( searchbar.config.elements.matchesContainer );
		searchbar.config.elements.clearResults = document.querySelector( searchbar.config.elements.clearResults );
		searchbar.config.elements.items = document.querySelectorAll( searchbar.config.elements.items );
	} ,
	
	
	error : {
		show : function(){
			searchbar.config.elements.bar.className += " has-error";
			searchbar.config.elements.unfind.style.display = '';
		} ,
		hide : function(){
			searchbar.config.elements.bar.className = searchbar.config.elements.bar.className.replace( "has-error" , "" );
			searchbar.config.elements.unfind.style.display = 'none';
		}
	} ,
	
	tags : {
		show : function(){
			if( searchbar.config.itemsFindTags.length ){
				searchbar.config.elements.matchesContainer.style.display = '';
				searchbar.config.elements.keyMatches.innerHTML = searchbar.config.itemsFindTags.join( ' , ' );
			}
		} , 
		hide : function(){
			searchbar.config.elements.matchesContainer.style.display = 'none';
		}
	} ,
	
	form : {
		clear : function(){
			searchbar.config.elements.bar.value = "";
			searchbar.tags.show();
		} , 
		trigger : function(){
			var event = document.createEvent( 'HTMLEvents' );
			event.initEvent( 'change' , true , false );
			searchbar.config.elements.bar.dispatchEvent( event );
		}
	} ,

	init : function(){
		
		searchbar.queryElements();
		
		searchbar.config.elements.clearResults.addEventListener( 'click' , function(){
			searchbar.config.itemsFind = 0;
			searchbar.form.clear();
			searchbar.error.hide();
			searchbar.config.itemsFindTags = [];
			searchbar.form.trigger();
			searchbar.tags.hide();
		});
		
		searchbar.config.elements.bar.addEventListener( searchbar.config.event , function( e ){
			var searchString = this.value.trim().toLowerCase().split( " " );

			var qtd = searchbar.config.elements.items.length;
			searchbar.config.itemsFindTags = [];
			
			
			for (var i = 0; i < qtd; i++) {
				var tag = searchbar.config.elements.items[ i ].getAttribute( searchbar.config.tagAttribute ).toString().toLowerCase();
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
					searchbar.config.elements.items[ i ].style.display = '';
					searchbar.config.itemsFind += 1;
				}
				else{
					searchbar.config.elements.items[ i ].style.display = 'none';
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
	}
};

searchbar.load( searchbar.init );
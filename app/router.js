$(document).ready(function(){

// Router
	App.Router = Backbone.Router.extend({

	    routes: {
	    	'': 'userCheck',
	        'home': 'home',
	        'login' : 'login',
	        'logout' : 'logout',
	        'signup': 'signup',
	        'book/edit/:id': 'edit',
	        'book/timeline/:id': 'timeline',
	        'book/settings/:id': 'bookSettings',
	        'purchases': 'purchases',
	        'create': 'create',
	        'profile': 'profile',
	        'friends': 'friends',
	        'settings': 'settings'
	    },

	    userCheck: function()
	    {
	    	if(!App.user)
	    	{
	    		console.log("no user..");
	    		App.router.navigate("login", {trigger: true, replace: true});
	    	}
	    	else
	    	{
	    		App.router.navigate("home", {trigger: true, replace: true});
	    		$('.login').remove();
	    		console.log("Yay, user..");
	    	}
	    },

	    home: function()
	    {

	    	App.Helpers.loggedIn();
			    	
	    	App.collection = new App.Collections.Scrapbooks;
			App.collection.query = new Parse.Query(App.Models.Scrapbook);
			App.collection.query.equalTo("authors", App.user.id);
			App.collection.fetch({
			  success: function(collection)
			  {

					App.collectionView = new App.CollectionViews.Scrapbooks({ collection: App.collection });
					$('#content').html($('#template-home').html());
					$('.home').append(App.collectionView.render().el);
					$('.cover').height($('.cover').width());

			        $('.scrapbooks').width(function (){
			            return ($('.scrapbook').length * 360);
			        });


			  },
			  error: function(collection, error)
			  {
			    // The collection could not be retrieved.
			  }
			});

	       
	    },

	    signup: function(){
	        var signupView = new App.Views.Signup;
	        $('#content').append(signupView.render().el);
	        $('.login').remove();
	    },

	    login: function(){
    		var loginView = new App.Views.Login;
        	$('#content').append(loginView.render().el);
        	$('.signup').remove();
	    	
	    },

	    logout: function(){
	        Parse.User.logOut();
	        App.user = null;
	        App.router.navigate("", {trigger: true, replace: true});
	        
	    },

	    edit: function(id){
	        App.Helpers.loggedIn();

	        App.pageCollection = new App.Collections.Pages;
			App.pageCollection.query = new Parse.Query(App.Models.Page);
			App.pageCollection.fetch({
			  success: function(collection)
			  {
			  		console.log("test")
			  		console.log(collection)
					App.collectionPageView = new App.CollectionViews.Pages({ collection: App.pageCollection });
					$('.body').html(App.collectionPageView.render().el);
					App.collectionPageView.setBookSizes();
					$('body').append("<div class='modal'><h1>Select what to fill in</h1><div class='scroll'><div class='content'><a class='btn modalCameraLive'>Take a photo from the phones camera</a><a class='btn modalCameraSaved'>Select a photo from the gallery</a><textarea class='textarea' ></textarea><a class='btn modalCameraSaved'>Use text from text box</a></div></div>");
					setTimeout(function(){
						$('.modal').addClass('open');
					}, 1000)
					$('.login').remove();

					$('.modalCameraLive').click(function(){
						navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
						    destinationType: Camera.DestinationType.DATA_URL,
						    encodingType: Camera.EncodingType.JPEG,
						     targetWidth: 300,
						     targetHeight: 300
						 }); 

						function onSuccess(imageData) {
						    


							   var serverUrl = 'https://api.parse.com/1/files/test.jpeg';

							   $.ajax({
							      type: "POST",
							      beforeSend: function(request) {
							         request.setRequestHeader("X-Parse-Application-Id", 'pcXO4gKtiFSCQ6CksNS039l6gQJIxqLEqnGQi9St');
							         request.setRequestHeader("X-Parse-REST-API-Key", 'aqEr2QdsizZIUyZZfg57tLY60xTDvgFYn2CBuiZX');
							         request.setRequestHeader("Content-Type", "image/jpeg");
							      },
							      url: serverUrl,
							      data: imageData,
							      processData: false,
							      contentType: false,
							      success: function(data) {

							         // save result from Parse local storage, so we can use it later
							         localStorage.setItem('parse_file_name', data.name);
							         localStorage.setItem('parse_url', data.url);
							         console.log(data)
							         $('.modal').removeClass('open');
							         data.url
							         // OPTIONAL: add service to save file name/URL to a list
							      },
							      error: function(data) {
							         var obj = jQuery.parseJSON(data);
							         alert(obj.error);
							      }
							   });


						}

						function onFail(message) {
						    alert('Failed because: ' + message);
						}
					});

					$('.modalCameraSaved').click(function(){
						navigator.camera.getPicture(onSuccess, onFail, { 
						    destinationType: Camera.DestinationType.DATA_URL,
						     sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM, 
						     encodingType: Camera.EncodingType.JPEG,
						     targetWidth: 100,
						     targetHeight: 100
						 }); 

						function onSuccess(imageData) {

							   var serverUrl = 'https://api.parse.com/1/files/test.jpg';

							   $.ajax({
							      type: "POST",
							      beforeSend: function(request) {
							         request.setRequestHeader("X-Parse-Application-Id", 'pcXO4gKtiFSCQ6CksNS039l6gQJIxqLEqnGQi9St');
							         request.setRequestHeader("X-Parse-REST-API-Key", 'aqEr2QdsizZIUyZZfg57tLY60xTDvgFYn2CBuiZX');
							         request.setRequestHeader("Content-Type", "image/jpeg");
							      },
							      url: serverUrl,
							      data: imageData,
							      processData: false,
							      contentType: false,
							      success: function(data) {

							         // save result from Parse local storage, so we can use it later
							         localStorage.setItem('parse_file_name', data.name);
							         localStorage.setItem('parse_url', data.url);
							         console.log(data);

							        var Page = Parse.Object.extend("Pages");
									var query = new Parse.Query(Page);
									query.get("aJZSiBAJGH", {
									  success: function(obj) {
									    // The object was retrieved successfully.

									    var content = obj.get('content');
									    content.blocks[2].content = data.url;
									    obj.set('content', content)
									    obj.save();
									    alert("done!")
									  },
									  error: function(object, error) {
									    // The object was not retrieved successfully.
									    // error is a Parse.Error with an error code and description.
									    alert(error)
									  }
									});


							         
							         $('.modal').removeClass('open');
							         // OPTIONAL: add service to save file name/URL to a list
							      },
							      error: function(data) {
							         var obj = jQuery.parseJSON(data);
							         alert(obj.error);
							      }
							   });


						    console.log(imageData);
						}

						function onFail(message) {
						    alert('Failed because: ' + message);
						}
					})

			  },
			  error: function(collection, error)
			  {
			    // The collection could not be retrieved.
			  }
			});
	    },

	    timeline: function(id){
	    	App.Helpers.loggedIn();
	        $('.body').html($("#template-book-timeline").html());
	        //closeMenu();

	    },

	    bookSettings: function(id){
	        App.Helpers.loggedIn();
	        $('.body').html($("#template-book-settings").html());
	        //closeMenu();

	    },

	    create:  function(){
	        App.Helpers.loggedIn();
			var createView = new App.Views.CreateScrapbook;
	        $('.body').html(createView.render().el);
			//closeMenu();
	       
	    },

	    purchases: function(id){
	        App.Helpers.loggedIn();
			$('.body').html($("#template-purchases").html());
			//closeMenu();

	    },

	    profile: function(){
	    	App.Helpers.loggedIn();
			var profileView = new App.Views.Profile;
        	$('.body').html(profileView.render().el);
        	profileView.populate();
			//closeMenu();

	    },

	    friends: function(){
	    	App.Helpers.loggedIn();
			$('.body').html($("#template-friends").html());
			//closeMenu();

	    },

	    settings:  function(){
	    	App.Helpers.loggedIn();
			$('.body').html($("#template-settings").html());
			//closeMenu();

	    },

	})
});
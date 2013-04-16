$(document).ready(function(){

	Scrapbook = new Backbone.Marionette.Application();

	// Namespacing
	window.App = {

	    Models: {},
	    Collections: {},
	    CollectionViews: {},
	    Views: {},
	    Router: {},
	    Helpers: {},
	};

	// Initialize Parse with your Parse application javascript keys
	Parse.initialize("pcXO4gKtiFSCQ6CksNS039l6gQJIxqLEqnGQi9St", "8gT14KCir0WVKs80GMbjGERJZ9F4HctSiD1WVpRY");

	// return the logged in user or false if not logged in
	App.Helpers.getCurrentUser = function()
	{
		if(typeof App.user != 'undefined')
		{
			return App.user
		}
		else
		{
			return false;
		}
	}

	// check to see if we are logged in..
	App.Helpers.loggedIn = function()
	{
		$('.login').remove();
		if(typeof App.user != 'undefined')
		{
			return true
		}
		else
		{
			App.router.navigate("", {trigger: true, replace: true});
			return false;
		}
	}

    App.Helpers.setHeights = function()
    {
        setInterval(function(){
            $('.body').height($(window).height() - 43);
        //$('#menuWrapper').height($(window).height());
            $('#menu').height($(window).height());
        },100);
	}

    App.Helpers.previousOrientation = window.orientation;
    App.Helpers.checkOrientation = function(){
        if(window.orientation !== App.Helpers.previousOrientation){
            App.Helpers.previousOrientation = window.orientation;
        }
    };


	// App View
	// ----------------------------------------------------------------------

	App.Views.Chrome = Backbone.View.extend({


		events:
		{
		    "click .trigger": "toggleMenu",
		    "click #close-mask": "toggleMenu",
		    "touchstart .menu": "preventDefault",
		    "touchstart #page": "preventDefault",
		},

	    render: function()
	    {
	        this.$el.html($('#template-app').html());
	        return this;
	    },

	    preventDefault: function()
	    {
		    $('#close-mask').on('touchmove', function(event) {
		        event.preventDefault();
		    });

		    $('#menu').on('touchmove', function(event) {
		        event.preventDefault();
		    });
	    },

	    toggleMenu: function()
	    {

	    	$('.menu').height(window.innerHeight);

	    	// menu is already open..

	        if($('.body').hasClass('menu-open'))
	        {
	        	$('#page').css('-webkit-transform', 'translate3d(0, 0 , 0)');
	                    
		        $('.body').addClass('menu-closing');
		        $('#close-mask').hide();
				$('.body').removeClass('menu-open');
				$('.body').removeClass('menu-closing');
				$('.body').removeClass('menu-moving');
		        
	        }
	        else
	        {
				console.log('opening...')
				$('#page').css('-webkit-transform', 'translate3d(260px, 0 , 0)');

				$('.body').addClass('menu-opening');

					$('.body').addClass('menu-open');
					$('#close-mask').show();
					$('.body').removeClass('menu-opening');
					$('.body').removeClass('menu-moving');
	        }
	        
	    }

	});

	// App Login view
	// ----------------------------------------------------------------------

	App.Views.Login = Backbone.View.extend({

	    className: 'login',

		tagName: 'div',

		events: {

			"click #loginButton" : "login"

		},

		initialize: function()
		{
			// stored in the cache?
			if (Parse.User.current())
			{
				App.user = Parse.User.current();
			    $('.login').remove();
			    App.Helpers.drawChrome();
			    App.router.navigate("home", {trigger: true, replace: true});
				return;
			}
		},

		// Cache the template function for a single item.
		//template: _.template($('#template-home-item').html()),

	    render: function() {
	        this.$el.html($('#template-login').html());
	        return this;
	    },

	    login: function()
	    {

	    	var email = $('#loginEmail').val();
	    	var password = $('#loginPassword').val();

	    	Parse.User.logIn(email, password, {
			  success: function(user) {
			    // Do stuff after successful login.
			    App.user = user;
			    $('.login').remove();
			    App.Helpers.drawChrome();
			    App.router.navigate("home", {trigger: true, replace: true});
	            $('#menu header').html(user.get('first_name') + " " + user.get('last_name'));

			  },
			  error: function(user, error) {
			    // The login failed. Check error to see why.
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
	    }

	});


	// App sign up view
	// ----------------------------------------------------------------------

	App.Views.Signup = Backbone.View.extend({

		className: 'signup',

		tagName: 'div',

		events: {

			"click #signUpButton" : "createUser"

		},

		// Cache the template function for a single item.
		//template: _.template($('#template-home-item').html()),

	    render: function() {
	        this.$el.html($('#template-signup').html());
	        return this;
	    },

	    createUser: function()
	    {

	    	var email = $('#signUpEmail').val();
	    	var password = $('#signUpPassword').val();
	    	var first_name = $('#signUpFirstName').val();
	    	var last_name = $('#signUpLastName').val();

	    	var user = new Parse.User();
			user.set("username", email);
			user.set("password", password);
			user.set("email", email);
			user.set("first_name", first_name);
			user.set("last_name", last_name);
			
			user.signUp(null, {
			  success: function(user) {
			  	
			  	App.router.navigate("home", {trigger: true, replace: true});
			  },
			  error: function(user, error) {
			    // Show the error message somewhere and let the user try again.
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
	    }

	});

	
	// App sign up view
	// ----------------------------------------------------------------------

	App.Views.Profile = Backbone.View.extend({

		className: 'profile padding',

		tagName: 'div',

		events:
		{

			"click #profileSave" : "save"

		},

		// Cache the template function for a single item.
		//template: _.template($('#template-home-item').html()),

	    render: function()
	    {
	        this.$el.html($('#template-profile').html());
	        return this;
	    },

	    populate: function()
	    {
	    	$('#profileEmail').val(App.user.get('email'));
	    	$('#profileFirstName').val(App.user.get('first_name'));
	    	$('#profileLastName').val(App.user.get('last_name'));
	    	$('#profileLocation').val(App.user.get('location'));
	    },

	    save: function()
	    {
	    	App.user.set('email', $('#profileEmail').val());
	    	App.user.set('username', $('#profileEmail').val());
	    	App.user.set('first_name', $('#profileFirstName').val());
	    	App.user.set('last_name', $('#profileLastName').val());
	    	App.user.set('location', $('#profileLocation').val());
	    	App.user.save(null, {
			  success: function(obj) {
			    // The object was saved successfully.
			    alert("Your profile has been updated!");
			  },
			  error: function(obj, error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
	    }

	});


	// Scrapbook Model
	// ----------------------------------------------------------------------
	App.Models.Scrapbook = Parse.Object.extend("Scrapbooks", {

		className: 'Scrapbooks',

		initialize: function()
		{
			this.set('id', this.id);
		},

		defaults:
		{
		  title: "Scrapbook Title",
		  pages: 0,
		  description: "Description of the scrapbook",
		},

	});


	// Page Model
	// ----------------------------------------------------------------------
	App.Models.Page = Parse.Object.extend("Pages", {

		className: 'Pages',

		defaults: {
			page_number : "1",
			content: {
				block_01 : {
						type: "text",
						content: "sample text"
				}
			}
		},

	});

	// Create book view
	// ----------------------------------------------------------------------

	App.Views.CreateScrapbook = Backbone.View.extend({

	    className: 'createScrapbook',

		tagName: 'div',

		events: {

			"click #createScrapbookButton" : "createScrapbook"
		},

		// Cache the template function for a single item.
		//template: _.template($('#template-home-item').html()),

	    render: function() {
	        this.$el.html($('#template-create').html());
	        return this;
	    },

	    createScrapbook: function()
	    {

	    	var title = $('#createScrapbookTitle').val();
	    	var description = $('#createScrapbookDescription').val();

	    	
			var newScrapbook = new App.Models.Scrapbook

			var current = Parse.User.current();

			 
			newScrapbook.set("authors", [current.id]);
			newScrapbook.set("owners", [current.id]);
			newScrapbook.set("title", title);
			newScrapbook.set("status", {
				status: "open", 
				changed_by: current.id
			});
			newScrapbook.set("recent_activity", {
				list: [
					{
						user: current.id, 
						date: App.Helpers.Today(),
						description: "Started the scrapbook!"
					}
				]
			});
			 
			newScrapbook.save(null, {
			  success: function(obj) {
			    // The object was saved successfully.
			    

	        App.router.navigate("/", {trigger: true, replace: true});

			  },
			  error: function(obj, error) {
			    // The save failed.
			    // error is a Parse.Error with an error code and description.
			    alert("Error: " + error.code + " " + error.message);
			  }
			});

	    	
	    }
	});

	App.Helpers.Today = function()
	{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;
		return today;
	}





	// Single Scrapbook View
	// ----------------------------------------------------------------------

	App.Views.Scrapbook = Backbone.View.extend({
		
	    tagName: "div",

	    className: "scrapbook",

	    // Cache the template function for a single item.
		template: _.template($('#template-home-item').html()),

		initialize: function(){
			this.model.bind('change', this.render, this);
		//this.model.set('id', "123")
			console.log(this.model.toJSON())
		},

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        console.log("inside scrapbook view render");
	        return this;
	    }
	});

	// Single Page View
	// ----------------------------------------------------------------------

	App.Views.Page = Backbone.View.extend({
		
	    tagName: "div",

	    className: "single",

	    // Cache the template function for a single item.
		template: _.template($('#template-book-single').html()),

		initialize: function()
		{
			this.model.bind('change', this.render, this);
			//window.addEventListener("resize", App.Helpers.checkOrientation, false);
    		//window.addEventListener("", App.Helpers.checkOrientation, false);
		},

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        console.log("inside page view render");
	        return this;
	    }
	});


	// Single Scrapbook View
	// ----------------------------------------------------------------------

	App.Views.SinglePage = Backbone.View.extend({

	    // Cache the template function for a single item.
		template: _.template($('#template-book-single').html()),

		initialize: function(){
			this.model.bind('change', this.render, this);
		},

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        console.log("inside scrapbook view render");
	        return this;
	    }
	});


	// Double Scrapbook View
	// ----------------------------------------------------------------------

	App.Views.DoublePage = Backbone.View.extend({

	    // Cache the template function for a single item.
		template: _.template($('#template-book-double').html()),

		initialize: function(){
			this.model.bind('change', this.render, this);
		},

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        console.log("inside scrapbook view render");
	        return this;
	    }
	});


	// Page Collection
	// ----------------------------------------------------------------------

	App.Collections.Pages = Parse.Collection.extend({

		model: App.Models.Page

	});


	// Scrapbook Collection
	// ----------------------------------------------------------------------

	App.Collections.Scrapbooks = Parse.Collection.extend({

		model: App.Models.Scrapbook

	});


	// Scrapbook collection view
	// ----------------------------------------------------------------------

	App.CollectionViews.Scrapbooks = Backbone.View.extend({
	    
	    tagName: 'div',

	    className: 'scrapbooks',

	    render: function()
	    {


	        this.collection.each(function(tempScrapbook)
	        {
	        	console.log(tempScrapbook)
	        	//create a new view for the current scrapbook model
	            var view = new App.Views.Scrapbook({ model: tempScrapbook });
	            console.log("inside collection view render");
	            this.$el.append(view.render().el);
	        }, this);

	        return this;

	    }
	});


	// Page collection view
	// ----------------------------------------------------------------------

	App.CollectionViews.Pages = Backbone.View.extend({
	    
	    tagName: 'div',

	    className: 'bookEdit padding',

	    render: function(){

	        this.collection.each(function(tempPage) {
	        	//create a new view for the current scrapbook model
	            var view = new App.Views.Page({ model: tempPage });
	            console.log("inside collection page view render");
	            this.$el.append(view.render().el);
	        }, this);

	        return this;

	    },

	    setBookSizes: function()
	    {
	        $('.topPage').height($('.topPage').width());
	        $('.middlePage').height($('.topPage').width() - 4);
	        $('.bottomPage').height($('.topPage').width() - 8);
    	}
	});

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
					$('.body').html($('#template-home').html());
					$('.home').append(App.collectionView.render().el);
					$('.login').remove();	
					$('.cover').height($('.cover').width());

			        $('.scrapbooks').width(function (){
			            return ($('.scrapbook').length * 360);
			        });


					setTimeout(function() {
				       // start scroller...

					var scroller = new Scroller(render, {
					scrollingY: false,
					paging: false,
					snapping: true
					});


					// Setup Scroller
					var container = document.getElementsByClassName("home")[0];
					window.content = document.getElementsByClassName("scrapbooks")[0];
					console.log(content)
					var rect = container.getBoundingClientRect();

					scroller.setPosition(rect.left+container.clientLeft, rect.top+container.clientTop);
					scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);
					scroller.setSnapSize(520, 520);
					container.addEventListener("touchstart", function(e) {
					// Don't react if initial down happens on a form element
					if (e.target.tagName.match(/input|textarea|a|select/i)) {
					  return;
					}

					scroller.doTouchStart(e.touches, e.timeStamp);
					e.preventDefault();
					}, false);

					document.addEventListener("touchmove", function(e) {
					scroller.doTouchMove(e.touches, e.timeStamp);
					}, false);

					document.addEventListener("touchend", function(e) {
					scroller.doTouchEnd(e.timeStamp);
					}, false);
				    }, 10);

					

					// end scroller...

			  },
			  error: function(collection, error)
			  {
			    // The collection could not be retrieved.
			  }
			});

	        
	    

	    },

	    signup: function(){
	        var signupView = new App.Views.Signup;
	        $('body').append(signupView.render().el);
	        $('.login').remove();
	    },

	    login: function(){
    		var loginView = new App.Views.Login;
        	$('body').append(loginView.render().el);
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

	App.Helpers.drawChrome = function()
	{
		App.chrome = new App.Views.Chrome;
		$('body').append(App.chrome.render().el);
		$('.login').remove();
		App.Helpers.setHeights();	
	}
	

	setTimeout(function() {
        window.scrollTo(0, 0);
    }, 100);

    window.addEventListener("resize", App.Helpers.checkOrientation, false);
    window.addEventListener("orientationchange", App.Helpers.checkOrientation, false);

	// Startup backbone...
	App.router = new App.Router;
	Backbone.history.start();
});
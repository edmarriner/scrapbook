//$(document).ready(function(){
document.addEventListener('deviceready', function() {
	
	document.addEventListener("offline", goneOffline, false);
	document.addEventListener("online", goneOnline, false);

	function goneOffline() {
	    $('#viewport').prepend("<div class='noConnection'>No internet connection. Attemping to reconnect...</div>");
	}

	function goneOnline() {
	    $('.noConnection').remove();
	}

	window.test = function()
	{
		App.Manager.user = new App.Models.User;
		App.Manager.user.set('id', '1835446356')
		App.router.navigate("", {trigger: true, replace: true});
	} 
	
	
	//if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
	//if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
	//if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
	
	try {
		
		
		FB.init({ appId: "425907780826832", nativeInterface: CDV.FB, useCachedDialogs: false });
	} catch (e) {
		alert(e);
	}
	
	//FB.Event.subscribe('auth.login', function(response) {
    //	alert('auth.login event'); 
   	//});
    //        
    //FB.Event.subscribe('auth.logout', function(response) {
    //	alert('auth.logout event');
    //});
    //
    //FB.Event.subscribe('auth.sessionChange', function(response) {
    //	alert('auth.sessionChange event');
    //});
    //
    //FB.Event.subscribe('auth.statusChange', function(response) {
    //	alert('auth.statusChange event');
    //});

	// center a div in the middle of the page..
	$.fn.center = function () {
	    this.css("position","absolute");
	    this.css("top", ( $(window).height() - this.height() ) / 2  + "px");
	    this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
	    return this;
	};

	// Namespacing
	window.App = {

	    Models: {},
	    Collections: {},
	    CollectionViews: {},
	    Views: {},
	    Router: {},
	    Helpers: {},
	    Modal: {},
	    Manager: {}
	};

	// Object to controll the application
	App.Manager =
	{
		currentView: null,
		activeCollections: {},
		appView: null,
		orientation: null,
		serverURL: 'http://scrapbook.uk.to/api/index.php',
	
		// Render a new view on to the page
		setView: function(view)
		{
			// check to see if a current view has been set yet
			if(this.currentView)
			{
				// Start by removing the current eleemnt from the DOM
				this.currentView.remove();
				// Then release the binded events
				this.currentView.unbind();

				// Next check to see if we have set a custom close method for the view, to do extra clear up
				if(this.currentView.close)
				{
					this.currentView.close();	
				}
			}
			
			// The user is indeed logged in, so show the view
			$('#content').html(view.render().el);
			this.currentView = view;
			
		},

		drawChrome: function()
		{
			App.Manager.loginView.remove();
			App.Manager.loginView.unbind();
			this.appView = new App.Views.Chrome;
			$('body').html(this.appView.render().el);			
		}
	}


	// App View
	// ----------------------------------------------------------------------

	App.Views.Chrome = Backbone.View.extend({

		id: 'viewport',

		events:
		{
		    "click #menuTrigger": "toggleMenu",
		    "click #activityTrigger": "toggleActivity",
		    "click #mask": "resetPage",
		    "touchstart .menu": "preventDefault",
		    "touchstart #page": "preventDefault",
		    "click #menu a": "toggleMenu"
		},

		initialize: function()
		{
			window.addEventListener("resize", this.orientationChange, false);
    		window.addEventListener("orientationchange", this.orientationChange, false);
    		
		},

		orientationChange: function()
		{
			//this.trigger("orientationChanged");
		},

		updateHeader: function(text)
		{
			this.$el.find('.appTitle').text(text);
		},

		swiped: function()
		{
			alert("swiped!")
		},

		updateTimeline: function (collection)
		{
			collection.each(function(tempTimeline)
	        {
	            var view = new App.Views.Timeline({ model: tempTimeline });
	            this.$el.find('#activity ul').append(view.render().el);
	        }, this);

	        return this;
		},

		// Cache the template function for a single item.
		template: _.template($('#template-app').html()),

	    render: function()
	    {
	        this.$el.html(this.template());
	        $("#home").swipe( {
		        //Generic swipe handler for all directions
		        swipeLeft:function(event, direction, distance, duration, fingerCount) {
		          alert("You swiped " + direction + " " + ++count + " times " );  
		        },
		        //Default is 75px, set to 0 for demo so any distance triggers swipe
		        threshold:0
		    });	
	        return this;
	    },

	    preventDefault: function()
	    {
		    $('#mask').on('touchmove', function(event) {
		        event.preventDefault();
		    });

		    $('#menu').on('touchmove', function(event) {
		        event.preventDefault();
		    });
	    },

	    resetPage: function ()
	    {
	    	if($('#page').hasClass('menu-open'))
	    	{
	    		this.toggleMenu();
	    	}
	    	else
	    	{
	    		this.toggleActivity();
	    	}
	    },

	    toggleMenu: function()
	    {
	    	if($('#page').hasClass('menu-closed'))
			{
				$('#page').removeClass('menu-closed');
				$('#menu').removeClass('hide-nav');
				$('#menu').addClass('show-nav');
				$('#page').addClass('menu-open');
				$('#mask').toggle();
			}
			else
			{

				$('#page').addClass('resetPage');

				$('#page').removeClass('menu-open');
				$('#menu').removeClass('show-nav');
				$('#menu').addClass('hide-nav');
				$('#page').addClass('menu-closed');
				$('#mask').toggle();
			}
	    },

	    toggleActivity: function()
	    {
	    	if($('#page').hasClass('activity-closed'))
			{
				$('#page').removeClass('activity-closed');
				$('#activity').removeClass('hide-activity');
				$('#activity').addClass('show-activity');
				$('#page').addClass('activity-open');
				$('#mask').toggle();
			}
			else
			{
				$('#page').addClass('resetPage');

				$('#page').removeClass('activity-open');
				$('#activity').removeClass('show-activity');
				$('#activity').addClass('hide-activity');
				$('#page').addClass('activity-closed');
				$('#mask').toggle();
			}
	    }

	});


	// App Login view
	// ----------------------------------------------------------------------

	App.Views.Login = Backbone.View.extend({

	    className: 'login',

		events: {

			"click #loginButton" : "login"
		},

		// Cache the template function for a single item.
		template: _.template($('#template-login').html()),

	    render: function() {
	        this.$el.html(this.template());
	        return this;
	    },

	    login: function()
	    {
	    	// login to facebook
	    	FB.login(function(response) {

	    		// check to see if the request was valid
			   	if (response.authResponse) {

			   	 	// save the access token for use later
				 	App.Manager.accessToken = response.authResponse.accessToken;

				 	// get detail about the new user
			   	 	FB.api('/me', function(response) {
					
					    // login or register the user to the server backend
						$.ajax({
						  url: App.Manager.serverURL + '/login',
						  dataType : 'jsonp',
						  data: 
						  	{
						  		user: response.id,
						  		firstName: response.first_name,
						  		lastName: response.last_name,
						  		location: response.location.name,
						  		email: response.email
							}

							}).success(function(response) // request to scrapbook server is good
							{
							  	
							  	// create a model to store the user
						    	App.Manager.user = new App.Models.User;
						   		
						   		// set the details of the user to the local model
								App.Manager.user.set('id', response.id);
								App.Manager.user.set('firstName', response.firstName);
								App.Manager.user.set('lastName', response.lastName);
								App.Manager.user.set('location', response.location);
								App.Manager.user.set('email', response.email);	

								App.router.navigate("", {trigger: true, replace: true});

							}).error(function(result, error) // bad request to scrapbook sever
							{
								alert("error sending request to scrapbook server app [1001]");
							});
					});
			   }
			   else
			   {
			     alert('User cancelled login or did not fully authorize. [1002]');
			   }
			},
			{
				// we want access to the email too. this request extra permission.. 
            	scope: "email,user_location"
            });  // end FB.login()	
		} // end login method	
 	}); // end login view
	

	// Single friend
	// ----------------------------------------------------------------------
	App.Views.Friend = Backbone.View.extend({

		// Cache the template function for a single item.
		template: _.template($('#template-single-friend').html()),

	    render: function()
	    {
	        this.$el.html(this.template(this.model));
	        return this;
	    }
	});



	// Single friend
	// ----------------------------------------------------------------------
	App.Views.FriendObject = Backbone.View.extend({

		// Cache the template function for a single item.
		template: _.template($('#template-single-add-friends').html()),

	    render: function()
	    {
	        this.$el.html(this.template(this.model));
	        return this;
	    }
	});

	// Single friend
	// ----------------------------------------------------------------------

	App.Views.Timeline = Backbone.View.extend({

		// Cache the template function for a single item.
		template: _.template($('#template-timeline').html()),

	    render: function()
	    {
	    	
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }

	});

	// FRIENDS VIEW
	App.CollectionViews.Friends = Backbone.View.extend({
	    
	    tagName: 'div',

	    className: 'friends padding',

	    events: 
	    {
	    	'click #addFriendFacebook' : 'findByFacebook'
	    },

	    // Cache the template function for a single item.
		template: _.template($('#template-friends').html()),

		initialize: function()
		{
			App.Manager.appView.updateHeader('Friends');

		
		},

		findByFacebook: function()
		{
 		 	FB.ui({method: 'apprequests',
				to: '',
				title: 'My Great Invite',
				message: 'Check out this App!',
			}, function(response) { });
		},

	    render: function()
	    {
	    	this.$el.html(this.template());


	    	FB.api('/fql', { q:{"query1":"SELECT uid , first_name, last_name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1"} },
				function(response)
				{
					for(var i = 0; i < response.data[0].fql_result_set.length; i++)
						{
							var facebookFriend = {}
							facebookFriend.firstName = response.data[0].fql_result_set[i].first_name;
							facebookFriend.lastName = response.data[0].fql_result_set[i].last_name;
							facebookFriend.picture = response.data[0].fql_result_set[i].pic_square;
							var myView = new App.Views.Friend({ model: facebookFriend });
							App.Manager.currentView.$el.find('.friendList').append(myView.render().el);
					    }
		      	}
   	 		);

	        return this;
	    }
	});

	
	//  profile view
	// ----------------------------------------------------------------------

	App.Views.Profile = Backbone.View.extend({

		className: 'profile padding',

		tagName: 'div',

		events:
		{

			"click #profileSave" : "save"

		},

		// Cache the template function for a single item.
		template: _.template($('#template-profile').html()),

	    render: function()
	    {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    },

	    save: function()
	    {
	    	
	    	App.Manager.user.set('email', $('#profileEmail').val());
	    	App.Manager.user.set('firstName', $('#profileFirstName').val());
	    	App.Manager.user.set('lastName', $('#profileLastName').val());
	    	App.Manager.user.set('location', $('#profileLocation').val());

	    	App.Manager.user.save({}, {
			    success: function (model, response) {
			        alert("Saved!")
			    },
			    error: function (model, response) {
			        alert("There was an error saving your profile...")
			    }
			});
	    },

	    initialize: function()
		{
			App.Manager.appView.updateHeader('Your Profile');
		}

	});


//  profile view
	// ----------------------------------------------------------------------

	App.CollectionViews.Purchases = Backbone.View.extend({

		className: 'purchases padding',

		// Cache the template function for a single item.
		template: _.template($('#template-purchases').html()),

	    render: function(){

	    	this.$el.html(this.template());

	        this.collection.each(function(tempPurchase) {
	            var view = new App.Views.Purchase({ model: tempPurchase });
	            this.$el.append(view.render().el);
	        }, this);

	        return this;

	    },

	    initialize: function()
		{
			App.Manager.appView.updateHeader('Purchases');
		}

	});


	// Scrapbook Model
	// ----------------------------------------------------------------------
	App.Models.Scrapbook = Backbone.Model.extend({

		className: 'Scrapbooks',

		initialize: function()
		{
			this.set('id', this.id);
		},

		url: App.Manager.serverURL + '/scrapbooks',

		defaults:
		{
		  title: "Scrapbook Title",
		  pages: 0,
		  description: "Description of the scrapbook",
		  colour: 'red',
		},

	});

	// Purchases Model
	// ----------------------------------------------------------------------
	App.Models.Purchase = Backbone.Model.extend({

		url: App.Manager.serverURL + '/purchases',

	});


	// Users Model
	// ----------------------------------------------------------------------
	App.Models.User = Backbone.Model.extend({

		urlRoot: App.Manager.serverURL + '/users'

	});


	// Page Model
	// ----------------------------------------------------------------------
	App.Models.Page = Backbone.Model.extend({

		className: 'Pages'

	});

	// Timeline Model
	// ----------------------------------------------------------------------
	App.Models.Timeline = Backbone.Model.extend({

		className: 'Timeline'

	});

	// Create book view
	// ----------------------------------------------------------------------

	App.Views.CreateScrapbook = Backbone.View.extend({

	    className: 'createScrapbook',

		tagName: 'div',

		events: {

			"click #createScrapbookButton" : "createScrapbook",
			'click #chooseFriends' : 'chooseFriends',
			"click .picker": "colourPicker"
		},

		// Cache the template function for a single item.
		template: _.template($('#template-create').html()),

	    render: function() {
	        this.$el.html(this.template());
	        return this;
	    },

	    friendPicker: null,

	    colourPicker: function(e)
	    {
	    	$('.picker').removeClass('colourSelected');
	    	//console.log($('#' + e.target.id))
	    	$('#' + e.target.id).addClass('colourSelected');
	    	//console.log(e);
	    },

	    chooseFriends: function()
	    {


			// open the dialog
			this.friendPicker = new App.Views.FriendPicker();
			this.friendPicker.render();

    		
	    },

	    friendsAdded: Array(),

	    close: function(){
	    	this.friendsAdded = [];
	    },

	    createScrapbook: function()
	    {

	    	var title = $('#createScrapbookTitle').val();
	    	var description = $('#createScrapbookDescription').val();
	    	var colour = ($('.colourSelected').css('backgroundColor'));

	    	
			var newScrapbook = new App.Models.Scrapbook;

			 
			newScrapbook.set("authors", 1);
			newScrapbook.set("owners", 1);
			newScrapbook.set("title", title);
			newScrapbook.set("description", description);
			newScrapbook.set("status", "open");
			newScrapbook.set("colour", colour)

			var data = newScrapbook.toJSON();
			data.user = App.Manager.user.get('id');
			data.friends = this.friendsAdded;
			newScrapbook.save(data, {

				success: function(model, response, options)
				{
					App.Manager.activeCollections.scrapbooks.add(newScrapbook)
					App.Manager.currentView.friendsAdded = [];
					App.router.navigate("/book/edit/" +  response.scrapbookID, {trigger: true, replace: true});
				},
				error: function(model, error, options)
				{
				    alert("There was an error with saving the scrapbooks.");
				    alert(JSON.stringify(model));
				    alert(JSON.stringify(error));
				    console.log(options);
				}
			});
	    },
	    initialize: function()
		{
			App.Manager.appView.updateHeader('Create Scrapbook');
		}
	});

	
	// Single Scrapbook View
	// ----------------------------------------------------------------------

	App.Views.Scrapbook = Backbone.View.extend({
		
	    tagName: "div",

	    className: "box",

	    // Cache the template function for a single item.
		template: _.template($('#template-home-item').html()),

		initialize: function(){
			this.model.on('change', this.render, this);
		},

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }
	});

		// Single Scrapbook View
	// ----------------------------------------------------------------------

	App.Views.Purchase = Backbone.View.extend({

	    // Cache the template function for a single item.
		template: _.template($('#template-purchase-single').html()),

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }
	});

	// Single Page View
	// ----------------------------------------------------------------------

	App.Views.Page = Backbone.View.extend({

		className: "topPage",

	    // Cache the template function for a single item.
		template_1: _.template($('#template-book-single-one').html()),
		template_2: _.template($('#template-book-single-two').html()),
		template_3: _.template($('#template-book-single-three').html()),
		template_4: _.template($('#template-book-single-four').html()),
		template_5: _.template($('#template-book-single-five').html()),
		template_6: _.template($('#template-book-single-six').html()),

		initialize: function()
		{
			this.model.bind('change', this.render, this);

			// set the page number on the div element
			$(this.el).attr('id', "page_" + this.model.get('pageNumber')); 

			// set the scrapbook id on the div element
			$(this.el).attr('data-scrapbook-id', this.model.get('scrapbookId')); 

			$(this.el).attr('data-page-id', this.model.get('id')); 

			console.log(this.model.toJSON())

			// hide the element
			//$(this.el).hide();
		},

	    render: function()
	    {
	    	var theContent = Array();
	    	var blocks = this.model.get('blocks');
	    	for(var i=0; i < blocks.length; i++ )
		   	{
		        if(blocks[i].type == 'image')
		        {
		          theContent[i] = "<img src='' style='width:100%; height: 100%; background-size:cover; background: url(http://scrapbook.uk.to/files/"+ blocks[i].content + ")' />";
		        }
		        else if (blocks[i].type == 'text')
		        {
		          theContent[i] = "<div style='width:100%; height: 100%; font-size:30px; colour:#333; text-align: center;'>" + blocks[i].content + "</div>";
		        }
		        else if (blocks[i].type == 'colour')
		        {
		          theContent[i] = "<div style='width:100%; height:100%; background:" + blocks[i].content +";'></div>";
		        }
		        else if (blocks[i].type == 'map')
		        {
		          theContent[i] = "<div style='width:100%; height:100%; background:#" + blocks[i].content +";'></div>";
		        }
		        else
		        {
		        	theContent[i] = "<div style='width:100%; height:100%;'></div>";
		        }
		    }

	    	if(this.model.get('templateId') == 1)
	    	{
	    		var data = this.model.toJSON();
	    		data.theContent = theContent
	        	this.$el.html(this.template_1(data));
	        	
	    	}
	    	else if(this.model.get('templateId') == 2)
	    	{
	    		var data = this.model.toJSON();
	    		data.theContent = theContent
	        	this.$el.html(this.template_2(data));
	    	}
	    	else if(this.model.get('templateId') == 3)
	    	{
	    		var data = this.model.toJSON();
	    		data.theContent = theContent
	        	this.$el.html(this.template_3(data));
	    	}
	    	else if(this.model.get('templateId') == 4)
	    	{
	    		var data = this.model.toJSON();
	    		data.theContent = theContent
	        	this.$el.html(this.template_4(data));
	    	}
	    	else if(this.model.get('templateId') == 5)
	    	{
	    		var data = this.model.toJSON();
	    		data.theContent = theContent
	        	this.$el.html(this.template_5(data));
	    	}
	    	else if(this.model.get('templateId') == 6)
	    	{
	    		var data = this.model.toJSON();
	    		data.theContent = theContent
	        	this.$el.html(this.template_6(data));
	    	}
	    	else
	    	{
	    		alert("Sorry, i can't find that template!");
	    	}
	        return this;
	    }
	});

	// Page Collection
	// ----------------------------------------------------------------------

	App.Collections.Pages = Backbone.Collection.extend({

		model: App.Models.Page,

		url: App.Manager.serverURL + '/pages'

	});


	// Purchases Collection
	// ----------------------------------------------------------------------

	App.Collections.Purchases = Backbone.Collection.extend({

		model: App.Models.Purchase,

		url: App.Manager.serverURL + '/purchases'

	});

	// Timeline Collection
	// ----------------------------------------------------------------------

	App.Collections.Timeline = Backbone.Collection.extend({

		model: App.Models.Timeline,

		url: App.Manager.serverURL + '/timeline'

	});



		// USers Collection
	// ----------------------------------------------------------------------

	App.Collections.Users = Backbone.Collection.extend({

		model: App.Models.User,

		url: App.Manager.serverURL + '/users'

	});


	// Scrapbook Collection
	// ----------------------------------------------------------------------

	App.Collections.Scrapbooks = Backbone.Collection.extend({

		model: App.Models.Scrapbook,

		url: App.Manager.serverURL + '/scrapbooks'

	});


	// Scrapbook collection view
	// Used on the home screen to display all the scrapbooks as a collection
	// ----------------------------------------------------------------------

	App.CollectionViews.Scrapbooks = Backbone.View.extend({
	    
	    tagName: 'div',

	    className: 'home',

	    setCoverSizes: function()
	    {
			$('.box span').css('font-size', ($('.box').width()/11));

			$('.centerTitle').fitText();

	        $('.tile').css('backgroundColor', function(){
	        	return 'rgba(255,255,255,' + Math.random() +')';
			});

	    },

	    insertNewShortcut: function()
	    {
	    	this.$el.prepend("<div class='box' style=''><a href='#/create' class='boxInner'><div class='homeCreateScrapbook'>+</div></a><div>");
	    },

	    initialize: function()
	    {
			App.Manager.appView.updateHeader('Scrapbooks');
	    },

	    render: function()
	    {
	        this.collection.each(function(tempScrapbook)
	        {
	        	//create a new view for the current scrapbook model
	            var view = new App.Views.Scrapbook({ model: tempScrapbook });
	            this.$el.append(view.render().el);
	        }, this);

	        $('.centerTitle').fitText();

	        $('.tile').css('backgroundColor', function(){
	        	return 'rgba(' + (Math.floor(Math.random() * 256)) + ','
            + (Math.floor(Math.random() * 256)) + ','
            + (Math.floor(Math.random() * 256)) + ','
            + '0.' + (Math.floor(Math.random() * 100)) + ')'});

	        return this;
	    }

	});

	App.Views.FriendPicker = Backbone.View.extend({

		el: '#viewport',

		// Cache the template function for a single item.
		template: _.template($('#template-dialog').html()),

		events: 
		{
			'click .dialogMask': 'close',
			'click .friend' :'toggleFriend'
		},

		initialize: function()
		{
			console.log(this.$el)

		},

		toggleFriend: function(e)
		{
			if(_.contains(App.Manager.currentView.friendsAdded,parseInt(e.currentTarget.id)))
			{
				$(e.currentTarget).removeClass('activeFriend');
				if(App.Manager.currentView.friendsAdded.length > 1)
				{
					array.splice(_.indexOf(App.Manager.currentView.friendsAdded, e.target.id), 1);
				}
				else
				{
					App.Manager.currentView.friendsAdded = []
				}
			}
			else
			{
				$(e.currentTarget).addClass('activeFriend');
				App.Manager.currentView.friendsAdded.push(parseInt(e.currentTarget.id));
			}
			console.log(App.Manager.currentView.friendsAdded);
		},

	    render: function()
	    {
	        this.$el.append(this.template());
	        this.$el.find('.dialog').center();
	        $('.dialog .inner').html("<div class='friendPicker'></div>")
	        this.alwaysCenter();

	        FB.api('/fql', { q:{"query1":"SELECT uid , first_name, last_name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1"} },
				function(response)
				{
					for(var i = 0; i < response.data[0].fql_result_set.length; i++)
					{
						var facebookFriend = {}
						facebookFriend.firstName = 'carys';
						//facebookFriend.firstName = response.data[0].fql_result_set[i].first_name;
						facebookFriend.lastName = 'morgan';
						//facebookFriend.lastName = response.data[0].fql_result_set[i].last_name;
						facebookFriend.picture = 'pic.jpg'
						facebookFriend.id = '123'
						//facebookFriend.picture = response.data[0].fql_result_set[i].pic_square;
						var myView = new App.Views.FriendObject({ model: facebookFriend });
						$('.dialog .inner .friendPicker').append(myView.render().el);
				    }

				    for(var i = 0; i < App.Manager.currentView.friendsAdded.length; i++)
					{
						alert($('.dialog #' + App.Manager.currentView.friendsAdded[i]))
						$('.dialog #' + App.Manager.currentView.friendsAdded[i]).addClass('activeFriend');
					}
		     	}
   	 		);
			
			//$('.dialog .header').html('Pick Friends')
	        return this;
	    },

	    close: function()
	    {
			this.unbind();
			this.undelegateEvents()
	    	$('.dialog').remove();
	    	$('.dialogMask').remove();
	    },

		alwaysCenter: function()
		{
			$(window).resize(function(){ // whatever the screen size this
		       $('.dialog').center();       // this will make it center when 
		    });
		}
	});

	// Modal
	App.Views.Dialog = Backbone.View.extend({

		el: '#viewport',

		// Cache the template function for a single item.
		template: _.template($('#template-dialog').html()),

		template_select_options: _.template($('#template-dialog-options').html()),

		template_has_colour: _.template($('#template-dialog-has-colour').html()),
		template_new_colour: _.template($('#template-dialog-new-colour').html()),
		template_map: _.template($('#template-dialog-has-map').html()),
		template_text: _.template($('#template-dialog-has-text').html()),
		template_new_text: _.template($('#template-dialog-new-text').html()),
		template_image: _.template($('#template-dialog-has-image').html()),
		
		template_settings: _.template($('#template-dialog-settings').html()),
		template_settings_not_a_page: _.template($('#template-dialog-settings-not-a-page').html()),
		template_settings_details: _.template($('#template-dialog-settings-scrapbook').html()),
		template_settings_remove: _.template($('#template-dialog-settings-remove-page').html()),
		template_settings_change_template: _.template($('#template-dialog-settings-template').html()),
		template_settings_share: _.template($('#template-dialog-settings-share').html()),
		template_settings_delete: _.template($('#template-dialog-settings-delete').html()),
		template_settings_editors: _.template($('#template-dialog-settings-change-friends').html()),

		events: 
		{
			'click .dialogMask': 'close',
			'click .removeEle' : 'removeElement',
			'click .takePhoto' : 'takePhoto',
			'click .library': 'libraryPhoto',
			'click .saveTextEle': 'saveText',
			'click .blockColourOption': 'saveColourBlock',
			'click .writeText' : 'newText',
			'click .colour' : 'colourBlock',
			'click .changeTemplate': 'changeTemplate',
			'click .removePage': 'removePage',
			'click .editDetails': 'editDetails',
			'click .share': 'share',
			'click .deleteScrapbook': 'deleteScrapbook',
			'click .editors': 'editors',
			'click .buy': 'buy',
			'click .tpl1': 'selectTemplate1',
			'click .tpl2': 'selectTemplate2',
			'click .tpl3': 'selectTemplate3',
			'click .tpl4': 'selectTemplate4',
			'click .tpl5': 'selectTemplate5',
			'click .tpl6': 'selectTemplate6',
			'click .deletePageRequest':'deletePageRequest',
			'click .deleteScrapbookRequest': 'deleteRequest',
			'click .updateNewDetails': 'updateNewDetails'
		},

		initialize: function()
		{
			console.log(this.$el)
			alert("dialog")
		},

	    render: function()
	    {
	        this.$el.append(this.template());
	        this.$el.find('.dialog').center();
	        this.alwaysCenter();
	        this.checkOptions();
	        return this;
	    },

	    close: function()
	    {
			this.unbind();
			this.undelegateEvents()
	    	$('.dialog').remove();
	    	$('.dialogMask').remove();
	    },

		alwaysCenter: function()
		{
			$(window).resize(function(){ // whatever the screen size this
		       $('.dialog').center();       // this will make it center when 
		    });
		},

		share: function()
		{
			var scrapbook = App.Manager.currentView.collection.at(App.Manager.currentView.currentPage - 1).get('scrapbookId')

			var data = {};
			$.ajax({
			  url: App.Manager.serverURL + '/singleScrapbook',
			  dataType : 'jsonp',
			  context: this,
			  data: 
			  	{
			  		scrapbook: scrapbook
				}

			})
			.success(function(result){
				var params = {
				    method: 'feed',
				    name: "" + result.title,
				    link: 'http://scrapbooka.com/scrapbook/' + scrapbook,
				    caption: 'Check out my new scrapbook!',
				    picture: 'http://fbrell.com/f8.jpg',
				    description: "" + result.description
				  };
				console.log(params);
				alert(window.FB)
			    window.FB.ui(params, function(obj) { console.log(obj);});
			})
			.error(function(result, error) // bad request to scrapbook sever
			{
				alert("Connection failed. Please try again later.");
			});


			
		},

		updateNewDetails: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});

			var scrapbook = myPage.get('scrapbookId')

			var title = $('#scrapbookTitleDetail').val();
			var description = $('#scrapbookDescriptionDetail').val();

			$.ajax({
			  url: App.Manager.serverURL + '/updateScrapbook',
			  dataType : 'jsonp',
			  context: this,
			  data: 
			  	{
			  		scrapbook: scrapbook,
			  		title: title,
			  		description: description
				}

			})
			.success(function(result){
				this.close()
			})
			.error(function(result, error) // bad request to scrapbook sever
			{
				alert("Error saving details!");
			});

		},

		selectTemplate1: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/changeTemplate',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		template: '1'
					}

					})
					.success(function(result){

						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{

								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								App.Manager.PageTurn.jump(PageNumber)
								App.Manager.currentView.currentPage = PageNumber;
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						console.log(error)
						alert("Error adding page !");
					});
					this.close()
		},

		selectTemplate2: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/changeTemplate',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		template: '2'
					}

					})
					.success(function(result){

						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{

								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								App.Manager.PageTurn.jump(PageNumber)
								App.Manager.currentView.currentPage = PageNumber;
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()
		},

		selectTemplate3: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/changeTemplate',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		template: '3'
					}

					})
					.success(function(result){

						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{

								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								App.Manager.PageTurn.jump(PageNumber)
								App.Manager.currentView.currentPage = PageNumber;
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()
		},

		selectTemplate4: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/changeTemplate',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		template: '4'
					}

					})
					.success(function(result){

						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{

								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								App.Manager.PageTurn.jump(PageNumber)
								App.Manager.currentView.currentPage = PageNumber;
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()
		},

		selectTemplate5: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/changeTemplate',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		template: '5'
					}

					})
					.success(function(result){

						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{

								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								App.Manager.PageTurn.jump(PageNumber)
								App.Manager.currentView.currentPage = PageNumber;
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()
		},

		selectTemplate6: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/changeTemplate',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		template: '6'
					}

					})
					.success(function(result){
						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{
								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								App.Manager.PageTurn.jump(PageNumber)
								App.Manager.currentView.currentPage = PageNumber;
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()
		},


		showSettings: function()
		{
			if(App.Manager.currentView.currentPage <= App.Manager.currentView.collection.length)
			{
				$('.dialog .inner').html(this.template_settings())
			}
			else
			{
				$('.dialog .inner').html(this.template_settings_not_a_page())
			}
		},

		buy: function()
		{
			var ref = window.open('http://scrapbook.uk.to/website/index.php/scrapbooks/1/buy', '_blank', 'location=no');
		},

		changeTemplate: function()
		{

			$('.dialog .inner').html(this.template_settings_change_template())
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var template = myPage.get('templateId');
			$('.templateButton').removeClass('templateButtonActive')
			switch(template)
			{
				case '1':
					$('.tpl1').addClass('templateButtonActive');
					break;
				case '2':
					$('.tpl2').addClass('templateButtonActive');
					break;
				case '3':
					$('.tpl3').addClass('templateButtonActive');
					break;
				case '4':
					$('.tpl4').addClass('templateButtonActive');
					break;
				case '5':
					$('.tpl5').addClass('templateButtonActive');
					break;
				case '6':
					$('.tpl6').addClass('templateButtonActive');
					break;
				default:
					alert("No template selected!");
					break;
			}
		},

		removePage: function()
		{
			$('.dialog .inner').html(this.template_settings_remove())
		},

		deletePageRequest: function()
		{
			
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var scrapbook = myPage.get('scrapbookId')
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/removePage',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		page: PageID,
				  		scrapbook: scrapbook
					}

					})
					.success(function(result){
						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{
								
								var view = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(view);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								view.animate();
								view.setBookSizes();
								
								if(PageNumber > 1)
								{
									App.Manager.currentView.currentPage = PageNumber - 1;
									App.Manager.PageTurn.jump(PageNumber - 1)
								} else
								{
									App.Manager.currentView.currentPage = 1;
									App.Manager.PageTurn.jump(1)
								} 
								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with the template for this page.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()

		},

		editDetails: function()
		{
			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var scrapbook = myPage.get('scrapbookId')


			var data = {};
			$.ajax({
			  url: App.Manager.serverURL + '/singleScrapbook',
			  dataType : 'jsonp',
			  context: this,
			  data: 
			  	{
			  		scrapbook: scrapbook
				}

			})
			.success(function(result){
				console.log(result)
				data.title = result.title;
				data.description = result.description;
				$('.dialog .inner').html(this.template_settings_details(data))
			})
			.error(function(result, error) // bad request to scrapbook sever
			{
				alert("Error getting scrapbook !");
			});
			console.log(data)
			
		},


		deleteScrapbook: function()
		{
			$('.dialog .inner').html(this.template_settings_delete())
		},

		deleteRequest: function()
		{


			var myPage = App.Manager.activeCollections.pages.findWhere({'pageNumber': ''+App.Manager.currentView.currentPage+''});
			var PageNumber = myPage.get('pageNumber');
			var scrapbook = myPage.get('scrapbookId')
			var PageID = myPage.get('id');

			$.ajax({
				  url: App.Manager.serverURL + '/removeScrapbook',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		scrapbook: scrapbook
					}

					})
					.success(function(result){
						
					App.router.navigate("", {trigger: true, replace: true});

					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});
					this.close()

		},

		editors: function()
		{
			$('.dialog .inner').html(this.template_settings_editors())
		},

		checkOptions: function()
		{
			if(this.options.hasContent)
			{
				
				var pageModel = App.Manager.currentView.collection.get(App.Manager.currentView.pageId)

				block = pageModel.get('blocks');
				for(var i = 0; i < block.length; i++)
				{
					if(block[i].id == App.Manager.currentView.blockId)
					{
						block = block[i]
					}
				}

				switch(this.options.contentType)
				{
					case "image": 
						this.hasImage(block);
						break;
					case "text": 
						this.hasText(block);
						break;
					case "colour": 
						this.hasColour(block);
						break;
					case "map": 
						this.hasMap(block);
						break;
					default:
						this.showSelectType();
						break;
				}
			}
			else if(this.options.settings)
			{
				this.showSettings();
			}
			else
			{
				this.showSelectType()
			}
		},

		newText: function()
		{
			$('.dialog .inner').html(this.template_new_text())
		},

		hasImage: function(block)
		{
			$('.dialog .inner').html(this.template_image(block))
		},

		hasText: function(block)
		{
			alert("text!")
			$('.dialog .inner').empty()
			$('.dialog .inner').html(this.template_text(block))
		},

		hasColour: function()
		{
			$('.dialog .inner').html(this.template_has_colour())
		},

		hasMap: function(block)
		{
			$('.dialog .inner').html(this.template_map(block))
		},

		colourBlock: function()
		{
			$('.dialog .inner').html(this.template_new_colour())
		},
		
		saveColourBlock: function(e)
		{
			alert("saving colour");
			var context = this;
			alert("colour is..");
			alert($('#' + e.target.id).attr('id'));
			var colour = $('#' + e.target.id).attr('id');
			$.ajax({
				  url: App.Manager.serverURL + '/editBlock',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		id: App.Manager.currentView.blockId,
				  		type: 'colour',
				  		content: colour
					}

					})
					.success(function(result){
						
						$('div[data-block-id='+ App.Manager.currentView.blockId +']').html("<div style='width:100%; height: 100%;background: " + colour + "'></div>")
						
						$('div[data-block-id='+ App.Manager.currentView.blockId +']').attr('data-block-type', 'colour');
						//$('div[data-block-id='+ App.Manager.currentView.blockId +']').data('pageId', App.Manager.currentView.pageId);

						var pageModel = App.Manager.currentView.collection.findWhere({id: App.Manager.currentView.pageId});
						alert("2")
						var blocks = pageModel.get('blocks');
						alert("3")
						blocks[ App.Manager.currentView.blockNumber - 1].content =  colour;
						alert("4")
						blocks[ App.Manager.currentView.blockNumber - 1].type = 'colour';
						alert("5")
						pageModel.set('blocks', blocks);
						alert("6")

						var pageModel2 = App.Manager.currentView.collection.get(App.Manager.currentView.pageId)

						var block = pageModel2.get('blocks');
						for(var i = 0; i < block.length; i++)
						{
							if(block[i].id == App.Manager.currentView.blockId)
							{
								block = block[i]
							}
						}
						context.close();
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error removing block!");
					});
		},

		saveText: function()
		{
			var context = this
			$.ajax({
				  url: App.Manager.serverURL + '/editBlock',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		id: App.Manager.currentView.blockId,
				  		type: 'text',
				  		content: $('#blockTextElement').val()
					}

					})
					.success(function(result){
						
						$('div[data-block-id='+ App.Manager.currentView.blockId +']').html("<div style='width:100%; height: 100%;'>" + $('#blockTextElement').val() + "</div>")
						
						$('div[data-block-id='+ App.Manager.currentView.blockId +']').attr('data-block-type', 'text');
						//$('div[data-block-id='+ App.Manager.currentView.blockId +']').data('pageId', App.Manager.currentView.pageId);

						var pageModel = App.Manager.currentView.collection.findWhere({id: App.Manager.currentView.pageId});
						alert("2")
						var blocks = pageModel.get('blocks');
						alert("3")
						blocks[ App.Manager.currentView.blockNumber - 1].content =  $('#blockTextElement').val();
						alert("4")
						blocks[ App.Manager.currentView.blockNumber - 1].type = 'text';
						alert("5")
						pageModel.set('blocks', blocks);
						alert("6")

						var pageModel2 = App.Manager.currentView.collection.get(App.Manager.currentView.pageId)

						var block = pageModel2.get('blocks');
						for(var i = 0; i < block.length; i++)
						{
							if(block[i].id == App.Manager.currentView.blockId)
							{
								block = block[i]
							}
						}
						context.close();
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error removing block!");
					});
		},

		libraryPhoto: function()
		{
			var filename = null;
			var context = this;
			navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}); 

			function onFail(error)
			{
				alert(error);
			}

			function onSuccess(imageURI)
			{
	            var options = new FileUploadOptions();
	            options.fileKey="file";
	            
	            var text = "";
			    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			    for( var i=0; i < 20; i++ )
			        text += possible.charAt(Math.floor(Math.random() * possible.length))
			 
			    filename = text;
			    
	            options.fileName = text;
	            options.mimeType="image/jpeg";

	            var params = new Object();
	            params.value1 = "test";
	            params.value2 = "param";

	            options.params = params;

	            var ft = new FileTransfer();
	            ft.upload(imageURI, encodeURI("http://scrapbook.uk.to/api/index.php/upload"), win, fail, options);
			}        

	        function win(returned)
	        {

	        	$.ajax({
				  url: App.Manager.serverURL + '/editBlock',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		id: App.Manager.currentView.blockId,
				  		type: 'image',
				  		content: filename + '.jpeg',
					}

					})
					.success(function(result){

						$('img[data-block-id='+ App.Manager.currentView.blockId +']').css('background-image', 'url(http://scrapbook.uk.to/files/' + filename + '.jpeg)');
						$('div[data-block-id='+ App.Manager.currentView.blockId +']').attr('data-block-type', 'image');
						var pageModel = App.Manager.currentView.collection.findWhere({id: App.Manager.currentView.pageId});
						alert("2")
						var blocks = pageModel.get('blocks');
						alert("3")
						blocks[ App.Manager.currentView.blockNumber - 1].content =  filename + '.jpeg';
						alert("4")
						blocks[ App.Manager.currentView.blockNumber - 1].type = 'image';
						alert("5")
						pageModel.set('blocks', blocks);
						alert("6")

						var pageModel2 = App.Manager.currentView.collection.get(App.Manager.currentView.pageId)

						var block = pageModel2.get('blocks');
						for(var i = 0; i < block.length; i++)
						{
							if(block[i].id == App.Manager.currentView.blockId)
							{
								block = block[i]
							}
						}
						context.hasImage(block);
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error removing block!");
					});
	        }

	        function fail(error)
	        {
	            alert("An error has occurred: Code = " + error.code);
	            console.log("upload error source " + error.source);
	            console.log("upload error target " + error.target);
	        }
		},

		takePhoto: function()
		{
			var filename = null;
			var context = this;
			navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
			}); 

			function onFail(error)
			{
				alert(error);
			}

			function onSuccess(imageURI)
			{
	            var options = new FileUploadOptions();
	            options.fileKey="file";
	            
	            var text = "";
			    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			    for( var i=0; i < 20; i++ )
			        text += possible.charAt(Math.floor(Math.random() * possible.length))
			 
			    filename = text;
			    
	            options.fileName = text;
	            options.mimeType="image/jpeg";

	            var params = new Object();
	            params.value1 = "test";
	            params.value2 = "param";

	            options.params = params;

	            var ft = new FileTransfer();
	            ft.upload(imageURI, encodeURI("http://scrapbook.uk.to/api/index.php/upload"), win, fail, options);

			}        

	        function win(returned)
	        {
	        	$.ajax({
				  url: App.Manager.serverURL + '/editBlock',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		id: App.Manager.currentView.blockId,
				  		type: 'image',
				  		content: filename + '.jpeg',
					}

					})
					.success(function(result){
						$('img[data-block-id='+ App.Manager.currentView.blockId +']').css('background-image', 'url(http://scrapbook.uk.to/files/' + filename + '.jpeg)');
						$('div[data-block-id='+ App.Manager.currentView.blockId +']').attr('data-block-type', 'image');
						var pageModel = App.Manager.currentView.collection.findWhere({id: App.Manager.currentView.pageId});
						alert("2")
						var blocks = pageModel.get('blocks');
						alert("3")
						blocks[ App.Manager.currentView.blockNumber - 1].content = filename + '.jpeg';
						alert("4")
						blocks[ App.Manager.currentView.blockNumber - 1].type = 'image';
						alert("5")
						pageModel.set('blocks', blocks);
						alert("6")

						var pageModel2 = App.Manager.currentView.collection.get(App.Manager.currentView.pageId)

						var block = pageModel2.get('blocks');
						for(var i = 0; i < block.length; i++)
						{
							if(block[i].id == App.Manager.currentView.blockId)
							{
								block = block[i]
							}
						}
						context.hasImage(block);
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error uploading picture, please try again!");
					});
	        }

	        function fail(error)
	        {
	            alert("An error has occurred: Code = " + error.code);
	            console.log("upload error source " + error.source);
	            console.log("upload error target " + error.target);
	        }
		},

		removeElement: function()
		{
			alert(App.Manager.currentView.blockId)
			$.ajax({
			  url: App.Manager.serverURL + '/removeBlock',
			  dataType : 'jsonp',
			  data: 
			  	{
			  		id: App.Manager.currentView.blockId,
				}

				}).success(function(result){
					alert("deleted block!");
					$('div[data-block-id='+ App.Manager.currentView.blockId +']').html("<div style='width:100%; height:100%;'></div>");
					//$('div[data-block-id='+ App.Manager.currentView.blockId +']').data('content', '');
					$('div[data-block-id='+ App.Manager.currentView.blockId +']').attr('data-block-type', '');
					//$('div[data-block-id='+ App.Manager.currentView.blockId +']').data('pageId', App.Manager.currentView.pageId);
				})
				.error(function(result, error) // bad request to scrapbook sever
				{
					alert("Error removing block!");
				});

			$('.removeEle').unbind();
			$('.removeEle').remove();
			$('.dialog .inner').unbind();
			$('.dialog .inner').empty();

			
			this.showSelectType()
		},

		showSelectType: function()
		{
			$('.dialog .inner').html(this.template_select_options())
		}

	});



	// Page collection view
	// ----------------------------------------------------------------------

	App.CollectionViews.Pages = Backbone.View.extend({

		className: "bookEdit",

		// Cache the template function for a single item.
		template: _.template($('#template-edit').html()),

		// cache each of the template views
		modalTemplates: 
		{
			overview: $('#template-modal-overview').html(),
			border: $('#template-modal-border').html(),
			selection: $('#template-modal-block-selection').html(),
			editText: $('#template-modal-edit-text').html(),
			editCamera: $('#template-modal-edit-camera').html(),
			editLibrary: $('#template-modal-edit-library').html()
		},
		
		modalCount: 0,

		blockId: null,

		pageId: null,

		events:
		{
			'click #prevPage': 'prevPage',
			'click #nextPage': 'nextPage',
			//"click .block" : "openModal",
			"click .block" : "dialog",
			"click #modal-mask": "close",
		    "touchmove #modal-mask": "preventDefault",
		    "click #changeBlock": "showBlockSelection",
		    "click #changeBorderStyle": "showBlockStyles",
		    "click #choosePhoto": "takePhoto",
		    "click #chooseLibrary": "libraryPhoto",
			'click .newPage' : 'newPage',
			'click .settingsButton' : 'settings',

		},

	    render: function(){

	    	this.$el.html(this.template());

	        this.collection.each(function(tempPage) {
	        	//create a new view for the current scrapbook model
	        	console.log(tempPage)
	            var view = new App.Views.Page({ model: tempPage });

	            var fragment = document.createDocumentFragment();
				var contents = fragment.appendChild(document.createElement('div'));
				
				var newAttrib = document.createAttribute('class');
				newAttrib.value = 'bb-item';

				fragment.childNodes[0].setAttributeNode(newAttrib);
				fragment.childNodes[0].appendChild(view.render().el)
				
	            this.$el.find('.bb-bookblock').append(fragment)
	            
	        }, this);

	        //while($('.bb-item').length == 0){}

	        return this;
	    },

	    newPage: function(e)
		{
			App.Manager.newPageFlag = true;

			var context = this
			alert("new page")

			$.ajax({
				  url: App.Manager.serverURL + '/addPage',
				  dataType : 'jsonp',
				  data: 
				  	{
				  		scrapbook: App.Manager.scrapbookId,
				  		user: App.Manager.user.get('id')
					}

					})
					.success(function(result){
						alert("success")
						App.Manager.activeCollections.pages = new App.Collections.Pages;
						App.Manager.activeCollections.pages.fetch({
							data: {
								scrapbook: App.Manager.scrapbookId
							},
							dataType : 'jsonp',
							success: function(collection)
							{
								alert("colletion time")
								var collectionPageView = new App.CollectionViews.Pages({ collection: collection });
								App.Manager.setView(collectionPageView);
								$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%; height: 57%;'>tap to start new page</div></div></div>")
								$('#page_1').show();
								collectionPageView.animate();
								collectionPageView.setBookSizes();
								App.Manager.PageTurn.jump(collection.length)

								//var dialog = new App.Views.Dialog;
								//dialog.render();
							},
							error: function(response, error)
							{
							    alert("There was an error with fetching the NEW collection of pages for this scrapbook.")
							    alert(JSON.stringify(error));
							    alert(JSON.stringify(response))
							    console.log(error)
							}

						});
						
						
					})
					.error(function(result, error) // bad request to scrapbook sever
					{
						alert("Error adding page !");
					});

		},

	    dialog: function(e)
	    {
	    	console.log(e)
	    	// see which block was clicked on and store for reference
			this.blockId = e.target.parentElement.attributes[1].value;

			this.blockType =  e.target.parentElement.attributes[3].value;

			this.blockNumber = e.currentTarget.attributes[4].value;

			// see which PAGE the bloack is from and store for reference
			this.pageId = e.target.parentElement.parentElement.attributes[3].value;

			var options = {};

			if(this.blockType != "")
			{
				options.hasContent = true,
				options.contentType = this.blockType
			}
			alert("testing")
			// open the dialog
			try{
			var dialog = new App.Views.Dialog(options);
			dialog.render();
			}
			catch(e)
			{
				alert(e)
				alert("errr")
			}
	    },

	    settings: function(e)
	    {

	    	
			var options = {};
			options.settings = true;

			// open the dialog
			var dialog = new App.Views.Dialog(options);
			dialog.render();
	    },

	    animate: function()
	    {
	    	$(function() {

				App.Manager.PageTurn = (function() {

					var config = {
							$bookBlock : $( '#bb-bookblock' ),
							$navNext : $( '#nextPage' ),
							$navPrev : $( '#prevPage' ),
							$navJump : $( '#bb-nav-jump' ),
							bb : $( '#bb-bookblock' ).bookblock( {
								speed : 450,
								shadowSides : 0.8,
								shadowFlip : 0.7,
								shadows : false
							} )
						},
						init = function() {

							App.Manager.currentView.currentPage = 1;
							initEvents();
						},

						initEvents = function() {

							var $slides = config.$bookBlock.children(),
									totalSlides = $slides.length;

									App.Manager.PageTurn.jump = function(page)
									{
										config.bb.jump( page );
										App.Manager.currentView.currentPage = page;
									}

							// add navigation events
							config.$navNext.on( 'click', function() {

								config.bb.next();
								//App.Manager.currentView.currentPage ++;
								return false;

							} );

							config.$navPrev.on( 'click', function() {
								
								config.bb.prev();
								//App.Manager.currentView.currentPage --;
								return false;

							} );

							config.$navJump.on( 'click', function() {
								
								config.bb.jump( totalSlides );
								return false;

							} );
							
							// add swipe events
							$slides.on( {

								'swipeleft'		: function( event ) {
								
									config.bb.next();
									App.Manager.currentView.currentPage ++;
									return false;

								},
								'swiperight'	: function( event ) {
								
									config.bb.prev();
									App.Manager.currentView.currentPage --;
									return false;
									
								}

							} );

						};

						return { init : init };

				})();

				App.Manager.PageTurn.init();

			});
	    },

	    close: function()
		{
			$('#modal').removeClass('show-modal');
			$('#modal').addClass('hide-modal');
			$('#modal-mask').unbind();
			$('#modal-mask').remove();
			$('header').show();
			$('#modal').unbind();
			$('#modal').remove();
		},

	    openModal: function(e)
		{
			$('header').hide();
			this.$el.append("<div id='modal' data-modal-level='" + this.modalCount + "' class='hide-modal'></div><div id='modal-mask' data-modal-level='" + this.modalCount + "' ></div>");
			$('#modal-mask').show();

			// see which block was clicked on and store for reference
			this.blockId = e.target.attributes[2].value;
			// see which PAGE the bloack is from and store for reference
			this.pageId = e.target.parentElement.attributes[3].value;

			this.showOverview()
		},

		showOverview: function()
		{
			$('#modal').html(this.modalTemplates.overview);
			$('#modal').removeClass('hide-modal');
			$('#modal').addClass('show-modal');

			// Get the model of the page we are working with
			var pageModel = App.Manager.currentView.collection.get(this.pageId)

			// get the blocks element from the model
			var blocks = pageModel.get('blocks');

			// set the little preview to the image
			$('.content').attr('src', "http://scrapbook.uk.to/files/" + blocks[0].content)
		},

		showBlockSelection: function(e)
		{	
			$('#modal').html(this.modalTemplates.selection);
		},

		showBlockStyles: function(e)
		{	
			$('#modal').html(this.modalTemplates.border);
		},

		takePhoto: function()
		{
			var filename = null;
			var pageId = this.pageId;
			var blockId = this.blockId;
			navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
			}); 

			function onFail(error)
			{
				alert(error);
			}

			function onSuccess(imageURI)
			{
	            var options = new FileUploadOptions();
	            options.fileKey="file";
	            
	            var text = "";
			    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			    for( var i=0; i < 20; i++ )
			        text += possible.charAt(Math.floor(Math.random() * possible.length))
			 
			    filename = text;
			    
	            options.fileName = text;
	            options.mimeType="image/jpeg";

	            var params = new Object();
	            params.value1 = "test";
	            params.value2 = "param";

	            options.params = params;

	            var ft = new FileTransfer();
	            ft.upload(imageURI, encodeURI("http://scrapbook.uk.to/api/index.php/upload"), win, fail, options);

			}        

	        function win(returned)
	        {

				var pageModel = App.Manager.currentView.collection.get(pageId)

				// get the blocks element from the model
				var blocks = pageModel.get('blocks');

				// update the content to the new url
				blocks[0].content = filename + ".jpeg";

				// set it to an image
				blocks[0].content = filename + ".jpeg";

				// set the model upto date
				pageModel.set('blocks', blocks);

				// save the model back to the server
				pageModel.save({}, {
				    success: function (model, response) {
				        console.log("success");
				        alert(JSON.stringify(response))
				    },
				    error: function (model, response) {
				        console.log("error..");
				        alert(JSON.stringify(response))
				    }
				});

				alert("saved!")
	        }

	        function fail(error)
	        {
	            alert("An error has occurred: Code = " + error.code);
	            console.log("upload error source " + error.source);
	            console.log("upload error target " + error.target);
	        }
		},

		libraryPhoto: function()
		{
			var filename = null;
			var pageId = this.pageId;
			var blockId = this.blockId;
			navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			}); 

			function onFail(error)
			{
				alert(error);
			}

			function onSuccess(imageURI)
			{
	            var options = new FileUploadOptions();
	            options.fileKey="file";
	            
	            var text = "";
			    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			    for( var i=0; i < 20; i++ )
			        text += possible.charAt(Math.floor(Math.random() * possible.length))
			 
			    filename = text;
			    
	            options.fileName = text;
	            options.mimeType="image/jpeg";

	            var params = new Object();
	            params.value1 = "test";
	            params.value2 = "param";

	            options.params = params;

	            var ft = new FileTransfer();
	            ft.upload(imageURI, encodeURI("http://scrapbook.uk.to/api/index.php/upload"), win, fail, options);

			}        

	        function win(returned)
	        {

				var pageModel = App.Manager.currentView.collection.get(pageId)

				// get the blocks element from the model
				var blocks = pageModel.get('blocks');

				// update the content to the new url
				blocks[0].content = filename + ".jpeg";

				// set it to an image
				blocks[0].content = filename + ".jpeg";

				// set the model upto date
				pageModel.set('blocks', blocks);

				// save the model back to the server
				pageModel.save({}, {
				    success: function (model, response) {
				        console.log("success");
				        alert(JSON.stringify(response))
				    },
				    error: function (model, response) {
				        console.log("error..");
				        alert(JSON.stringify(response))
				    }
				});

				alert("saved!")
	        }

	        function fail(error)
	        {
	            alert("An error has occurred: Code = " + error.code);
	            console.log("upload error source " + error.source);
	            console.log("upload error target " + error.target);
	        }
		},

		preventDefault: function(event)
	    {
		    event.preventDefault();
		},

	    nextPage: function()
	    {
	    	next = App.activePage + 1;

			//if($('#page_' + next).length > 0)
			//{
			//	$('#page_' + App.activePage).hide(); // hide current page
			//	$('#page_' + next).show(); // show next page
			//	App.activePage = next; // + by 1
			//} else
			//{
			//	alert("no more pages!");
			//}
	    },

	    prevPage: function()
	    {
	    	prev = App.activePage - 1;

			//if($('#page_' + prev).length > 0)
			//{
			//	$('#page_' + App.activePage).hide(); // hide current page
			//	$('#page_' + prev).show(); // show next page
			//	App.activePage = prev; // + by 1
			//} else
			//{
			//	alert("At the first page!");
			//}
	    },

	    initialize: function()
		{
			App.Manager.appView.updateHeader('Edit Scrapbook');
		},

	    setBookSizes: function()
	    {
	        $('.topPage').height($('.topPage').width());
	        $('.middlePage').height($('.topPage').width() - 4);
	        $('.bottomPage').height($('.topPage').width() - 8);
    	}
	});

		// Page collection view
	// ----------------------------------------------------------------------

	App.CollectionViews.PagesLandscape = Backbone.View.extend({
	    
	    tagName: 'div',

	    className: 'bookEdit padding',

	    render: function(){

	        this.collection.each(function(tempPage) {
	        	//create a new view for the current scrapbook model
	            var view = new App.Views.Page({ model: tempPage });
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
	    	'': 'home',
	        'login' : 'login',
	        'logout' : 'logout',
	        'book/edit/:id': 'edit',
	        'purchases': 'purchases',
	        'create': 'create',
	        'profile': 'profile',
	        'friends': 'friends',
	        'settings': 'settings'
	    },

	    login: function(){
	    	//alert("login started")
	    	App.Manager.loginView = new App.Views.Login;
	        $('body').html(App.Manager.loginView.render().el);
	        //alert("about to turn off")
	        navigator.splashscreen.hide();
	    },

	    logout: function(){

	        FB.logout(function(response) {
            	
            });

	        App.Manager.user = null;
	        App.Manager.appView.remove();
			App.Manager.appView.unbind();
	        App.Manager.appView = null;
	        App.router.navigate("", {trigger: true, replace: true});
	    },

	    home: function()
	    {

	    	if(App.Manager.user)
			{
				if(App.Manager.appView == null)
				{
					App.Manager.drawChrome();
				}
		    	App.Manager.activeCollections.scrapbooks = new App.Collections.Scrapbooks;
				App.Manager.activeCollections.scrapbooks.fetch({
					data: {
						user: App.Manager.user.get('id')
					},
					dataType : 'jsonp',
					success: function(collection)
					{
						var collectionView = new App.CollectionViews.Scrapbooks({ collection: collection });
						App.Manager.setView(collectionView);
						collectionView.setCoverSizes();
						collectionView.insertNewShortcut();
					},
					error: function(collection, error)
					{
					    alert("There was an error with fetching the collection of scrapbooks.");
					    console.log(error)
					}
				});

			}
			else
			{
				// The user is not logged in so show the login screen
				App.router.navigate("login", {trigger: true, replace: true});
			}
	    },

	    edit: function(id){

	    	App.Manager.scrapbookId = id;
	        App.Manager.activeCollections.pages = new App.Collections.Pages;
			App.Manager.activeCollections.pages.fetch({
				data: {
					scrapbook: id
				},
				dataType : 'jsonp',
				success: function(collection)
				{
					//console.log(collection)
					var collectionPageView = new App.CollectionViews.Pages({ collection: collection });
					App.Manager.setView(collectionPageView);
					$('#bb-bookblock').append("<div class='bb-item' style='display: none;'><div class='topPage'><div class='newPage' style='color: #999; font-size: 33px;text-align: center;padding-top: 43%;'>tap to start new page</div></div></div>")
					$('#page_1').show();
					collectionPageView.animate();
					collectionPageView.setBookSizes();
					App.activePage = 1;

					//var dialog = new App.Views.Dialog;
					//dialog.render();
				},
				error: function(response, error)
				{
				    alert("There was an error with fetching the collection of pages for this scrapbook.")
				    alert(JSON.stringify(error));
				    alert(JSON.stringify(response))
				    console.log(error)
				}
			});
	    },

	    create:  function(){

			var createView = new App.Views.CreateScrapbook;
	        App.Manager.setView(createView); 
	    },

	    purchases: function(id){

	        App.Manager.activeCollections.purchases = new App.Collections.Purchases;
			App.Manager.activeCollections.purchases.fetch({
				data: {
					user: App.Manager.user.get('id')
				},
				dataType : 'jsonp',
				success: function(collection)
				{
					console.log(collection)
					var purchasesView = new App.CollectionViews.Purchases({ collection: collection });
        			App.Manager.setView(purchasesView); 
				},
				error: function(collection, error)
				{
				    alert("There was an error with fetching the collection of purchases.");
				    console.log(error)
				}
			});

	    },

	    profile: function(){

			var profileView = new App.Views.Profile({ model: App.Manager.user });
        	App.Manager.setView(profileView); 

	    },

	    friends: function(){

			var friendsView = new App.CollectionViews.Friends();
			App.Manager.setView(friendsView); 
				

	    },

	    settings:  function(){

			$('#content').html($("#template-settings").html());
			//closeMenu();

	    },

	})

	
	
	// Startup backbone...
	App.router = new App.Router;
	Backbone.history.start();

	

}, false);


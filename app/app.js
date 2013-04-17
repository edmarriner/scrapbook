$(document).ready(function() {


  try {
  alert('Device is ready! Make sure you set your app_id below this alert.');
  FB.init({ appId: "425907780826832", nativeInterface: CDV.FB, useCachedDialogs: false });
  } catch (e) {
  alert(e);
  }
 

	FB.Event.subscribe('auth.login', function(response) {
                               alert('auth.login event');
                               });
            
            FB.Event.subscribe('auth.logout', function(response) {
                               alert('auth.logout event');
                               });
            
            FB.Event.subscribe('auth.sessionChange', function(response) {
                               alert('auth.sessionChange event');
                               });
            
            FB.Event.subscribe('auth.statusChange', function(response) {
                               alert('auth.statusChange event');
                               });


            function getLoginStatus() {
                FB.getLoginStatus(function(response) {
                  if (response.status == 'connected') {
                  alert('logged in');
                  } else {
                  alert('not logged in');
                  }
                });
            }

	alert("facebook done");
	// JQUERY Functions

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

		logOut: function()
		{
			FB.logout(function(response) {
            	alert('logged out');
            });
	        this.user = null;
	        App.router.navigate("", {trigger: true, replace: true});
		},

		start: function()
		{
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

	    render: function()
	    {
	        this.$el.html($('#template-app').html());
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

		initialize: function()
		{
			alert("loginning in view")
		},

		// Cache the template function for a single item.
		template: _.template($('#template-login').html()),

	    render: function() {
	    	alert("rendering login");
	        this.$el.html(this.template());
	        return this;
	    },

	    login: function()
	    {
	    	console.log("about to request facebook login");

	    	// login to facebook
	    	 FB.login(function(response) {

	    	 	console.log(response)

			   if (response.authResponse) {

			     console.log('Login was successful');

			   	 FB.api('/me', function(response) {
				   	 	console.log(response);
			   	   	console.log('user is' + response.name);
					       App.Manager.user = new App.Models.User;
					       App.Manager.user.fetch({
						data: {
							user: response.id
						},
						dataType : 'jsonp',
						success: function(result)
						{
							console.log(result);
						},
						error: function(collection, error)
						{
						    alert("There was an error with fetching the timeline of your friends.");
						    console.log(error)
						}
					});
				    // });
			   } else {
			     console.log('User cancelled login or did not fully authorize.');
			   }
			 });

            // check if login worked
    		alert('getting timeline...!');
    		this.activeCollections.timeline = new App.Collections.Timeline;
				
				this.activeCollections.timeline.fetch({
					data: {
						user: App.Manager.user.get('id')
					},
					dataType : 'jsonp',
					success: function(collection)
					{
						App.Manager.appView.updateTimeline(collection);
					},
					error: function(collection, error)
					{
					    alert("There was an error with fetching the timeline of your friends.");
					    console.log(error)
					}
				});
	    }
	});


	// App sign up view
	// ----------------------------------------------------------------------

	App.Views.Home = Backbone.View.extend({

		className: 'home',

		tagName: 'div',

	    render: function() {
	        this.$el.html($('#template-signup').html());
	        return this;
	    },

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
	    	var password = $('#signUpPassword').val()
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
	
	// Single friend
	// ----------------------------------------------------------------------

	App.Views.Friend = Backbone.View.extend({

		className: 'frame',

		events: {
			'click #removeFriend' : 'remove'
		},

		// Cache the template function for a single item.
		template: _.template($('#template-single-friend').html()),

	    render: function()
	    {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    },

	    remove: function()
	    {  	
	    	
	    	var removeFriend = $.get(App.Manager.serverURL + '/removeFriend', {user: App.Manager.user.get('id'), friend: this.model.get('id')})
	    	.done(function()
	    	{
	    		App.Manager.activeCollections.friends.remove(this.model);
	    		alert("removed!")
	    	})
	    	.fail(function()
	    	{
	    		alert("error, friend not removed!"); 
	    	});
	    }

	});

	// Single friend
	// ----------------------------------------------------------------------

	App.Views.Timeline = Backbone.View.extend({

		tagName: 'li',

		// Cache the template function for a single item.
		template: _.template($('#template-timeline').html()),

	    render: function()
	    {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    },

	});

	// Scrapbook collection view
	// Used on the home screen to display all the scrapbooks as a collection
	// ----------------------------------------------------------------------

	App.CollectionViews.Friends = Backbone.View.extend({
	    
	    tagName: 'div',

	    className: 'friends padding',

	    events: 
	    {
	    	'click #friendsSearch' : 'add'
	    },

	    // Cache the template function for a single item.
		template: _.template($('#template-friends').html()),

		initialize: function()
		{
			App.Manager.appView.updateHeader('Friends');
		},

		add:function()
		{
			var findFriend = $.get(App.Manager.serverURL + '/addFriend', {user: App.Manager.user.get('id'), email: this.$el.find('#friendsEmail').val()})
	    	.done(function()
	    	{
	    		alert("added!")
	    	})
	    	.fail(function()
	    	{
	    		alert("error, friend not found!"); 
	    	});
		},

	    render: function()
	    {

	    	this.$el.html(this.template());
	    	console.log(this.collection)
	        this.collection.each(function(tempFriend)
	        {
	        	//create a new view for the current scrapbook model
	            var view = new App.Views.Friend({ model: tempFriend });
	            this.$el.append(view.render().el);
	        }, this);

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

	App.Views.Purchases = Backbone.View.extend({

		className: 'purchases padding',

		// Cache the template function for a single item.
		template: _.template($('#template-purchases').html()),

	    render: function()
	    {
	        this.$el.html(this.template());
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
		},

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

			"click #createScrapbookButton" : "createScrapbook"
		},

		// Cache the template function for a single item.
		template: _.template($('#template-create').html()),

	    render: function() {
	        this.$el.html(this.template());
	        return this;
	    },

	    createScrapbook: function()
	    {

	    	var title = $('#createScrapbookTitle').val();
	    	var description = $('#createScrapbookDescription').val();

	    	
			var newScrapbook = new App.Models.Scrapbook;

			 
			newScrapbook.set("authors", 1);
			newScrapbook.set("owners", 1);
			newScrapbook.set("title", title);
			newScrapbook.set("description", description);
			newScrapbook.set("status", "open");

			var data = newScrapbook.toJSON();
			data.user = App.Manager.user.get('id');
			newScrapbook.save(data, {

				success: function(obj)
				{
					App.Manager.activeCollections.scrapbooks.add(newScrapbook)
					alert("saved!");
					App.router.navigate("/book/edit/id", {trigger: true, replace: true});
				},
				error: function(obj, error)
				{
				    alert("There was an error with saving the scrapbooks.");
				    console.log(error);
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

	// Single Page View
	// ----------------------------------------------------------------------

	App.Views.Page = Backbone.View.extend({

		className: "topPage",

	    // Cache the template function for a single item.
		template: _.template($('#template-book-single').html()),

		initialize: function()
		{
			this.model.bind('change', this.render, this);

			// set the page number on the div element
			$(this.el).attr('id', "page_" + this.model.get('pageNumber')); 

			// set the scrapbook id on the div element
			$(this.el).attr('data-scrapbook-id', this.model.get('scrapbookId')); 

			$(this.el).attr('data-page-id', this.model.get('id')); 

			// hide the element
			//$(this.el).hide();
		},

	    render: function() {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }
	});

	// Page Collection
	// ----------------------------------------------------------------------

	App.Collections.Pages = Backbone.Collection.extend({

		model: App.Models.Page,

		url: App.Manager.serverURL + '/pages'

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

	    className: 'home padding',

	    setCoverSizes: function()
	    {
			$('.cover').height($('.cover').width());
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

	        return this;
	    }
	});

	// Modal
	App.Views.Dialog = Backbone.View.extend({

		el: '#viewport',

		// Cache the template function for a single item.
		template: _.template($('#template-dialog').html()),

		events: 
		{
			'click .dialogMask': 'close'
		},

		initialize: function()
		{
			console.log(this.$el)
		},

	    render: function()
	    {
	        this.$el.append(this.template());
	        this.$el.find('.dialog').center();
	        this.alwaysCenter();
	        return this;
	    },

	    close: function()
	    {
			this.unbind();
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
		    "click #chooseLibrary": "libraryPhoto"
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
	            
	            //this.$el.append();
	        }, this);

	        //while($('.bb-item').length == 0){}



	        return this;
	    },

	    dialog: function()
	    {
	    	var dialog = new App.Views.Dialog;
			dialog.render();
	    },

	    animate: function()
	    {
	    	$(function() {

				var Page = (function() {

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

							initEvents();
							
						},
						initEvents = function() {

							var $slides = config.$bookBlock.children(),
									totalSlides = $slides.length;

							// add navigation events
							config.$navNext.on( 'click', function() {

								config.bb.next();
								return false;

							} );

							config.$navPrev.on( 'click', function() {
								
								config.bb.prev();
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
									return false;

								},
								'swiperight'	: function( event ) {
								
									config.bb.prev();
									return false;
									
								}

							} );

						};

						return { init : init };

				})();

				Page.init();

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
	        'signup': 'signup',
	        'book/edit/:id': 'edit',
	        'purchases': 'purchases',
	        'create': 'create',
	        'profile': 'profile',
	        'friends': 'friends',
	        'settings': 'settings'
	    },

	    signup: function(){
    		alert("not done");
	    },

	    login: function(){

	    	var loginView = new App.Views.Login;
	        App.Manager.setView(loginView); 

    		
	    },

	    logout: function(){
	        App.Manager.LogOut();
	    },

	    home: function()
	    {

	    	if(this.user)
			{

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
				alert("login required..");
				App.router.navigate("login", {trigger: true, replace: true});
			}
	    },

	    edit: function(id){

	        var pageCollection = new App.Collections.Pages;
			pageCollection.fetch({
				data: {
					scrapbook: id
				},
				dataType : 'jsonp',
				success: function(collection)
				{
					//console.log(collection)
					var collectionPageView = new App.CollectionViews.Pages({ collection: collection });
					App.Manager.setView(collectionPageView);
					$('.single').append("<div class='topPage'><div style='color:red; fonr-size:50px;'>add new page?</div></div>")
					$('#page_1').show();
					collectionPageView.animate();
					collectionPageView.setBookSizes();
					App.activePage = 1;
					//var dialog = new App.Views.Dialog;
					//dialog.render();
				},
				error: function(collection, error)
				{
				    alert("There was an error with fetching the collection of pages for this scrapbook.")
				}
			});
	    },

	    create:  function(){

			var createView = new App.Views.CreateScrapbook;
	        App.Manager.setView(createView); 
	    },

	    purchases: function(id){

			var purchasesView = new App.Views.Purchases;
	        App.Manager.setView(purchasesView); 

	    },

	    profile: function(){

			var profileView = new App.Views.Profile({ model: App.Manager.user });
        	App.Manager.setView(profileView); 

	    },

	    friends: function(){

	    	App.Manager.activeCollections.friends = new App.Collections.Users;
			App.Manager.activeCollections.friends.fetch({
				data: {
					user: App.Manager.user.get('id')
				},
				dataType : 'jsonp',
				success: function(collection)
				{
					console.log(collection)
					var friendsView = new App.CollectionViews.Friends({ collection: collection });
        			App.Manager.setView(friendsView); 
				},
				error: function(collection, error)
				{
				    alert("There was an error with fetching the collection of friends.");
				    console.log(error)
				}
			});

	    },

	    settings:  function(){

			$('#content').html($("#template-settings").html());
			//closeMenu();

	    },

	})
	// start the application
	App.Manager.start();


	// Startup backbone...
	App.router = new App.Router;
	Backbone.history.start();

	

 }, false);
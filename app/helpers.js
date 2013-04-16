$(document).ready(function(){

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

	App.Helpers.toggleMenu = function()
	{
		if($('#page').hasClass('menu-closed'))
		{
			$('#page').removeClass('menu-closed');
			$('nav').removeClass('hide-nav');
			$('nav').addClass('show-nav');
			$('#page').addClass('menu-open');
			$('#mask').toggle();
		}
		else
		{
			$('#page').removeClass('menu-open');
			$('#page').removeClass('show-nav');
			$('nav').addClass('hide-nav');
			$('#page').addClass('menu-closed');
			$('#mask').toggle();
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

	
	App.Helpers.Today = function()
	{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;
		return today;
	}

	App.Helpers.NextPage = function()
	{
		if($('#page_' + App.activePage + 1).length > 0)
		{
			$('#page_' + App.activePage).hide(); // hide current page
			$('#page_' + App.activePage + 1).show(); // show next page
			App.activePage = App.activePage + 1; // + by 1
		} else
		{
			alert("no more pages!");
		}
	}
});
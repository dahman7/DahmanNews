/**
 * News PAGE - Hackernews
 *
 */


// News templates Module
(function() {
	/*
	 * MAIN
	 **/
	var init = function () {

		//template single article in the news list
		$M.Templates.NewsItem = "\
					<li data-id='<%= id %>' data-counter='<%= number-1 %>'>\
						 <a href='<%= url %>' class='story '> \
							<h3><%= title %></h3>\
							<span class='points'><%= points %></span>&nbsp;\
							<span class='author'><%= postedBy %></span>&nbsp; \
							<span class='time-ago'><%= postedAgo %></span>&nbsp; \
							<span class='url'><%= $M.ParseUrl(url).parent_domain %></span>\
						</a><a href='<%= url %>' class='comments'><span class='icon icon-bubble'></span><%= commentCount %></a>\
					</li>\
				";
		//template news list container
		$M.Templates.NewsBloc = "\
				<% for (var i = 0, item; item = items[i]; i++) { %>\
					<% if (item) { %>\
					<% item.number=i+1 %>\
						<%= new EJS({'text': $M.Templates.NewsItem}).render(item)  %>\
					<% } %>\
				<% } %>\
			";
		//Template comments Container
		$M.Templates.NewsCommentBloc = "\
				<% for (var i = 0, cmnt; cmnt = comments[i]; i++) { %>\
					<div class='commentBox'>\
						<div class='commentBoxTop'>\
								<time> <%= cmnt.postedAgo %></time> \
								<span class='author'>by <%= cmnt.postedBy %></span>\
						</div>\
						<div class='commentBoxBottom'>\
								<p>posted <%= cmnt.comment %></p> \
						</div>\
					</div>\
				<% } %>\
				";

	};

	if (typeof $M === 'undefined') {
		$M = {};
	}
	$M.Templates = init;
})();

//parsing url function
(function(url) {
	/*
	 * parsing url
	 **/
	var init = function (url) {
		parsed_url = {}

	    if ( url == null || url.length == 0 )
	        return parsed_url;

	    protocol_i = url.indexOf('://');
	    parsed_url.protocol = url.substr(0,protocol_i);

	    remaining_url = url.substr(protocol_i + 3, url.length);
	    domain_i = remaining_url.indexOf('/');
	    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
	    parsed_url.domain = remaining_url.substr(0, domain_i);
	    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

	    domain_parts = parsed_url.domain.split('.');
	    switch ( domain_parts.length ){
	        case 2:
	          parsed_url.subdomain = null;
	          parsed_url.host = domain_parts[0];
	          parsed_url.tld = domain_parts[1];
	          break;
	        case 3:
	          parsed_url.subdomain = domain_parts[0];
	          parsed_url.host = domain_parts[1];
	          parsed_url.tld = domain_parts[2];
	          break;
	        case 4:
	          parsed_url.subdomain = domain_parts[0];
	          parsed_url.host = domain_parts[1];
	          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
	          break;
	    }

	    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

	    return parsed_url;
	};

	if (typeof $M === 'undefined') {
		$M = {};
	}
	$M.ParseUrl = init;
})();


// News Init Module
(function() {
	/*
	 * MAIN
	 **/
	var Initcall= function(){
		$.jsonp({
			type: 'GET',
			url: 'http://api.ihackernews.com/page?format=jsonp&callback=?'
		}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
			$('.no-story').html('error with server <br/> please click refresh');
		}).done(function ( data ) {
			pageData=data;
			var html = new EJS({'text': $M.Templates.NewsBloc}).render(data);
			$('.list').html(html);
			$('ul.list').height($(window).height() - 102);

			//initialize the right side
			$('.right-side').removeClass('filled');
			$('.page-about').html('<span class="no-story">No Story Selected</span>');
		});
	}
	var init = function () {

		//first call to news list
		Initcall();

		$('body').on('click','.left-side .btn-refresh',function(e){
			//implement event for refresh
			Initcall();
		});
		$('body').on('click','.itemDetails .link',function(e){
			window.open(pageData.items[$(this).parents('.itemBox').data('counter')].url,'_blank');
		});
		//click event of sidebar menu
		$('body').on('click','.menu-left-side',function(e){
			$('.menu-left-side').delay(500).hide();
			$('.right-side').delay(500).show();
			$('.left-side').delay(500).show();
		});

		$('body').on('click','li a.story',function(e){
			e.preventDefault();
			var id=$(this).parent().data('id');

			$('.itemBox li').removeClass('active');
			$(this).parent().addClass('active');

			if($(this).parents('.itemBox').hasClass('active') || $(this).hasClass('disabled')){
				$('.itemBox').removeClass('active');
				$('.itemBox .loadingCmnt').remove();
			}
			else{
				$('.itemBox').removeClass('active');
				$('.itemBox .loadingCmnt').remove();
				$(this).parents('.itemBox').addClass('active');
				$( "<div class='loadingCmnt'></div>" ).insertAfter( $(this).parent() );
			}

			var heightIframe=$(window).height() - 52;
			var html = '<iframe width="100%" height="'+heightIframe+'px" src="'+$(this).attr("href")+'"/>';
			$('.right-side .page').html(html);
			$('.right-side').addClass('filled');
			if($( window ).width()<760){
				$('.menu-left-side').delay(500).show();
				$('.right-side').delay(500).show();
				$('.left-side').delay(500).hide();
				$('.menu-left-side').width(15);
				$('.right-side').width($(window).width() - 17);
			}
		})
		$('body').on('click','li a.comments',function(e){
			e.preventDefault();
			var id=$(this).parent().data('id');

			$('.itemBox li').removeClass('active');
			$(this).parent().addClass('active');

			if($(this).parents('.itemBox').hasClass('active') || $(this).hasClass('disabled')){
				$('.itemBox').removeClass('active');
				$('.itemBox .loadingCmnt').remove();
			}
			else{
				$('.itemBox').removeClass('active');
				$('.itemBox .loadingCmnt').remove();
				$(this).parents('.itemBox').addClass('active');
				$( "<div class='loadingCmnt'></div>" ).insertAfter( $(this).parent() );
			}


			//the api sometime dont respond so i implement as a second solution the iframe content
			$.jsonp({
			 	type: 'GET',
				url: 'http://api.ihackernews.com/post/'+id+'?format=jsonp&callback=?',
				params:{scope:this}
			}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
				//in case api doesn't respond we include the page into iframe
				$('.right-side').removeClass('filled');
				$('.page-about').html('<span class="no-story">Error contacting server <br> redirecting to page</span>');
				var heightIframe=$(window).height() - 52;
				var html = '<iframe width="100%" height="'+heightIframe+'px" src="'+$(XMLHttpRequest.params.scope).attr("href")+'"/>';
				setTimeout(function(){
					$('.right-side .page').html(html);
					$('.right-side').addClass('filled');
					if($( window ).width()<760){
						$('.menu-left-side').delay(500).show();
						$('.right-side').delay(500).show();
						$('.left-side').delay(500).hide();
						$('.menu-left-side').width(15);
						$('.right-side').width($(window).width() - 17);
					}
				}, 2000);

			}).done(function ( data ) {
				pageData=data;
				var html = new EJS({'text': $M.Templates.NewsCommentBloc}).render(pageData);
				$('.right-side .page').html(html);
				$('.right-side').addClass('filled');
			});
		})
	};

	if (typeof $M === 'undefined') {
		$M = {};
	}
	$M.newsInit = init;
})();
$(document).ready(function () {
	var pageData;
	var OldHeight=0;
	var OldWidth=0;
	$M.Templates();
	$M.newsInit();

	//resize event to detect height/width variation
	$(window).resize(function() {
		if(Math.abs($(window).height()-OldHeight)>10){
			OldHeight=$(window).height();
			$('.right-side , .left-side, .menu-left-side ,iframe').height($(window).height() - 52);
			$('ul.list').height($(window).height() - 102);
		}
		if($(window).width()>760){
			$('.left-side').width('35%');
			$('.right-side').width('65%');
			$('.menu-left-side').hide();
			$('.left-side').show();
		}else if(Math.abs($(window).width()-OldWidth)>10 && $('.left-side').css('display')=='none'){
			OldWidth=$(window).width();
			$('.menu-left-side').width(15);
			$('.right-side').width($(window).width() - 17);
		}


	});


	//trigger first time
	$(window).trigger( "resize" );
});

$( document ).ready(function() {
document.addEventListener("deviceready", function () {

  // DOMMouseScroll included for firefox support
  var canScroll = true,
      scrollController = null;
  $(this).on('mousewheel DOMMouseScroll', function(e){

    if (!($('.outer-nav').hasClass('is-vis'))) {

      e.preventDefault();

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

	  if($(".section--is-active").find(".intro").size() > 0) {
		canScroll = false;
	  } 
	  else {
		canScroll = true;
	  }

      if (delta > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(1);
      }
      else if (delta < -50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(-1);
      }

    }

  });

  $('.side-nav li, .outer-nav li').click(function(){

    if (!($(this).hasClass('is-active'))) {

      var $this = $(this),
          curActive = $this.parent().find('.is-active'),
          curPos = $this.parent().children().index(curActive),
          nextPos = $this.parent().children().index($this),
          lastItem = $(this).parent().children().length - 1;

	  if(curPos !== 0) {
	      updateNavs(nextPos);
    	  updateContent(curPos, nextPos, lastItem);
	  }
	  else {
		  alert('Faça o login para acessar as funcionalidades.')
	  }

    }

  });

  $('.cta').click(function(){

	var curActive = $('.side-nav').find('.is-active'),
	curPos = $('.side-nav').children().index(curActive),
	lastItem = $('.side-nav').children().length - 1,
	nextPos = curPos + 1;

	var d = new Date();
	var cookieName = 'sessionlogin';
	var cookieValue = $("#user-login").val() + '-' + $("#user-pass").val();

	var expirationDays = 2;
	d.setTime(d.getTime() + (expirationDays*24*60*60*1000));

	var expires = "expires="+ d.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";

	var successLoginReset = function(offline = false) {
		setTimeout(function(){ 
			loadCustomerFromBackup(db, offline);
			loadScheduledTimeFromBackup(db, offline);
			loadBlockedTimeFromBackup(db, offline);
		}, 2000);

		setTimeout(function(){
			alert('Restauração realizada, para melhor desempenho, faça novo login com seu usuário comum!');
			successLoginCallback();
		}, 5000);

	}

	var successLoginCallback = function() {
		initCustomers();
		initScheduler();

		updateNavs(nextPos);
		updateContent(curPos, nextPos, lastItem);
		$("#user-pass").val("");
		$('.header--nav-toggle').removeClass('hide');	
	}

	//TODO fazer validacao backend
	if(cookieValue.toLowerCase() === 'f-' || cookieValue === 'rodrigo-admin123' || cookieValue === 'reset-reset') {

		if(cookieValue === 'reset-reset') {
			$( "#dialog-offline" ).dialog({
			  resizable: true,
			  height: "auto",
			  width: "auto",
			  modal: true,
			  closeOnEscape: false,
			  buttons: {
				"Resetar para versão online": function() {
				  successLoginReset(false);
				  $( this ).dialog( "close" );
				},
				"Resetar para versão de backup local": function() {
				  successLoginReset(true);
				  $( this ).dialog( "close" );
				}
			  }
			});
		} else {
			successLoginCallback();
		}
		
	} else {
		alert('Ops! Login incorreto.');
	}

  });

  // swipe support for touch devices
  var targetElement = document.getElementById('viewport'),
      mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on('swipeup swipedown', function(e) {

    updateHelper(e);

  });

  $(document).keyup(function(e){

    if (!($('.outer-nav').hasClass('is-vis'))) {
      e.preventDefault();
      updateHelper(e);
    }

  });

  // determine scroll, swipe, and arrow key direction
  function updateHelper(param) {

    var curActive = $('.side-nav').find('.is-active'),
        curPos = $('.side-nav').children().index(curActive),
        lastItem = $('.side-nav').children().length - 1,
        nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem && curPos !== 0) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
    else if (param.type === "swipedown" || param.keyCode === 38 || param < 0){
      if (curPos !== 0 && curPos !== 1){
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(curPos);
        updateContent(curPos, curPos, lastItem);
      }
    }

  }

  // sync side and outer navigations
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');

  }

  // update main content area
  function updateContent(curPos, nextPos, lastItem) {

    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    }
    else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    }
    else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    }
    else {
      $('.header--cta').removeClass('is-active');
    }

  }

  function outerNav() {

    $('.header--nav-toggle').click(function(){

      $('.perspective').addClass('perspective--modalview');
      setTimeout(function(){
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');

    });

    $('.outer-nav--return, .outer-nav li').click(function(){

      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function(){
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');

    });

  }

  function transitionLabels() {

    $('.work-request--information input').focusout(function(){

      var textVal = $(this).val();

      if (textVal === "") {
        $(this).removeClass('has-value');
      }
      else {
        $(this).addClass('has-value');
      }

      // correct mobile device window position
      window.scrollTo(0, 0);

    });

  }

  outerNav();
  transitionLabels();

}); //cordova ready
}); //jquery ready

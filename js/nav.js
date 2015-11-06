var nav = {};

nav.viewport = document.getElementById('main-nav');

nav.header = document.getElementById('main-nav-header');

nav.init = function () {

	nav.active = false;

	nav.viewport.classList.remove('is-animating');

	nav.viewport.style.transform = 'translateX(' + ( window.innerWidth - nav.header.offsetWidth ) + 'px)';

	setTimeout(function() {
		nav.viewport.classList.add('is-animating');
	}, 300);

	window.addEventListener('resize', function() {

		nav.viewport.classList.remove('is-animating');

		nav.viewport.style.transform = 'translateX(' + ( window.innerWidth - nav.header.offsetWidth ) + 'px)';

		setTimeout(function() {
			nav.viewport.classList.add('is-animating');
		}, 300);

	});

	nav.header.addEventListener('click', function() {

		if (nav.active) nav.viewport.style.transform = 'translateX(' + ( window.innerWidth - nav.header.offsetWidth ) + 'px)';
		else nav.viewport.style.transform = 'translateX(' + ( window.innerWidth - nav.viewport.offsetWidth ) + 'px)';

		nav.active = !nav.active;

	});

};
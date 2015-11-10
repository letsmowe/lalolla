function Nav() {

	this.viewport = document.getElementById('main-nav');

	this.header = document.getElementById('main-nav-header');

}

Nav.prototype.init = function () {

	this.active = false;

	this.viewport.classList.remove('is-animating');

	this.viewport.style.transform = 'translateX(' + ( window.innerWidth - this.header.offsetWidth ) + 'px)';

	setTimeout(function() {
		this.viewport.classList.add('is-animating');
	}, 300);

	window.addEventListener('resize', function() {

		this.viewport.classList.remove('is-animating');

		this.viewport.style.transform = 'translateX(' + ( window.innerWidth - this.header.offsetWidth ) + 'px)';

		setTimeout(function() {
			this.viewport.classList.add('is-animating');
		}, 300);

	});

	this.header.addEventListener('click', function() {

		if (this.active) this.viewport.style.transform = 'translateX(' + ( window.innerWidth - this.header.offsetWidth ) + 'px)';
		else this.viewport.style.transform = 'translateX(' + ( window.innerWidth - this.viewport.offsetWidth ) + 'px)';

		this.active = !this.active;

	});

};
/*!
 * Mowe La Lolla v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/magmafantastico/lalolla/blob/master/LICENSE)
 */

var nav = new Nav();

nav.init();

var url;

url = "https://api.instagram.com/v1/users/2244150949/media/recent/?client_id=80703e5f430749578c3113ff9eb19c9b";
url = "https://api.instagram.com/v1/users/225309780/media/recent/?client_id=80703e5f430749578c3113ff9eb19c9b";
url = "https://api.instagram.com/v1/users/2216452236/media/recent/?access_token=2216452236.2a3f246.b2c6417da4f84406a38198dd54de7c5f";

var installery = new Installery(document.getElementById('installery-gallery'), false);

installery.loadBrandData([
	{
		caption: {
			text: 'Garnus'
		},
		brand: true,
		images: {
			standard_resolution: {
				url: 'img/garnus.png'
			}
		}
	},
	{
		caption: {
			text: 'Khelf'
		},
		brand: true,
		images: {
			standard_resolution: {
				url: 'img/khelf.png'
			}
		}
	},
	{
		caption: {
			text: 'Miss Chilli'
		},
		brand: true,
		images: {
			standard_resolution: {
				url: 'img/miss-chilli.png'
			}
		}
	}
]);

installery.init(url);

var foo = function() {
//		console.log(this);
	document.getElementById('main').classList.toggle('light-blue-100');
};

var menu = new Menu(document.getElementById('installery-menu'), {
	name: 'cagories',
	title: false,
	showItems: 3,
	list: [
		{
			name: 'camisetas',
			title: 'Camisetas',
			onClick: function() {
				installery.reload();
			}
		},
		{
			name: 'categoria-01',
			title: 'Saias',
			onClick: foo
		},
		{
			name: 'categoria-02',
			title: 'Vestidos',
			onClick: foo
		},
		{
			name: 'categoria-03',
			title: 'Blusas',
			onClick: foo
		},
		{
			name: 'categoria-04',
			title: 'Camisas',
			onClick: foo
		},
		{
			name: 'categoria-05',
			title: 'Bolsas',
			onClick: foo
		},
		{
			name: 'categoria-06',
			title: 'Sapatos',
			onClick: foo
		},
		{
			name: 'categoria-07',
			title: 'Batas',
			onClick: foo
		}
	]
});

menu.init();

var contact = new Contact(document.getElementById('contact-form'), {
	url: 'i/mail/'
});

contact.init();
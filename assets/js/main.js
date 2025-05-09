const SCRIPT_VERSION = '1.0.4';
console.log(`Script version: ${SCRIPT_VERSION}`);

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');
        
    // Track whether contact form handler has been initialized
    var contactFormInitialized = false;

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Contact form handling - only initialize once
	function setupContactForm() {
		// Only set up once to prevent duplicate submissions
		if (contactFormInitialized) {
			console.log('Contact form already initialized, skipping setup');
			return;
		}

		console.log('Setting up contact form handler');
		const contactForm = document.getElementById('contactForm');
		const submitBtn = document.getElementById('submitBtn');
		const successPopup = document.getElementById('successPopup');
		
		if (contactForm && submitBtn) {
			console.log('Contact form elements found, attaching event');
			
			// Remove any existing event listeners if possible
			const newSubmitBtn = submitBtn.cloneNode(true);
			submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
			
			// Add the event listener to the new button
			newSubmitBtn.addEventListener('click', async function() {
				console.log('Submit button clicked');
				
				const originalText = newSubmitBtn.textContent;
				
				// Show loading state
				newSubmitBtn.disabled = true;
				newSubmitBtn.textContent = 'Sending...';
				
				const name = document.getElementById('name').value;
				const email = document.getElementById('email').value;
				const message = document.getElementById('message').value;
				
				// Validate form
				if (!name || !email || !message) {
					alert('Please fill out all fields');
					newSubmitBtn.disabled = false;
					newSubmitBtn.textContent = originalText;
					return;
				}
				
				console.log(`Sending message from ${name} (${email})`);
				
				try {
					// Your API Gateway endpoint
					const response = await fetch('https://qn5l9eb16a.execute-api.ap-south-1.amazonaws.com/prod/contact', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ name, email, message })
					});
					
					console.log('Response status:', response.status);
					const result = await response.json();
					console.log('Response data:', result);
					
					// Parse the response
					let success = false;
					
					if (result.statusCode === 200) {
						const bodyObj = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
						success = bodyObj.success;
					}
					
					// Display popup notification on success
					if (success) {
						// Reset form
						contactForm.reset();
						
						// Show popup
						if (successPopup) {
							successPopup.style.display = 'block';
							
							// Hide popup after 2.2 seconds
							setTimeout(function() {
								successPopup.style.display = 'none';
							}, 2200);
						} else {
							// Fallback if popup element doesn't exist
							alert('Message sent successfully!');
						}
					} else {
						alert('There was an error sending your message. Please try again later.');
					}
				} catch (error) {
					console.error('Error:', error);
					alert('Sorry, there was a network error. Please try again later.');
				} finally {
					// Reset button state
					newSubmitBtn.disabled = false;
					newSubmitBtn.textContent = originalText;
				}
			});
			
			// Mark as initialized
			contactFormInitialized = true;
			console.log('Contact form handler successfully initialized');
		} else {
			console.log('Contact form elements not found on this page');
		}
	}

	// Remove any existing jQuery form handlers
	$('form').off('click', '.submit');

	// Sidebar.
	if ($sidebar.length > 0) {

		var $sidebar_a = $sidebar.find('a');

		$sidebar_a
			.addClass('scrolly')
			.on('click', function() {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Deactivate all links.
					$sidebar_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-20vh',
						bottom: '-20vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($sidebar_a.filter('.active-locked').length == 0) {

									$sidebar_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	}

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1000,
		offset: function() {

			// If <=large, >small, and sidebar is present, use its height as the offset.
				if (breakpoints.active('<=large')
				&&	!breakpoints.active('<=small')
				&&	$sidebar.length > 0)
					return $sidebar.height();

			return 0;

		}
	});

	// Spotlights.
	$('.spotlights > section')
		.scrollex({
			mode: 'middle',
			top: '-10vh',
			bottom: '-10vh',
			initialize: function() {

				// Deactivate section.
					$(this).addClass('inactive');

			},
			enter: function() {

				// Activate section.
					$(this).removeClass('inactive');

			}
		})
		.each(function() {

			var	$this = $(this),
				$image = $this.find('.image'),
				$img = $image.find('img'),
				x;

			// Assign image.
				$image.css('background-image', 'url(' + $img.attr('src') + ')');

			// Set background position.
				if (x = $img.data('position'))
					$image.css('background-position', x);

			// Hide <img>.
				$img.hide();

		});

	// Features.
	$('.features')
		.scrollex({
			mode: 'middle',
			top: '-20vh',
			bottom: '-20vh',
			initialize: function() {

				// Deactivate section.
					$(this).addClass('inactive');

			},
			enter: function() {

				// Activate section.
					$(this).removeClass('inactive');

			}
		});
		
	async function updateVisitorCounter() {
		console.log('Attempting to fetch visitor count...')
		try {
			const response = await fetch('https://3u40preuk1.execute-api.ap-south-1.amazonaws.com/prod/counter', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log('Response status:', response.status);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log('Received data:', data);
			const counterElement = document.getElementById('visitor-count');
			
			if (counterElement) {
				console.log('Visitor count updated to:', data.visits);
				counterElement.textContent = data.visits;
			} else {
				console.error('Visitor count element not found');
			}
		} catch (error) {
			console.error('Failed to fetch visitor counter:', error);
		}
	}
	
	// Initialize everything when DOM is ready - ONCE ONLY
	$(document).ready(function() {
		console.log('DOM ready - initializing components');
		setupContactForm();
		updateVisitorCounter();
	});
			
})(jQuery);
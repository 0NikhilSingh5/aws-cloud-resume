const SCRIPT_VERSION = '1.0.2';
console.log(`Script version: ${SCRIPT_VERSION}`);

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

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

	// Contact form handling
	// Contact form handler
function setupContactForm() {
	console.log('Setting up contact form handler');
	const contactForm = document.getElementById('contactForm');
	const formStatus = document.getElementById('formStatus');
	
	if (contactForm) {
	  console.log('Contact form found, attaching submit event');
	  
	  contactForm.addEventListener('submit', async function(e) {
		// Prevent default form submission
		e.preventDefault();
		console.log('Form submit intercepted');
		
		const submitButton = contactForm.querySelector('button[type="submit"]');
		const originalText = submitButton.textContent;
		
		// Show loading state
		submitButton.disabled = true;
		submitButton.textContent = 'Sending...';
		
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const message = document.getElementById('message').value;
		
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
		  let responseMessage = '';
		  
		  if (result.statusCode === 200) {
			const bodyObj = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
			success = bodyObj.success;
			responseMessage = bodyObj.message;
		  } else {
			success = false;
			responseMessage = 'Server error';
		  }
		  
		  // Display status message
		  formStatus.textContent = success 
			? 'Thanks for your message! I\'ll get back to you soon.' 
			: `Sorry, there was an error: ${responseMessage}`;
		  formStatus.style.color = success ? '#7e67d6' : '#e74c3c';
		  formStatus.style.display = 'block';
		  
		  // Reset form on success
		  if (success) {
			contactForm.reset();
		  }
		} catch (error) {
		  console.error('Error:', error);
		  formStatus.textContent = 'Sorry, there was a network error. Please try again later.';
		  formStatus.style.color = '#e74c3c';
		  formStatus.style.display = 'block';
		} finally {
		  // Reset button state
		  submitButton.disabled = false;
		  submitButton.textContent = originalText;
		}
	  });
	} else {
	  console.error('Contact form not found');
	}
  }
  
  // Add this to your existing window load event or document ready
  document.addEventListener('DOMContentLoaded', function() {
	setupContactForm();
  });

	// Forms.
		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {
				// Stop propagation, default.
				event.stopPropagation();
				event.preventDefault();

				// Submit form.
				$(this).parents('form').submit();
			});

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
	
	// Modify the existing load event listener
	window.addEventListener('load', function () {
		setTimeout(function () {
			document.body.classList.remove('is-preload');
			updateVisitorCounter(); // Call the visitor counter function
			setupContactForm(); // Setup the contact form handler
		}, 100);
	});
			
})(jQuery);
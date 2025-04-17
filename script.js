document.addEventListener('DOMContentLoaded', function() {
    // --- Flatpickr Initialization ---
    const commonConfig = {
        enableTime: true,
        dateFormat: "Y-m-d H:i", // Format: Year-Month-Day Hour:Minute
        altInput: true, // Show a user-friendly format
        altFormat: "F j, Y at h:i K", // User-friendly format (e.g., April 15, 2025 at 03:45 PM)
        minDate: "today",
        time_24hr: false,
    };

    // Initialize Start Date/Time picker
    flatpickr("#start_datetime", {
        ...commonConfig,
        onChange: function(selectedDates, dateStr, instance) {
            // When start date changes, set the minimum date for the end date picker
            if (endDatePicker) {
                endDatePicker.set('minDate', selectedDates[0] || "today");
            }
        }
    });

    // Initialize End Date/Time picker
    const endDatePicker = flatpickr("#end_datetime", {
        ...commonConfig,
    });

    // --- EmailJS Form Submission ---
    const quoteForm = document.getElementById('quote-form');
    const formStatus = document.getElementById('form-status');

    // Replace with your actual EmailJS Service ID and Template IDs
    const emailJsServiceID = 'service_3yhbbg8';
    const ownerTemplateID = 'template_4617fem'; // Template for email to dcmarkaz@gmail.com
    const userTemplateID = 'template_79vfjy6';   // Template for confirmation email to user

    quoteForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Basic check if EmailJS IDs are placeholders
        if (emailJsServiceID === 'YOUR_SERVICE_ID' || ownerTemplateID === 'YOUR_OWNER_TEMPLATE_ID' || userTemplateID === 'YOUR_USER_TEMPLATE_ID') {
            formStatus.textContent = 'EmailJS is not configured. Please provide Service and Template IDs.';
            formStatus.style.color = 'red';
            // Optionally disable the button after showing the error
            // quoteForm.querySelector('button[type="submit"]').disabled = true;
            return; // Stop submission if not configured
        }

        formStatus.textContent = 'Sending...';
        formStatus.style.color = 'blue';
        const submitButton = quoteForm.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable button during sending

        // Generate a simple request ID
        const requestID = `JIDA-${Date.now()}`;

        // Prepare template parameters from form data using the template variable names
        const templateParams = {
            requestID: requestID, // Generated request ID
            name: document.getElementById('name').value, // Corresponds to {{name}}
            requesterEmail: document.getElementById('email').value, // Corresponds to {{requesterEmail}}
            phone: document.getElementById('phone').value, // Corresponds to {{phone}}
            companyName: document.getElementById('company').value || 'N/A', // Corresponds to {{companyName}}
            genType: document.getElementById('generator_type').value || 'Not specified', // Corresponds to {{genType}}
            rentalStart: document.getElementById('start_datetime').value, // Corresponds to {{rentalStart}}
            rentalEnd: document.getElementById('end_datetime').value, // Corresponds to {{rentalEnd}}
            content: document.getElementById('message').value || 'No message provided.' // Corresponds to {{content}}
            // Note: The user template also uses {{name}} and {{rentalStart}}, which are included.
            // The user template also needs the recipient's email, but EmailJS handles this automatically when sending.
        };

        // Send email to owner (dcmarkaz@gmail.com)
        emailjs.send(emailJsServiceID, ownerTemplateID, templateParams)
            .then(function(ownerResponse) {
                console.log('Owner email SUCCESS!', ownerResponse.status, ownerResponse.text);

                // If owner email is successful, send confirmation to user
                return emailjs.send(emailJsServiceID, userTemplateID, templateParams);
            })
            .then(function(userResponse) {
                console.log('User confirmation email SUCCESS!', userResponse.status, userResponse.text);
                formStatus.textContent = 'Quote request sent successfully! Check your email for confirmation.';
                formStatus.style.color = 'green';
                quoteForm.reset(); // Clear the form
            })
            .catch(function(error) {
                console.error('EmailJS FAILED...', error);
                formStatus.textContent = 'Failed to send quote request. Please try again later or contact us directly.';
                formStatus.style.color = 'red';
            })
            .finally(function() {
                submitButton.disabled = false; // Re-enable button
            });
    });

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

     // --- Smooth Scrolling for Hero CTA ---
    document.querySelector('.hero a.cta-button[href^="#"]').addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });

});

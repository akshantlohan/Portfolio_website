const contactForm = document.querySelector('#contact form');

if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const announcement = contactForm.querySelector('#contact-announcement');
    const successMessage = contactForm.querySelector('#contact-success');
    const errorMessage = contactForm.querySelector('#contact-error');
    const submitLabel = submitButton.textContent.trim();

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (contactForm.dataset.submitting === 'true') {
            return;
        }

        contactForm.dataset.submitting = 'true';
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        contactForm.setAttribute('aria-busy', 'true');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = '';
        successMessage.hidden = true;
        errorMessage.hidden = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Form submission failed with status ${response.status}`);
            }

            contactForm.reset();
            announcement.textContent = "Thanks for reaching out! I've received your inquiry and will get back to you as soon as possible.";
            successMessage.hidden = false;
        } catch (error) {
            announcement.setAttribute('role', 'alert');
            announcement.setAttribute('aria-live', 'assertive');
            announcement.textContent = 'Something went wrong. Please try again in a moment.';
            errorMessage.hidden = false;
        } finally {
            delete contactForm.dataset.submitting;
            contactForm.removeAttribute('aria-busy');
            submitButton.disabled = false;
            submitButton.textContent = submitLabel;
        }
    });
}

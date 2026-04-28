// Contact form submission handler
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = form.querySelector('#contact-name');
  const emailInput = form.querySelector('#contact-email');
  const messageInput = form.querySelector('#contact-message');
  const submitBtn = form.querySelector('.contact-form__submit');
  const statusEl = form.querySelector('.contact-form__status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous status
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'contact-form__status';
    }

    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validation
    if (!name || !email || !message) {
      showStatus('Please fill in all fields', 'error');
      return;
    }

    // Disable submit button
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          website: '', // Honeypot field
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showStatus('Message sent! I will get back to you soon.', 'success');
        form.reset();
      } else {
        showStatus(data.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showStatus('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `contact-form__status contact-form__status--${type}`;
  }
}

// Contact modal and form handler
export function initContactForm() {
  const modal = document.getElementById('contact-modal');
  const trigger = document.getElementById('contact-trigger');
  const closeBtn = document.getElementById('contact-modal-close');
  const overlay = document.getElementById('contact-modal-overlay');
  const form = document.getElementById('contact-form');

  if (!modal || !trigger || !form) return;

  const nameInput = form.querySelector('#contact-name');
  const emailInput = form.querySelector('#contact-email');
  const messageInput = form.querySelector('#contact-message');
  const submitBtn = form.querySelector('.contact-modal__submit .contact-modal__submit-text');
  const statusEl = form.querySelector('.contact-modal__status');

  // Open modal
  function openModal(e) {
    e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first input after animation
    setTimeout(() => nameInput.focus(), 300);
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'contact-modal__status';
    }
  }

  // Event listeners
  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous status
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'contact-modal__status';
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
    statusEl.className = `contact-modal__status contact-modal__status--${type}`;
    // Auto-close modal on success after 3 seconds
    if (type === 'success') {
      setTimeout(() => closeModal(), 3000);
    }
  }
}

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  } else {
    console.error('Mobile menu elements not found');
  }

  // Scroll Animations with Intersection Observer
  const animateOnScroll = () => {
    const sections = document.querySelectorAll(
      '.how-it-works, .features, .footer, .simple-hero .hero-content, .real-example, .benefits-section, .tech-highlight'
    );
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Stop observing once animated
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach(section => {
      observer.observe(section);
    });
  };

  // Initial call and resize handler
  animateOnScroll();
  window.addEventListener('resize', animateOnScroll);

  // Button Click Handlers
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
      console.log(`Button clicked: ${e.target.textContent.trim()}`);
      if (e.target.textContent.trim() === 'Declare Your Intent') {
        const intentForm = document.getElementById('intentForm');
        if (intentForm) {
          intentForm.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.error('Intent form not found');
        }
      }
    });
  });

  // Intent Form Submission
  const intentForm = document.getElementById('intentForm');
  const formMessage = document.getElementById('formMessage');
  const statusText = document.getElementById('statusText');
  const successModal = document.getElementById('successModal');
  const closeModal = document.querySelector('.close-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  if (intentForm && formMessage && statusText && successModal) {
    intentForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const condition = document.getElementById('condition').value.trim();
      const location = document.getElementById('location').value.trim();
      const funding = document.getElementById('funding').value;
      const urgency = document.getElementById('urgency').value.trim();
      const email = document.getElementById('email').value.trim();

      // Validation
      let isValid = true;
      const errorElements = {
        condition: document.getElementById('conditionError'),
        location: document.getElementById('locationError'),
        funding: document.getElementById('fundingError'),
        urgency: document.getElementById('urgencyError'),
        email: document.getElementById('emailError')
      };

      // Reset error messages
      Object.values(errorElements).forEach(error => error.style.display = 'none');

      if (!condition) {
        errorElements.condition.style.display = 'block';
        isValid = false;
      }
      if (!location) {
        errorElements.location.style.display = 'block';
        isValid = false;
      }
      if (!funding || funding <= 0) {
        errorElements.funding.style.display = 'block';
        isValid = false;
      }
      if (!urgency || urgency < 1) {
        errorElements.urgency.style.display = 'block';
        isValid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorElements.email.style.display = 'block';
        isValid = false;
      }

      if (isValid) {
        // Mock blockchain storage
        const intent = {
          condition,
          location,
          funding,
          urgency,
          email,
          timestamp: new Date().toISOString()
        };
        let intents = JSON.parse(localStorage.getItem('anomaIntents')) || [];
        intents.push(intent);
        localStorage.setItem('anomaIntents', JSON.stringify(intents));

        // Show success modal
        successModal.classList.remove('hidden');

        // Update form message
        formMessage.textContent = 'Intent submitted successfully!';
        formMessage.style.color = '#28a745';
        intentForm.reset();

        // Update Matching Status
        let statusIndex = 0;
        const statuses = [
          `Intent submitted: ${condition} in ${location} with $${funding} needed within ${urgency} days. Initializing matching process...`,
          `Searching donor registries...`,
          `Analyzing funding sources...`,
          `Match found! Connecting parties...`
        ];
        const statusInterval = setInterval(() => {
          statusText.textContent = statuses[statusIndex];
          statusIndex = (statusIndex + 1) % statuses.length;
          if (statusIndex === statuses.length - 1) clearInterval(statusInterval); // Stop after full cycle
        }, 3000);
      } else {
        formMessage.textContent = 'Please fix the errors in the form.';
        formMessage.style.color = '#dc3545';
      }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  } else {
    console.error('Intent form or related elements not found');
  }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Target not found for href: ${this.getAttribute('href')}`);
    }
  });
});
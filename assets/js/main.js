/**
* TWELCARGO EXPORTS Website
* Template Name: Hidayah
* Updated: 2024 with Bootstrap v5.3.3
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .dropdown > a').forEach(dropdown => {
    // Add click handler for the main dropdown link
    dropdown.addEventListener('click', function(e) {
      if (window.innerWidth <= 991) { // Only for mobile
        e.preventDefault();
        const parent = this.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.navmenu .dropdown').forEach(item => {
          if (item !== parent) {
            item.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        parent.classList.toggle('active');
        
        e.stopPropagation();
      }
    });

    // Add click handler for dropdown items
    const dropdownItems = dropdown.nextElementSibling?.querySelectorAll('a');
    if (dropdownItems) {
      dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
          // Allow default navigation for dropdown items
          if (window.innerWidth <= 991) {
            // Close mobile menu after selection
            document.querySelector('body').classList.remove('mobile-nav-active');
            document.querySelector('.mobile-nav-toggle').classList.toggle('bi-list');
            document.querySelector('.mobile-nav-toggle').classList.toggle('bi-x');
          }
        });
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navmenu .dropdown')) {
      document.querySelectorAll('.navmenu .dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });

  /**
   

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Web3Forms Contact Form Submission
   */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const formAction = this.action;

      // Add a status message element if it doesn't exist
      let statusMsg = this.querySelector('.status-message');
      if (!statusMsg) {
        statusMsg = document.createElement('div');
        statusMsg.className = 'status-message text-center py-2';
        submitBtn.parentNode.insertBefore(statusMsg, submitBtn.nextSibling);
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusMsg.textContent = '';

      fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            statusMsg.textContent = 'Message sent successfully!';
            statusMsg.style.color = 'green';
            contactForm.reset();
          } else {
            statusMsg.textContent = 'Error: ' + data.message;
            statusMsg.style.color = 'red';
          }
        })
        .catch(error => {
          statusMsg.textContent = 'An error occurred. Please try again.';
          statusMsg.style.color = 'red';
          console.error('Error:', error);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          setTimeout(() => {
            statusMsg.textContent = '';
          }, 5000); // Clear message after 5 seconds
        });
    });
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  // Handle Web3Forms Submission
  function handleWeb3Form(formElement, successMessage = 'Message sent successfully!') {
    if (!formElement) return;
    
    formElement.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const formAction = this.action;
      const redirectUrl = this.querySelector('input[name="redirect"]')?.value;

      // Add a status message element if it doesn't exist
      let statusMsg = this.querySelector('.status-message');
      if (!statusMsg) {
        statusMsg = document.createElement('div');
        statusMsg.className = 'status-message text-center py-2';
        submitBtn.parentNode.insertBefore(statusMsg, submitBtn.nextSibling);
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusMsg.textContent = '';
      statusMsg.style.display = 'block';

      fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok && data.success) {
          statusMsg.textContent = successMessage;
          statusMsg.style.color = 'green';
          formElement.reset();
          
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1500);
          }
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      })
      .catch((error) => {
        statusMsg.textContent = error.message || 'An error occurred. Please try again.';
        statusMsg.style.color = 'red';
        console.error('Error:', error);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 5000);
      });
    });
  }

  // Initialize form handlers
  handleWeb3Form(document.getElementById('contactForm'));
  handleWeb3Form(
    document.getElementById('quickContactForm'),
    'Thank you for your message! We will get back to you soon.'
  );

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      if (index === 0) {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
// Initialize Feather Icons
feather.replace();

document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================
       Current Year in Footer
       ========================================== */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ==========================================
       Theme Toggle
       ========================================== */
    const themeBtn = document.getElementById('theme-toggle');
    const mobileThemeBtn = document.getElementById('theme-toggle-mobile');
    
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        // Default to dark as requested
        document.documentElement.classList.add('dark');
    }

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    };

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

    /* ==========================================
       Mobile Menu Toggle
       ========================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    /* ==========================================
       Navbar Scroll Effect & Active Links
       ========================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobNavLinks = document.querySelectorAll('.mobile-nav-link');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        mobNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       Scroll Reveal Animations
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const progressBars = document.querySelectorAll('.progress');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate progress bars when skill section is revealed
                if (entry.target.classList.contains('skill-category')) {
                    const bars = entry.target.querySelectorAll('.progress');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       Custom Cursor
       ========================================== */
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');

    // Only run cursor logic if not on mobile (touch devices)
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ==========================================
       Back to Top Button
       ========================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================
       Contact Form Submission
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = contactForm.querySelector('.btn-submit');
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span>Sending...</span>';
            btnSubmit.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    formStatus.textContent = data.message;
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error('Something went wrong');
                }
            } catch (error) {
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
                formStatus.className = 'form-status error';
            } finally {
                btnSubmit.innerHTML = originalBtnText;
                btnSubmit.disabled = false;
                
                // Clear status message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }
});

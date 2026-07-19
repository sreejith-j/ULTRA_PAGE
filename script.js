document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smart Input Demo
    const smartInput = document.getElementById('smartInput');
    const demoResult = document.getElementById('demoResult');

    if (smartInput && demoResult) {
        smartInput.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();
            
            if (!text.trim()) {
                demoResult.innerHTML = '<span class="placeholder">Type a sentence above to see the magic...</span>';
                return;
            }

            let task = e.target.value;
            let location = null;
            let transition = null;

            // Simple regex for demo purposes (matching app logic)
            const arriveMatch = text.match(/(?:when|while)\s+(?:i\s+)?(?:am\s+|'m\s+)?(?:arrive|arriving|get|getting|reach|reaching)\s+(?:(?:at|to)\s+)?(.+?)(?:\s+remind|\s*$)/i);
            const leaveMatch = text.match(/(?:when|while)\s+(?:i\s+)?(?:am\s+|'m\s+)?(?:leave|leaving|depart|departing|exit|exiting)\s+(?:(?:from)\s+)?(.+?)(?:\s+remind|\s*$)/i);

            if (arriveMatch) {
                location = arriveMatch[1];
                transition = "Enter";
                task = task.substring(0, arriveMatch.index).trim();
            } else if (leaveMatch) {
                location = leaveMatch[1];
                transition = "Exit";
                task = task.substring(0, leaveMatch.index).trim();
            }

            // Cleanup task string
            task = task.replace(/remind me to/i, '').replace(/remind me/i, '').trim();
            
            let html = '';
            if (task) {
                html += `<div class="tag tag-task">📝 Task: <strong>${task}</strong></div>`;
            }
            if (location) {
                html += `<div class="tag tag-location">📍 Location: <strong>${location}</strong></div>`;
            }
            if (transition) {
                html += `<div class="tag tag-transition">🚪 Action: <strong>${transition}</strong></div>`;
            }
            
            if (!html) {
                demoResult.innerHTML = '<span class="placeholder">Listening...</span>';
            } else {
                demoResult.innerHTML = html;
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Showcase Scroll Buttons
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');
    const showcaseGallery = document.getElementById('showcaseGallery');

    if (scrollLeft && scrollRight && showcaseGallery) {
        scrollLeft.addEventListener('click', () => {
            showcaseGallery.scrollBy({ left: -400, behavior: 'smooth' });
        });
        scrollRight.addEventListener('click', () => {
            showcaseGallery.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }
});

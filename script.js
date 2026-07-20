document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                activeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const smartInput = document.getElementById('smartInput');
    const demoResult = document.getElementById('demoResult');

    const escapeHtml = (value) => value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const addTag = (className, label, value) => {
        if (!value) return '';
        return `<div class="tag ${className}">${label}: <strong>${escapeHtml(value)}</strong></div>`;
    };

    const parseSmartInput = (rawValue) => {
        const original = rawValue.trim();
        const text = original.toLowerCase();
        const parsed = [];
        let task = original;

        const arriveMatch = text.match(/(?:when|while)\s+(?:i\s+)?(?:am\s+|'m\s+)?(?:arrive|arriving|get|getting|reach|reaching)\s+(?:(?:at|to)\s+)?(.+?)(?:\s+remind|\s*$)/i);
        const leaveMatch = text.match(/(?:when|while)\s+(?:i\s+)?(?:am\s+|'m\s+)?(?:leave|leaving|depart|departing|exit|exiting)\s+(?:(?:from)\s+)?(.+?)(?:\s+remind|\s*$)/i);
        const batteryMatch = text.match(/battery\s+(?:is|at|hits|reaches|drops to|below)?\s*(\d{1,3})\s*%?/i);
        const chargerMatch = text.match(/charger\s+(connected|disconnected)|(?:plugged|unplugged)\s+(?:in|out)?/i);
        const durationActivityMatch = text.match(/(?:after|for)\s+(\d+)\s*(minutes?|mins?|hours?|hrs?)\s+(walking|walk|running|run|cycling|driving|drive|still|stationary)/i);
        const countdownMatch = text.match(/(?:in|after)\s+(\d+)\s*(minutes?|mins?|hours?|hrs?)\b/i);
        const dayMatch = text.match(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i);
        const irctcMatch = text.match(/\b(?:pnr|irctc|train|coach|berth|seat|depart|departure)\b/i);

        if (arriveMatch) {
            parsed.push({ className: 'tag-location', label: 'Location', value: arriveMatch[1] });
            parsed.push({ className: 'tag-transition', label: 'Action', value: 'Arrive' });
            task = task.substring(0, arriveMatch.index).trim();
        } else if (leaveMatch) {
            parsed.push({ className: 'tag-location', label: 'Location', value: leaveMatch[1] });
            parsed.push({ className: 'tag-transition', label: 'Action', value: 'Leave' });
            task = task.substring(0, leaveMatch.index).trim();
        }

        if (batteryMatch) {
            const percent = Math.max(0, Math.min(100, Number(batteryMatch[1])));
            parsed.push({ className: 'tag-device', label: 'Device', value: `Battery ${percent}%` });
        } else if (chargerMatch) {
            parsed.push({ className: 'tag-device', label: 'Device', value: text.includes('disconnect') || text.includes('unplug') ? 'Charger disconnected' : 'Charger connected' });
        }

        if (durationActivityMatch) {
            parsed.push({ className: 'tag-activity', label: 'Activity', value: `${durationActivityMatch[3]} for ${durationActivityMatch[1]} ${durationActivityMatch[2]}` });
        } else if (countdownMatch) {
            parsed.push({ className: 'tag-time', label: 'Countdown', value: `${countdownMatch[1]} ${countdownMatch[2]}` });
        }

        if (dayMatch) {
            parsed.push({ className: 'tag-time', label: 'Date', value: dayMatch[1] });
        }

        if (irctcMatch) {
            parsed.push({ className: 'tag-travel', label: 'Travel', value: 'Train/IRCTC details detected' });
        }

        task = task
            .replace(/remind me to/i, '')
            .replace(/remind me when/i, '')
            .replace(/remind me/i, '')
            .replace(/wake me up/i, 'wake up')
            .trim();

        if (task && !/^when\b|^after\b|^in\b/i.test(task)) {
            parsed.unshift({ className: 'tag-task', label: 'Task', value: task });
        }

        return parsed;
    };

    const renderSmartInput = () => {
        if (!smartInput || !demoResult) return;

        const value = smartInput.value;
        if (!value.trim()) {
            demoResult.innerHTML = '<span class="placeholder">Type a reminder sentence to see what ULTRA can extract.</span>';
            return;
        }

        const parsed = parseSmartInput(value);
        if (!parsed.length) {
            demoResult.innerHTML = '<span class="placeholder">Listening for time, place, activity, device, or travel details...</span>';
            return;
        }

        demoResult.innerHTML = parsed.map(item => addTag(item.className, item.label, item.value)).join('');
    };

    if (smartInput && demoResult) {
        smartInput.addEventListener('input', renderSmartInput);

        document.querySelectorAll('.example-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                smartInput.value = chip.dataset.example || '';
                smartInput.focus();
                renderSmartInput();
            });
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');
    const showcaseGallery = document.getElementById('showcaseGallery');

    if (scrollLeft && scrollRight && showcaseGallery) {
        scrollLeft.addEventListener('click', () => {
            showcaseGallery.scrollBy({ left: -420, behavior: 'smooth' });
        });
        scrollRight.addEventListener('click', () => {
            showcaseGallery.scrollBy({ left: 420, behavior: 'smooth' });
        });
    }
});

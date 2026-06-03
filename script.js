// Barra de anuncio Shark Tank (cerrable, recordado por campaña)
(function () {
    const CAMPAIGN_KEY = 'stAnnouncementClosed';
    const CAMPAIGN_ID = '2026-06-04'; // cambiar para reactivar/retirar la barra
    const bar = document.getElementById('announcementBar');
    const closeBtn = document.getElementById('announcementClose');
    if (!bar) return;

    if (localStorage.getItem(CAMPAIGN_KEY) === CAMPAIGN_ID) {
        document.body.classList.remove('has-announcement');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.classList.remove('has-announcement');
            try { localStorage.setItem(CAMPAIGN_KEY, CAMPAIGN_ID); } catch (e) {}
        });
    }
})();

// Navigation Toggle for Mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Scroll Effect for Navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 80) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Offset = navbar fijo (+ barra de anuncio si está visible)
            const offset = document.body.classList.contains('has-announcement') ? 130 : 90;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations (revelado suave con efecto escalonado)
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -80px 0px'
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || '0', 10);

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }, delay);

        // Limpia los estilos inline al terminar para no interferir con el hover
        setTimeout(() => {
            el.style.transition = '';
            el.style.transform = '';
        }, delay + 850);

        obs.unobserve(el);
    });
}, observerOptions);

// Elementos a animar
const animatedElements = document.querySelectorAll(
    '.diferenciador-card, .benefit-card, .testimonial-card, .gallery-item, .caracteristica-item, .pricing-card, .section-title, .section-subtitle'
);
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s ' + EASE + ', transform 0.7s ' + EASE;
    observer.observe(el);
});

// Efecto escalonado para elementos dentro de la misma cuadrícula
document.querySelectorAll('.diferenciadores-grid, .benefits-grid, .testimonials-grid, .gallery-grid, .pricing-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
        child.dataset.revealDelay = i * 90;
    });
});

// Counter Animation for Stats
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            
            statNumber.dataset.suffix = suffix;
            animateValue(statNumber, 0, number, 2000);
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Note: CTA buttons are now direct links to Google Play Store
// No JavaScript action needed as they use href attribute

// Gallery Item Click (Optional: Open in modal)
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Aquí puedes agregar funcionalidad para abrir en modal
        console.log('Gallery item clicked');
    });
});

// Form Validation (if you add a contact form)
const validateEmail = (email) => {
    return email.match(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};

// Add parallax effect to hero image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.phone-mockup');
    if (parallax) {
        const speed = 0.5;
        parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Reproductor vertical (reel) — click para reproducir con sonido
(function () {
    const container = document.getElementById('reelContainer');
    const video = document.getElementById('reelVideo');
    const playBtn = document.getElementById('reelPlay');
    if (!container || !video) return;

    const start = () => {
        video.setAttribute('controls', '');
        container.classList.add('playing');
        video.play();
    };

    if (playBtn) playBtn.addEventListener('click', start);

    video.addEventListener('play', () => container.classList.add('playing'));
    video.addEventListener('pause', () => {
        if (!video.ended) container.classList.remove('playing');
    });
    video.addEventListener('ended', () => {
        container.classList.remove('playing');
        video.removeAttribute('controls');
        video.currentTime = 0;
    });
})();

// Console welcome message
console.log('%c¡Bienvenido a ComandaYa!', 'font-size: 20px; font-weight: bold; color: #FFC107;');
console.log('%c¿Interesado en trabajar con nosotros? Contáctanos!', 'font-size: 14px; color: #666;');

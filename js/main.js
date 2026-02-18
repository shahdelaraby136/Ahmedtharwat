// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (navLink) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});

// ===== STATS COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });
}

const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// ===== PORTFOLIO TABS & FILTERING =====
const tabBtns = document.querySelectorAll('.tab-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active tab
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        // Filter items with animation
        portfolioItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.style.animation = 'none';
                item.offsetHeight; // trigger reflow
                item.style.animation = `fadeInUp 0.4s ease ${index * 0.08}s forwards`;
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ===== LIGHTBOX =====
// Create lightbox element
const lightboxHTML = `
<div class="lightbox" id="lightbox">
    <button class="lightbox-close" id="lightboxClose"><i class="fas fa-times"></i></button>
    <button class="lightbox-nav lightbox-prev" id="lightboxPrev"><i class="fas fa-arrow-left"></i></button>
    <button class="lightbox-nav lightbox-next" id="lightboxNext"><i class="fas fa-arrow-right"></i></button>
    <img class="lightbox-img" id="lightboxImg" src="" alt="">
    <div class="lightbox-caption">
        <h4 id="lightboxTitle"></h4>
        <p id="lightboxDesc"></p>
    </div>
</div>`;
document.body.insertAdjacentHTML('beforeend', lightboxHTML);

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
let currentLightboxIndex = 0;

function getVisibleItems() {
    return Array.from(portfolioItems).filter(item => !item.classList.contains('hidden'));
}

function openLightbox(index) {
    const visibleItems = getVisibleItems();
    currentLightboxIndex = index;
    const item = visibleItems[index];
    const img = item.querySelector('img');
    const title = item.querySelector('.overlay-content h4');
    const desc = item.querySelector('.overlay-content p');

    lightboxImg.src = img.src;
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxDesc.textContent = desc ? desc.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const visibleItems = getVisibleItems();
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = visibleItems.length - 1;
    if (currentLightboxIndex >= visibleItems.length) currentLightboxIndex = 0;
    openLightbox(currentLightboxIndex);
}

// Click on portfolio cards to open lightbox
portfolioItems.forEach(item => {
    item.querySelector('.portfolio-card').addEventListener('click', () => {
        const visibleItems = getVisibleItems();
        const index = visibleItems.indexOf(item);
        openLightbox(index);
    });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => navigateLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.tag, .hero-content, .hero-image, .stat-item, .skill-card, .portfolio-top, .portfolio-item, .testimonial-card, .contact-header, .contact-info, .contact-form');

fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', () => {
    const btn = contactForm.querySelector('.submit-btn');
    btn.textContent = 'Sending...';
    btn.style.background = '#00a354';
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

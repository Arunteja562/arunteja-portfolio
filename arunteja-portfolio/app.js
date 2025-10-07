// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initThemeToggle();
    initTypingAnimation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initScrollEffects();
    initLoadingAnimations();
});

// Navigation Functions
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Theme Toggle Functions
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(icon, currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Typing Animation
function initTypingAnimation() {
    const typingText = document.getElementById('typing-text');
    const cursor = document.getElementById('cursor');
    const text = 'Vasam Arunteja';
    let index = 0;

    if (!typingText) return;

    typingText.textContent = '';
    
    function typeText() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 150);
        } else {
            // Start cursor blinking animation
            if (cursor) {
                cursor.style.animation = 'blink 1s infinite';
            }
        }
    }

    // Start typing animation after a short delay
    setTimeout(typeText, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Trigger skill bars animation when skills section is visible
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const elementsToAnimate = document.querySelectorAll(`
        .strength-item, .education-item, .skill-category, 
        .project-card, .cert-item, .contact-item,
        .experience-item, .responsibility-item
    `);
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillsSection = document.querySelector('.skills');
    
    if (!skillsSection) return;

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillObserver.observe(skillsSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, index * 200);
    });
}

// Loading Animations
function initLoadingAnimations() {
    // Add stagger effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add stagger effect to skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.15}s`;
    });
}

// Contact Form Functions
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value.trim();
        });

        // Validate form
        if (validateContactForm(formObject)) {
            handleFormSubmission(formObject);
        }
    });

    // Add real-time validation
    const formFields = contactForm.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateContactForm(formData) {
    const { name, email, subject, message } = formData;
    let isValid = true;
    const errors = [];

    // Clear previous error styles
    clearFormErrors();

    if (!name) {
        errors.push('Name is required');
        markFieldError('name');
        isValid = false;
    }

    if (!email) {
        errors.push('Email is required');
        markFieldError('email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
        markFieldError('email');
        isValid = false;
    }

    if (!subject) {
        errors.push('Subject is required');
        markFieldError('subject');
        isValid = false;
    }

    if (!message) {
        errors.push('Message is required');
        markFieldError('message');
        isValid = false;
    } else if (message.length < 10) {
        errors.push('Message must be at least 10 characters long');
        markFieldError('message');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                markFieldError(field.id);
                isValid = false;
            }
            break;
        case 'text':
            if (!value) {
                markFieldError(field.id);
                isValid = false;
            }
            break;
        default:
            if (!value) {
                markFieldError(field.id);
                isValid = false;
            }
    }

    if (isValid) {
        clearFieldError(field);
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function markFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }
}

function clearFieldError(field) {
    if (field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }
}

function clearFormErrors() {
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach(field => {
        clearFieldError(field);
    });
}

function handleFormSubmission(formData) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contact-form').reset();
        clearFormErrors();
        
        // Add success animation
        const form = document.getElementById('contact-form');
        form.style.transform = 'scale(0.98)';
        setTimeout(() => {
            form.style.transform = '';
        }, 200);
        
    }, 2000);
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const bgColor = type === 'success' ? '#10B981' : '#EF4444';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        word-wrap: break-word;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const icon = type === 'success' ? 
        '<i class="fas fa-check-circle"></i>' : 
        '<i class="fas fa-exclamation-circle"></i>';
    
    notification.innerHTML = icon + message;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 5000);

    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    });
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '';
        }

        // Update for dark theme
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(17, 24, 39, 0.98)';
            } else {
                navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            }
        }
    }, 10));
}

// Resume Download Function
function downloadResume() {
    // Create comprehensive resume content
    const resumeContent = `
VASAM ARUNTEJA
Portfolio: https://vasam-arunteja-portfolio.com
Email: vasamaruntej143@gmail.com
Phone: +91 9154922849
LinkedIn: www.linkedin.com/in/vasam-arunteja2002-00ab11256
GitHub: Arunteja562
Location: Warangal/Hanumakonda, Telangana

===============================================
PROFESSIONAL SUMMARY
===============================================

Currently pursuing Master's in Computer Applications at Aurora University. Passionate about transforming ideas into impactful digital solutions through programming and creative design. Strong foundation in Python, web development, and graphic design with hands-on experience from internships and academic projects.

===============================================
EDUCATION
===============================================

🎓 Master of Computer Applications (MCA)
   Aurora Deemed to be University
   Expected: 2025 | Status: Pursuing

🎓 Bachelor of Commerce (B.Com)
   Bhadruka Commerce Degree College, Hanumakonda
   Completed: 2023

🎓 Intermediate (M.P.C)
   Prathibha Junior College, Hanamkonda
   Completed: 2020

🎓 SSC
   Ravi Chandra Concept School, Warangal
   Completed: 2018

===============================================
TECHNICAL SKILLS
===============================================

Programming Languages:
• C++ (85% Proficiency)
• Python (90% Proficiency) 
• JavaScript (80% Proficiency)

Frontend Development:
• HTML5 & CSS3 (95% Proficiency)
• React.js (75% Proficiency)
• Bootstrap & Tailwind CSS (85% Proficiency)
• Responsive Design

Backend Development:
• Node.js & Express.js (70% Proficiency)
• Python (90% Proficiency)

Databases:
• SQL Server (80% Proficiency)
• MongoDB (75% Proficiency)

Tools & Technologies:
• Git & GitHub (85% Proficiency)
• VS Code, Jupyter, Arduino IDE
• REST API Development (80% Proficiency)
• Postman for API Testing

Design & Others:
• Graphic Design (75% Proficiency)
• CRUD Operations
• Problem-Solving & Algorithm Design

===============================================
FEATURED PROJECTS
===============================================

🩸 Blood Donation Bank Management System
   Technologies: Visual Studio, SQL Server, Full Stack Development
   • Built comprehensive donor registration system
   • Implemented blood stock management with search functionality
   • Developed user-friendly interface for efficient operations
   
🔧 IoT MQ2 Gas Detector
   Technologies: Arduino IDE, IoT, MQ2 Sensor, Hardware Programming
   • Developed real-time gas leakage detection system
   • Implemented buzzer alert mechanism for safety
   • Created monitoring dashboard for continuous surveillance
   
👶 Kindergarten Website
   Technologies: HTML5, CSS3, JavaScript, Responsive Design
   • Designed engaging website for preschool
   • Created interactive elements and mobile-first approach
   • Implemented responsive design for all devices
   
🎓 College Placement Management System
   Technologies: Frontend Frameworks, Backend, Database, Full Stack
   • Built comprehensive placement portal for colleges
   • Developed student profile management system
   • Implemented company registration and interview scheduling

===============================================
PROFESSIONAL EXPERIENCE
===============================================

🏢 Intern - MVG Innovation & Learning

Python Development:
• Developed small-scale Bio-Medical projects using Jupyter and Spyder
• Implemented data analysis and visualization solutions
• Created Python scripts for medical data processing

Graphic Design:
• Designed professional posters, brochures, and marketing materials
• Created video content and handled various editing tasks
• Developed visual identity for company communications

===============================================
CERTIFICATIONS & ACHIEVEMENTS
===============================================

🏆 Dynamic Public Speaking - Coursera
   Certified in professional communication and presentation skills

🥇 Web Development Hackathon Winner
   CognoRise InfoTech - September Edition
   Recognized for innovative web development solution

🎯 ICCII 25 Conference Participant
   International Conference on Computational Intelligence and Industry 5.0
   Velammal Institute of Technology, Chennai (March 21-22, 2025)

===============================================
KEY STRENGTHS
===============================================

✅ Excellent organizational and planning capabilities
✅ Self-motivated and disciplined approach to work
✅ Strong dedication to achieving set goals
✅ Time punctuality and professional discipline
✅ Fast learner with collaborative team spirit
✅ Problem-solving mindset with creative thinking

===============================================
LANGUAGES
===============================================

• English - Professional Working Proficiency
• Telugu - Native Speaker
• Hindi - Conversational

===============================================
INTERESTS & HOBBIES
===============================================

• Full Stack Web Development
• IoT and Hardware Programming
• Graphic Design and Digital Art
• Technology Innovation
• Bio-Medical Applications
• Open Source Contributions

===============================================

Thank you for considering my application. I am excited about the opportunity to contribute to innovative projects and grow within the technology industry.

Best regards,
Vasam Arunteja
    `.trim();

    // Create and download the file
    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vasam_Arunteja_Resume.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Resume downloaded successfully! 📄', 'success');
    
    // Add download animation
    const downloadBtn = event.target.closest('.btn');
    if (downloadBtn) {
        downloadBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            downloadBtn.style.transform = '';
        }, 150);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const link = e.target.matches('a[href^="#"]') ? e.target : e.target.closest('a[href^="#"]');
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Enhanced window resize handler
window.addEventListener('resize', debounce(function() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
    
    // Recalculate skill bars if visible
    const skillsSection = document.querySelector('.skills');
    if (skillsSection && isElementInViewport(skillsSection)) {
        animateSkillBars();
    }
}, 250));

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
        
        // Close any open notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        });
    }
});

// Performance optimization: Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add any image URLs that need preloading
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
preloadImages();

// Page load optimization
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Initialize any additional animations after page load
    setTimeout(() => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.opacity = '1';
        }
    }, 100);
});

// Export functions for global access
window.downloadResume = downloadResume;
window.showNotification = showNotification;

// Console welcome message
console.log(`
🚀 Welcome to Vasam Arunteja's Portfolio
📧 Contact: vasamaruntej143@gmail.com
🔗 LinkedIn: www.linkedin.com/in/vasam-arunteja2002-00ab11256
💻 GitHub: Arunteja562

This portfolio showcases modern web development with:
✨ Unique Indigo-Amber color scheme
🎨 Smooth animations and transitions  
📱 Fully responsive design
🌙 Dark/Light theme toggle
⚡ Optimized performance
`);
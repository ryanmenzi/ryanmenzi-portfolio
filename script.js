document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.querySelector('.greeting-text');
    
    if (greetingElement) {
        try {
            const languages = JSON.parse(greetingElement.getAttribute('data-languages'));
            let currentLangIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingDelay = 150;
            const erasingDelay = 100;
            const newTextDelay = 2000; // Delay before starting to erase
            
            function type() {
                const currentText = languages[currentLangIndex];
                
                if (isDeleting) {
                    greetingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                    typingDelay = erasingDelay;
                } else {
                    greetingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    typingDelay = 150; // Randomize typing speed slightly for realism if wanted
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    // Pause at the end of the word
                    isDeleting = true;
                    setTimeout(type, newTextDelay);
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    currentLangIndex++;
                    if (currentLangIndex >= languages.length) {
                        currentLangIndex = 0;
                    }
                    setTimeout(type, typingDelay + 200);
                } else {
                    setTimeout(type, typingDelay);
                }
            }
            
            // Start the typing effect
            setTimeout(type, newTextDelay + 250);
            
        } catch (e) {
            console.error("Failed to parse languages data", e);
        }
    }

    // Invert Colors Logic
    const invertToggle = document.getElementById('invert-toggle');
    if (invertToggle) {
        invertToggle.addEventListener('click', (e) => {
            e.preventDefault();
            let activeScheme = document.documentElement.style.colorScheme;
            if (!activeScheme || activeScheme === 'light dark') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                activeScheme = prefersDark ? 'dark' : 'light';
            }
            document.documentElement.style.colorScheme = activeScheme === 'dark' ? 'light' : 'dark';
        });
    }
    // Image Load Animation (Scroll-triggered)
    const gridItems = document.querySelectorAll('.project-card');
    if (gridItems.length > 0) {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('.project-img');
                    if (img) {
                        if (img.complete) {
                            img.classList.add('loaded');
                        } else {
                            img.addEventListener('load', () => {
                                img.classList.add('loaded');
                            });
                        }
                    }
                    gridObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        gridItems.forEach((item) => {
            gridObserver.observe(item);
        });
    }
    // Case Study Scroll Animation
    const csItems = document.querySelectorAll('.cs-bento-item');
    if (csItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0,
            rootMargin: "0px 0px 100px 0px"
        });

        csItems.forEach((item, index) => {
            // Force the first two items to animate in immediately
            if (index < 2) {
                setTimeout(() => item.classList.add('visible'), 100 + (index * 100));
            } else {
                observer.observe(item);
            }
        });

        // Aspect Ratio Detection
        const csImages = document.querySelectorAll('.cs-bento-item img');
        csImages.forEach(img => {
            if (img.complete) {
                if (img.naturalHeight > img.naturalWidth) img.closest('.cs-bento-item').classList.add('vertical-slide');
            } else {
                img.addEventListener('load', () => {
                    if (img.naturalHeight > img.naturalWidth) img.closest('.cs-bento-item').classList.add('vertical-slide');
                });
            }
        });
    }

    // Accordion Toggle
    const toggles = document.querySelectorAll('.statement-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            const content = toggle.nextElementSibling;
            content.classList.toggle('open');
        });
    });

    // Flipbook Sliders
    const flipbooks = document.querySelectorAll('.flipbook-container');
    flipbooks.forEach(container => {
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const slider = container.querySelector('.flipbook-scroll');
        
        if (slider && prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -slider.clientWidth + 40, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                slider.scrollBy({ left: slider.clientWidth - 40, behavior: 'smooth' });
            });
        }
    });

    // Skill Scroller Logic
    const skillWrapper = document.querySelector('.skill-wrapper');
    const skillCurrent = document.querySelector('.skill-current');
    
    if (skillWrapper && skillCurrent) {
        const skills = ["Identity Designer", "UI/UX Designer", "Storyteller", "Problem Solver", "Graphic Designer"];
        let currentIndex = 0;
        
        // Initial width setup
        const initWidth = () => {
            if (skillCurrent.offsetWidth > 0) {
                skillWrapper.style.width = skillCurrent.offsetWidth + 'px';
            }
        };
        initWidth();
        
        // Also update if fonts change the size later
        if (document.fonts) {
            document.fonts.ready.then(initWidth);
        }
        // Fallback for immediate render
        requestAnimationFrame(initWidth);
        
        // Wait for the hook text to fade out before starting
        setTimeout(() => {
            const interval = setInterval(() => {
                currentIndex++;
                if (currentIndex >= skills.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        const stratText = document.getElementById('brand-strategist');
                        if(stratText) stratText.classList.add('script-text');
                    }, 400);
                    return;
                }
                
                // 1. Clone current text to animate it OUT
                const oldText = skillCurrent.cloneNode(true);
                skillWrapper.appendChild(oldText);
                oldText.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
                
                // Trigger reflow then animate OUT
                requestAnimationFrame(() => {
                    oldText.style.transform = 'translateY(-100%)';
                    oldText.style.opacity = '0';
                });
                
                // Remove old node after animation
                setTimeout(() => oldText.remove(), 300);
                
                // 2. Setup the actual node with NEW text to animate IN
                skillCurrent.textContent = skills[currentIndex];
                skillCurrent.style.transition = 'none';
                skillCurrent.style.transform = 'translateY(100%)';
                skillCurrent.style.opacity = '0';
                
                // Update wrapper width so the rest of the sentence slides over smoothly!
                skillWrapper.style.width = skillCurrent.offsetWidth + 'px';
                
                // Trigger reflow then animate IN
                requestAnimationFrame(() => {
                    skillCurrent.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
                    skillCurrent.style.transform = 'translateY(0)';
                    skillCurrent.style.opacity = '1';
                });
                
            }, 700); // Wait 700ms on each word
        }, 2100);
    }

    // --- Custom Animated Cursor ---
    const customCursor = document.createElement('div');
    customCursor.classList.add('custom-cursor');
    customCursor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#111111" /><path d="M10 16h10M16 12l4 4-4 4" fill="none" stroke="#F8F6F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-arrow" /></svg>';
    document.body.appendChild(customCursor);

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const projectCards = document.querySelectorAll('.project-card, .next-project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            customCursor.classList.add('active');
        });
        card.addEventListener('mouseleave', () => {
            customCursor.classList.remove('active');
        });
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        customCursor.style.transform = 'translate3d(' + (cursorX - 16) + 'px, ' + (cursorY - 16) + 'px, 0)';
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // --- Scroll to Top Button ---
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 800) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});

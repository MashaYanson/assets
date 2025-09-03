/**
 * Scroll-driven animations with Intersection Observer
 * Provides various entrance effects and fade-in animations for text elements
 */

(function() {
    'use strict';

    // Animation configuration
    const config = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        animationClass: 'animated',
        animateSelector: '.scroll-animate'
    };

    // Intersection Observer callback
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay) || 0;
                
                // Apply animation with delay
                setTimeout(() => {
                    element.classList.add(config.animationClass);
                }, delay);
                
                // Stop observing this element
                observer.unobserve(element);
            }
        });
    }

    // Initialize scroll animations
    function initScrollAnimations() {
        // Check if browser supports Intersection Observer
        if (!window.IntersectionObserver) {
            // Fallback: show all elements immediately
            document.querySelectorAll(config.animateSelector).forEach(element => {
                element.classList.add(config.animationClass);
            });
            return;
        }

        // Create Intersection Observer
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });

        // Observe all animation elements
        document.querySelectorAll(config.animateSelector).forEach(element => {
            observer.observe(element);
        });
    }

    // Enhanced scroll animations with performance optimizations
    function initEnhancedScrollAnimations() {
        let ticking = false;
        const animationElements = document.querySelectorAll(config.animateSelector);
        
        function updateAnimations() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            animationElements.forEach(element => {
                if (element.classList.contains(config.animationClass)) return;
                
                const elementTop = element.getBoundingClientRect().top + scrollY;
                const elementBottom = elementTop + element.offsetHeight;
                const triggerPoint = scrollY + windowHeight - 100;
                
                if (triggerPoint > elementTop && scrollY < elementBottom) {
                    const delay = parseInt(element.dataset.delay) || 0;
                    
                    setTimeout(() => {
                        element.classList.add(config.animationClass);
                    }, delay);
                }
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }
        
        // Use Intersection Observer if available, otherwise fall back to scroll listener
        if (window.IntersectionObserver) {
            initScrollAnimations();
        } else {
            window.addEventListener('scroll', requestTick);
            window.addEventListener('resize', requestTick);
            updateAnimations(); // Initial check
        }
    }

    // Advanced animation presets
    const animationPresets = {
        staggerText: function(container, options = {}) {
            const defaultOptions = {
                animation: 'fadeInUp',
                delay: 200,
                stagger: 100
            };
            const opts = { ...defaultOptions, ...options };
            
            const elements = container.querySelectorAll('span, div, p');
            elements.forEach((element, index) => {
                element.classList.add('scroll-animate');
                element.setAttribute('data-animation', opts.animation);
                element.setAttribute('data-delay', opts.delay + (index * opts.stagger));
            });
        },
        
        cascadeWords: function(textElement, options = {}) {
            const defaultOptions = {
                animation: 'fadeInUp',
                baseDelay: 0,
                wordDelay: 150
            };
            const opts = { ...defaultOptions, ...options };
            
            const text = textElement.textContent;
            const words = text.split(' ');
            
            textElement.innerHTML = words.map((word, index) => 
                `<span class="scroll-animate" data-animation="${opts.animation}" data-delay="${opts.baseDelay + (index * opts.wordDelay)}">${word}</span>`
            ).join(' ');
        },
        
        splitText: function(container, options = {}) {
            const defaultOptions = {
                leftDelay: 300,
                rightDelay: 600
            };
            const opts = { ...defaultOptions, ...options };
            
            const leftPart = container.querySelector('.text-part.left');
            const rightPart = container.querySelector('.text-part.right');
            
            if (leftPart && rightPart) {
                // Set up the animation trigger
                leftPart.style.animationDelay = opts.leftDelay + 'ms';
                rightPart.style.animationDelay = opts.rightDelay + 'ms';
                
                // Add a class to trigger animations when container is visible
                container.classList.add('split-text-ready');
            }
        }
    };

    // DOM ready function
    function domReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // Initialize when DOM is ready
    domReady(function() {
        initEnhancedScrollAnimations();
        
        // Initialize split text animation for artists section
        const splitTextContainers = document.querySelectorAll('.split-text-container');
        splitTextContainers.forEach(container => {
            animationPresets.splitText(container);
            
            // Use Intersection Observer to trigger split text animation
            if (window.IntersectionObserver) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-split-text');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.3,
                    rootMargin: '0px 0px -20px 0px'
                });
                
                observer.observe(container);
            } else {
                // Fallback for older browsers
                container.classList.add('animate-split-text');
            }
        });
        
        // Apply advanced presets to specific elements if needed
        const textElements = document.querySelectorAll('.mbr-text .scroll-animate span');
        textElements.forEach(element => {
            if (element.textContent.length > 50) {
                // Apply word-by-word animation for longer texts
                animationPresets.cascadeWords(element, {
                    animation: 'fadeInUp',
                    baseDelay: parseInt(element.dataset.delay) || 0,
                    wordDelay: 100
                });
            }
        });
    });

    // Export for external use
    window.ScrollAnimations = {
        init: initScrollAnimations,
        presets: animationPresets,
        config: config
    };

})();
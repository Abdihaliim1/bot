// VideoSave Bot - Main JavaScript File
// Handles all animations, interactions, and dynamic content

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initScrollReveal();
    initDemoAnimation();
    initStatsCounters();
    initPlatformChart();
    initSmoothScrolling();
    initInteractiveElements();
});

// Scroll reveal animation system
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add stagger delay for multiple elements
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Demo animation system
function initDemoAnimation() {
    const demoProgress = document.getElementById('demo-progress');
    const progressBar = demoProgress?.querySelector('.bg-gradient-to-r');
    
    if (!demoProgress || !progressBar) return;

    let animationRunning = false;
    
    function startDemoAnimation() {
        if (animationRunning) return;
        animationRunning = true;
        
        // Reset progress
        progressBar.style.width = '0%';
        
        // Animate progress bar
        anime({
            targets: progressBar,
            width: '100%',
            duration: 3000,
            easing: 'easeInOutQuad',
            complete: () => {
                // Show completion message
                setTimeout(() => {
                    showDemoComplete();
                    setTimeout(() => {
                        animationRunning = false;
                        startDemoAnimation(); // Restart animation
                    }, 2000);
                }, 500);
            }
        });
    }
    
    function showDemoComplete() {
        const chatContainer = document.querySelector('.space-y-4');
        if (!chatContainer) return;
        
        const completionMessage = document.createElement('div');
        completionMessage.className = 'flex justify-start';
        completionMessage.innerHTML = `
            <div class="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                <p class="text-sm flex items-center">
                    <span class="text-green-500 mr-2">✅</span>
                    Video downloaded successfully!
                </p>
                <div class="mt-2 bg-white rounded-lg p-2">
                    <div class="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center">
                        <span class="text-gray-500 text-sm">🎥 Video Preview</span>
                    </div>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(completionMessage);
        
        // Animate the new message
        anime({
            targets: completionMessage,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
    
    // Start animation when demo section is visible
    const demoSection = document.querySelector('.demo-chat');
    if (demoSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(startDemoAnimation, 1000);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(demoSection);
    }
}

// Animated statistics counters
function initStatsCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        setTimeout(() => animateCounter(counter), Math.random() * 500);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// Platform usage chart
function initPlatformChart() {
    const chartContainer = document.getElementById('platform-chart');
    if (!chartContainer) return;
    
    const chart = echarts.init(chartContainer);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: '0%',
            textStyle: {
                fontSize: 14
            }
        },
        series: [
            {
                name: 'Platform Usage',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { 
                        value: 35, 
                        name: 'TikTok',
                        itemStyle: { color: '#ff6b6b' }
                    },
                    { 
                        value: 28, 
                        name: 'Instagram',
                        itemStyle: { color: '#4ecdc4' }
                    },
                    { 
                        value: 25, 
                        name: 'YouTube',
                        itemStyle: { color: '#1a5f5f' }
                    },
                    { 
                        value: 12, 
                        name: 'Other Platforms',
                        itemStyle: { color: '#95a5a6' }
                    }
                ]
            }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
            return Math.random() * 200;
        }
    };
    
    chart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Interactive elements and hover effects
function initInteractiveElements() {
    // Button hover animations
    const buttons = document.querySelectorAll('button, .card-hover');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Platform icon interactions
    const platformIcons = document.querySelectorAll('.platform-icon');
    
    platformIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Add click animation
            anime({
                targets: this,
                scale: [1, 0.95, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
            
            // Show platform-specific info (could be expanded)
            showPlatformInfo(this);
        });
    });
    
    // Navigation blur effect on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(250, 250, 250, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'rgba(250, 250, 250, 0.9)';
            nav.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Show platform-specific information
function showPlatformInfo(platformElement) {
    const platformName = platformElement.querySelector('h3').textContent;
    
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">✓</span>
            </div>
            <div>
                <div class="font-semibold text-gray-900">${platformName} Supported</div>
                <div class="text-sm text-gray-500">Click to learn more about ${platformName} features</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad'
    });
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: 300,
            opacity: 0,
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                notification.remove();
            }
        });
    }, 3000);
}

// Utility function for creating floating particles effect
function createFloatingParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(26, 95, 95, ${particle.opacity})`;
            ctx.fill();
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', resizeCanvas);
}

// Initialize floating particles (optional - can be enabled for extra visual effect)
// createFloatingParticles();

// Add loading state management
function showLoadingState(element) {
    const originalText = element.textContent;
    element.textContent = '⏳ Loading...';
    element.disabled = true;
    
    setTimeout(() => {
        element.textContent = originalText;
        element.disabled = false;
    }, 2000);
}

// Add click handlers for CTA buttons
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Start Downloading') || 
        e.target.textContent.includes('Try Bot Now') ||
        e.target.textContent.includes('Try VideoSave Bot')) {
        
        showLoadingState(e.target);
        
        // Simulate bot interaction
        setTimeout(() => {
            window.open('https://t.me/instasaverke', '_blank');
        }, 1000);
    }
    
    if (e.target.textContent.includes('View Demo')) {
        // Scroll to demo section
        document.querySelector('.demo-chat').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    if (e.target.textContent.includes('Read Setup Guide')) {
        window.location.href = 'setup.html';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Error handling for missing elements
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}

// Console easter egg
console.log(`
🎥 VideoSave Bot - Landing Page
Built with ❤️ using modern web technologies

Features:
- Smooth animations with Anime.js
- Interactive charts with ECharts
- Responsive design with Tailwind CSS
- Progressive enhancement approach

Ready to download some videos? 🚀
`);
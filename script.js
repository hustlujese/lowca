document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled');
            // Wait, actually I want it to be transparent at top, but scrolled immediately after
            // Let's remove scrolled when at top
            if(window.scrollY <= 10) {
                 navbar.classList.remove('scrolled');
            }
        }
    });

    // Initial check
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    }

    // --- Intersection Observer for Scroll Animations (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Accordion Logic (TOS & Privacy) ---
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(acc => {
        const btn = acc.querySelector('.accordion-btn');
        const content = acc.querySelector('.accordion-content');

        btn.addEventListener('click', () => {
            // Check if currently active
            const isActive = acc.classList.contains('active');
            
            // Close all accordions (optional, for one-at-a-time behavior)
            accordions.forEach(a => {
                a.classList.remove('active');
                a.querySelector('.accordion-content').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                acc.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                // Adjust scroll position for navbar height
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Pricing Toggle Logic ---
    const pricingToggleBtn = document.getElementById('pricing-toggle-btn');
    const priceMain = document.getElementById('price-main');
    const priceExtra = document.getElementById('price-extra');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');

    if(pricingToggleBtn) {
        pricingToggleBtn.addEventListener('change', (e) => {
            if(e.target.checked) {
                // Yearly
                labelMonthly.classList.remove('active');
                labelYearly.classList.add('active');
                
                // 19% discount
                // Base: 499, Yearly (per month approx): 404
                // Extra: 129, Yearly (per month approx): 104
                animateValue(priceMain, parseInt(priceMain.innerText), 404, 300);
                animateValue(priceExtra, parseInt(priceExtra.innerText), 104, 300);
            } else {
                // Monthly
                labelYearly.classList.remove('active');
                labelMonthly.classList.add('active');
                
                animateValue(priceMain, parseInt(priceMain.innerText), 499, 300);
                animateValue(priceExtra, parseInt(priceExtra.innerText), 129, 300);
            }
        });
    }
    // Number animation helper
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- Slots Rendering Logic ---
    const slotsGrid = document.getElementById('slots-grid');
    if (slotsGrid) {
        const voivodeships = [
            "Dolnośląskie", "Kujawsko-pomorskie", "Lubelskie", "Lubuskie",
            "Łódzkie", "Małopolskie", "Mazowieckie", "Opolskie",
            "Podkarpackie", "Podlaskie", "Pomorskie", "Śląskie",
            "Świętokrzyskie", "Warmińsko-mazurskie", "Wielkopolskie", "Zachodniopomorskie"
        ];

        // Symulacja pobierania danych z Telegrama (liczba wszystkich członków w grupie)
        // 2 osoby to Ty (Admin) i Bot. Klienci liczeni są od 3 osoby. Maksymalnie 15 klientów (czyli 17 w grupie).
        // W prawdziwym systemie te dane pochodziłyby np. z pliku JSON generowanego przez Bota.
        
        // Funkcja generująca losowe dane na potrzeby pokazu
        const getDummyData = () => {
            return voivodeships.map(region => {
                // Na prośbę: wyzerowano, ponieważ nie ma jeszcze klientów (Beta)
                let customers = 0;
                
                return { name: region, customers: customers, max: 15 };
            });
        };

        const slotsData = getDummyData();

        slotsData.forEach(slot => {
            const isFull = slot.customers >= slot.max;
            const statusClass = isFull ? 'full' : 'available';
            const statusText = isFull ? 'Brak Miejsc ❌' : 'Dostępne ✅';

            const card = document.createElement('div');
            card.className = 'slot-card';
            card.innerHTML = `
                <div class="slot-header">
                    <span class="slot-region">${slot.name}</span>
                    <span class="slot-count ${statusClass}">${statusText}</span>
                </div>
            `;
            slotsGrid.appendChild(card);
        });
    }
});

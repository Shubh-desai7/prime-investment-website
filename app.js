document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    // --- Premium Staggered Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        let delayCounter = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delayCounter * 120);
                delayCounter++;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    const formatINR = (num) => '₹' + Math.round(num).toLocaleString('en-IN');

    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('.calc-tab');
    const panels = document.querySelectorAll('.calc-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // --- SIP Calculator Logic ---
    const sipMonthly = document.getElementById('sip-monthly');
    const sipRate = document.getElementById('sip-rate');
    const sipYears = document.getElementById('sip-years');

    function calcSIP() {
        if (!sipMonthly) return;
        const P = parseFloat(sipMonthly.value);
        const r = parseFloat(sipRate.value);
        const y = parseFloat(sipYears.value);

        document.getElementById('sip-m-val').textContent = P.toLocaleString('en-IN');
        document.getElementById('sip-r-val').textContent = r;
        document.getElementById('sip-y-val').textContent = y;

        const i = r / 12 / 100;
        const n = y * 12;

        const invested = P * n;
        const maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const gained = maturity - invested;

        document.getElementById('sip-invested').textContent = formatINR(invested);
        document.getElementById('sip-gained').textContent = formatINR(gained);
        document.getElementById('sip-total').textContent = formatINR(maturity);
    }
    if (sipMonthly) {
        [sipMonthly, sipRate, sipYears].forEach(el => el.addEventListener('input', calcSIP));
        calcSIP();
    }

    // --- Lumpsum Calculator Logic ---
    const lumPrincipal = document.getElementById('lum-principal');
    const lumRate = document.getElementById('lum-rate');
    const lumYears = document.getElementById('lum-years');

    function calcLumpsum() {
        if (!lumPrincipal) return;
        const P = parseFloat(lumPrincipal.value);
        const r = parseFloat(lumRate.value) / 100;
        const y = parseFloat(lumYears.value);

        document.getElementById('lum-p-val').textContent = P.toLocaleString('en-IN');
        document.getElementById('lum-r-val').textContent = (r * 100).toFixed(1);
        document.getElementById('lum-y-val').textContent = y;

        const invested = P;
        const maturity = P * Math.pow((1 + r), y);
        const gained = maturity - invested;

        document.getElementById('lum-invested').textContent = formatINR(invested);
        document.getElementById('lum-gained').textContent = formatINR(gained);
        document.getElementById('lum-total').textContent = formatINR(maturity);
    }
    if (lumPrincipal) {
        [lumPrincipal, lumRate, lumYears].forEach(el => el.addEventListener('input', calcLumpsum));
        calcLumpsum();
    }

    // --- Retirement Calculator Logic ---
    const retAge = document.getElementById('ret-current-age');
    const retExp = document.getElementById('ret-expense');

    function calcRetirement() {
        if (!retAge) return;
        const currentAge = parseInt(retAge.value);
        const currentExp = parseFloat(retExp.value);
        const retirementAge = 60;
        const inflation = 0.06;

        document.getElementById('ret-ca-val').textContent = currentAge;
        document.getElementById('ret-exp-val').textContent = currentExp.toLocaleString('en-IN');

        const yearsLeft = retirementAge - currentAge;
        document.getElementById('ret-years-left').textContent = `${yearsLeft} Years`;

        const futureExp = currentExp * Math.pow((1 + inflation), yearsLeft);
        document.getElementById('ret-future-exp').textContent = formatINR(futureExp);

        const corpus = (futureExp * 12) * 20;
        document.getElementById('ret-corpus').textContent = formatINR(corpus);
    }
    if (retAge) {
        [retAge, retExp].forEach(el => el.addEventListener('input', calcRetirement));
        calcRetirement();
    }

    // --- Lead Form Validation & Micro-Feedback ---
    const leadForm = document.getElementById('lead-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = leadForm ? leadForm.querySelector('button[type="submit"]') : null;

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fname = document.getElementById('fname').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const digitsOnly = phone.replace(/\D/g, '');

            if (fname.length > 0 && digitsOnly.length >= 10) {
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="margin-right: 8px;"></i> Submitting...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    leadForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formSuccess.classList.add('fade-in-active');
                }, 1200);
            } else {
                alert('Please provide a valid Name and a 10-digit Phone Number.');
            }
        });
    }
});
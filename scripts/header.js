const burger = document.querySelector('.nav-burger');
        const nav = document.querySelector('nav');
        const burgerLines = document.querySelectorAll('.burger-line');

        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burgerLines.forEach(line => line.classList.toggle('active'));
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
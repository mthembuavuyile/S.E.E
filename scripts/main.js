// Parallax effect on scroll
       window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelector('.hero').style.transform = `translateY(${scrolled * 0.5}px)`;
    });

  // Intersection Observer for fade-in animations
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
   });

    document.querySelectorAll('section').forEach((section) => {
       section.style.opacity = 0;
       section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.5s ease-out';
       observer.observe(section);
   });
// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            e.preventDefault(); // Only prevent if target exists
            target.scrollIntoView({ behavior: 'smooth' });
        }
        // If no target, let browser handle it normally so scroll doesn't break
    });
});

// Back to Top Button - only runs if button exists
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Handle Reservation Form
function handleReservation(event) {
    event.preventDefault();
    const form = event.target;
    
    // Get form data
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const time = form.querySelector('select').value;
    
    // Create reservation message
    const message = `Hello! I would like to make a reservation at Mama Njie's Restaurant.%0A%0AReservation Details:%0A- Name: ${name}%0A- Email: ${email}%0A- Phone: ${phone}%0A- Time: ${time}%0A%0AThank you!`;
    
    // WhatsApp API link - sends to +2205169685
    const whatsappURL = `https://wa.me/2205169685?text=${message}`;
    
    // Show confirmation message
    alert(`Thanks ${name}! Opening WhatsApp to send your reservation details...`);
    
    // Open WhatsApp in new window
    window.open(whatsappURL, '_blank');
    
    // Reset form
    form.reset();
}
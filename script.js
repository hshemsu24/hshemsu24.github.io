// script.js

// Add an event listener to the window scroll event
window.addEventListener('scroll', function() {
    // Get the height of the viewport
    const viewportHeight = window.innerHeight;
  
    // Get all the sections on the page
    const sections = document.querySelectorAll('section');
  
    // Loop through each section and check if it is in the viewport
    sections.forEach(function(section) {
      // Get the position and height of the section
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
  
      // Calculate the section's position in the viewport
      const sectionInView = sectionTop < viewportHeight && sectionTop + sectionHeight > 0;
  
      // Apply the blur effect to the main content if the section is in view
      if (sectionInView) {
        document.querySelector('main').classList.remove('blur');
      } else {
        document.querySelector('main').classList.add('blur');
      }
    });
  
    // Update the active navigation link based on the current section
    sections.forEach(function(section) {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
  
      if (sectionTop < viewportHeight / 2 && sectionTop + sectionHeight > viewportHeight / 2) {
        const sectionId = section.getAttribute('id');
        updateActiveLink(sectionId);
      }
    });
  });
  
  // Function to update the active navigation link
  function updateActiveLink(sectionId) {
    const navLinks = document.querySelectorAll('nav a');
  
    // Remove the 'active' class from all navigation links
    navLinks.forEach(function(link) {
      link.classList.remove('active');
    });
  
    // Add the 'active' class to the corresponding navigation link
    const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    activeLink.classList.add('active');
  }
  
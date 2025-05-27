import shortcuts from './shortcuts.js';

// DOM Elements
const shortcutContainer = document.getElementById('shortcutContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const filterButtons = document.querySelectorAll('.filter-btn');
const darkModeToggle = document.getElementById('darkModeToggle');
const goToTopButton = document.getElementById('goToTop'); // Add "Go to Top" button

function createCard(shortcut) {
    const card = document.createElement('div');
    card.className = 'shortcut-card';

    // Truncate the description to a maximum of 50 characters
    const truncatedDescription = shortcut.description.length > 50
        ? shortcut.description.substring(0, 50) + '...'
        : shortcut.description;

    // Check if the detailed field contains an image or text
    const isImage = shortcut.detailed && (shortcut.detailed.endsWith('.jpg') || shortcut.detailed.endsWith('.png') || shortcut.detailed.endsWith('.jpeg') || shortcut.detailed.endsWith('.gif'));

    card.innerHTML = `
        <div class="category-tag">${shortcut.category}</div>
        <div class="keys">${shortcut.keys}</div>
        <div class="description">${truncatedDescription}</div>
        <div class="detailed-description">
          ${isImage
            ? `<img src="${shortcut.detailed}" class="zoomable"/>`
            : `<p>${shortcut.detailed}</p>`}
        </div>
        <i class="fas fa-chevron-down expand-icon"></i>
    `;

    // Click handler for the card
    card.addEventListener('click', function (e) {
        e.stopPropagation();
        const currentCard = e.currentTarget;
        const wasExpanded = currentCard.classList.contains('expanded');

        // Collapse all other cards
        document.querySelectorAll('.shortcut-card.expanded').forEach(card => {
            if (card !== currentCard) {
                card.classList.remove('expanded');
            }
        });

        // Toggle the clicked card's expanded state
        if (!wasExpanded) {
            currentCard.classList.add('expanded');
            enableImageZoom(); // Reapply zoom functionality to the newly expanded card
        } else {
            currentCard.classList.remove('expanded');
        }
    });

    return card;
}

// Document click handler to close cards when clicking outside
document.addEventListener('click', function (e) {
    // Collapse all expanded cards if the click is outside any card
    if (!e.target.closest('.shortcut-card')) {
        document.querySelectorAll('.shortcut-card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
    }
});

function renderShortcuts(filter = 'all', category = 'all', search = '') {
    shortcutContainer.innerHTML = ''; // Clear the container

    const filtered = shortcuts.filter(shortcut => {
        const matchesOS = filter === 'all' || shortcut.os === filter;
        const matchesCategory = category === 'all' || shortcut.category === category;
        const searchLower = search.toLowerCase();
        return matchesOS && matchesCategory && (
            shortcut.description.toLowerCase().includes(searchLower) ||
            shortcut.detailed.toLowerCase().includes(searchLower) ||
            shortcut.keys.toLowerCase().includes(searchLower)
        );
    });

    filtered.forEach(shortcut => {
        shortcutContainer.appendChild(createCard(shortcut));
    });

    // Re-apply the zoom functionality to the newly rendered images
    enableImageZoom();
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    renderShortcuts(
        document.querySelector('.filter-btn.active').dataset.category,
        categoryFilter.value,
        e.target.value
    );
});

categoryFilter.addEventListener('change', (e) => {
    renderShortcuts(
        document.querySelector('.filter-btn.active').dataset.category,
        e.target.value,
        searchInput.value
    );
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderShortcuts(
            button.dataset.category,
            categoryFilter.value,
            searchInput.value
        );
    });
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

function enableImageZoom() {
    const images = document.querySelectorAll('.shortcut-card img.zoomable');

    images.forEach((img) => {
        let scale = 1; // Initial scale
        let isDragging = false; // Track if the image is being dragged
        let startX = 0; // Starting X position of the mouse
        let startY = 0; // Starting Y position of the mouse
        let translateX = 0; // Current X translation of the image
        let translateY = 0; // Current Y translation of the image

        // Zoom in/out on mouse wheel
        img.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent the page from scrolling

            // Adjust the scale based on the scroll direction
            if (e.deltaY < 0) {
                scale += 0.1; // Zoom in
            } else {
                scale -= 0.1; // Zoom out
            }

            // Limit the scale to a reasonable range
            scale = Math.min(Math.max(scale, 1), 3);

            // Apply the scale transformation
            img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        });

        // Start dragging on mousedown
        img.addEventListener('mousedown', (e) => {
            if (scale > 1) { // Allow dragging only if the image is zoomed in
                isDragging = true;
                startX = e.clientX; // Record the starting mouse X position
                startY = e.clientY; // Record the starting mouse Y position
                img.style.cursor = 'grabbing'; // Change cursor to indicate dragging
            }
        });

        // Drag the image on mousemove
        img.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - startX; // Calculate the X movement
                const deltaY = e.clientY - startY; // Calculate the Y movement
                translateX += deltaX; // Update the X translation
                translateY += deltaY; // Update the Y translation
                img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
                startX = e.clientX; // Update the starting X position
                startY = e.clientY; // Update the starting Y position
            }
        });

        // Stop dragging on mouseup
        img.addEventListener('mouseup', () => {
            isDragging = false;
            img.style.cursor = scale > 1 ? 'grab' : 'default'; // Reset cursor to indicate draggable state
        });

        // Stop dragging on mouseleave
        img.addEventListener('mouseleave', () => {
            isDragging = false;
    if (scale > 1) {
        img.style.transform = 'scale(1) translate(0, 0)';
        translateX = 0;
        translateY = 0;
        scale = 1;
        // Remove inline style after transition to allow CSS hover
        setTimeout(() => {
            img.style.transform = '';
        }, 300); // Matches CSS transition duration
    }
    img.style.cursor = 'default';
        });
    });
}

// Add "Go to Top" functionality
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) { // Show button after scrolling 200px
        goToTopButton.style.display = 'flex';
    } else {
        goToTopButton.style.display = 'none';
    }
});

goToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling
    });
});

// Call the function after rendering the shortcuts
renderShortcuts();
enableImageZoom();
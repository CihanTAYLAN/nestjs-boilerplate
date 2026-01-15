window.apiDocUtils = {
    changeCategory: function(category, element) {
        console.log('Switching to category:', category);
        const apiElement = document.getElementById('api-docs');
        const container = document.querySelector('.api-container');
        if (!apiElement || !container) return;

        // Update active class in UI
        if (element) {
            const items = document.querySelectorAll('.nav-item');
            items.forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }

        // Update URL without refreshing the page
        const newUrl = '/api/v1/doc/' + category;
        window.history.pushState({ category: category }, '', newUrl);

        // Transition effect
        container.style.opacity = '0.3';
        container.style.filter = 'blur(8px)';

        setTimeout(() => {
            // Re-create the element to force a complete refresh of the Stoplight UI
            const newApiElement = document.createElement('elements-api');
            newApiElement.id = 'api-docs';
            newApiElement.setAttribute('data-theme', 'dark');
            newApiElement.setAttribute('apiDescriptionUrl', '/api/v1/doc/swagger-doc-json/' + category);
            newApiElement.setAttribute('router', 'hash');
            newApiElement.setAttribute('layout', 'sidebar');
            newApiElement.setAttribute('hideExport', 'false');

            // Clear and append
            container.innerHTML = '';
            container.appendChild(newApiElement);

            // Re-apply styles
            container.style.opacity = '1';
            container.style.filter = 'none';
        }, 150);
    }
};

// Handle hash changes if necessary
window.addEventListener('hashchange', () => {
    // Sync UI state if needed
});

// Initialize tooltips or other micro-interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initial load animations or checks
});

// Initialize the app
window.app = {
    router: {
        currentPage: 'home',

        navigate: function (page, pushHistory = true) {
            this.currentPage = page;
            const contentEl = document.getElementById('app-content');

            if (!contentEl) {
                console.error('app-content element not found');
                return;
            }

            // Update URL using History API
            if (pushHistory) {
                const url = page === 'home' ? '/' : `/${page}`;
                window.history.pushState({ page: page }, '', url);
            }

            // Update document title
            const pageTitle = page === 'home' ? 'Home' : page.charAt(0).toUpperCase() + page.slice(1);
            document.title = `${pageTitle} - My SPA App`;

            // Load page content
            const pagePath = `pages/${page}.html`;

            fetch(pagePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    contentEl.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    contentEl.innerHTML = `<div class="container mt-5"><div class="alert alert-danger" role="alert">Error loading page: ${error.message}</div></div>`;
                });
        },

        // // Get page from URL
        getPageFromURL: function () {
            const path = window.location.pathname;
            if (path === '/' || path === '') return 'home';
            // เอาทุก segment มาต่อด้วย "-"
            return path.substring(1).replace(/\//g, '-');
        }
    },

    loadComponents: function () {
        // Load header
        fetch('components/header.html')
            .then(response => response.text())
            .then(html => {
                const headerEl = document.getElementById('navbar-header');
                if (headerEl) {
                    headerEl.innerHTML = html;
                }
            })
            .catch(error => console.error('Error loading header:', error));

        // Load footer
        fetch('components/footer.html')
            .then(response => response.text())
            .then(html => {
                const footerEl = document.getElementById('footer-content');
                if (footerEl) {
                    footerEl.innerHTML = html;
                }
            })
            .catch(error => console.error('Error loading footer:', error));
    }
};

// Handle browser back/forward buttons
window.addEventListener('popstate', function (event) {
    const page = event.state?.page || window.app.router.getPageFromURL();
    window.app.router.navigate(page, false);
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        window.app.loadComponents();
        const page = window.app.router.getPageFromURL();
        // setTimeout(() => window.app.router.navigate(page, false), 100);
        window.app.router.navigate(page, false);

    });
} else {
    window.app.loadComponents();
    const page = window.app.router.getPageFromURL();
    // setTimeout(() => window.app.router.navigate(page, false), 100);
    window.app.router.navigate(page, false);

}



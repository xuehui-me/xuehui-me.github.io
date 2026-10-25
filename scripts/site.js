(() => {
    const links = Array.from(document.querySelectorAll('#sidebar .menu-list a'));
    const entries = links.map(link => ({ link, section: document.querySelector(link.hash) }))
        .filter(entry => entry.section);
    let scheduled = false;

    function updateNavigation() {
        scheduled = false;
        if (!entries.length) return;
        let current = entries[0];
        for (const entry of entries) {
            if (entry.section.getBoundingClientRect().top <= 60) current = entry;
        }
        if (scrollY + innerHeight >= document.documentElement.scrollHeight - 10) {
            current = entries[entries.length - 1];
        }
        for (const entry of entries) {
            entry.link.classList.toggle('is-active', entry === current);
            if (entry === current) entry.link.setAttribute('aria-current', 'location');
            else entry.link.removeAttribute('aria-current');
        }
    }

    function scheduleNavigation() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(updateNavigation);
    }

    window.addEventListener('scroll', scheduleNavigation, { passive: true });
    window.addEventListener('resize', scheduleNavigation);
    window.addEventListener('load', updateNavigation);
    updateNavigation();

    const map = document.querySelector('.visitor-map img[data-src]');
    const mapLabel = document.querySelector('.visitor-label');
    const isPublishedSite = location.hostname === 'xuehui-me.github.io'
        && ['http:', 'https:'].includes(location.protocol);
    if (map && isPublishedSite && navigator.onLine) {
        map.addEventListener('load', () => {
            map.hidden = false;
            if (mapLabel) mapLabel.hidden = true;
            scheduleNavigation();
        });
        map.addEventListener('error', () => {
            map.hidden = true;
            if (mapLabel) mapLabel.hidden = false;
        });
        map.src = map.dataset.src;
    }
})();

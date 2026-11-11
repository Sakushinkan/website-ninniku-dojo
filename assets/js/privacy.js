/* Google Maps is created only after Usercentrics reports consent for that service. */
(() => {
    let mapsAllowed = false;
    let cmpReady = false;
    let consentRevision = 0;

    function render() {
        document.querySelectorAll('[data-privacy-settings]').forEach(button => {
            button.hidden = !cmpReady;
        });
        document.querySelectorAll('[data-map-src]').forEach(panel => {
            const placeholder = panel.querySelector('.map-placeholder');
            let frame = panel.querySelector('iframe');
            if (mapsAllowed && !frame) {
                frame = document.createElement('iframe');
                frame.title = 'Mappa della sede del Ninniku Dojo alla Sailing Gym';
                frame.height = '360';
                frame.loading = 'lazy';
                frame.referrerPolicy = 'no-referrer-when-downgrade';
                frame.allowFullscreen = true;
                frame.src = panel.dataset.mapSrc;
                panel.appendChild(frame);
            } else if (!mapsAllowed && frame) {
                frame.remove();
            }
            placeholder.hidden = mapsAllowed;
        });
    }

    function applyConsent(details) {
        const services = Object.values(details?.services || {});
        mapsAllowed = services.some(service =>
            service.name === 'Google Maps' && service.consent?.given === true
        );
        render();
    }

    async function initialize() {
        if (!window.__ucCmp) return;
        const revision = consentRevision;
        try {
            if (!await window.__ucCmp.isInitialized()) return;
            cmpReady = true;
            render();
            const details = await window.__ucCmp.getConsentDetails();
            // A newer choice must take precedence over this asynchronous initial read.
            if (revision === consentRevision) applyConsent(details);
        } catch {
            // Leave the map blocked when consent cannot be read.
        }
    }

    window.addEventListener('UC_CONSENT', event => {
        consentRevision++;
        applyConsent(event.detail);
    });
    window.addEventListener('UC_UI_INITIALIZED', initialize);
    document.addEventListener('DOMContentLoaded', () => {
        render();
        document.querySelectorAll('[data-privacy-settings]').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    await window.__ucCmp.showSecondLayer();
                } catch {
                    // The external Google Maps link remains available if the CMP fails.
                }
            });
        });
        initialize();
    });
})();

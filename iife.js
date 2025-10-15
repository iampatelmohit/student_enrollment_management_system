(function () {
    function c() {
        // Get the content document of the iframe
        var b = a.contentDocument || a.contentWindow.document;

        if (b) {
            // Create a <script> element to inject CF challenge parameters
            var d = b.createElement('script');

            d.innerHTML = `
                window.__CF$cv$params = {
                    r: '98ecc151b01b59cc',
                    t: 'MTc2MDUwNDQ1MS4wMDAwMDA='
                };
                var a = document.createElement('script');
                a.nonce = '';
                a.src = '/cdn-cgi/challenge-platform/scripts/jsd/main.js';
                document.getElementsByTagName('head')[0].appendChild(a);
            `;

            // Append the script to the iframe's head
            b.getElementsByTagName('head')[0].appendChild(d);
        }
    }

    if (document.body) {
        // Create a hidden iframe element
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';

        // Append the iframe to the document body
        document.body.appendChild(a);

        // If the document is already loaded, call c() immediately
        if (document.readyState !== 'loading') {
            c();
        }
        // Otherwise, set up event listener for DOMContentLoaded
        else if (window.addEventListener) {
            document.addEventListener('DOMContentLoaded', c);
        } else {
            // Fallback for older browsers using onreadystatechange
            var e = document.onreadystatechange || function () {};
            document.onreadystatechange = function (b) {
                e(b);
                if (document.readyState !== 'loading') {
                    document.onreadystatechange = e;
                    c();
                }
            };
        }
    }
})();

(() => {
    "use strict";
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("DOMContentLoaded", (function() {
        const radios = document.querySelectorAll('.js-options-type input[name="type"]');
        const items = {
            1: document.querySelector(".example-calc__item--word"),
            2: document.querySelector(".example-calc__item--image"),
            3: document.querySelector(".example-calc__item--word-image")
        };
        function updateExample(type) {
            Object.entries(items).forEach((([key, el]) => {
                if (key === type) {
                    el.classList.add("is-active");
                    requestAnimationFrame((() => {
                        el.classList.add("is-visible");
                    }));
                } else {
                    el.classList.remove("is-visible");
                    el.classList.remove("is-active");
                }
            }));
        }
        radios.forEach((radio => {
            radio.addEventListener("change", (function() {
                updateExample(this.value);
            }));
        }));
        const checked = document.querySelector('.js-options-type input[name="type"]:checked');
        if (checked) updateExample(checked.value);
    }));
})();

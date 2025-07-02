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
    document.addEventListener("DOMContentLoaded", (() => {
        const formatPrice = val => `${val.toLocaleString("ru-RU")} ₽`;
        const radiosType = document.querySelectorAll('.js-options-type input[name="type"]');
        const searchBlock = document.querySelector(".info-calc-item_search");
        const classCountInput = document.querySelector("#range");
        const items = {
            1: document.querySelector(".example-calc__item--word"),
            2: document.querySelector(".example-calc__item--image"),
            3: document.querySelector(".example-calc__item--word-image")
        };
        const totalEl = document.querySelector(".js-result-total strong");
        const searchRadios = document.querySelectorAll('input[name="search"]');
        const searchImgRadios = document.querySelectorAll('input[name="search-for-img"]');
        const isSearchRequired = () => document.querySelector('input[name="search"]:checked')?.value === "1";
        const isImageSearchRequired = () => document.querySelector('input[name="search-for-img"]:checked')?.value === "1";
        const getSelectedType = () => document.querySelector('input[name="type"]:checked')?.value;
        const getClassCount = () => parseInt(classCountInput?.noUiSlider?.get() || "1");
        function toggleSearchBlock(typeValue) {
            if (!searchBlock) return;
            searchBlock.classList.toggle("hidden", typeValue === "1");
        }
        function updateExample(type) {
            Object.entries(items).forEach((([key, el]) => {
                if (!el) return;
                if (key === type) {
                    el.classList.add("is-active");
                    requestAnimationFrame((() => el.classList.add("is-visible")));
                } else el.classList.remove("is-visible", "is-active");
            }));
        }
        function updatePrices() {
            const selectedType = getSelectedType();
            const classCount = getClassCount();
            document.querySelectorAll(".result-calc-item[data-price]").forEach((item => {
                const basePrice = parseInt(item.dataset.price || "0");
                const priceEl = item.querySelector(".result-calc-item__value strong");
                let finalPrice = basePrice;
                if (item.classList.contains("js-search-price") && !isSearchRequired()) finalPrice = 0; else if (item.classList.contains("js-reg-price")) if (selectedType === "1") finalPrice = basePrice; else finalPrice = basePrice * (isImageSearchRequired() ? 2 : 1); else if (item.classList.contains("js-gosposhlina-vidacha")) finalPrice = basePrice + Math.max(0, classCount - 5) * 2e3;
                if (priceEl) priceEl.textContent = formatPrice(finalPrice);
            }));
            const podachaBlock = document.querySelector(".js-gosposhlina-podacha");
            if (podachaBlock) {
                const formal = parseInt(podachaBlock.dataset.formal || "0");
                const expert = parseInt(podachaBlock.dataset.expert || "0");
                const extraClasses = Math.max(0, classCount - 1);
                const total = formal + expert + extraClasses * (1e3 + 2500);
                const priceEl = podachaBlock.querySelector(".result-calc-item__value strong");
                if (priceEl) priceEl.textContent = formatPrice(total);
            }
            const tariffBlock = document.querySelector(".js-tariff-price");
            if (tariffBlock) {
                const isFast = document.querySelector('input[name="tariff"]:checked')?.value === "2";
                const selectedType = getSelectedType();
                const basePrice = parseInt(tariffBlock.dataset.priceBase || "0");
                const fastPrice = parseInt(tariffBlock.dataset.fast || "0");
                const standardPrice = parseInt(tariffBlock.dataset.standard || "0");
                const labelEl = tariffBlock.querySelector(".result-calc-item__label");
                const valueEl = tariffBlock.querySelector(".result-calc-item__value strong");
                let total = 0;
                if (isFast) {
                    const multiplier = selectedType === "3" ? 2 : 1;
                    total = fastPrice + basePrice * multiplier;
                    if (labelEl) labelEl.textContent = "Ускоренная пошлина";
                } else {
                    total = standardPrice;
                    if (labelEl) labelEl.textContent = "Стандартная пошлина";
                }
                if (valueEl) valueEl.textContent = formatPrice(total);
                tariffBlock.dataset.price = total;
            }
        }
        function updateTotal() {
            let total = 0;
            const selectedType = getSelectedType();
            const classCount = getClassCount();
            document.querySelectorAll(".result-calc-item[data-price]").forEach((item => {
                const basePrice = parseInt(item.dataset.price || "0");
                if (item.classList.contains("js-search-price") && !isSearchRequired()) return;
                if (item.classList.contains("js-reg-price")) total += selectedType === "1" ? basePrice : basePrice * (isImageSearchRequired() ? 2 : 1); else if (item.classList.contains("js-gosposhlina-vidacha")) total += basePrice + Math.max(0, classCount - 5) * 2e3; else total += basePrice;
            }));
            const podachaBlock = document.querySelector(".js-gosposhlina-podacha");
            if (podachaBlock) {
                const formal = parseInt(podachaBlock.dataset.formal || "0");
                const expert = parseInt(podachaBlock.dataset.expert || "0");
                const extraClasses = Math.max(0, classCount - 1);
                total += formal + expert + extraClasses * (1e3 + 2500);
            }
            if (totalEl) totalEl.textContent = formatPrice(total);
            const tariffBlock = document.querySelector(".js-tariff-price");
            if (tariffBlock) {
                const isFast = document.querySelector('input[name="tariff"]:checked')?.value === "2";
                const price = parseInt(tariffBlock.dataset[isFast ? "fast" : "standard"] || "0");
                total += price;
            }
        }
        function handleChange() {
            const selectedType = getSelectedType();
            updateExample(selectedType);
            toggleSearchBlock(selectedType);
            updatePrices();
            updateTotal();
        }
        const radiosTariff = document.querySelectorAll('input[name="tariff"]');
        [ ...radiosType, ...searchRadios, ...searchImgRadios, ...radiosTariff ].forEach((radio => {
            radio.addEventListener("change", handleChange);
        }));
        if (classCountInput?.noUiSlider) classCountInput.noUiSlider.on("update", handleChange);
        document.querySelectorAll(".calc__wrapper").forEach((wrapper => {
            const nameInput = wrapper.querySelector(".js-name");
            const phoneInput = wrapper.querySelector(".js-phone");
            const submitBtn = wrapper.querySelector(".result-calc-item__btn");
            const checkInputs = () => {
                const filled = nameInput?.value.trim() && phoneInput?.value.trim();
                submitBtn?.classList.toggle("_disabled", !filled);
            };
            nameInput?.addEventListener("input", checkInputs);
            phoneInput?.addEventListener("input", checkInputs);
            checkInputs();
        }));
        handleChange();
    }));
    window["FLS"] = false;
})();

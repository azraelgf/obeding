(() => {
    "use strict";
    const modules_flsModules = {};
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
                document.querySelectorAll(".submenu__tabs ._tab-active").forEach((el => {
                    el.classList.remove("_tab-active");
                }));
                document.querySelectorAll(".submenu__tabs ._tabs-body-active").forEach((el => {
                    el.classList.remove("_tabs-body-active");
                }));
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function initMenuBehavior() {
        const isDesktop = window.matchMedia("(min-width: 992px)").matches;
        const menuItems = document.querySelectorAll(".menu__item");
        menuItems.forEach((menuItem => {
            const link = menuItem.querySelector(".has-submenu");
            const submenu = menuItem.querySelector(".submenu");
            if (!link || !submenu) return;
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            const newSubmenu = submenu.cloneNode(true);
            submenu.parentNode.replaceChild(newSubmenu, submenu);
            if (isDesktop) {
                newLink.addEventListener("mouseenter", (() => {
                    closeAllSubmenusExcept(menuItem);
                    menuItem.classList.add("_submenu-open--active");
                    newSubmenu.classList.add("_submenu-open");
                }));
                newLink.addEventListener("mouseleave", (() => {
                    menuItem.classList.remove("_submenu-open--active");
                    newSubmenu.classList.remove("_submenu-open");
                }));
                newSubmenu.addEventListener("mouseenter", (() => {
                    menuItem.classList.add("_submenu-open--active");
                    newSubmenu.classList.add("_submenu-open");
                }));
                newSubmenu.addEventListener("mouseleave", (() => {
                    menuItem.classList.remove("_submenu-open--active");
                    newSubmenu.classList.remove("_submenu-open");
                }));
            } else newLink.addEventListener("click", (e => {
                e.preventDefault();
                const isActive = menuItem.classList.contains("_submenu-open--active");
                closeAllSubmenusExcept(isActive ? null : menuItem);
                if (!isActive) {
                    menuItem.classList.add("_submenu-open--active");
                    newSubmenu.classList.add("_submenu-open");
                }
            }));
        }));
    }
    document.addEventListener("click", (e => {
        if (!e.target.closest(".menu__item")) {
            document.querySelectorAll("._submenu-open--active").forEach((item => {
                item.classList.remove("_submenu-open--active");
            }));
            document.querySelectorAll("._submenu-open").forEach((item => {
                item.classList.remove("_submenu-open");
            }));
        }
    }));
    function closeAllSubmenusExcept(currentItem) {
        document.querySelectorAll(".menu__item._submenu-open--active").forEach((item => {
            if (item !== currentItem) {
                item.classList.remove("_submenu-open--active");
                const submenu = item.querySelector(".submenu");
                if (submenu) submenu.classList.remove("_submenu-open");
            }
        }));
    }
    initMenuBehavior();
    let resizeTimeout;
    window.addEventListener("resize", (() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout((() => {
            initMenuBehavior();
        }), 150);
    }));
    function initMobileTabs(selector = ".submenu__tabs") {
        const tabBlocks = document.querySelectorAll(selector);
        tabBlocks.forEach((tabs => {
            const titles = tabs.querySelectorAll(".tabs__title");
            const bodies = tabs.querySelectorAll(".tabs__body");
            titles.forEach(((title, index) => {
                title.addEventListener("click", (e => {
                    if (window.innerWidth < 768) {
                        e.preventDefault();
                        titles.forEach((t => t.classList.remove("_tab-active")));
                        bodies.forEach((b => b.classList.remove("_tabs-body-active")));
                        title.classList.add("_tab-active");
                        if (bodies[index]) bodies[index].classList.add("_tabs-body-active");
                    }
                }));
            }));
            const backButtons = tabs.querySelectorAll(".tabs__body .btn-back");
            backButtons.forEach((btn => {
                btn.addEventListener("click", (e => {
                    if (window.innerWidth < 768) {
                        e.preventDefault();
                        tabs.querySelectorAll("._tab-active").forEach((t => t.classList.remove("_tab-active")));
                        tabs.querySelectorAll("._tabs-body-active").forEach((b => b.classList.remove("_tabs-body-active")));
                    }
                }));
            }));
        }));
    }
    initMobileTabs();
    window["FLS"] = false;
    addLoadedClass();
    menuInit();
    pageNavigation();
    headerScroll();
})();
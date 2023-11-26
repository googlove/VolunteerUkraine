(() => {
    "use strict";
    function functions_getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };


    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }

//-----------------------tabs-----------------------------

    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = functions_getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                    tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                }));
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);

   /*------------popups----------------*/ 

    const modalTrigger = document.querySelectorAll("[data-modal]"), 
    modal = document.querySelector(".modal"), 
    modalCloseBtn = document.querySelector("[data-close]");
    const modalLink = document.querySelector('.modal__btn');

    function showModal (){
        btn.addEventListener("click", (() => {
            modal.classList.add("show");
            modal.classList.remove("hide");
            document.body.style.overflow = "hidden";
        }));
    }

/*    modalTrigger.forEach((btn => {
        btn.addEventListener("click", (() => {
            modal.classList.add("show");
            modal.classList.remove("hide");
            document.body.style.overflow = "hidden";
        }));
    }));  */
    function closeMode() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }
    modalCloseBtn.addEventListener("click", closeMode);
    modalLink.addEventListener("click", closeMode);
    modal.addEventListener("click", (e => {
        if (e.target === modal) closeMode();
    }));
    document.addEventListener("keydown", (e => {
        if (e.code === "Escape" && modal.classList.contains("show")) closeMode();
    })); 

   


/*------------langs----------------*/

    const langButtons = document.querySelectorAll("[data-btn]");
    const allLangs = [ "ukr", "en" ];
    const currentPathName = window.location.pathname;
    let currentLang = localStorage.getItem("language") || checkBrowserLang() || "ukr";
    let currentTexts = {};
    const homeTexts = {
        "home_page-title": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "home_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "footer_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "home_page-1": {
            ukr: "авто для зсу",
            en: "Cars for armed forces"
        },
        "home_page-2": {
            ukr: "Купуємо, ремонтуємо та передаємо авто на фронт нашим захисникам",
            en: "We purchase, repair and transfer cars to the front line  to our defenders"
        },
        "home_page-3": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-4": {
            ukr: "Ми – ГО «Волонтери для ЗСУ»",
            en: "We are the Volunteer Movement of Ukraine"
        },
        "home_page-5": {
            ukr: "Про ГО «Волонтери для ЗСУ»",
            en: "About the Charitable Fund"
        },
        "home_page-6": {
            ukr: "Благодійний Фонд створено з метою надання  підтримки захисникам України. А саме ми займаємося закупівлею позашляховиків та мінібусів.",
            en: "The Charitable Fund was created to provide support to defenders of Ukraine. Specifically, we purchase Hyundai off-roaders and minivans."
        },
        "home_page-7": {
            ukr: "У нас відкрито збір на авто для ЗСУ. Приєднуйтесь! Все буде Україна!",
            en: "We launch a fundraiser to purchase cars for the Armed Forces of Ukraine. Join us and support Ukraine!"
        },
        "home_page-8": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-9": {
            ukr: "Наші партнери",
            en: "Our partners"
        },
        "home_page-10": {
            ukr: "Офіційний сервіс",
            en: "Official service"
        },
        "home_page-11": {
            ukr: "Дніпро, Україна",
            en: "Dnipro, Ukraine"
        },
        "home_page-12": {
            ukr: "Офіційний сервіс",
            en: "Official service"
        },
        "home_page-13": {
            ukr: "Черкаси, Україна",
            en: "Cherkasy, Ukraine"
        },
        "home_page-14": {
            ukr: "Кропивницький, Україна",
            en: "Kropyvnytskyi, Ukraine"
        },
        "home_page-15": {
            ukr: "Офіційний сервіс",
            en: "Official service"
        },
        "home_page-16": {
            ukr: "Черкаси, Україна",
            en: "Cherkasy, Ukraine"
        },
        "home_page-17": {
            ukr: "Кропивницький, Україна",
            en: "Kropyvnytskyi, Ukraine"
        },
        "home_page-18": {
            ukr: "Офіційний сервіс",
            en: "Official service"
        },
        "home_page-19": {
            ukr: "Черкаси, Україна",
            en: "Cherkasy, Ukraine"
        },
        "home_page-20": {
            ukr: "Офіційний сервіс",
            en: "Official service"
        },
        "home_page-21": {
            ukr: "Кропивницький, Україна",
            en: "Kropyvnytskyi, Ukraine"
        },
        "home_page-22": {
            ukr: "Більше про партнерів",
            en: "More about partners"
        },
        "home_page-23": {
            ukr: "Найпоширеніші авто, що ми закуповуємо",
            en: "Types of cars our foundation purchase"
        },
        "home_page-24": {
            ukr: "Позашляховики",
            en: "Off-roaders"
        },
        "home_page-25": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-26": {
            ukr: "Мікроавтобуси",
            en: "Minivans"
        },
        "home_page-27": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-28": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-29": {
            ukr: "Запит на авто",
            en: "Request for a car"
        },
        "home_page-30": {
            ukr: "Чому важливо донатити на авто для ЗСУ?",
            en: "Why is it important to donate on a car for the Armed Forces?"
        },
        "home_page-31": {
            ukr: "Автомобілі на фронті відіграють дуже важливу роль у веденні бойових дій, адже завдяки ним наші захисники мають змогу проводити розвідувальні операції, транспортувати потерпілих з гарячих точок та підвищувати свою мобільність.",
            en: "Cars at the front play a very important role in the conduct of hostilities, because thanks to them, our defenders are able to conduct reconnaissance operations, transport victims from hot spots and increase their mobility."
        },
        "home_page-32": {
            ukr: "Нажаль, автомоболі на фронті є розхідним матеріалом, тому гостра потреба в них залишається завжди.",
            en: "Unfortunately, the life of cars at the front line is very fleeting, so there is always an urgent need for them."
        },
        "home_page-33": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-34": {
            ukr: "Як ти можеш долучитись?",
            en: "How can you get involved?"
        },
        "home_page-35": {
            ukr: "Ти можеш підтримати нашу ініціативу своїм донатом. Це може бути як одноразовий внесок, так і підписка на щомісячний донат. ",
            en: "You can support our initiative with your donation. It can be either a one-time contribution or a subscription to a monthly donation."
        },
        "home_page-36": {
            ukr: "Давай наближувати перемогу разом!",
            en: "Let's get closer to victory together!"
        },
        "home_page-37": {
            ukr: "Зробити внесок",
            en: "Make a donation"
        },
        "home_page-38": {
            ukr: "Для нас буде великою цінністю, якщо ти будеш ділитися із друзями та знайомими нашою ініціативою. Це буде твоїм дуже вагомим внеском у досягнення нашої спільної мети!",
            en: "It will be of great value to us if you share our initiative with your friends. This will be your very significant contribution to achieving our common goal!"
        },
        "home_page-39": {
            ukr: "Поділитись сайтом",
            en: "Share a website"
        },
        "home_page-40": {
            ukr: "Ви можете подати запит на авто для військової частини в містах. Для цього необхідно перейти за посиланням та заповнити форму зворотнього зв’язку.",
            en: "You can submit a request for a car for a military unit. To do this, you need to follow the link and fill out the feedback form."
        },
        "home_page-41": {
            ukr: "Запит на авто",
            en: "Request for a car"
        },
        "home_page-42": {
            ukr: "Наші досягнення",
            en: "Our achievements"
        },
        "home_page-43": {
            ukr: "ПриватБанк",
            en: "PrivatBank"
        },
        "home_page-44": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-45": {
            ukr: "Реквізити",
            en: "Bank details"
        },
        "home_page-46": {
            ukr: "Підтримати збір на авто для ЗСУ",
            en: "Support the fundraising for cars for the Armed Forces of Ukraine"
        },
        "home_page-47": {
            ukr: "Сума внеску",
            en: "Contribution amount"
        },
        "home_page-48": {
            ukr: "Ви будете отримувати звітності на email по вашому внеску",
            en: "You will receive reports on your contribution"
        },
        "home_page-49": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-50": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-51": {
            ukr: "🇺🇦Monobank",
            en: "🇺🇦Monobank"
        },
        "home_page-52": {
            ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
            en: "You will receive a receipt by email and you will receive reports on your contribution"
        },
        "home_page-53": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-54": {
            ukr: "Реквізити",
            en: "Bank details in Ukraine"
        },
        "home_page-55": {
            ukr: "Перекази в іноземній валюті",
            en: "International bank transfers"
        },
        "home_page-56": {
            ukr: "Заповнюйте форму і ми з вами зв’яжемось",
            en: "Fill out the form and we will contact you"
        },
        "home_page-57": {
            ukr: "Ім’я",
            en: "Name"
        },
        "home_page-58": {
            ukr: "Номер телефону",
            en: "Phone number"
        },
        "home_page-59": {
            ukr: "Надіслати",
            en: "Send"
        },
        "home_page-60": {
            ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
            en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!"
        },
        "home_page-61": {
            ukr: "Звітність",
            en: "Reports"
        },
        "home_page-62": {
            ukr: "Підписка",
            en: "Subscription"
        },
        "home_page-63": {
            ukr: "Партнери",
            en: "Partners"
        },
        "home_page-64": {
            ukr: "Вакансії",
            en: "Vacansies"
        },
        "home_page-65": {
            ukr: "Часті запитання",
            en: "FAQ"
        },
        "home_page-66": {
            ukr: "Інформаційна лінія",
            en: "Information line"
        },
        "home_page-67": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-68": {
            ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
            en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly."
        },
        "home_page-69": {
            ukr: "Все буде Україна!",
            en: "Everything will be Ukraine!"
        },
        "home_page-70": {
            ukr: "Підтримати збір",
            en: "Support fundraising"
        },
        "home_page-71": {
            ukr: "Поділись сайтом та поширюй збір коштів на авто для ЗСУ!",
            en: "Share the site and spread the fundraiser for cars for the Armed Forces of Ukraine!"
        },
        "home_page-72": {
            ukr: "Копіювати посилання на сайт",
            en: "Copy the link to the site"
        },
        "home_page-73": {
            ukr: "Поділитись у соціальних мережах",
            en: "Share on social networks"
        }
    };
    const partnersTexts = {
        "partners_page-1": {
            ukr: "Наші партнери",
            en: "Our partners"
        },
        "home_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "footer_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "home_page-title": {
            ukr: "Партнери - ГО «Волонтери для ЗСУ»",
            en: "Partners - Volunteer Movement of Ukraine"
        },
        "partners_page-2": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-3": {
            ukr: "Дніпро, Україна",
            en: "Dnipro, Ukraine"
        },
        "partners_page-4": {
            ukr: "Запорізьке шосе, 59",
            en: "59, Zaporizhia highway"
        },
        "partners_page-5": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-6": {
            ukr: "Кропивницький, Україна",
            en: "Kropyvnytskyi, Ukraine"
        },
        "partners_page-7": {
            ukr: "вул. Вокзальна, 60-А",
            en: "St. Vokzalna, 60-A"
        },
        "partners_page-8": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-9": {
            ukr: "Черкаси, Україна",
            en: "Cherkasy, Ukraine"
        },
        "partners_page-10": {
            ukr: "вул. 30 років Перемоги, 7/2",
            en: "St. 30 years of Victory, 7/2"
        },
        "partners_page-11": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-12": {
            ukr: "Кропивницький, Україна",
            en: "Kropyvnytskyi, Ukraine"
        },
        "partners_page-13": {
            ukr: "пр-т Винниченка, 2",
            en: "2 Vinnychenka Ave"
        },
        "partners_page-14": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-15": {
            ukr: "Черкаси, Україна",
            en: "Cherkasy, Ukraine"
        },
        "partners_page-16": {
            ukr: "вул. 30 років Перемоги, 7/2",
            en: "St. 30 years of Victory, 7/2"
        },
        "partners_page-17": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-18": {
            ukr: "Кропивницький, Україна",
            en: "Kropyvnytskyi, Ukraine"
        },
        "partners_page-19": {
            ukr: "пр-т Винниченка, 2",
            en: "2 Vinnychenka Ave"
        },
        "partners_page-20": {
            ukr: "Посилання на сайт",
            en: "website"
        },
        "partners_page-21": {
            ukr: "Черкаси, Україна",
            en: "Cherkasy, Ukraine"
        },
        "partners_page-22": {
            ukr: "вул. Чигиринська, 60/2",
            en: "St. Chygyrinska, 60/2"
        },
        "help_page-17": {
            ukr: "Підтримати",
            en: "Support"
        },
        "help_page-18": {
            ukr: "Запит на авто",
            en: "Request for a car"
        },
        "home_page-43": {
            ukr: "ПриватБанк",
            en: "PrivatBank"
        },
        "home_page-44": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-45": {
            ukr: "Реквізити",
            en: "Bank details"
        },
        "home_page-46": {
            ukr: "Підтримати збір на авто для ЗСУ",
            en: "Support the fundraising for cars for the Armed Forces of Ukraine"
        },
        "home_page-47": {
            ukr: "Сума внеску",
            en: "Contribution amount"
        },
        "home_page-48": {
            ukr: "Ви будете отримувати звітності на email по вашому внеску",
            en: "You will receive reports on your contribution"
        },
        "home_page-49": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-50": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-51": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-52": {
            ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
            en: "You will receive a receipt by email and you will receive reports on your contribution"
        },
        "home_page-53": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-54": {
            ukr: "Реквізити",
            en: "Bank details in Ukraine"
        },
        "home_page-55": {
            ukr: "Перекази в іноземній валюті",
            en: "International bank transfers"
        },
        "home_page-56": {
            ukr: "Заповнюйте форму і ми з вами зв’яжемось",
            en: "Fill out the form and we will contact you"
        },
        "home_page-57": {
            ukr: "Ім’я",
            en: "Name"
        },
        "home_page-58": {
            ukr: "Номер телефону",
            en: "Phone number"
        },
        "home_page-59": {
            ukr: "Надіслати",
            en: "Send"
        },
        "home_page-60": {
            ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
            en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!"
        },
        "home_page-61": {
            ukr: "Звітність",
            en: "Reports"
        },
        "home_page-62": {
            ukr: "Підписка",
            en: "Subscription"
        },
        "home_page-63": {
            ukr: "Партнери",
            en: "Partners"
        },
        "home_page-64": {
            ukr: "Вакансії",
            en: "Vacansies"
        },
        "home_page-65": {
            ukr: "Часті запитання",
            en: "FAQ"
        },
        "home_page-66": {
            ukr: "Інформаційна лінія",
            en: "Information line"
        },
        "home_page-67": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-68": {
            ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
            en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly."
        },
        "home_page-69": {
            ukr: "Все буде Україна!",
            en: "Everything will be Ukraine!"
        },
        "home_page-70": {
            ukr: "Підтримати збір",
            en: "Support fundraising"
        }
    };
    const vacancyTexts = {
        "vacancy_page-1": {
            ukr: "Вакансії",
            en: "Vacansies"
        },
        "vacancy_page-title": {
            ukr: "Вакансії - ГО «Волонтери для ЗСУ»",
            en: "Vacansies - Volunteer Movement of Ukraine"
        },
        "home_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "footer_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "vacancy_page-2": {
            ukr: "Координатор юриста",
            en: "Lawyer coordinator"
        },
        "vacancy_page-3": {
            ukr: "Одеса, Україна",
            en: "Odesa, Ukraine"
        },
        "vacancy_page-4": {
            ukr: "вул. Гагаріна, 12 а",
            en: "St. Gagarina, 12 a"
        },
        "vacancy_page-5": {
            ukr: "Регіональний координатор БФ",
            en: "Regional coordinator of foundation"
        },
        "vacancy_page-6": {
            ukr: "Одеса, Україна",
            en: "Odesa, Ukraine"
        },
        "vacancy_page-7": {
            ukr: "вул. Гагаріна, 12 а",
            en: "St. Gagarina, 12 a"
        },
        "help_page-17": {
            ukr: "Підтримати",
            en: "Support"
        },
        "help_page-18": {
            ukr: "Запит на авто",
            en: "Request for a car"
        },
        "home_page-43": {
            ukr: "ПриватБанк",
            en: "PrivatBank"
        },
        "home_page-44": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-45": {
            ukr: "Реквізити",
            en: "Bank details"
        },
        "home_page-46": {
            ukr: "Підтримати збір на авто для ЗСУ",
            en: "Support the fundraising for cars for the Armed Forces of Ukraine"
        },
        "home_page-47": {
            ukr: "Сума внеску",
            en: "Contribution amount"
        },
        "home_page-48": {
            ukr: "Ви будете отримувати звітності на email по вашому внеску",
            en: "You will receive reports on your contribution"
        },
        "home_page-49": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-50": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-51": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-52": {
            ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
            en: "You will receive a receipt by email and you will receive reports on your contribution"
        },
        "home_page-53": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-54": {
            ukr: "Реквізити",
            en: "Bank details in Ukraine"
        },
        "home_page-55": {
            ukr: "Перекази в іноземній валюті",
            en: "International bank transfers"
        },
        "home_page-56": {
            ukr: "Заповнюйте форму і ми з вами зв’яжемось",
            en: "Fill out the form and we will contact you"
        },
        "home_page-57": {
            ukr: "Ім’я",
            en: "Name"
        },
        "home_page-58": {
            ukr: "Номер телефону",
            en: "Phone number"
        },
        "home_page-59": {
            ukr: "Надіслати",
            en: "Send"
        },
        "home_page-60": {
            ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
            en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!"
        },
        "home_page-61": {
            ukr: "Звітність",
            en: "Reports"
        },
        "home_page-62": {
            ukr: "Підписка",
            en: "Subscription"
        },
        "home_page-63": {
            ukr: "Партнери",
            en: "Partners"
        },
        "home_page-64": {
            ukr: "Вакансії",
            en: "Vacansies"
        },
        "home_page-65": {
            ukr: "Часті запитання",
            en: "FAQ"
        },
        "home_page-66": {
            ukr: "Інформаційна лінія",
            en: "Information line"
        },
        "home_page-67": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-68": {
            ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
            en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly."
        },
        "home_page-69": {
            ukr: "Все буде Україна!",
            en: "Everything will be Ukraine!"
        },
        "home_page-70": {
            ukr: "Підтримати збір",
            en: "Support fundraising"
        }
    };
    const helpTexts = {
        "help_page-1": {
            ukr: "Часті запитання",
            en: "FAQ"
        },
        "home_page-title": {
            ukr: "Запитання - ГО «Волонтери для ЗСУ»",
            en: "FAQ - Volunteer Movement of Ukraine"
        },
        "home_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "footer_page-logo": {
            ukr: "ГО «Волонтери для ЗСУ»",
            en: "Volunteer Movement of Ukraine"
        },
        "help_page-2": {
            ukr: "Кому допомагає фонд?",
            en: "Who does the fund help?"
        },
        "help_page-3": {
            ukr: "Фонд закуповує та передає авто військовим частинам ЗСУ. Також фонд забезпечує сервісний ремонт авто, що видає та надає безкоштовний технічний супровід та ремонт для кожного переданого автомобіля на сервісних станціях наших партнерів Української Автомобільної Групи «АВТОКРАФТ».",
            en: 'The fund purchases and transfers cars to the military units of the Armed Forces of Ukraine. The fund also provides car service repair, issuing and providing free technical support and repair for each transferred car at the service stations of our partners of the Ukrainian Automotive Group "AUTOKRAFT".'
        },
        "help_page-4": {
            ukr: "Подати запит на авто",
            en: "Submit a request for a car"
        },
        "help_page-5": {
            ukr: "Як отримати допомогу від фонду?",
            en: "How to get help from the fund?"
        },
        "help_page-6": {
            ukr: "Для того щоб отримати автівку для військової частини, вам необхідно заповнити форму зворотнього зв’язку. З вами зв’яжуться наші спеціалісти та опрацюють ваш запит",
            en: "In order to get a car for a military unit, you need to fill out a feedback form. Our specialists will contact you and process your request"
        },
        "help_page-7": {
            ukr: "Подати запит на авто",
            en: "Submit a request for a car"
        },
        "help_page-8": {
            ukr: "Чому тільки авто?",
            en: "Why only cars?"
        },
        "help_page-9": {
            ukr: "Авто відіграють дуже важливу роль на фронті. Завдяки нашим партнерам сервісним центрам, ми не тільки закуповуємо автомобілі, ми також проводимо ретельну перевірку їх технічного стану, виправляємо недоліки та перефарбовуємо.",
            en: "Cars play a very important role at the front line. Thanks to our partners – service centers, we not only buy cars, we also carry out a thorough inspection of their technical condition, correct defects and repaint."
        },
        "help_page-10": {
            ukr: "Для кожного переданого ЗСУ автомобіля ми забезпечуємо безкоштовний технічний супровід та ремонт на сервісних станціях наших партнерів Української Автомобільної Групи «АВТОКРАФТ».",
            en: 'For each transferred car for the Armed Forces, we provide free technical support and repair at the service stations of our partners of the Ukrainian Automotive Group "AUTOKRAFT".'
        },
        "help_page-11": {
            ukr: "Підтримати",
            en: "Support"
        },
        "help_page-12": {
            ukr: "Які авто надає фонд?",
            en: "What cars does the fund provide?"
        },
        "help_page-13": {
            ukr: "Фонд закуповує позашляховики та мінібуси Hyundai. Наш партнер сервісний центр Hyundai у місті Дніпро видає автомобілі та забезпечує їх технічний супровід.",
            en: "The fund purchase Hyundai off-roaders and minivans. Our partner, the Hyundai service center in Dnipro, issues cars and provides their technical support."
        },
        "help_page-14": {
            ukr: "В подальшому за вашої підтримки, ми плануємо масшабуватись та задіювати сервісні центри наших партнерів у містах Черкаси та Кропивницький. Так ми зможемо допомогти більшій кількості наших військових, забезпечивши їх автомобілями та безкоштовним технічним супровідом.",
            en: "In the future, with your support, we plan to expand and use the service centers of our partners in the cities of Cherkasy and Kropyvnytskyi. So we will be able to help more of our military by providing them with cars and free technical support."
        },
        "help_page-15": {
            ukr: "Подати запит на авто",
            en: "Submit a request for a car"
        },
        "help_page-16": {
            ukr: "Підтримати",
            en: "Support"
        },
        "help_page-17": {
            ukr: "Підтримати",
            en: "Support"
        },
        "help_page-18": {
            ukr: "Запит на авто",
            en: "Request for a car"
        },
        "home_page-43": {
            ukr: "ПриватБанк",
            en: "PrivatBank"
        },
        "home_page-44": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-45": {
            ukr: "Реквізити",
            en: "Bank details"
        },
        "home_page-46": {
            ukr: "Підтримати збір на авто для ЗСУ",
            en: "Support the fundraising for cars for the Armed Forces of Ukraine"
        },
        "home_page-47": {
            ukr: "Сума внеску",
            en: "Contribution amount"
        },
        "home_page-48": {
            ukr: "Ви будете отримувати звітності на email по вашому внеску",
            en: "You will receive reports on your contribution",
        },
        "home_page-49": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-50": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-51": {
            ukr: "🇺🇦Monobank",
            en: "Monobank"
        },
        "home_page-52": {
            ukr: "Вам надійде квитанція на email та ви будете отримувати звітності по вашому внеску",
            en: "You will receive a receipt by email and you will receive reports on your contribution"
        },
        "home_page-53": {
            ukr: "Оформити підписку",
            en: "Get a subscription"
        },
        "home_page-54": {
            ukr: "Реквізити",
            en: "Bank details in Ukraine"
        },
        "home_page-55": {
            ukr: "Перекази в іноземній валюті",
            en: "International bank transfers"
        },
        "home_page-56": {
            ukr: "Заповнюйте форму і ми з вами зв’яжемось",
            en: "Fill out the form and we will contact you"
        },
        "home_page-57": {
            ukr: "Ім’я",
            en: "Name"
        },
        "home_page-58": {
            ukr: "Номер телефону",
            en: "Phone number"
        },
        "home_page-59": {
            ukr: "Надіслати",
            en: "Send"
        },
        "home_page-60": {
            ukr: "Залишай свою електронну пошту та отримуй звітність про діяльність фонду. Будь завжди в курсі !",
            en: "Leave your e-mail and receive reports on the fund's activities. Always be informed!"
        },
        "home_page-61": {
            ukr: "Звітність",
            en: "Reports"
        },
        "home_page-62": {
            ukr: "Підписка",
            en: "Subscription"
        },
        "home_page-63": {
            ukr: "Партнери",
            en: "Partners"
        },
        "home_page-64": {
            ukr: "Вакансії",
            en: "Vacansies"
        },
        "home_page-65": {
            ukr: "Часті запитання",
            en: "FAQ"
        },
        "home_page-66": {
            ukr: "Інформаційна лінія",
            en: "Information line"
        },
        "home_page-67": {
            ukr: "Підтримати",
            en: "Support"
        },
        "home_page-68": {
            ukr: "Дякуємо, що залишили запит на нашому сайті. Очікуйте, найближчим часом з вами зв’яжуться.",
            en: "Thank you for leaving a request on our website. Please wait, you will be contacted shortly."
        },
        "home_page-69": {
            ukr: "Все буде Україна!",
            en: "Everything will be Ukraine!"
        },
        "home_page-70": {
            ukr: "Підтримати збір",
            en: "Support fundraising"
        }
    };
    function checkPagePathName() {
        switch (currentPathName) {
          case "/index.html":
            currentTexts = homeTexts;
            break;

          case "/partners.html":
            currentTexts = partnersTexts;
            break;

          case "/vacancy.html":
            currentTexts = vacancyTexts;
            break;

          case "/help.html":
            currentTexts = helpTexts;
            break;

          default:
            currentTexts = homeTexts;
            break;
        }
    }
    checkPagePathName();
    function changeLang() {
        for (const key in currentTexts) {
            let elem = document.querySelector(`[data-lang=${key}]`);
            if (elem) elem.textContent = currentTexts[key][currentLang];
        }
    }
    changeLang();
    langButtons.forEach((btn => {
        btn.addEventListener("click", (event => {
            if (!event.target.classList.contains("header__btns-btn--active")) {
                currentLang = event.target.dataset.btn;
                localStorage.setItem("language", event.target.dataset.btn);
                resetActiveClass(langButtons, "header__btns-btn--active");
                btn.classList.add("header__btns-btn--active");
                changeLang();
            }
        }));
    }));  

   

    function resetActiveClass(arr, activeClass) {
        arr.forEach((elem => {
            elem.classList.remove(activeClass);
        }));
    }
    function checkActiveLangButton() {
        switch (currentLang) {
          case "ukr":
            document.querySelector('[data-btn="ukr"]').classList.add("header__btn_active");
            break;

          case "en":
            document.querySelector('[data-btn="en"]').classList.add("header__btn_active");
            break;

          default:
            document.querySelector('[data-btn="ukr"]').classList.add("header__btn_active");
            break;
        }
    }
    checkActiveLangButton();
    function checkBrowserLang() {
        const navLang = navigator.language.slice(0, 2).toLowerCase();
        const result = allLangs.some((elem => elem === navLang));
        if (result) return navLang;
    }
    console.log("navigator.language", checkBrowserLang());

  
    /*-----------copy-------------------*/

    function copy () {
        const textToCopyOne = document.querySelector('#copy-text-one');
        const copyBtn = document.querySelector('#copy-one'); 
        const textToCopySecond = document.querySelector('#copy-text-second');
        const copyBtnSecond = document.querySelector('#copy-second'); 
        const textToCopyThird = document.querySelector('#copy-text-third');
        const copyBtnThird = document.querySelector('#copy-third'); 
        const textToCopyFourth = document.querySelector('#copy-text-fourth');
        const copyBtnFourth = document.querySelector('#copy-fourth');
       
        copyBtn.addEventListener('click', function copyTextOne () {         
            navigator.clipboard.writeText(textToCopyOne.innerText);
        });

        copyBtnSecond.addEventListener('click', function copyTextSecond () {         
            navigator.clipboard.writeText(textToCopySecond.innerText);
        });

        copyBtnThird.addEventListener('click', function copyTextThird () {         
            navigator.clipboard.writeText(textToCopyThird.innerText);
        });
        copyBtnFourth.addEventListener('click', function copyTextFourth () {         
            navigator.clipboard.writeText(textToCopyFourth.innerText);
        });
    
    };


    /*------------forms----------------*/




 /*   phoneInputs = document.querySelectorAll('input[name="contact-item__tel"]');

    phoneInputs.forEach(item => {
        item.addEventListener('input', () => {
            item.value = item.value.replace(/\D/, '');
        });
    }); */

    const form = document.querySelectorAll('form'),
    inputs = document.querySelectorAll('input'),
    phoneInputs = document.querySelectorAll('input[name="tel"]');

phoneInputs.forEach(item => {
  item.addEventListener('input', () => {
      item.value = item.value.replace(/\D/, '');
  });
});

const message = {
  loading: 'Загрузка...',
  success: showModal (),
  failure: 'Что-то пошло не так...'
};

const postData = async (url, data) => {
    document.querySelector('.status').textContent = message.loading;
    let res = await fetch(url, {
        method: "POST",
        body: data
    });

    return await res.text();
};

const clearInputs = () => {
    inputs.forEach(item => {
        item.value = '';
    });
};

form.forEach(item => {
    item.addEventListener('submit', (e) => {
        e.preventDefault();

        let statusMessage = document.createElement('div');
        statusMessage.classList.add('status');
        item.appendChild(statusMessage);

        const formData = new FormData(item);

        postData('server.php', formData)
            .then(res => {
                console.log(res);
                showModal();
            })
            .catch(() => 
            statusMessage.textContent = message.failure)
            .finally(() => {
                clearInputs();
                setTimeout(() => {
                    statusMessage.remove();
                }, 5000);
            });
    });
});


//    let form = document.querySelector('.contact-form__box'),
//    nameValue = document.querySelector('#contact__name'),
//    inputEmail = document.querySelector('#contact__email'),
 //   phoneValue = document.querySelector('#contact__tel');
    
//    const formBtn = document.querySelector(".contact-form__btn");

    
    

//  formBtn.addEventListener ("submit", () => {
 //   formValidate();
//  })


//}

//валидация!------------------------------

/*let form = document.querySelector('.js-form'),
    formInputs = document.querySelectorAll('.js-input'),
    inputEmail = document.querySelector('.js-input-email'),
    inputPhone = document.querySelector('.js-input-phone');


function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}



function validatePhone(phone) {
    let re = /^[0-9\s]*$/;
    return re.test(String(phone));
}

form.onsubmit = function () {
    let emailVal = inputEmail.value,
        phoneVal = inputPhone.value,
        emptyInputs = Array.from(formInputs).filter(input => input.value === '');


    formInputs.forEach(function (input) {
        if (input.value === '') {
            input.classList.add('error');

        } else {
            input.classList.remove('error');
        }
    });

    if (emptyInputs.length !== 0) {
        console.log('inputs not filled');
        return false;
    }
    if(!validateEmail(emailVal)) {
        console.log('email not valid');
        inputEmail.classList.add('error');
        return false;
    } else {
        inputEmail.classList.remove('error');
        
    }
    
    if (!validatePhone(phoneVal)) {
        console.log('phone not valid');
        inputPhone.classList.add('error');
        return false;
    } else {
        inputPhone.classList.remove('error');
    }
    
} */












/*----------------------------*/
    copy();     
    spollers();
    tabs();
})();
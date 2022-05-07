function sidebarSearch() {
    var searchTrigger = $(".search-active"),
        endTriggersearch = $(".search-close"),
        container = $(".main-search-active");

    searchTrigger.on("click", function (e) {
        e.preventDefault();
        container.addClass("search-visible");
    });

    endTriggersearch.on("click", function () {
        container.removeClass("search-visible");
    });
}
sidebarSearch();
/*====== Sidebar menu functionality ======*/
function mobileHeaderActive() {
    var navbarTrigger = $(".burger-icon"),
        endTrigger = $(".mobile-menu-close"),
        container = $(".mobile-header-active"),
        wrapper4 = $("body");

    wrapper4.prepend('<div class="body-overlay-1"></div>');

    navbarTrigger.on("click", function (e) {
        e.preventDefault();
        container.addClass("sidebar-visible");
        wrapper4.addClass("mobile-menu-active");
    });

    endTrigger.on("click", function () {
        container.removeClass("sidebar-visible");
        wrapper4.removeClass("mobile-menu-active");
    });

    $(".body-overlay-1").on("click", function () {
        container.removeClass("sidebar-visible");
        wrapper4.removeClass("mobile-menu-active");
    });
}
mobileHeaderActive();

/*---------------------
        Mobile menu active
    ------------------------ */
var $offCanvasNav = $(".mobile-menu"),
    $offCanvasNavSubMenu = $offCanvasNav.find(".dropdown");

/*Add Toggle Button With Off Canvas Sub Menu*/
$offCanvasNavSubMenu
    .parent()
    .prepend(
        '<span class="menu-expand"><i class="fi-rs-angle-small-down"></i></span>'
    );

/*Close Off Canvas Sub Menu*/
$offCanvasNavSubMenu.slideUp();

/*Category Sub Menu Toggle*/
$offCanvasNav.on("click", "li a, li .menu-expand", function (e) {
    var $this = $(this);
    if (
        $this
            .parent()
            .attr("class")
            .match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/) &&
        ($this.attr("href") === "#" || $this.hasClass("menu-expand"))
    ) {
        e.preventDefault();
        if ($this.siblings("ul:visible").length) {
            $this.parent("li").removeClass("active");
            $this.siblings("ul").slideUp();
        } else {
            $this.parent("li").addClass("active");
            $this
                .closest("li")
                .siblings("li")
                .removeClass("active")
                .find("li")
                .removeClass("active");
            $this.closest("li").siblings("li").find("ul:visible").slideUp();
            $this.siblings("ul").slideDown();
        }
    }
});

/*--- language currency active ----*/
$(".mobile-language-active").on("click", function (e) {
    e.preventDefault();
    $(".lang-dropdown-active").slideToggle(900);
});

/*--- categories-button-active-2 ----*/
$(".categories-button-active-2").on("click", function (e) {
    e.preventDefault();
    $(".categori-dropdown-active-small").slideToggle(900);
});

/*--- Mobile demo active ----*/
var demo = $(".tm-demo-options-wrapper");
$(".view-demo-btn-active").on("click", function (e) {
    e.preventDefault();
    demo.toggleClass("demo-open");
});

/*-----More Menu Open----*/
$(".more_slide_open").slideUp();
$(".more_categories").on("click", function () {
    $(this).toggleClass("show");
    $(".more_slide_open").slideToggle();
});

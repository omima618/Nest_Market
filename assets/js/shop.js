// Elements
// Shop page
const imagesSlider = document.querySelector(".product-image-swiper");
const thumbnailSlider = document.querySelector(".swiper-thumbnails");
// Vendor page
const searchBar = document.querySelector(".search-bar");
// Shop-invoice
const pdfContent = document.getElementById("invoice_wrapper");
const downloadBtn = document.getElementById("invoice_download_btn");
// Modal
const quickViewBtn = document.querySelector(".quick--view");
const modalContent = document.querySelector(".modal-content");
// Wishlist
const wishlistTable = document.querySelector(".wishlist--body");
const totalWishlistItems = document.querySelector(".total-wishlist-items");
// Cart
const cart = document.querySelector(".cart--body");
const totalCartItems = document.querySelector(".total-cart-items");
const clearAllBtn = document.querySelector(".clear-all-cart");
const country = document.querySelector(".selct-country");
const selectedCountry = document.querySelector(".country-estimate");
const shipping = document.querySelector(".shipping--rate");
// Compare
const compareTable = document.querySelector(".table-compare");
const totalCompareProducts = document.querySelector(".total-pr-compare");
const productImgRow = document.querySelector(".table-compare .pr_image");
const productTitleRow = document.querySelector(".table-compare .pr_title");
const productPriceRow = document.querySelector(".table-compare .pr_price");
const productRatingRow = document.querySelector(".table-compare .pr_rating");
const productDescRow = document.querySelector(".table-compare .description");
const productStockRow = document.querySelector(".table-compare .pr_stock");
const productWeightRow = document.querySelector(".table-compare .pr_weight");
const productDimenRow = document.querySelector(".table-compare .pr_dimensions");
const productRemoveBtnRow = document.querySelector(".table-compare .pr_remove");
const productCartBtnRow = document.querySelector(
    ".table-compare .pr_add_to_cart"
);
// classes
class GeneratePDF {
    constructor() {
        this.createPDF(pdfContent, downloadBtn);
    }
    createPDF(pdfContent, downloadButton) {
        if (!pdfContent) return;
        const contantRect = pdfContent.getClientRects();
        const pdfMargin = 20;
        const { width: contentWidth, height: contentHeight } = contantRect[0];
        const pdfWidth = contentWidth + pdfMargin * 2;
        const pdfHeight = contentWidth * 1.5 + pdfMargin * 2;
        const canvasImageWidth = contentWidth;
        const canvasImageHeight = contentHeight;
        const totalPDFPages = Math.floor(contentHeight / pdfHeight);
        html2canvas(pdfContent).then(function (canvas) {
            canvas.getContext("2d");
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const pdfFile = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);
            pdfFile.addImage(
                imgData,
                "JPG",
                pdfMargin,
                pdfMargin,
                canvasImageWidth,
                canvasImageHeight
            );
            for (let i = 1; i <= totalPDFPages; i++) {
                pdfFile.addPage(pdfWidth, pdfHeight);
                pdfFile.addImage(
                    imgData,
                    "JPG",
                    pdfMargin,
                    -(pdfHeight * i) + pdfMargin * 4,
                    canvasImageWidth,
                    canvasImageHeight
                );
            }
            document.addEventListener("click", (e) => {
                if (e.target !== downloadButton) return;
                pdfFile.save("shop-invoice");
            });
        });
    }
}
class ProductSlider {
    constructor() {
        this.createThumbnailSwiper();
    }
    // product images swiper
    createThumbnailSwiper() {
        if (!imagesSlider) return;
        const imgsSlider = new Swiper(".product-image-swiper", {
            effect: "flip",
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
        const thumbnailSwiper = new Swiper(".swiper-thumbnails", {
            slidesPerView: 5,
            spaceBetween: 20,
            cssMode: true,
            watchSlidesProgress: true,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            thumbs: {
                swiper: this.imgsSlider,
            },
        });
    }
}
// vendor search
class Vendor {
    constructor() {
        // vendor search
        if (searchBar) {
            searchBar.addEventListener("keyup", this.search.bind(this));
        }
    }
    search() {
        const searchValue = document
            .querySelector(".search-bar")
            .value.toUpperCase();
        const products = document.querySelectorAll(".vendor-card");
        const productName = document.querySelectorAll(".card-name");
        for (let i = 0; i < productName.length; i++) {
            let match = products[i].getElementsByClassName("card-name")[0];
            if (match) {
                let textValue = match.textContent || match.innerHTML;
                if (textValue.toUpperCase().indexOf(searchValue) > -1) {
                    products[i].style.display = "";
                } else {
                    products[i].style.display = "none";
                }
            }
        }
    }
}
// shop actions
class Shop {
    constructor() {
        // events
        document.addEventListener("click", this.addModalContent.bind(this));
        document.addEventListener("click", this.addToWishlist.bind(this));
        document.addEventListener("click", this.addToCart.bind(this));
        document.addEventListener("click", this.addToCartFromWish.bind(this));
        document.addEventListener("click", this.removeHandler.bind(this));
        document.addEventListener("click", this.subTotalPrice.bind(this));
        document.addEventListener("click", this.addToCompareTable.bind(this));
        document.addEventListener("click", this.removeCompareItem.bind(this));
        document.addEventListener(
            "click",
            this.addToCartFromCompare.bind(this)
        );
        if (country) country.addEventListener("change", this.showCountry);
        if (clearAllBtn)
            clearAllBtn.addEventListener("click", this.clearAll.bind(this));
        this.getWishlistProductsData();
        this.getCartProductsData();
        this.getCompareProductData();
        if (wishlistTable)
            this.addIncomingDataTolist(
                totalWishlistItems,
                this._wishlistDataArray,
                "wishlist"
            );
        if (cart) {
            this.addIncomingDataTolist(
                totalCartItems,
                this._cartDataArray,
                "cart"
            );
            this.calcTotalAmount();
        }
        if (compareTable) {
            this.addIncomingDataTolist(
                totalCompareProducts,
                this._compareDataArr,
                "compare"
            );
        }
    }
    // VARIABLES
    _wishlistDataArray = [];
    _cartDataArray = [];
    _compareDataArr = [];
    // METHODS
    showCountry() {
        selectedCountry.textContent = country.value;
    }
    // add data to local storage
    addDataToLocalStorage(itemName, dataArray) {
        localStorage.setItem(itemName, JSON.stringify(dataArray));
    }
    // collect data
    collectData(targetButton) {
        // product data
        const product =
            targetButton.closest(".product-cart-wrap") ||
            targetButton.closest(".product--row");
        const productId = product.getAttribute("id");
        const productName = product.querySelector("h2 a").textContent;
        const productImg = product.querySelector(".default-img").src;
        const productHoverImg = product.querySelector(".hover-img").src;
        const productQuantity = product.querySelector(".quantity").textContent;
        const productRating = product.querySelector(
            ".product-rate-cover"
        ).innerHTML;
        const productPrice = product.querySelector(
            ".product-price span:first-of-type"
        ).textContent;
        const productOldPrice = product.querySelector(
            ".product-price .old-price"
        ).textContent;
        const productCategory = product.querySelector(
            ".product-category a"
        ).textContent;
        const productVendor =
            product.querySelector(".vendor--name").textContent;
        // create data object
        const productData = {
            id: productId,
            pName: productName,
            img: productImg,
            hoverImg: productHoverImg,
            quantity: productQuantity,
            rating: productRating,
            price: productPrice,
            oldPrice: productOldPrice,
            category: productCategory,
            vendor: productVendor,
        };
        return productData;
    }
    // check unique products
    checkProduct(itemName, productsArray, product) {
        if (!productsArray.some((item) => item.id === product.id)) {
            productsArray.push(product);
        }
        this.addDataToLocalStorage(itemName, productsArray);
    }
    // get data from local storage
    getWishlistProductsData() {
        if (localStorage.getItem("wishlistProducts"))
            this._wishlistDataArray = JSON.parse(
                localStorage.getItem("wishlistProducts")
            );
    }
    getCartProductsData() {
        if (localStorage.getItem("cartProducts"))
            this._cartDataArray = JSON.parse(
                localStorage.getItem("cartProducts")
            );
    }
    getCompareProductData() {
        if (localStorage.getItem("compareProducts"))
            this._compareDataArr = JSON.parse(
                localStorage.getItem("compareProducts")
            );
    }
    // create HTML elements
    createWishlistHTML(product, checkBox) {
        const productStructure = `<tr class="item--row">
            <td class="custome-checkbox pl-30">
                <input class="form-check-input" type="checkbox" name="checkbox"
                    id="exampleCheckbox${checkBox}" value="" />
                <label class="form-check-label" for="exampleCheckbox${checkBox}">
                </label>
            </td>
            <td class="image product-thumbnail pt-40" id="${product.id}"><img
                    src=${product.img} alt="#" />
                <h6><a class="product-name mb-10" href="shop-product-right.html">${
                    product.pName
                }</a></h6>
            <div class="product-rate-cover">
                ${product.rating}
            </div>
            </td>
            <td class="price" data-title="Price">
                <h3 class="text-brand wish-price">${product.price}</h3>
            </td>
            ${
                +product.quantity > 0
                    ? `<td class="text-center detail-info" data-title="Stock">
                <span class="stock-status in-stock mb-0"> In Stock </span>
                        </td>`
                    : `<td class="text-center detail-info" data-title="Stock">
                            <span class="stock-status out-stock mb-0"> Out Stock </span>
                        </td>`
            }
            ${
                +product.quantity > 0
                    ? `<td class="text-center" data-title="Cart">
                <button class="btn btn-sm add-to-cart-btn" title="add to cart">
                    <i class="fi fi-rs-shopping-cart"></i>
                </button>
                </td>`
                    : `<td class="text-right" data-title="Cart">
                <button class="btn btn-sm btn-secondary ml-15"><i class="fi-rs-headset mr-5"></i>Contact Us</button>
            </td>`
            }
            <td class="action text-center" data-title="Remove">
                <a href="#" class="text-body"><i class="fi-rs-trash wish-item-remove"></i></a>
            </td>
    </tr>`;
        wishlistTable.insertAdjacentHTML("afterbegin", productStructure);
    }
    createCartHTML(product, checkBox) {
        const productStructure = `
        <tr class="item--row">
            <td class="custome-checkbox pl-30">
                <input class="form-check-input" type="checkbox" name="checkbox"
                    id="exampleCheckbox${checkBox}" value="">
                <label class="form-check-label" for="exampleCheckbox${checkBox}"></label>
            </td>
            <td class="image product-thumbnail pt-40" id="${product.id}"><img
                    src=${product.img} alt="#"></td>
            <td class="product-des product-name">
                <h6 class="mb-5"><a class="product-name mb-10 text-heading"
                        href="shop-product-right.html">${product.pName}</a></h6>
                <div class="product-rate-cover">
                    ${product.rating}
                </div>
            </td>
            <td class="price" data-title="Price">
                <h4 class="text-body product--price">${product.price}</h4>
                <div class="hide quantity">100</div>
            </td>
            <td class="text-center detail-info" data-title="Stock">
                <div class="detail-extralink mr-15">
                    <div class="detail-qty border radius">
                        <a class="qty-down"><i class="fi-rs-angle-small-down dec-qty"></i></a>
                        <span class="qty-val">1</span>
                        <a class="qty-up"><i class="fi-rs-angle-small-up inc-qty"></i></a>
                    </div>
                </div>
            </td>
            <td class="price" data-title="Price">
                <h4 class="text-brand total--price">${product.price}</h4>
            </td>
            <td class="action text-center" data-title="Remove">
            <a href="#" class="text-body">
            <i class="fi-rs-trash cart-item-remove"></i>
            </a>
            </td>
        </tr>
        `;
        cart.insertAdjacentHTML("afterbegin", productStructure);
    }
    // add incoming data to the page
    addIncomingDataTolist(totalItemsElement, dataArray, list) {
        totalItemsElement.textContent = dataArray.length;
        let checkBox = 1;
        dataArray.forEach((product) => {
            if (list === "cart") {
                this.createCartHTML(product, checkBox);
                checkBox++;
            } else if (list === "wishlist") {
                this.createWishlistHTML(product, checkBox);
                checkBox++;
            } else if (list === "compare") {
                this.compareHTML(product);
            }
        });
    }
    removeFromLocalStorage(dataArray, itemName, productId, totalItemsElement) {
        const itemIndex = dataArray.findIndex(
            (product) => product.id === productId
        );
        dataArray.splice(itemIndex, 1);
        this.addDataToLocalStorage(itemName, dataArray);
        totalItemsElement.textContent = dataArray.length;
    }
    // remove items
    removeItem(e, dataArray, itemName, totalItemsElement) {
        e.preventDefault();
        const productId = e.target
            .closest(".item--row")
            .querySelector(".product-thumbnail")
            .getAttribute("id");
        this.removeFromLocalStorage(
            dataArray,
            itemName,
            productId,
            totalItemsElement
        );
        e.target.closest(".item--row").remove();
        this.calcTotalAmount();
    }
    removeHandler(e) {
        if (e.target.classList.contains("wish-item-remove")) {
            this.removeItem(
                e,
                this._wishlistDataArray,
                "wishlistProducts",
                totalWishlistItems
            );
        } else if (e.target.classList.contains("cart-item-remove")) {
            this.removeItem(
                e,
                this._cartDataArray,
                "cartProducts",
                totalCartItems
            );
        }
    }
    // check if item exist in wishlist or cart
    checkWishlist(productIndex) {
        if (productIndex === -1) return;
        alert("this product will be removed from whishlist");
        this._wishlistDataArray.splice(productIndex, 1);
        this.addDataToLocalStorage("wishlistProducts", this._wishlistDataArray);
    }
    checkCart(productIndex) {
        if (productIndex === -1) return;
        alert("this product will be removed from cart");
        this._cartDataArray.splice(productIndex, 1);
        this.addDataToLocalStorage("cartProducts", this._cartDataArray);
    }
    checkItem(targetButton, dataArray, parentClass, action) {
        const productId = targetButton
            .closest(`.${parentClass}`)
            .getAttribute("id");
        const productIndex = dataArray.findIndex(
            (product) => product.id === productId
        );
        if (action === "wishlist") {
            this.checkCart(productIndex);
        } else if (action === "cart") {
            this.checkWishlist(productIndex);
        }
    }
    // wishlist event handler
    addToWishlist(e) {
        if (
            e.target.getAttribute("aria-label") === "Add To Wishlist" ||
            e.target.parentElement.getAttribute("aria-label") ===
                "Add To Wishlist"
        ) {
            const wishlistButton =
                e.target.parentElement.getAttribute("aria-label") ===
                "Add To Wishlist"
                    ? e.target.parentElement
                    : e.target;
            // check if cart already include this item ? remove from cart
            this.checkItem(
                wishlistButton,
                this._cartDataArray,
                "product-cart-wrap",
                "wishlist"
            );
            const productData = this.collectData(wishlistButton);
            this.checkProduct(
                "wishlistProducts",
                this._wishlistDataArray,
                productData
            );
        }
    }
    // add to cart event handler
    addingItem(e, className, parentClass) {
        let addToCartButton = e.target.classList.contains(className)
            ? e.target
            : e.target.parentElement;
        addToCartButton = addToCartButton.parentElement;
        const product = addToCartButton.closest(`.${parentClass}`);
        if (+product.querySelector(".quantity").textContent === 0) {
            alert("this product isn't available for now");
            e.preventDefault();
            return;
        }
        this.checkItem(
            addToCartButton,
            this._wishlistDataArray,
            parentClass,
            "cart"
        );
        const productData = this.collectData(addToCartButton);
        this.checkProduct("cartProducts", this._cartDataArray, productData);
    }
    addToCart(e) {
        if (
            e.target.classList.contains("add") ||
            e.target.parentElement.classList.contains("add")
        ) {
            this.addingItem(e, "add", "product-cart-wrap");
        } else if (
            e.target.classList.contains("button-add-to-cart") ||
            e.target.parentElement.classList.contains("button-add-to-cart")
        ) {
            this.addingItem(e, "button-add-to-cart", "product--row");
        }
    }
    // add product from wishlist to cart
    addToCartFromWish(e) {
        if (
            e.target.getAttribute("title") === "add to cart" ||
            e.target.parentElement.getAttribute("title") === "add to cart"
        ) {
            let addToCartButton =
                e.target.getAttribute("title") === "add to cart"
                    ? e.target
                    : e.target.parentElement;
            addToCartButton = addToCartButton.parentElement;
            const productId = addToCartButton
                .closest(".item--row")
                .querySelector(".product-thumbnail")
                .getAttribute("id");
            let product = this._cartDataArray.find(
                (product) => product.id === productId
            );
            if (product) return;
            product = this._wishlistDataArray.find(
                (product) => product.id === productId
            );
            this.checkProduct("cartProducts", this._cartDataArray, product);
            // remove from wishlist
            addToCartButton
                .closest(".item--row")
                .querySelector(".wish-item-remove")
                .click();
        }
    }
    // clear all cart items
    clearAll() {
        this._cartDataArray = [];
        this.addDataToLocalStorage("cartProducts", this._cartDataArray);
        location.reload();
    }
    // calc total price after add shipping & show it
    calcTotalAmount() {
        if (!cart) return;
        const totalAmount = document.querySelector(".total--amount");
        const finalTotalAmount = document.querySelector(".final-total");
        const shippingRate =
            parseInt(document.querySelector(".shipping-rate").textContent) /
            100;
        const allSubTotal = Array.from(
            document.querySelectorAll(".total--price")
        ).map((price) => +price.textContent.slice(1));
        const sum = +allSubTotal
            .reduce((acc, price) => {
                return acc + price;
            }, 0)
            .toFixed(2);
        totalAmount.textContent = `$${sum}`;
        finalTotalAmount.textContent = `$${(sum + sum * shippingRate).toFixed(
            2
        )}`;
        shippingRate > 0
            ? (shipping.textContent = `${shippingRate * 100}%`)
            : "FREE";
    }
    // increace or decrease quantity handler
    subTotalPrice(e) {
        if (
            e.target.classList.contains("dec-qty") ||
            e.target.classList.contains("inc-qty")
        ) {
            e.preventDefault();
            const product = e.target.closest(".item--row");
            const quantitySelect = product.querySelector(".qty-val");
            let quantityValue = product.querySelector(".qty-val").textContent;
            const totalPriceElement = product.querySelector(".total--price");
            const prodectPriceValue = +product
                .querySelector(".product--price")
                .textContent.slice(1);
            const TotalquantityValue =
                +product.querySelector(".quantity").textContent;
            const calcSubTotal = () => {
                quantitySelect.textContent = `${quantityValue}`;
                totalPriceElement.textContent = `$${(
                    quantityValue * prodectPriceValue
                ).toFixed(2)} `;
                this.calcTotalAmount();
            };
            if (e.target.classList.contains("dec-qty")) {
                if (+quantityValue === 1) return;
                quantityValue--;
                calcSubTotal();
            }
            if (e.target.classList.contains("inc-qty")) {
                if (+quantityValue === TotalquantityValue) return;
                quantityValue++;
                calcSubTotal();
            }
        }
    }
    // MODAL
    modalHTML(targetButton) {
        const product = this.collectData(targetButton);
        const price = +product.price.slice(1);
        const oldPrice = +product.oldPrice.slice(1);
        let discount = Math.trunc(((oldPrice - price) / oldPrice) * 100);
        if (discount < 0) discount = 0;
        const modalContentHTML = `
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="modal-body">
            <div class="row product--row" id=${product.id}>
                <div class="col-lg-6 col-sm-12 mb-lg-0 mb-sm-5">
                    <div class="product-cart-wrap">
                        <div class="product-img-action-wrap">
                            <div class="product-img product-img-zoom">
                                <a href="shop-product-right.html">
                                    <img class="default-img" src=${product.img}
                                    alt="product-img" />
                                    <img class="hover-img" src=${product.hoverImg}
                                    alt="product-img" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-sm-12">
                    <div class="detail-info pr-30 pl-30">
                        <span class="stock-status out-stock"> Sale Off </span>
                        <h2 class="title-detail"><a href="shop-product-right.html" class="text-heading">
                        ${product.pName}</a></h2>
                        <div class="product-category">
                            <a href="shop-grid-right.html">${product.category}</a>
                        </div>
                        <div class="product-detail-rating">
                            <div class="product-rate-cover text-end">
                                ${product.rating}
                            </div>
                        </div>
                        <div class="hide quantity">${product.quantity}</div>
                        <div class="clearfix product-price-cover">
                            <div class="product-price primary-color float-left">
                                <span class="current-price text-brand">${product.price}</span>
                                <span>
                                    <span class="save-price font-md color3 ml-15">${discount}% Off</span>
                                    <span class="old-price font-md ml-15">${product.oldPrice}</span>
                                </span>
                            </div>
                        </div>
                        <div class="hide quantity">120</div>
                        <div class="detail-extralink mb-30">
                            <div class="product-extra-link2">
                                <button type="submit" class="button button-add-to-cart">
                                <i class="d-inline fi-rs-shopping-cart"></i>Add to cart</button>
                            </div>
                        </div>
                        <div class="font-xs">
                            <ul>
                                <li class="mb-5">Vendor: <span class="text-brand vendor--name">
                                ${product.vendor}</span></li>
                                <li class="mb-5">MFG:<span class="text-brand">Jun 4.2021</span></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Detail Info -->
                </div>
            </div>
        </div>
        `;
        modalContent.innerHTML = modalContentHTML;
    }
    addModalContent(e) {
        if (
            e.target.classList.contains("quick--view") ||
            e.target.parentElement.classList.contains("quick--view")
        ) {
            const targetButton = e.target.classList.contains("quick--view")
                ? e.target
                : e.target.parentElement;
            this.modalHTML(targetButton);
        }
    }
    // COMPARE
    compareHTML(product) {
        const ratingNumbers = [120, 121, 130, 139, 200, 70, 99, 253];
        const productsWeight = [375, 320, 275, 350, 250, 400, 450, 500];
        const productImgHTML = `
        <td class="row_img"><img src=${product.img} alt="compare-img"></td>
        `;
        const productTitleHTML = `
        <td class="product_name" id=${product.id}>
            <h6>
            <a href="shop-product-full.html" class="text-heading">${product.pName}</a>
            </h6>
        </td>
        `;
        const productPriceHTML = `
        <td class="product_price">
            <h4 class="price text-brand">${product.price}</h4>
        </td>
        `;
        const productRatingHTML = `
        <td>
            <div class="rating_wrap">
                ${product.rating}
                <br>
                <span class="rating_num">
                (${
                    ratingNumbers[
                        Math.ceil(Math.random() * ratingNumbers.length - 1)
                    ]
                })
                </span>
            </div>
        </td>
        `;
        const productDescriptionHTML = `
        <td class="row_text font-xs">
            <p class="font-sm text-muted px-1">Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
            unknown printer took a galley of type and</p>
        </td>
        `;
        const productStockStatusHTML = `
        ${
            +product.quantity > 0
                ? `<td class="row_stock"><span class="stock-status in-stock mb-0">In Stock</span></td>`
                : `<td class="row_stock"><span class="stock-status out-stock mb-0">Out of stock</span></td>`
        }
        `;
        const productWeightHTML = `
        <td class="row_weight">${
            productsWeight[Math.ceil(Math.random() * productsWeight.length - 1)]
        } gram</td>
        `;
        const productDimensHTML = `
        <td class="row_dimensions">N/A</td>
        `;
        const productActionHTML = `
        ${
            +product.quantity > 0
                ? `<td class="row_btn">
                        <button class="btn btn-sm add_to_cart">
                            <i class="fi-rs-shopping-bag mr-5"></i>Add to cart
                        </button>
                    </td>`
                : `<td class="row_btn">
                    <button class="btn btn-sm btn-secondary"><i class="fi-rs-headset mr-5"></i>Contact Us</button>
                    </td>`
        }
        `;
        const productRemoveHTML = `
        <td class="row_remove">
            <a href="#" class="text-muted compare-item-remove">
            <i class="fi-rs-trash mr-5"></i><span>Remove</span> 
            </a>
        </td>
        `;
        productImgRow.insertAdjacentHTML("beforeend", productImgHTML);
        productTitleRow.insertAdjacentHTML("beforeend", productTitleHTML);
        productPriceRow.insertAdjacentHTML("beforeend", productPriceHTML);
        productRatingRow.insertAdjacentHTML("beforeend", productRatingHTML);
        productDescRow.insertAdjacentHTML("beforeend", productDescriptionHTML);
        productStockRow.insertAdjacentHTML("beforeend", productStockStatusHTML);
        productWeightRow.insertAdjacentHTML("beforeend", productWeightHTML);
        productDimenRow.insertAdjacentHTML("beforeend", productDimensHTML);
        productCartBtnRow.insertAdjacentHTML("beforeend", productActionHTML);
        productRemoveBtnRow.insertAdjacentHTML("beforeend", productRemoveHTML);
    }
    // add product to compare table
    addToCompareTable(e) {
        if (
            e.target.classList.contains("compare--product") ||
            e.target.parentElement.classList.contains("compare--product")
        ) {
            const targetButton = e.target.classList.contains("compare--product")
                ? e.target
                : e.target.parentElement;
            const product = this.collectData(targetButton);
            this.checkProduct("compareProducts", this._compareDataArr, product);
        }
    }
    //  remove || add to cart
    actionsHandler(trClass, targetButton, action, dataArray, itemName) {
        const allBtns = Array.from(document.querySelectorAll(`.${trClass} td`));
        const allProductsTitle = Array.from(
            document.querySelectorAll(".pr_title td")
        );
        const btnParent = targetButton.parentElement;
        const btnIndex = allBtns.findIndex((btn) => btn === btnParent);
        const productId = allProductsTitle[btnIndex].getAttribute("id");
        this.getCompareProductData();
        if (action === "cart") {
            const product = dataArray.find(
                (product) => product.id === productId
            );
            // check wishlist
            const productIndex = this._wishlistDataArray.findIndex(
                (product) => product.id === productId
            );
            this.checkWishlist(productIndex);
            this.checkProduct(itemName, this._cartDataArray, product);
        } else if (action === "remove") {
            this.removeFromLocalStorage(
                dataArray,
                itemName,
                productId,
                totalCompareProducts
            );
            location.reload();
        }
    }
    // remove compare table item
    removeCompareItem(e) {
        if (
            e.target.classList.contains("compare-item-remove") ||
            e.target.parentElement.classList.contains("compare-item-remove")
        ) {
            e.preventDefault();
            const targetButton = e.target.classList.contains(
                "compare-item-remove"
            )
                ? e.target
                : e.target.parentElement;
            this.actionsHandler(
                "pr_remove",
                targetButton,
                "remove",
                this._compareDataArr,
                "compareProducts"
            );
        }
    }
    // add product to cart from compare table
    addToCartFromCompare(e) {
        if (
            e.target.classList.contains("add_to_cart") ||
            e.target.parentElement.classList.contains("add_to_cart")
        ) {
            const targetButton = e.target.classList.contains("add_to_cart")
                ? e.target
                : e.target.parentElement;
            this.actionsHandler(
                "pr_add_to_cart",
                targetButton,
                "cart",
                this._compareDataArr,
                "cartProducts"
            );
        }
    }
}
const productSlider = new ProductSlider();
const vendor = new Vendor();
const shop = new Shop();
const pdf = new GeneratePDF();

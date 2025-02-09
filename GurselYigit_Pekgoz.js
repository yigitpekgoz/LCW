(() => {
    const init = async () => {
        const products = await getProducts();
        buildHTML(products);
        buildCSS();
        setEvents();
    };

    //list of the local storage keys to avoid typo
    const productListKey = 'productList';
    const favoriteProductsKey = 'favoriteProducts';

    //get products and set to local storage
    const getProducts = async () => {
        try {
            //Check if product list is already in local storage
            const storedProducts = localStorage.getItem(productListKey);
            if (storedProducts) {
                //to prove data is fetched from local storage :)
                console.log('Retrieved products from local storage');
                return JSON.parse(storedProducts);
            }

            //If not in local storage, get from the server
            const response = await fetch(
                'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json'
            );

            if (!response.ok) {
                throw new Error(`An error occurred while fetching products: ${response.status}`);
            }

            const data = await response.json();

            //Save the data to local storage
            localStorage.setItem(productListKey, JSON.stringify(data));
            console.log('Fetched and saved products to local storage');

            return data;
        } catch (error) {
            console.error('An error occurred while fetching products:', error);
            return [];
        }
    };

    //get favorite producs from local storage
    const getFavoriteProducts = () => {
        const storedFavorites = localStorage.getItem(favoriteProductsKey);
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    };

    //update(add or delete) favorite producs from local storage
    const updateFavoriteProducts = (productId, isFavorite) => {
        let favoriteProducts = getFavoriteProducts();

        if (isFavorite) {
            if (!favoriteProducts.includes(productId)) {
                favoriteProducts.push(productId);
            }
        } else {
            favoriteProducts = favoriteProducts.filter(id => id !== productId);
        }

        localStorage.setItem(favoriteProductsKey, JSON.stringify(favoriteProducts));
    };

    //html structure of thee product carousel
    //find arrows, heart icon from lcw.com inspect
    const buildHTML = (products) => {
        const favoriteProducts = getFavoriteProducts();

        const html = `
            <div class="carousel-container">
                <h1>You Might Also Like</h1>
                <div class="carousel-wrapper">
                    <button type="button" aria-label="previous" class="carousel-arrow carousel-arrow-left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M12.5 2l-10 10 10 10"></path>
                        </svg>
                    </button>
                    <div class="carousel">
                        ${products.map(product => `
                            <div class="product-card" data-id="${product.id}" data-url="${product.url}">
                                <img src="${product.img}" alt="${product.name}" />
                                <div class="new-product-card-like-button ${favoriteProducts.includes(product.id) ? 'favorite' : ''}" optionid="${product.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
                                        <path fill="${favoriteProducts.includes(product.id) ? 'blue' : 'none'}" 
                                              stroke="#555" stroke-width="1.5px" 
                                              d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" 
                                              transform="translate(.756 -1.076)"></path>
                                    </svg>
                                </div>
                                <div class="product-info">
                                    <p class="product-name">${product.name}</p>
                                    <p class="product-price">${product.price} TL</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" aria-label="next" class="carousel-arrow carousel-arrow-right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M1.5 2l10 10-10 10"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        $('.product-detail').append(html);
    };

    //css of the product carousel
    const buildCSS = () => {
        const css = `
            .carousel-container {
                margin: 20px auto;
                text-align: center;
                max-width: 90%;
            }
            .carousel-container h1 {
                font-size: 24px;
                margin-bottom: 20px;
                font-weight: bold;
            }
            .carousel-wrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                max-width: calc(100% - 80px);
                margin: 0 auto;
            }
            .carousel {
                display: flex;
                gap: 20px;
                overflow-x: scroll;
                scroll-behavior: smooth;
                padding: 10px;
                max-width: 100%;
            }
            .carousel::-webkit-scrollbar {
                display: none;
            }
            .product-card {
                flex: 0 0 calc((100% - 120px) / 6.5);
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
                transition: transform 0.2s;
                cursor: pointer;
            }
            .product-card img {
                width: 100%;
                height: auto;
                border-radius: 10px;
                margin-bottom: 10px;
                cursor: pointer;
            }
            .product-card:hover {
                transform: translateY(-5px);
            }
            .new-product-card-like-button {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 30px;
                height: 30px;
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s ease, box-shadow 0.3s ease;
            }

            .new-product-card-like-button.favorite {
                border-color: #ddd;
            }

            .new-product-card-like-button.favorite svg path {
                fill: blue;
            }

            .new-product-card-like-button:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            .carousel-arrow {
                background: none;
                border: none;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                width: 40px;
                height: 40px;
            }

            .carousel-arrow-left {
                left: -50px;
            }

            .carousel-arrow-right {
                right: -50px;
            }

            .carousel-arrow:hover path {
                stroke: #000;
            }

            .carousel-arrow svg {
                width: 20px;
                height: 20px;
            }

            .product-price {
                color: blue;
                font-weight: bold;
                font-size: 1.6rem;
            }
        `;
        $('<style>').html(css).appendTo('head');
    };

    //handle click events
    const setEvents = () => {
        const calculateCardWidth = () => $('.product-card').outerWidth(true);

        //handle left arrow click event
        $('.carousel-arrow-left').on('click', () => {
            const cardWidth = calculateCardWidth();
            $('.carousel').scrollLeft($('.carousel').scrollLeft() - cardWidth);
        });

        //handle right arrow click event
        $('.carousel-arrow-right').on('click', () => {
            const cardWidth = calculateCardWidth();
            $('.carousel').scrollLeft($('.carousel').scrollLeft() + cardWidth);
        });

        //handle to open the product page on the new tab when click on the products container
        $('.product-card').on('click', function (event) {
            if (!$(event.target).closest('.new-product-card-like-button').length > 0) {
                const productUrl = $(this).data('url');
                if (productUrl) {
                    window.open(productUrl, '_blank');
                }
            }
        });

        //handle the favorite click event
        $('.new-product-card-like-button').on('click', function (event) {
            event.stopPropagation();
            const productId = $(this).closest('.product-card').data('id');
            const isFavorite = $(this).hasClass('favorite');
            updateFavoriteProducts(productId, !isFavorite);
            $(this).toggleClass('favorite');
            const svgPath = $(this).find('svg path');
            svgPath.attr('fill', isFavorite ? 'none' : 'blue');
        });
    };

    init();
})();

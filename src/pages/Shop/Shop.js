// ProductList.js
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import MidFooter from "../../components/MidFooter";
import "../productList/ProductList.css";

import Subscribe from "../../components/Subscribe";

import "../../components/SeasonalProducts.css";
import "../../components/TopProducts.css";
// import S1 from "../../images/s1.jpg";
// import S2 from "../../images/s2.jpg";
// import S3 from "../../images/s3.jpg";
// import S4 from "../../images/s4.jpg";
// import S5 from "../../images/s5.jpg";
// import S6 from "../../images/s6.jpg";
// import S7 from "../../images/s7.jpg";
// import S8 from "../../images/s8.jpg";
// import S9 from "../../images/s9.jpg";
import { Link, useNavigate } from "react-router-dom";
import MobileSidebar from "../../components/MobileSidebar";
import { AiOutlineHome, AiOutlineRight } from "react-icons/ai";
import SignContext from "../../contextAPI/Context/SignContext";
import axios from "axios";
import Swal from "sweetalert2";

const Shop = () => {
  const url = `${process.env.REACT_APP_BASE_URL}`;
  const navigate = useNavigate();
  const {
    getProducts,
    getCategories,
    getLoggedInCustomer,
    addToCart,
    getColors,
    getMaterials,
    getSeasons,
    GetLoggedInCartItems,
    setOpenLoginModal,
  } = useContext(SignContext);
  const [ProductData, setProductData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);
  const [ColorData, setColorData] = useState([]);
  const [MaterialData, setMaterialData] = useState([]);
  const [SeasonData, setSeasonData] = useState([]);
  const [categoryNameMapping, setCategoryNameMapping] = useState({});
  const [CustomerInfo, setCustomerInfo] = useState({});
  const authToken = localStorage.getItem("authToken");
  const [QueryParams, setQueryParams] = useState({});

  const [loading, setLoading] = useState(false);

  const Getproduct = async () => {
    const res = await getProducts();

    console.log("res", res);

    const categoryRes = await getCategories();
    console.log("categories", categoryRes);
    if (categoryRes) {
      const mapping = {};
      categoryRes.forEach((category) => {
        mapping[category._id] = category.name;
      });

      setCategoryNameMapping(mapping);
    }
    setProductData(res.products);
    setCategoryData(categoryRes);
  };

  //  const changeQueryparams = (parameter, value) => {
  //    const updatedQueryParams = { ...QueryParams };
  //    updatedQueryParams[parameter] = value;

  //    setQueryParams(updatedQueryParams);
  //  };

  //  const getFilteredItems = async () => {
  //    const url = `${process.env.REACT_APP_BASE_URL}/product/getallproducts`;

  //    const queryString = Object.keys(QueryParams)
  //      .map((key) => `${key}=${QueryParams[key]}`)
  //     .join("&");

  //    const fullUrl = queryString ? `${url}?${queryString}` : url;

  //    console.log(fullUrl);

  //    try {
  //      const response = await axios.post(fullUrl);
  //      console.log("Main response", response.data);
  //      if (response.data.success) setProductData(response.data.products);
  //    } catch (error) {
  //      console.error("Error fetching data:", error);
  //    }
  //  }

  const GetColors = async () => {
    const res = await getColors();
    setColorData(res.colors);
  };

  const GetMaterials = async () => {
    const res = await getMaterials();
    setMaterialData(res.material);
  };

  const GetSeasons = async () => {
    const res = await getSeasons();
    setSeasonData(res.season);
  };

  // const onFilterChange =

  const GetLoggedInCustomer = async (token) => {
    const res = await getLoggedInCustomer(token);

    if (res.success) {
      setCustomerInfo(res.customer);
      console.log("success");
    } else {
      console.log("err", res.msg);
    }
  };

  // Define state variables for filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("New In");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
  const [selectedShopBy, setSelectedShopBy] = useState([]);
  const [price, setPrice] = useState(40);
  const [productsToShow, setProductsToShow] = useState(5);

  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedPriceRange(null);
    setSelectedCategory([]);
    setSelectedShopBy([]);
    setSelectedSeason([]);
    setSelectedMaterial([]);
    setShowFilters(false);
    Getproduct();
  };

  const handleInput = (e) => {
    setPrice(e.target.value);
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const [selectedColor, setSelectedColor] = useState([]);
  // Define functions to handle filter changes
  const GetProductsByColor = async () => {
    setLoading(true);
    const res = await getProducts();

    const filteredProducts = selectedColor
      ? res.products.filter((product) => product.productColor === selectedColor)
      : res.products;

    setProductData(filteredProducts);
    setLoading(false);
  };

  useEffect(() => {
    GetProductsByColor();
  }, [selectedColor]);

  const handleColorChange = (color) => {
    console.log("Selected color:", color);
    setSelectedColor( color);
  };

  // const handleColorChange = (color) => {
  //   console.log("Selected color:", color);
  //   if (selectedColor.includes(color)) {
  //     const colorIndex = selectedColor.indexOf(color);
  //     var tempColor = [...selectedColor];
  //     tempColor.splice(colorIndex, 1);
  //     setSelectedColor(tempColor);
  //   } else {
  //     setSelectedColor([...selectedColor, color]);
  //   }
  //   // setSelectedColor([...selectedColor, color]);
  // };

  const handleSeasonChange = (selectedseason) => {
    const updatedColors = selectedSeason.includes(selectedseason)
      ? selectedSeason.filter((color) => color !== selectedseason)
      : [...selectedSeason, selectedseason];

    // Update the selected colors state
    setSelectedSeason(updatedColors);

    changeQueryparams("season", updatedColors.join(","));
  };

  const handlePriceChange = async (range) => {
    let min, max;
    if (range === "Over ₹5000") {
      // Specifically handle the "Over ₹5000" case
      min = "5000";
      max = undefined;
    } else {
      // Extract min and max values for other ranges
      [min, max] = range.match(/\d+/g);
    }

    // Update QueryParams with min and max prices
    changeQueryparams(min, max);

    try {
      // Fetch products based on the price range
      await getFilteredItems();
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setSelectedPriceRange(range);
  };

  const changeQueryparams = (min, max) => {
    let priceRange;

    if (min === "5000" && max === undefined) {
      priceRange = encodeURIComponent("5000+");
    } else {
      priceRange = `${encodeURIComponent(min)}-${encodeURIComponent(max)}`;
    }

    const updatedQueryParams = { priceRange };
    setQueryParams(updatedQueryParams);
  };

  const getFilteredItems = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}/product/getallproductsforprice`;

    // Construct query parameters including the selected category
    const queryParams = {
      ...QueryParams,
      category: selectedCategory, // Add selected category to the query parameters
    };

    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const fullUrl = queryString ? `${url}?${queryString}` : url;

    console.log(fullUrl);

    try {
      const response = await axios.post(fullUrl);
      if (response.data.success) setProductData(response.data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GetproductByCategory = async () => {
    setLoading(true);
    const res = await getProducts();

    const filteredProducts = selectedCategory
      ? res.products.filter((product) => product.category === selectedCategory)
      : res.products;

    // console.log("filter data", filteredProducts, ProductData);

    setProductData(filteredProducts);
    setLoading(false);
    // setCategoryData(categoryRes);
  };

  useEffect(() => {
    GetproductByCategory();
  }, [selectedCategory]);

  const handleCategoryChange = (selectedCategory) => {
    console.log("Selected category:", selectedCategory);

    setSelectedCategory(selectedCategory);
  };

  const handleMaterialChange = (selectedmaterial) => {
    changeQueryparams("material", selectedmaterial);
    setSelectedMaterial(selectedmaterial);
  };

  const handleShopByChange = (shopItem) => {
    // Toggle the selected shop item
    if (selectedShopBy.includes(shopItem)) {
      setSelectedShopBy(selectedShopBy.filter((item) => item !== shopItem));
    } else {
      setSelectedShopBy([...selectedShopBy, shopItem]);
    }
  };

  const handleSortByChange = (value) => {
    setSelectedSortBy(value);

    // Sort the product data based on the selected option
    const sortedData = [...ProductData];
    const newSortedData = [...ProductData];

    if (value === "newIn") {
      sortedData.sort((a, b) => {
        // Sort by creation date in descending order
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Filter products that are marked as new
      const newInProducts = sortedData.filter(
        (product) => product.isProductNew
      );

      // Update the sorted data with only new products
      // Assuming you want to update the sortedData array directly
      // If you use sortedData(newInProducts), it will result in an error
      sortedData.length = 0; // Clear the original array
      sortedData.push(...newInProducts); // Push new products into the array
    } else if (value === "priceLowestFirst") {
      sortedData.sort((a, b) => {
        const priceA = a.prices.discounted || a.prices.calculatedPrice;
        const priceB = b.prices.discounted || b.prices.calculatedPrice;
        return priceA - priceB;
      });
    } else if (value === "priceHighestFirst") {
      sortedData.sort((a, b) => {
        const priceA = a.prices.discounted || a.prices.calculatedPrice;
        const priceB = b.prices.discounted || b.prices.calculatedPrice;
        return priceB - priceA;
      });
    }
    setProductData(sortedData);
  };

  const handleShowMore = () => {
    setProductsToShow(ProductData.length);
  };

  const handleCartClick = async (id) => {
    GetLoggedInCustomer();
    try {
      console.log("My data", ProductData);
      const product = ProductData.find((p) => p._id === id);
      console.log("PPP", product); // Find the product by ID
      if (
        !product ||
        product.productStock.length === 0 ||
        product.productStock[0].quantity <= 0
      ) {
        // Assuming productStock is an array and quantity indicates the stock level
        Swal.fire({
          icon: "error",
          title: "Not available",
          text: "This product is currently out of stock.",
          confirmButtonText: "OK",
        });
        return; // Exit the function to prevent adding to cart
      }
      console.log("ci", CustomerInfo);
      if (authToken) {
        const customerId = CustomerInfo._id;
        const cartInfo = {
          productId: id,
          quantity: 1,
        };

        const response = await GetLoggedInCartItems(customerId);

        if (response.success) {
          const cartItems = response.cartItems;
          const currentCartQuantity = cartItems.reduce(
            (total, item) =>
              item.product._id === id ? total + item.quantity : total,
            0
          );
          if (currentCartQuantity >= product.productStock[0].quantity) {
            Swal.fire({
              icon: "error",
              title: "Out of Stock",
              text: "You've reached the maximum available quantity for this product.",
              confirmButtonText: "OK",
            });
            return;
          }
        }

        const res = await addToCart(customerId, cartInfo);
        console.log(customerId);
        console.log(cartInfo);
        console.log("m response", res);

        if (res.success) {
          // Cart updated successfully
          Swal.fire({
            icon: "success",
            title: "Item Added to Cart",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          // Handle the error
          console.error(res.msg);
        }
      } else {
        setOpenLoginModal(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    Getproduct();
    GetColors();
    GetLoggedInCustomer(authToken);
    GetMaterials();
    GetSeasons();
  }, [authToken]);

  useEffect(() => {
    getFilteredItems();
  }, [selectedCategory, QueryParams, selectedColors, selectedPriceRange]);

  return (
    <div>
      <Header />
      <MobileSidebar />
      <div class="page-header breadcrumb-wrap">
        <div className="container">
          <div className="breadcrumb">
            <Link className="homeLink" to="/" rel="nofollow">
              <i className="fi-rs-home ">
                <AiOutlineHome />
              </i>
              Home{" "}
            </Link>
            <AiOutlineRight className="rightIcon" /> <span /> Product List{" "}
            <span />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <Link className="shop-filter-toogle" to="#" onClick={toggleFilters}>
              <span className="fi-rs-filter bi bi-funnel" />
              Filters
              {showFilters ? (
                <i className="fi-rs-angle-small-up angle-up bi bi-chevron-up" />
              ) : (
                <i className="fi-rs-angle-small-down angle-down bi bi-chevron-down" />
              )}
            </Link>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 mb-lg-0 mb-md-5 mb-sm-5 "
            style={{ float: "right" }}
          >
            <div className="reset">
              <button className="btn btn-reset" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>
          <div className="col-lg-12">
            {showFilters && (
              <div className="shop-product-fillter-header">
                <div className="row">
                  {/* Color Filter */}
                  <div className="col-xl-3 col-lg-6 col-md-6 filter-div mb-lg-0 mb-md-2 mb-sm-2">
                    <div className="card">
                      <h5 className="mb-30 text-start fw-bold fs-5">Colors</h5>
                      <div className="d-flex text-start flex-wrap">
                        {ColorData.map((color) => (
                          <div key={color} className="custome-checkbox mr-80">
                            <input
                              className="form-check-input mb-2 me-2"
                              type="checkbox"
                              name="checkbox"
                              id={`color-${color}`}
                              value={color.name}
                              checked={selectedColor.includes(color.name)}
                              onChange={() => handleColorChange(color.name)}
                            />
                            <label
                              className="form-check-label mb-1"
                              htmlFor={`color-${color}`}
                            >
                              <span>{color.name}</span>
                            </label>
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="col-xl-3 col-lg-6 col-md-6 filter-div mb-lg-0 mb-md-2 mb-sm-2">
                    <div className="card">
                      <h5 className="mb-30 price-btm fw-bold fs-5 text-start">
                        By Price
                      </h5>
                      <div className="custome-radio text-start">
                        {[
                          "₹0 - ₹1000",
                          "₹1000 - ₹5000",
                          //"₹5000 - ₹10000",
                          "Over ₹5000",
                        ].map((range) => (
                          <div
                            key={range}
                            className="d-flex align-items-center"
                            style={{ paddingLeft: "12px" }}
                          >
                            <input
                              type="radio"
                              name="priceRange"
                              id={`price-${range}`}
                              value={range}
                              checked={selectedPriceRange === range}
                              onChange={() => handlePriceChange(range)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`price-${range}`}
                            >
                              <span>{range}</span>
                            </label>
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="col-xl-3 col-lg-6 col-md-6 filter-div mb-lg-0 mb-md-2 mb-sm-2">
                    <div className="card">
                      <h5 className="mb-30 fw-bold fs-5 text-start">
                        By Categories
                      </h5>
                      <div
                        className="categories-dropdown-wrap font-heading"
                        style={{ paddingLeft: "12px" }}
                      >
                        <select
                          className="form-select"
                          value={selectedCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                          <option value="">All Categories</option>
                          {CategoryData.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Shop By Filter */}
                  <div className="col-xl-3 col-lg-6 col-md-6 filter-div mb-lg-0 mb-md-2 mb-sm-2">
                    <div className="card">
                      <h5 className="mb-30 fw-bold fs-5 text-start">
                        By Materials
                      </h5>
                      <div
                        className="categories-dropdown-wrap font-heading"
                        style={{ paddingLeft: "12px" }}
                      >
                        <select
                          className="form-select"
                          value={selectedMaterial}
                          onChange={(e) => handleMaterialChange(e.target.value)}
                        >
                          <option value="">All Materials</option>
                          {MaterialData.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* By Season */}
                  <div className="col-xl-3 col-lg-6 col-md-6 filter-div mb-lg-0 mb-md-2 mb-sm-2">
                    <div className="card">
                      <h5 className="mb-30 text-start fw-bold fs-5">Seasons</h5>
                      <div className="d-flex text-start flex-wrap">
                        {SeasonData.map((color) => (
                          <div key={color} className="custome-checkbox mr-80">
                            <input
                              className="form-check-input mb-2 me-2"
                              type="checkbox"
                              name="checkbox"
                              id={`color-${color}`}
                              value={color._id}
                              checked={selectedSeason.includes(color._id)}
                              onChange={() => handleSeasonChange(color._id)}
                            />
                            <label
                              className="form-check-label mb-1"
                              htmlFor={`color-${color}`}
                            >
                              <span>{color.name}</span>
                            </label>
                            <br />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Product List */}
        {/* <div className="row">
          {filteredProducts.map((product, index) => (
            <div key={index} className="col-lg-4">
              <div className="product-card">
                <h2>{product.name}</h2>
                <p>Color: {product.color}</p>
                <p>Price: {product.price}</p>
                <p>Category: {product.category}</p>
                <p>Shop by: {product.shopBy}</p>
              </div>
            </div>
          ))}

          
        </div> */}
        <div className="row">
          <div class="shop-product-fillter ">
            <div class="totall-product">
              <p></p>
            </div>
            <div className="d-flex ">
              {/* <div className="d-flex  page-show">
                <div>
                  <label>Page:</label>
                </div>
                <select value={selectedValue} onChange={handleChange}>
                  <option value="10">50</option>
                  <option value="20">100</option>
                  <option value="30">150</option>
                  <option value="40">200</option>
                </select>
              </div> */}
              <div className="d-flex  page-show">
                <div>
                  <label>Sortby:</label>
                </div>
                <select
                  value={selectedSortBy}
                  onChange={(e) => handleSortByChange(e.target.value)}
                >
                  <option value="">select</option>
                  <option value="newIn">New In</option>
                  <option value="priceLowestFirst">Price(lowest first)</option>
                  <option value="priceHighestFirst">
                    Price(highest first)
                  </option>
                </select>
              </div>
            </div>
          </div>
          {/* { loading && <p className="text-align-center h5" >Loading...</p> } */}
          {ProductData
            ? ProductData.slice(0, productsToShow).map((product) => (
                <div
                  className=" col-lg-3 col-md-4 col-sm-6 col-6  mb-4"
                  key={product.id}
                >
                  <div
                    className="product-cart-wrap popular-card filter-card"
                    tabIndex={0}
                  >
                    <div className="product-img-action-wrap">
                      <div className="product-img product-img-zoom">
                        <Link
                          to={`/product-details/${product._id}`}
                          tabIndex={0}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            className="default-img"
                            src={`${url}/products/${product.imageGallery[0]}`}
                            alt=""
                            onError={(e) => {
                              e.target.src =
                                "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                              e.target.style.width = "192.6px";
                              e.target.style.height = "192.6px";
                            }}
                          />
                          <img
                            className="hover-img"
                            src={product.hoverImageUrl}
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div class="product-content-wrap">
                      <div class="product-category">
                        <Link
                          to={`/product-details/${product._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {categoryNameMapping[product.category]}
                        </Link>
                      </div>
                      <h2>
                        <Link
                          to={`/product-details/${product._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {product.name}
                        </Link>
                      </h2>

                      <h5 className="notAvailableTitle">
                        {product.productStock.length === 0 ? (
                          <span className="stock-message-list">
                            Not available
                          </span>
                        ) : product.productStock[0].quantity <= 0 ? (
                          <span className="stock-message-list">
                            Out of stock
                          </span>
                        ) : product.productStock[0].quantity < 5 ? (
                          <span className="stock-message-list">
                            Only {product.productStock[0].quantity} left
                          </span>
                        ) : null}
                      </h5>

                      <div class="product-card-bottom">
                        <div class="product-price popular-card-price">
                          <span id="f-c-p">
                            ₹
                            {product.prices.discounted
                              ? product.prices.discounted
                              : product.prices.calculatedPrice}
                          </span>
                          {!product.calculationOnWeight && (
                            <span class="old-price " id="f-c-o-p">
                              ₹{product.prices ? product.prices.original : null}
                            </span>
                          )}
                        </div>
                        <div class="add-cart popular-card-cart">
                          <Link
                            class="add add-cart-btn"
                            id="shop-cart"
                            onClick={() => {
                              handleCartClick(product._id);
                            }}
                          >
                            <i class="fi-rs-shopping-cart mr-5 bi bi-cart me-2"></i>
                            Add
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
        <div>
          {productsToShow < ProductData.length && (
            <div className="btn" onClick={handleShowMore}>
              Show More
            </div>
          )}
        </div>
      </div>
      <Subscribe />
      <MidFooter />
    </div>
  );
};

export default Shop;

import React, { useContext, useEffect, useState } from "react";
// import { getLoggedinCustomerCart } from './Header';

import "./SeasonalProducts.css";
import "./TopProducts.css";
import "./NewArrival.css"

import { Link } from "react-router-dom";
import Slider from "react-slick";
import Swal from "sweetalert2";
import SignContext from "../contextAPI/Context/SignContext";

const NewArrival = (props) => {
  const url = `${process.env.REACT_APP_BASE_URL}`;

  // const [showPopup, setShowPopup] = useState(false);
  const {
    getProducts,
    getCategories,
    getLoggedInCustomer,
    GetLoggedInCartItems,

    addToCart,
    OpenLoginModal,
    setOpenLoginModal,
  } = useContext(SignContext);
  const [ProductData, setProductData] = useState([]);
  const [categoryNameMapping, setCategoryNameMapping] = useState({});
  const [CustomerInfo, setCustomerInfo] = useState({});
  const authToken = localStorage.getItem("authToken");

  // const getLoggedinCustomerCart = async (CustomerId) => {
  //   const res = await GetLoggedInCartItems(CustomerId);
  //   if (res.success) {
  //     setCartData(res.cartItems);
  //   }
  // };

  const Getproduct = async () => {
    const res = await getProducts();
    console.log("Products", res);

    const categoryRes = await getCategories();
    if (categoryRes) {
      const mapping = {};
      categoryRes.forEach((category) => {
        mapping[category._id] = category.name;
      });
      setCategoryNameMapping(mapping);
    }
    setProductData(res.products);
  };

  const GetLoggedInCustomer = async (token) => {
    const res = await getLoggedInCustomer(token);
    if (res.success) {
      setCustomerInfo(res.customer);
    } else {
      console.log(res.msg);
    }
  };

  const NextArrow = ({ onClick }) => (
    <div
      className="custom-arrow position-absolute top-0 end-0 popular-next-arrow"
      onClick={onClick}
    >
      <button>
        {" "}
        <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="custom-arrow  position-absolute top-0 left-0 popular-prev-arrow  "
      onClick={onClick}
    >
      <button>
        <i className="bi bi-arrow-left "></i>
      </button>
    </div>
  );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Display all products in one row
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: ProductData ? Math.min(ProductData.length, 4) : null,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: ProductData ? Math.min(ProductData.length, 3) : null,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: ProductData ? Math.min(ProductData.length, 2) : null,
          slidesToScroll: ProductData ? Math.min(ProductData.length, 2) : null,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: ProductData ? Math.min(ProductData.length, 1) : null,
          slidesToScroll: ProductData ? Math.min(ProductData.length, 1) : null,
        },
      },
    ],
  };

  const handleCartClick = async (id) => {
    try {
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
    GetLoggedInCustomer(authToken);
    // getLoggedinCustomerCart(CustomerInfo._id);
  }, [authToken]);

  return (
    <div style={{ background: "rgba(251, 248, 240, 0.74)" }}>
      <div className="container" style={{ marginTop: "55px" }}>
        <div className="row popular-row">
          <div className="row text-start">
            <div className="col">
              <h1 className="text-start fs-1 mt-4 mb-4 titleCategory">
                New Arrivals
              </h1>
            </div>
            <div className="col text-end d-flex align-items-center justify-content-end">
              <Link
                to="/shop"
                className="mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>view all Products</strong>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <Slider {...settings}>
            {ProductData
              ? ProductData.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
                  .filter((product) => product.isProductNew)
                  .slice(0,20)
                  .map((product) => (
                    <div
                      className="col-xxl-2 col-lg-3 col-md-4 col-sm-6 mb-4 popular-card"
                      key={product.id}
                    >
                      <Link
                        to={`/product-details/${product._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <div
                          className="product-cart-wrap popular-card"
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
                                  }}
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
                            <h2 className="new-product-name">
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
                                <span className="stock-message-new">
                                  Not available
                                </span>
                              ) : product.productStock[0].quantity <= 0 ? (
                                <span className="stock-message-new">
                                  Out of stock
                                </span>
                              ) : product.productStock[0].quantity < 5 ? (
                                <span className="stock-message-new">
                                  Only {product.productStock[0].quantity} left
                                </span>
                              ) : null}
                            </h5>

                            <div class="product-card-bottom new-arrival-card-bottom">
                              <div class="product-price popular-card-price new-arrival-price">
                                <span>
                                  ₹
                                  {product.prices.discounted
                                    ? product.prices.discounted
                                    : product.prices.calculatedPrice}
                                </span>
                                {!product.calculationOnWeight && (
                                  <span class="old-price">
                                    ₹
                                    {product.prices
                                      ? product.prices.original
                                      : null}
                                  </span>
                                )}
                              </div>
                              <div class="add-cart popular-card-cart">
                                <Link
                                  class="add"
                                  onClick={() => {
                                    handleCartClick(product._id);
                                  }}
                                  rel="noopener noreferrer"
                                >
                                  <i class="fi-rs-shopping-cart mr-5 bi bi-cart me-2"></i>
                                  Add{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
              : null}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;

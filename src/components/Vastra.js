import React, { useContext, useEffect, useState } from "react";

import Slider from "react-slick";
import "./SeasonalProducts.css";
import "./Vastra.css";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import SignContext from "../contextAPI/Context/SignContext";

const Vastra = () => {
  const url = `${process.env.REACT_APP_BASE_URL}`;
  const id = "65083839f32a06ef841fa5de";
  // const navigate = useNavigate();
  const {
    GetProductsbyCategoryId,
    getCategories,
    getLoggedInCustomer,
    addToCart,
    GetLoggedInCartItems,

    OpenLoginModal,
    setOpenLoginModal,
  } = useContext(SignContext);
  const [ProductData, setProductData] = useState([]);
  const [categoryNameMapping, setCategoryNameMapping] = useState({});
  const [CustomerInfo, setCustomerInfo] = useState({});
  const [categoryImage, setCategoryImage] = useState("");
  const authToken = localStorage.getItem("authToken");

  const Getproduct = async (id) => {
    const res = await GetProductsbyCategoryId("categoryId",id);

    const categoryRes = await getCategories();

    if (categoryRes) {
      const mapping = {};
      categoryRes.forEach((category) => {
        mapping[category._id] = category.name;
        if (category._id === id) {
          setCategoryImage(category.image);
        }
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

  //  Next/Previous Button Configuration
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

  // Slider Configuration
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Display all products in one row
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: ProductData ? ProductData.length : null,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: ProductData ? ProductData.length : null,
          slidesToScroll: ProductData ? ProductData.length : null,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: ProductData ? ProductData.length : null,
          slidesToScroll: ProductData ? ProductData.length : null,
        },
      },
    ],
  };

  const handleCartClick = async (id) => {
    try {
      const product = products.find((p) => p._id === id);
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
    Getproduct(id);
    GetLoggedInCustomer(authToken);
  }, [id, authToken]);

  const products = ProductData;

  return (
    <div style={{ background: "rgb(251 248 240 / 74%)" }}>
      <div className="container mb-4">
        <div className="row text-start">
          <div className="col">
            <h1 className="fs-1 mt-4 mb-4 titleCategory">Vastra</h1>
          </div>
          <div className="col text-end d-flex align-items-center justify-content-end">
            <Link
              to={`/product-list/${id}/categoryId`}
              className="mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>view all</strong>
            </Link>
          </div>
        </div>
        <div className="row ">
          <div
            class="col-lg-3 d-none d-lg-flex mb-4"
            style={{ marginTop: "30px" }}
          >
            <div class="banner-img style-2 vastra">
              <img
                style={{ borderRadius: "10px" }}
                src={`${url}/cagtegory/${categoryImage}`}
                alt=""
              />
              <div class="banner-text d-none">
                <h2 class="mb-100">Bring Top Vastra into Your Home</h2>
                <Link to="#" class="btn btn-xs">
                  Shop Now <i class="fi-rs-arrow-small-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-12 mb-4">
            <Slider {...settings}>
              {products
                ? products.map((product) => (
                    <div key={product.id}>
                      {/* <ProductCard redirectTo imageLink productCategory></ProductCard> */}
                      <Link
                        to={`/product-details/${product._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div
                          className="product-cart-wrap shringar-card slick-slide slick-current slick-active"
                          tabIndex={0}
                          style={{ width: 246 }}
                          data-slick-index={3}
                          aria-hidden="false"
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
                                      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"; // Replace with the path to your alternate image
                                  }}
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="product-content-wrap">
                            <div className="product-category">
                              <Link
                                to={`/product-details/${product._id}`}
                                tabIndex={0}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {categoryNameMapping[product.category]}
                              </Link>
                            </div>
                            <h2 className="vastra-title">
                              <Link
                                to={`/product-details/${product._id}`}
                                tabIndex={0}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {product.name}
                              </Link>

                              {product.productStock.length === 0 ? (
                                <span className="stock-message">
                                  Not available
                                </span>
                              ) : product.productStock[0].quantity <= 0 ? (
                                <span className="stock-message">
                                  Out of stock
                                </span>
                              ) : product.productStock[0].quantity < 5 ? (
                                <span className="stock-message">
                                  Only {product.productStock[0].quantity} left
                                </span>
                              ) : (
                                null
                              )}
                            </h2>
                            <div className="product-price mt-10 mb-2">
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
                            <Link
                              className="btn w-100 hover-up"
                              tabIndex={0}
                              onClick={() => {
                                handleCartClick(product._id);
                              }}
                            >
                              <i className="fi-rs-shopping-cart bi bi-cart mr-5 me-1 " />
                              Add To Cart
                            </Link>
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
    </div>
  );
};

export default Vastra;

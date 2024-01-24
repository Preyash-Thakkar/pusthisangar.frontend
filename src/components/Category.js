import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import SignContext from "../contextAPI/Context/SignContext";
import VastraCat3 from "../images/ShangarSmallCategory.png";
import VastraCat4 from "../images/ShringarSmallCategory.jpg";
import VastraCat from "../images/VastraCatagorySmall.jpg";
import VastraCat2 from "../images/VastraCategory2Small.png";
import "./Category.css";
import "./FeatureCategory.css";
import ShowMoreCategory from "./ShowMoreCategory";

const Category = ({ background }) => {
  const url = `${process.env.REACT_APP_BASE_URL}`;

  const categories = [
    {
      name: "Shri Mastak",
      image: VastraCat,
      itemCount: 29,
      color: "#fff ",
    },
    {
      name: "Shri Karna",
      image: VastraCat4,
      itemCount: 29,
      color: "#fff ",
    },
    {
      name: "Shishful",
      image: VastraCat3,
      itemCount: 29,
      color: "#fff ",
    },
    {
      name: "Vastra",
      image: VastraCat2,
      itemCount: 29,
      color: "#fff ",
    },
    {
      name: "Shringar",
      image: VastraCat4,
      itemCount: 29,
      color: "#fff ",
    },
    {
      name: "Shangar",
      image: VastraCat3,
      itemCount: 29,
      color: "#fff ",
    },

    // Add more categories here...
  ];

  const CategoryCard = ({ name, image, itemCount, color, id }) => (
    <div className="col-12 col-md-6 col-lg-3 category col-lg-1-5">
      <Link to={`/product-list/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card" style={{ backgroundColor: color }}>
          <img
            src={`${url}/cagtegory/${image}`}
            className="card-img-top"
            alt={name}
            style={{
              width: "80px",
              height: "80px",
              maxHeight: "250px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <div className="card-body">
            <p className="card-text mt-2 d-block fw-bold">
              {name}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
  

  const { getCategories } = useContext(SignContext);
  const navigate = useNavigate();

  const [CategoryData, setCategoryData] = useState([]);

  const Getcategories = async () => {
    const res = await getCategories();
    // console.log(res);
    if (res !== undefined) {
      const transformedData = res.map((category, index) => ({
        ...category,
        id: index + 1,
      }));
      setCategoryData(transformedData);
    }
  };

  // console.log(CategoryData);

  const handlecategoryClick = () => {
    // Use navigate to go to the cart page
    navigate("/all-category");
  };
  const inlineStyle = {
    padding: "20px",
    paddingTop: "1px",
    // marginTop: "-50px",
    background: background || "#f2fce4", // Use the prop value if provided, or red as a default
  };

  useEffect(() => {
    Getcategories();
  }, []);

  return (
    <div style={inlineStyle}>
      <div className="container">
        <div className="row text-start">
          <div className="col">
            <h1 className="fs-1 mt-4 mb-4 fw-bold text-start titleCategory">
              Our Category
            </h1>
          </div>
          <div className="col text-end d-flex align-items-center justify-content-end">
            <Link to="/shop" className="mb-2">
              <strong>view all Products</strong>
            </Link>
          </div>
        </div>
        <div className="row">
          {CategoryData.slice(0, 6).map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              image={category.image}
              // itemCount={category.noOfProducts}
              id={category._id}
              // onClick={()=>{category._id}}
              // color={category.color}
            />
          ))}
          {/* Show More Categories card */}

          <ShowMoreCategory onClick={handlecategoryClick} />
        </div>
      </div>
    </div>
  );
};

export default Category;

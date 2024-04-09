import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";

const MobileCategory = () => {
  const [navBarData, setNavBarData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/category/getcategories`);
        console.log("Categories fetched successfully", response.data);
        setNavBarData(response.data.map(category => ({ ...category, subcategories: [] })));
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryToggle = async (isOpen, event, metadata, categoryId) => {
    if (isOpen) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/category/getsubcategories/${categoryId}`);
            console.log("Subcategory names fetched successfully", response.data.categoriesWithSubCategoriesAndSubSubCategories[0].subcategories.map(subcategory => subcategory.name));
            
            setNavBarData(navBarData.map(category =>
                category._id === categoryId
                    ? { ...category, subcategories: response.data.categoriesWithSubCategoriesAndSubSubCategories[0].subcategories }
                    : category
            ));
        } catch (error) {
            console.error("Error fetching subcategories", error);
        }
    }
};


return (
  <Navbar bg="light" expand="lg" variant="light">
    <style>
      {`
        .custom-dropdown .dropdown-toggle {
          background-color: transparent;
          color: inherit;
          border: none;
          padding: 0;
        }

        .custom-dropdown .dropdown-toggle:focus {
          box-shadow: none;
        }

        .custom-dropdown .dropdown-toggle:active {
          background-color: transparent;
        }
      `}
    </style>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <NavDropdown title="Browse all categories" className="custom-dropdown">
          {navBarData.map((item) => (
            <NavDropdown
              title={item.name}
              className="custom-dropdown"
              key={item._id}
              onToggle={(isOpen, event, metadata) => handleCategoryToggle(isOpen, event, metadata, item._id)}
            >
              {item.subcategories.map((subItem) => (
                <NavDropdown.Item
                  href={`/product-list/${subItem._id}/subCategoryId`}
                  key={subItem._id}
                >
                  {subItem.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ))}
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

};

export default MobileCategory;


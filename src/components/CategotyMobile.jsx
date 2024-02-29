import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";

const MobileCategory = () => {
  const [navBarData, setNavBarData] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/category/getcategories`);
        setNavBarData(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

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
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Browse All Categories" className="custom-dropdown">
            {navBarData.map((item) => (
              <NavDropdown.Item
                href={`/product-list/${item._id}/categoryId`}  // Replace 'categoryId' with the actual identifier
                key={item._id}
              >
                {item.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MobileCategory;

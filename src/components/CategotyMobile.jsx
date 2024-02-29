import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import axios from "axios"; // Import Axios

const MobileCategory = () => {
  const [navBarData, setNavBarData] = useState([]);

  useEffect(() => {
    // Fetch your categories data from the backend and update the state
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/category/getcategories`);
        setNavBarData(response.data); // Use response.data directly
        console.log(">>>>>>>", response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const menuShow = (mItems) => {
    return mItems.map((item, index) => {
      if (item.submenu) {
        return (
          <NavDropdown title={item.name} key={index}>
            {menuShow(item.submenu)}
          </NavDropdown>
        );
      } else {
        return (
          <Nav.Link href={`/${item._id}`} key={index}>
            {item.name}
          </Nav.Link>
        );
      }
    });
  };

  const renderSubmenu = (submenu) => {
    if (!submenu) return null;
    return submenu.map((item, index) => {
      if (item.submenu) {
        return (
          <NavDropdown title={item.name} key={index}>
            {renderSubmenu(item.submenu)}
          </NavDropdown>
        );
      } else {
        return (
          <Nav.Link href={`/${item._id}`} key={index}>
            {item.name}
          </Nav.Link>
        );
      }
    });
  };

  return (
    <Navbar bg="light" expand="lg" variant="light">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown className="navDropDownDiv" title="Browse All Categories">
            {navBarData.map((item, index) => (
              <NavDropdown title={item.name} key={index}>
                {renderSubmenu(item.submenu)}
              </NavDropdown>
            ))}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MobileCategory;

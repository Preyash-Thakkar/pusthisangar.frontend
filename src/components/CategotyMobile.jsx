import React from "react";


import { Navbar, Nav, NavDropdown } from "react-bootstrap";


import { AiTwotoneAppstore } from "react-icons/ai";






const navBarData = [


    {


        label: "Browse All Categories",


        submenu: [


            {


                label: "Sub Category",


                url: "#",


                submenu: [


                    {


                        label: "Sub Sub Category",


                        url: "/react/hooks",


                        submenu: [


                            {


                                label: "Category Item",


                                url: "#"


                            },


                            {


                                label: "Category Item",


                                url: "#"


                            }


                        ]


                    },






                ]


            },






        ]


    }


];






function MobileCategory({ items }) {


    const menuShow = (mItems) => {


        return mItems.map((item, index) => {


            if (item.submenu) {


                return (


                    <NavDropdown title={item.label} key={index}>


                        {menuShow(item.submenu)}


                    </NavDropdown>


                );


            } else {


                return (


                    <Nav.Link href={item.url} key={index}>


                        {item.label}


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


                    <NavDropdown title={item.label} key={index}>


                        {renderSubmenu(item.submenu)}


                    </NavDropdown>


                );


            } else {


                return (


                    <Nav.Link href={item.url} key={index}>


                        {item.label}


                    </Nav.Link>


                );


            }


        });


    };






    return (


        <Navbar bg="light" expand="lg" variant="light">


            <Navbar.Collapse id="basic-navbar-nav">


                <Nav className="mr-auto">


                    {navBarData.map((item, index) => (


                        <NavDropdown className="navDropDownDiv" title={item.label} key={index}>


                            {renderSubmenu(item.submenu)}


                        </NavDropdown>


                    ))}


                </Nav>


            </Navbar.Collapse>


        </Navbar>


    );


}






export default MobileCategory;
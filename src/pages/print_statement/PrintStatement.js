import React from "react";
import logo from "../../images/logo1.png";

import { Link, useParams } from "react-router-dom";

import { useContext } from "react";

import SignContext from "../../contextAPI/Context/SignContext";
import { useState } from "react";
import { useEffect } from "react";

const PrintStatement = () => {
  const url = `${process.env.REACT_APP_BASE_URL}`;

  const { id } = useParams();
  const { getSpecificOrderbyId, GetSpecificCustomer, GetSpecificCouponbyId } =
    useContext(SignContext);
  const [OrderData, setOrderData] = useState([]);
  const [todayDate, setTodayDate] = useState("");
  const [ProductData, setProductData] = useState([]);
  const [CouponData, setCouponData] = useState({});
  const [CustomerInfo, setCustomerInfo] = useState({});
  const customerId = OrderData.customer;
  const ShippingCharge = 150;

  //Print the Invoice
  const printInvoice = () => {
    window.print();
  };

  const GetspecificOrderbyId = async (id) => {
    const res = await getSpecificOrderbyId(id);

    if (res.data.success) {
      setOrderData(res.data.orderWithProductDetails.order);
      setProductData(res.data.orderWithProductDetails.products);
    }
    console.log("My response", res);

    console.log("image url", url);
  };

  const getspecificCouponbyId = async (id) => {
    const res = await GetSpecificCouponbyId(id);
    console.log(res);
    if (res.success) {
      setCouponData(res.coupon);
    }
  };
  console.log("1245", CouponData);

  const getSpecificCustomer = async (customerId) => {
    try {
      console.log("invoked");
      const res = await GetSpecificCustomer(customerId);
      console.log("My customer response", res);
      if (res.data.success) {
        setCustomerInfo(res.data.customer);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const totalPrice = ProductData
    ? ProductData.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity);
      // const gst = parseFloat(item.tax);

      const discountedPrice = parseFloat(
        item.product.prices.discounted
          ? item.product.prices.discounted
          : item.product.prices.calculatedPrice
      );

      if (isNaN(quantity) || isNaN(discountedPrice)) {
        return acc; // Skip this item if it has invalid data
      }

      return acc + quantity * discountedPrice;
    }, 0)
    : null;

  const tPwithGST = ProductData
    ? ProductData.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity);
      const gst = parseFloat(item.product.gst);

      const discountedPrice = parseFloat(
        item.product.prices.discounted
          ? item.product.prices.discounted
          : item.product.prices.calculatedPrice
      );
      const totalPriceWithGST =
        quantity * discountedPrice + (quantity * discountedPrice * gst) / 100;

      if (isNaN(quantity) || isNaN(discountedPrice)) {
        return acc;
      }

      return acc + totalPriceWithGST;
    }, 0)
    : null;

  const shpChrg = ProductData
    ? ProductData.reduce((acc, item) => {
      // Ensure that item.quantity and item.discountedPrice are valid numbers
      let quantity = 0;
      quantity = quantity + parseFloat(item.product.shippingCharge);

      return quantity;
    }, 0)
    : null;

  useEffect(() => {
    GetspecificOrderbyId(id);
    if (customerId) {
      getSpecificCustomer(customerId);
    }
    getspecificCouponbyId(OrderData.couponCode);
    const getFormattedDate = () => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const today = new Date();
      return today.toLocaleDateString("en-US", options);
    };

    setTodayDate(getFormattedDate());
  }, [id, customerId, OrderData.couponCode]);

  document.title = "Invoice Details ";
  let totalQuantityCount = 0;

  if (OrderData && OrderData.products && OrderData.products.length > 0) {
    // Calculate total quantity count
    totalQuantityCount = OrderData.products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);
  }

  if (ProductData) {
    console.log("Me product", ProductData);
  }

  console.log("Setted customer info", CustomerInfo);

  console.log("Total proce", typeof totalPrice);
  console.log("gst", typeof tPwithGST);
  console.log("amount", typeof OrderData.totalAmount);
  let a =
    Number(totalPrice) +
    (Number(tPwithGST) - Number(totalPrice)) +
    150 -
    Number(OrderData.totalAmount);
  const discount = a.toFixed(2);
  console.log("aaaaaa", discount);
  return (
    <div>
      <section class="pt-4 vmobile-tag-kl">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h3 class="text-center inovice-mobile ">
                {" "}
                <span className="fs-4">Order Statement</span>{" "}
              </h3>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-area pt-4 pb-5">
        <div className="container">
          <div className="row m-0" id="printablediv">
            <div className="col-sm-12 checkout-login">
              <div className="row align-items-center">
                <div className="col-md-5">
                  <img
                    src={logo}
                    className="img-fluid center-block text-center"
                    style={{ width: 200 }}
                  />
                </div>
                <div className="col-md-7">
                  <div className="invoice-address">
                    <h4 className="mb-2">Pushti Shangar</h4>
                    <p>
                      {" "}
                      <strong>Address :</strong>  Pushtishangar<br />
                      103, VrajMadhurya Flats, Laxmi Colony 20,<br />
                      Behind Govardhannathji Haveli,<br />
                      Productivity road, <br />
                      Vadodara Gujarat 390007
                    </p>
                    <p>
                      {" "}
                      <strong>Customer Care Email :</strong>
                      <a href="mailto:pushtishangarsales@gmail.com">pushtishangarsales@gmail.com</a>

                    </p>
                    <p>
                      {" "}
                      <strong>Customer Care No. :</strong>
                      <a href="tel:+918980963151">+91 8980963151</a>

                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row mt-4">
                <div className="col-md-4">
                  <h5 className="order-ttl">Order Details </h5>
                  <table className="meta table table-bordered">
                    <tbody className="text-start">
                      <tr>
                        <th>Order Date</th>
                        <td>
                          {OrderData && OrderData.createdAt
                            ? OrderData.createdAt.slice(0, 10)
                            : "N/A"}
                        </td>
                      </tr>

                      <tr>
                        <th>Invoice No</th>
                        <td>{OrderData.invoiceNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-8">
                  <h5 className="order-ttl">Payment Details </h5>
                  <table className="meta table table-bordered">
                    <tbody className="text-start">
                      <tr>
                        <th>No of Items</th>
                        <td>{totalQuantityCount}</td>
                      </tr>
                      <tr>
                        <th>Payment Details</th>
                        <td>{OrderData.paymentMethod}</td>
                      </tr>
                      <tr>
                        <th>Payment status</th>
                        <td>{OrderData.status}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <hr />
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5 className="order-ttl">Billing Details </h5>
                  <table className="meta-2 table table-bordered">
                    <tbody className="text-start">
                      <tr>
                        <th>Name</th>
                        <td>{CustomerInfo.username}</td>
                      </tr>

                      <tr>
                        <th>Email Id</th>
                        <td>{CustomerInfo.email}</td>
                      </tr>
                      <tr>
                        <th>Mobile No</th>
                        <td>+91 {CustomerInfo.phone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h5 className="order-ttl xs-sp-add">Shipping Address </h5>
                  <table className="meta-2 table table-bordered">
                    <tbody className="text-start">
                      <tr>
                        <th>Name</th>
                        <td>
                          {OrderData.FirstName} {OrderData.LastName}
                        </td>
                      </tr>
                      <tr>
                        <th>Address </th>
                        <td>{OrderData.shippingAddress}</td>
                      </tr>

                      <tr>
                        <th>Mobile No</th>
                        <td>+91 {OrderData.phone}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <hr />
              <div className="row mt-4">
                <div className="col-sm-12">
                  <h2 className="order-ttl text-center">Order Summary </h2>
                  <div className="table table-responsive">
                    <table className="meta-1 table table-bordered order-summary mb-0">
                      <tbody className="text-start">
                        <tr>
                          <th>Sr.No</th>
                          <th style={{ width: "10%" }}>Image</th>
                          <th>Item Name</th>
                          <th>HSN</th>
                          <th>Unit Price</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-center">Tax</th>
                        </tr>
                        {ProductData.map((p, key) => (
                          <tr>
                            <td className="text-center">{key + 1}</td>
                            <td>
                              <div className="img-dlt text-center">
                                <img
                                  src={`${url}/products/${p.product.imageGallery[0]}`}
                                  width={80}
                                  className="img-responsive center-block"
                                  alt=""
                                />
                              </div>
                            </td>

                            <td>
                              <div className="description-p">
                                <p className="product-category">
                                  {p.product.name}
                                </p>
                              </div>
                            </td>
                            <td>{p.product.hsnCode}</td>
                            <td>{p.product.prices.calculatedPrice}</td>
                            <td className="text-center">{p.quantity}</td>
                            <td className="text-center">{p.product.gst}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <table className="meta-1 table table-bordered order-summary mb-0">
                      <tbody className="text-end">
                        <tr>
                          <td>Sub Total :</td>
                          <td className="text-end">₹ {totalPrice}</td>
                        </tr>
                        <tr>
                          <td>Tax :</td>
                          <td className="text-end">
                            ₹ {(tPwithGST - totalPrice).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td>Shipping Charge :</td>
                          <td className="text-end">
                            ₹ {ShippingCharge ? ShippingCharge : "0"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Discount <span className="text-muted"></span> : :
                          </td>
                          <td className="text-end">₹ {discount}</td>
                        </tr>
                        {/* <tr>
                                <td>Shipping Charge :</td>
                                <td className="text-end">$65.00</td>
                              </tr> */}

                        <tr className="border-top border-top-dashed">
                          <th scope="row">Total (₹) :</th>
                          <th className="text-end">
                            ₹ {OrderData.totalAmount}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row mt-4">
                <div className="col-sm-12">
                  <div className="mlr-20 offer-panel">
                    <p className="text-center" style={{ fontSize: 11 }}>
                      This is system generated invoice statement, It's not
                      required any Digital signature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="hstack gap-2 justify-content-end d-print-none mb-4">
        <Link to="#" onClick={printInvoice} className="btn btn-success">
          <i className="ri-printer-line align-bottom me-1"></i> Download Invoice
        </Link>
      </div>
    </div>
  );
};

export default PrintStatement;

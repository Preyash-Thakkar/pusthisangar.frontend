import React, { useState, Suspense } from "react";
import Header from "./Header";
import HomeSlider from "./HomeSlider";
import MobileSidebar from "./MobileSidebar";

// Lazy load components
const CatgoryMobileView = React.lazy(() => import("./CategotyMobile"));
const Category = React.lazy(() => import("./Category"));
const OfferPart = React.lazy(() => import("./OfferPart"));
const NewArrival = React.lazy(() => import("./NewArrival"));
const Shringar = React.lazy(() => import("./Shringar"));
const Silvervessel = React.lazy(() => import("./Silvervessel"));
const Sugandhi = React.lazy(() => import("./Sugandhi"));
const TopProducts = React.lazy(() => import("./TopProducts"));
const Subscribe = React.lazy(() => import("./Subscribe"));
const Featured = React.lazy(() => import("./Featured"));
const MidFooter = React.lazy(() => import("./MidFooter"));

const Home = () => {
  return (
    <div>
      <Header />
      <MobileSidebar />
      <HomeSlider />
      <div className="mobileCategoryDiv">
        <Suspense fallback={<div>Loading...</div>}>
          <CatgoryMobileView />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Category />
        <OfferPart />
        <NewArrival />
        <Shringar />
        <Silvervessel />
        <Sugandhi />
        <TopProducts />
        <Subscribe />
        <Featured />
        <MidFooter />
      </Suspense>
    </div>
  );
};

export default Home;

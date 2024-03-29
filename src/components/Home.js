import React, { useState } from "react";
import CatgoryMobileView from "./CategotyMobile";
import Category from "./Category";
import FeatureCategory from "./FeatureCategory";
import Featured from "./Featured";
import Header from "./Header";
import HomeSlider from "./HomeSlider";
import MidFooter from "./MidFooter";
import Silvervessel from "./Silvervessel";

import MobileSidebar from "./MobileSidebar";
import NewArrival from "./NewArrival";
import OfferPart from "./OfferPart";
import SeasonalProducts from "./SeasonalProducts";
import Shringar from "./Shringar";
import Subscribe from "./Subscribe";
import TopProducts from "./TopProducts";
import Vastra from "./Vastra";
import Deals_Of_the_day from "./Deals_Of_the_day";
import { SignState } from "../contextAPI/State/SignState";
import Sugandhi from "./Sugandhi";

const Home = () => {
  
  
  return (
    <div>
      <Header  />

      <MobileSidebar />
      <HomeSlider  />
      <div className="mobileCategoryDiv">


      <CatgoryMobileView />


      </div>
      {/* <FeatureCategory/> */}
      <Category />
      <OfferPart />
      <NewArrival />
      <Shringar />

      {/* <SeasonalProducts/> */}
      <Silvervessel />
      <Sugandhi />    
      {/* sugandhi category */}
      <TopProducts />
      <Subscribe />
      <Featured />
      <MidFooter />
    </div>
  );
};

export default Home;

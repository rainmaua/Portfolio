import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import NavbarCustom from "./components/navbar.component"; 
import Banner from "./components/banner.component"; 
import MainPage from "./components/main-page.component"; 
import CreateAccount from "./components/register.component"; 
import LoginAccount from "./components/login.component"; 
import Contact from "./components/contact.component"; 
import TodayQuote from "./components/today-quote.component";
import Search from "./components/search-book.component";
import Review from "./components/review.component"; 
import Footer from "./components/footer.component";

// import LogoutAccount from "./components/logout.component"; 
import './App.css'; 

function App() {
  // const apiKey = AIzaSyD2HkNyFW6hjZKs79SZo2BVvjPMVm7lPkM

  useEffect(() => {
  }, [])

  return (
    <BrowserRouter> 
        <NavbarCustom /> 
        <Banner />
        <br/> 
        <div className="container">

        <Routes> 
            <Route path="/" element={<MainPage/>} /> 
            <Route path="/search" element={<Search/>} />
            <Route path="/today_quote" element={<TodayQuote />} />
            <Route path="/login" element={<LoginAccount />}/>
            <Route path="/register" element={<CreateAccount />}/> 
            <Route path="/contact" element={<Contact />}/>
            <Route path="/review" element={<Review />} />           
        </Routes>
        </div>
        <Footer />
    </BrowserRouter>
    
  );
}




export default App;

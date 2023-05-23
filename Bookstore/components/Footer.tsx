import React from "react";

const Footer = () => {
  return (
    <footer className="sticky bottom-0">
      <div className="py-4 bg-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 font-thin">
            &copy; {new Date().getFullYear()} WuBooks.Inc
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

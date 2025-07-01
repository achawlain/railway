import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scroll > 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed scrollTopButton bottom-6 right-6 bg-[#f1f1f1] text-[#9b4b90] px-4 py-2 rounded-full shadow-lg hover:bg-[#ffff] transition"
        >
          ↑ Top
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;

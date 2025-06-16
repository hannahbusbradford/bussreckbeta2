// src/pages/Landing.jsx
import React from "react";
import tw from "twin.macro";
import Hero from "../components/hero/TwoColumnWithInput.js"; // Example Treact component
import Features from "../components/features/ThreeColSimple.js";
import Footer from "../components/footers/FiveColumnWithInputForm.js";

export default function Landing() {
  return (
    <div>
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

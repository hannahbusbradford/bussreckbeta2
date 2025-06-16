import React from "react";
import buswreckLogo from "../assets/bussreck-logo.png"; // adjust path if needed

export default function Home() {
  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            <img src={buswreckLogo} alt="Busswreck Logo" width="40" className="me-2" />
            Busswreck
          </a>
          <div>
            <a href="/login" className="btn btn-outline-primary me-2">Login</a>
            <a href="/signup" className="btn btn-primary">Sign Up</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to Busswreck</h1>
          <p className="lead text-muted">
            Vehicle diagnostics, real-time mechanic dispatch, and serious under-the-hood intelligence.
          </p>
          <a href="/signup" className="btn btn-primary btn-lg mt-3">Get Started</a>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="container my-5">
        <div className="row text-center">
          <div className="col-md-4">
            <i className="bi bi-gear-wide-connected fs-1 text-primary"></i>
            <h5 className="mt-3">Smart Diagnostics</h5>
            <p className="text-muted">We scan your car like a pro, instantly detecting issues others miss.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-truck fs-1 text-primary"></i>
            <h5 className="mt-3">Fast Dispatch</h5>
            <p className="text-muted">Our algorithm finds the closest qualified mechanic in seconds.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-shield-check fs-1 text-primary"></i>
            <h5 className="mt-3">Verified Mechanics</h5>
            <p className="text-muted">Background-checked, reviewed, and ready to help fast.</p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">What It Looks Like</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1589927986089-35812388d1c5"
                className="img-fluid rounded shadow-sm"
                alt="Mechanic Example"
              />
            </div>
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1610986603161-d2ecffb25229"
                className="img-fluid rounded shadow-sm"
                alt="Vehicle Scan Example"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="text-center py-5">
        <h2 className="fw-bold">Ready to rescue your ride?</h2>
        <p className="text-muted">It takes 30 seconds to get help. You can sign up for free.</p>
        <a href="/signup" className="btn btn-success btn-lg">Join Busswreck Now</a>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-top py-4 text-center text-muted">
        <small>&copy; 2025 Busswreck, Inc. All rights reserved.</small>
      </footer>
    </div>
  );
}

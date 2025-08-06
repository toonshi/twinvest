import React from 'react';
import { Routes, Route } from "react-router-dom";
import styles from "./style";
import {
  Billing,
  Business,
  CardDeal,
  Clients,
  CTA,
  Footer,
  Navbar,
  Stats,
  Testimonials,
  Hero,
  AuthSystem,
  Dashboard, // Add this import
} from "./components";

const HomePage = () => (
  <>
    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <Billing />
        <CardDeal />
        <Testimonials />
        <Clients />
        <CTA />
        <Footer />
      </div>
    </div>
  </>
);

const Apps = () => (
  <>
    <div className="bg-primary w-full overflow-hidden">
      <Routes>
        {/* Routes that need navbar */}
        <Route
          path="/"
          element={
            <>
              <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Navbar />
                </div>
              </div>
              <HomePage />
            </>
          }
        />
        <Route
          path="/auth"
          element={
            <>
              <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Navbar />
                </div>
              </div>
              <AuthSystem />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Navbar />
                </div>
              </div>
              <AuthSystem />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Navbar />
                </div>
              </div>
              <AuthSystem />
            </>
          }
        />

        {/* Dashboard route without navbar (has its own navigation) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  </>
);

export default Apps;

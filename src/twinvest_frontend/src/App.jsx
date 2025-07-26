import { useState } from "react";
import { twinvest_backend } from "declarations/twinvest_backend";
import Header from './sections/Header'
import Hero from "./sections/Hero";
import About from "./sections/About";

function App() {
  return (
    <main>
      <Header />
      <Hero />
      <About />
    </main>
  );
}

export default App;

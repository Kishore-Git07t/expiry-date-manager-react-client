import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onNavigate={onNavigate} />
      <main className="flex-grow">
        <HeroSection onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

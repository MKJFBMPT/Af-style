import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "AF STYLE | Luxury Fashion Maison",
  description = "Experience timeless elegance and curated excellence with AF STYLE. Discover the finest luxury fashion, tailored specifically for the modern connoisseur.",
  keywords = "luxury fashion, high-end clothing, AF Style Bangladesh, designer wear, virtual try-on fashion, premium boutique",
  image = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200", // ব্র্যান্ডের একটি মেইন ছবি
  url = window.location.href,
  type = "website"
}) => {
  const siteName = "AF STYLE Luxury Maison";
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* 1. Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AF STYLE" />
      <link rel="canonical" href={url} />

      {/* 2. Open Graph / Facebook / WhatsApp Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* 3. Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 4. Robots & Indexing */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      
      {/* 5. Theme Color for Browser Mobile Header */}
      <meta name="theme-color" content="#2B1B12" />
    </Helmet>
  );
};

export default SEO;
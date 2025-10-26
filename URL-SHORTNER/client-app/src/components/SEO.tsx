import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  keywords?: string;
  schemaData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Scissor — Shorten URLs Instantly",
  description = "Scissor is a sleek, fast, and privacy-friendly URL shortener. Create, track, and share links effortlessly. Also create beautiful link-in-bio pages.",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "https://www.scissor.site/og-image.png",
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  keywords = "url shortener, link shortener, short url, shorten link, free url shortener, link in bio, linktree alternative, link groups, qr code generator, create qr code, qr code maker",
  schemaData,
}) => {
  const finalCanonical = canonical || window.location.href;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalOgUrl = ogUrl || window.location.href;
  const finalTwitterTitle = twitterTitle || title;
  const finalTwitterDescription = twitterDescription || description;
  const finalTwitterImage = twitterImage || ogImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Scissor" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:site" content="@scissor" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Scissor" />

      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      )}
    </Helmet>
  );
};

export default SEO;

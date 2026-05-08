# Case Study SEO Optimization Plan

## What Each Page Needs:

1. ✅ Meta description
2. ✅ Canonical tag  
3. ✅ Favicon link
4. ✅ Open Graph tags
5. ✅ Twitter Card tags
6. ✅ H1 accessibility text
7. ✅ CreativeWork schema
8. ✅ Breadcrumb schema
9. ✅ Update sitemap.xml

---

## 1. Bundaberg CeRUMony

### Meta Tags (add after `<title>`)
```html
<meta name="description" content="Bundaberg Rum CeRUMony wedding campaign - videography, editing, and colour grading for a crowd-sourced wedding that generated 24.8M earned impressions and 167 pieces of media coverage.">
<link rel="canonical" href="https://josephgmedia.com/work/bundaberg.html">
<link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
```

### Open Graph (add after canonical)
```html
<!-- Open Graph -->
<meta property="og:title" content="Bundaberg CeRUMony Wedding Campaign | Joseph G Media">
<meta property="og:description" content="Videography, editing, and colour grading for Bundaberg Rum's crowd-sourced wedding campaign. 24.8M earned impressions.">
<meta property="og:image" content="https://josephgmedia.com/src/assets/images/featured-work/bundaberg_feature-image_1.jpg">
<meta property="og:url" content="https://josephgmedia.com/work/bundaberg.html">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Bundaberg CeRUMony Wedding Campaign">
<meta name="twitter:description" content="Videography and post-production for Bundaberg Rum's viral wedding campaign.">
<meta name="twitter:image" content="https://josephgmedia.com/src/assets/images/featured-work/bundaberg_feature-image_1.jpg">
```

### H1 Text (add inside `<h1 class="nav__logo-wrap">`)
```html
<span class="sr-only">Joseph G Media - Bundaberg CeRUMony Case Study</span>
```

### Schema Markup (add before `</head>`)
```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Bundaberg CeRUMony - The Wedding That Fans Built",
  "description": "Videography, editing, and colour grading for Bundaberg Rum's crowd-sourced wedding campaign that generated 24.8M earned impressions",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  },
  "datePublished": "2023",
  "keywords": "videography, video editing, colour grading, branded content, wedding film",
  "image": "https://josephgmedia.com/src/assets/images/featured-work/bundaberg_feature-image_1.jpg"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://josephgmedia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://josephgmedia.com/work.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Bundaberg CeRUMony",
      "item": "https://josephgmedia.com/work/bundaberg.html"
    }
  ]
}
</script>
```

---

## 2. Gryff - Losing Touch

### Meta Tags
```html
<meta name="description" content="Gryff - Losing Touch music video. Director, producer, DOP, editor, and colourist for an 80s synthwave music video shot across Sydney featuring neon cityscape visuals.">
<link rel="canonical" href="https://josephgmedia.com/work/gryff.html">
<link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
```

### Open Graph
```html
<!-- Open Graph -->
<meta property="og:title" content="Gryff - Losing Touch Music Video | Joseph G Media">
<meta property="og:description" content="Director, DOP, and editor for Gryff's 80s synthwave music video shot across Sydney.">
<meta property="og:image" content="https://josephgmedia.com/src/assets/images/featured-work/gryff_feature-image_1.jpg">
<meta property="og:url" content="https://josephgmedia.com/work/gryff.html">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Gryff - Losing Touch Music Video">
<meta name="twitter:description" content="80s synthwave music video shot across Sydney's neon cityscape.">
<meta name="twitter:image" content="https://josephgmedia.com/src/assets/images/featured-work/gryff_feature-image_1.jpg">
```

### H1 Text
```html
<span class="sr-only">Joseph G Media - Gryff Music Video Case Study</span>
```

### Schema Markup
```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Gryff - Losing Touch (ft. Max Cruise)",
  "description": "80s synthwave music video directed, shot, and edited for Gryff",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  },
  "datePublished": "2024",
  "keywords": "music video, director, cinematography, video editing, colour grading, synthwave",
  "image": "https://josephgmedia.com/src/assets/images/featured-work/gryff_feature-image_1.jpg"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://josephgmedia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://josephgmedia.com/work.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Gryff - Losing Touch",
      "item": "https://josephgmedia.com/work/gryff.html"
    }
  ]
}
</script>
```

---

## 3. NLA Enlighten

### Meta Tags
```html
<meta name="description" content="NLA Enlighten Festival 2025 - Design lead for large-scale projection mapping at the National Library of Australia using AI animation and After Effects.">
<link rel="canonical" href="https://josephgmedia.com/work/nla-enlighten.html">
<link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
```

### Open Graph
```html
<!-- Open Graph -->
<meta property="og:title" content="NLA Enlighten Festival Projection | Joseph G Media">
<meta property="og:description" content="Design lead for AI-powered projection mapping at National Library of Australia, Enlighten Festival 2025.">
<meta property="og:image" content="https://josephgmedia.com/src/assets/images/featured-work/nla_feature-image_1.jpg">
<meta property="og:url" content="https://josephgmedia.com/work/nla-enlighten.html">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NLA Enlighten Festival Projection">
<meta name="twitter:description" content="Large-scale projection mapping for Enlighten Festival 2025.">
<meta name="twitter:image" content="https://josephgmedia.com/src/assets/images/featured-work/nla_feature-image_1.jpg">
```

### H1 Text
```html
<span class="sr-only">Joseph G Media - NLA Enlighten Case Study</span>
```

### Schema Markup
```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "NLA Enlighten Festival 2025",
  "description": "Large-scale projection mapping for the National Library of Australia using AI animation workflows",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  },
  "datePublished": "2025",
  "keywords": "projection mapping, AI animation, ComfyUI, AnimatedDiff, motion design, Enlighten Festival",
  "image": "https://josephgmedia.com/src/assets/images/featured-work/nla_feature-image_1.jpg"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://josephgmedia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://josephgmedia.com/work.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "NLA Enlighten",
      "item": "https://josephgmedia.com/work/nla-enlighten.html"
    }
  ]
}
</script>
```

---

## 4. Porsche x Dr Jack

### Meta Tags
```html
<meta name="description" content="Porsche x Dr Jack collaboration - VFX design, 3D animation, and colour grading for Iron Man-style holographic UI and tech environment.">
<link rel="canonical" href="https://josephgmedia.com/work/porsche-drjack.html">
<link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
```

### Open Graph
```html
<!-- Open Graph -->
<meta property="og:title" content="Porsche x Dr Jack VFX Project | Joseph G Media">
<meta property="og:description" content="VFX design and 3D animation for Porsche and Dr Jack collaboration featuring holographic UI.">
<meta property="og:image" content="https://josephgmedia.com/src/assets/images/featured-work/drjack_feature-image_1.jpg">
<meta property="og:url" content="https://josephgmedia.com/work/porsche-drjack.html">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Porsche x Dr Jack VFX Project">
<meta name="twitter:description" content="Holographic UI design and VFX for Porsche collaboration.">
<meta name="twitter:image" content="https://josephgmedia.com/src/assets/images/featured-work/drjack_feature-image_1.jpg">
```

### H1 Text
```html
<span class="sr-only">Joseph G Media - Porsche x Dr Jack Case Study</span>
```

### Schema Markup
```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Dr Jack x Porsche",
  "description": "VFX design, 3D animation, and colour grading for Iron Man-style holographic environment",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  },
  "datePublished": "2022",
  "keywords": "VFX, 3D animation, Cinema 4D, Octane Render, motion tracking, colour grading",
  "image": "https://josephgmedia.com/src/assets/images/featured-work/drjack_feature-image_1.jpg"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://josephgmedia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://josephgmedia.com/work.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Porsche x Dr Jack",
      "item": "https://josephgmedia.com/work/porsche-drjack.html"
    }
  ]
}
</script>
```

---

## 5. RAMS Construction

### Meta Tags
```html
<meta name="description" content="RAMS Home Loans construction finance series - 3D animation, art direction, editing, and mixing for educational content featuring Tom Williams and a Lego-world environment.">
<link rel="canonical" href="https://josephgmedia.com/work/rams-construction.html">
<link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
```

### Open Graph
```html
<!-- Open Graph -->
<meta property="og:title" content="RAMS Construction Finance Series | Joseph G Media">
<meta property="og:description" content="3D animation and art direction for RAMS Home Loans educational content series.">
<meta property="og:image" content="https://josephgmedia.com/src/assets/images/featured-work/rams_feature-image_1.jpg">
<meta property="og:url" content="https://josephgmedia.com/work/rams-construction.html">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="RAMS Construction Finance Series">
<meta name="twitter:description" content="3D Lego-world animation for construction finance education.">
<meta name="twitter:image" content="https://josephgmedia.com/src/assets/images/featured-work/rams_feature-image_1.jpg">
```

### H1 Text
```html
<span class="sr-only">Joseph G Media - RAMS Construction Case Study</span>
```

### Schema Markup
```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "RAMS - Tom's Building Blocks",
  "description": "3D animation, art direction, and post-production for RAMS Home Loans construction finance content series",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  },
  "datePublished": "2022",
  "keywords": "3D animation, Cinema 4D, Octane Render, art direction, video editing, sound mixing",
  "image": "https://josephgmedia.com/src/assets/images/featured-work/rams_feature-image_1.jpg"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://josephgmedia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://josephgmedia.com/work.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "RAMS Construction",
      "item": "https://josephgmedia.com/work/rams-construction.html"
    }
  ]
}
</script>
```

---

## 6. Weightless - A State of Mind

### Meta Tags
```html
<meta name="description" content="Weightless EP artwork and release package - 3D design, animation, and art direction for album cover, stage visualiser, and promotional assets for Australian metal band.">
<link rel="canonical" href="https://josephgmedia.com/work/weightless.html">
<link rel="icon" type="image/svg+xml" href="../favicon.svg?v=2" />
```

### Open Graph
```html
<!-- Open Graph -->
<meta property="og:title" content="Weightless - A State of Mind EP Artwork | Joseph G Media">
<meta property="og:description" content="3D artwork and visual identity for Weightless EP - cover art, stage visualiser, and release campaign.">
<meta property="og:image" content="https://josephgmedia.com/src/assets/images/featured-work/weightless_feature-image.jpg">
<meta property="og:url" content="https://josephgmedia.com/work/weightless.html">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Weightless - A State of Mind EP Artwork">
<meta name="twitter:description" content="3D album artwork and visual identity for Weightless EP.">
<meta name="twitter:image" content="https://josephgmedia.com/src/assets/images/featured-work/weightless_feature-image.jpg">
```

### H1 Text
```html
<span class="sr-only">Joseph G Media - Weightless EP Artwork Case Study</span>
```

### Schema Markup
```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Weightless - A State of Mind",
  "description": "3D artwork, design, and animation for EP release package including cover art, stage visualiser, and promotional assets",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  },
  "datePublished": "2023",
  "keywords": "album artwork, 3D design, Cinema 4D, Octane Render, motion graphics, stage visualiser",
  "image": "https://josephgmedia.com/src/assets/images/featured-work/weightless_feature-image.jpg"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://josephgmedia.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://josephgmedia.com/work.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Weightless - A State of Mind",
      "item": "https://josephgmedia.com/work/weightless.html"
    }
  ]
}
</script>
```

---

## Sitemap Update

Add these 6 URLs to sitemap.xml:

```xml
  <url>
    <loc>https://josephgmedia.com/work/bundaberg.html</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://josephgmedia.com/work/gryff.html</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://josephgmedia.com/work/nla-enlighten.html</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://josephgmedia.com/work/porsche-drjack.html</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://josephgmedia.com/work/rams-construction.html</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://josephgmedia.com/work/weightless.html</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
```

---

**Ready to implement?** This is the complete SEO package for all 6 case studies.

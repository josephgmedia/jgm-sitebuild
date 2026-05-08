# Schema Markup Implementation Guide

## Implementation Instructions

Add these JSON-LD schema blocks to your HTML pages inside the `<head>` section, just before the closing `</head>` tag.

---

## 1. Organization Schema (Homepage)

Add to `index.html` in the `<head>`:

```html
<!-- Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Joseph G Media",
  "url": "https://josephgmedia.com",
  "logo": "https://josephgmedia.com/src/assets/images/logos/JGMedia_Logo.svg",
  "description": "Motion design and video production specializing in broadcast, advertising, and live events in Sydney, Australia",
  "email": "info@josephgmedia.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Sydney",
    "addressRegion": "NSW",
    "addressCountry": "AU"
  },
  "founder": {
    "@type": "Person",
    "name": "Joseph Giuffrida",
    "jobTitle": "Senior Motion Designer",
    "sameAs": [
      "https://www.linkedin.com/in/jgiuffrida93/",
      "https://www.instagram.com/josephgmedia"
    ]
  },
  "sameAs": [
    "https://www.instagram.com/josephgmedia",
    "https://www.youtube.com/@josephgmedia",
    "https://www.linkedin.com/in/jgiuffrida93/"
  ]
}
</script>
```

---

## 2. Person Schema (About Section)

Add to `index.html` after the Organization schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Joseph Giuffrida",
  "alternateName": "Joseph G Media",
  "jobTitle": "Senior Motion Designer",
  "description": "Motion designer, 3D animator, videographer, and multimedia artist with 10+ years experience in broadcast, advertising, and live events",
  "worksFor": {
    "@type": "Organization",
    "name": "The Electric Canvas"
  },
  "alumniOf": [
    {
      "@type": "Organization",
      "name": "Saatchi & Saatchi"
    },
    {
      "@type": "Organization",
      "name": "Omnicom"
    }
  ],
  "knowsAbout": [
    "Motion Design",
    "3D Animation",
    "Video Production",
    "After Effects",
    "Cinema 4D",
    "Video Editing",
    "Sound Design",
    "Music Composition"
  ],
  "url": "https://josephgmedia.com",
  "email": "info@josephgmedia.com",
  "sameAs": [
    "https://www.linkedin.com/in/jgiuffrida93/",
    "https://www.instagram.com/josephgmedia",
    "https://www.youtube.com/@josephgmedia"
  ]
}
</script>
```

---

## 3. WebSite Schema (Search Box - Optional)

Add to `index.html` for site search functionality (if you add search later):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Joseph G Media",
  "url": "https://josephgmedia.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://josephgmedia.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## 4. VideoObject Schema (For Showreels)

If you embed showreels on the work page, add to `work.html`:

### Motion Design Reel

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Motion Design Showreel 2026",
  "description": "Motion graphics and 2D animation showreel featuring work for major brands including Qantas, Toyota, Nivea, and more",
  "thumbnailUrl": "https://josephgmedia.com/src/assets/images/reel-thumbs/motion-showreel.jpg",
  "uploadDate": "2026-01-01",
  "contentUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "embedUrl": "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  "duration": "PT2M30S",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  }
}
</script>
```

### 3D Animation Reel

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "3D Animation Showreel 2026",
  "description": "3D animation and modeling showreel showcasing Cinema 4D, Blender, and motion graphics work",
  "thumbnailUrl": "https://josephgmedia.com/src/assets/images/reel-thumbs/3d-showreel.jpg",
  "uploadDate": "2026-01-01",
  "contentUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "embedUrl": "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  "duration": "PT2M15S",
  "creator": {
    "@type": "Person",
    "name": "Joseph Giuffrida"
  }
}
</script>
```

---

## 5. BreadcrumbList Schema (Work Page)

Add to `work.html` for breadcrumb navigation:

```html
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
    }
  ]
}
</script>
```

---

## Validation

After implementing, test your schema markup:

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema.org Validator:** https://validator.schema.org/
3. **Google Search Console:** Check "Enhancements" section after deployment

---

## Implementation Checklist

- [ ] Add Organization schema to index.html
- [ ] Add Person schema to index.html
- [ ] Add VideoObject schema to work.html (if videos embedded)
- [ ] Add BreadcrumbList schema to work.html
- [ ] Validate with Google Rich Results Test
- [ ] Deploy and monitor in Google Search Console

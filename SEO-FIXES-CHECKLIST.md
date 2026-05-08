# Complete SEO Fixes Checklist

## ✅ COMPLETED

- [x] Create robots.txt with AI crawler management
- [x] Create sitemap.xml
- [x] Add meta descriptions (index.html, work.html)
- [x] Add canonical tags (both pages)
- [x] Add Open Graph tags (both pages)
- [x] Add Twitter Card tags (both pages)
- [x] Optimize title tags (both pages)
- [x] Add Organization schema markup (index.html)
- [x] Add Person schema markup (index.html)
- [x] Add fetchpriority="high" to hero brick image
- [x] Add width/height to hero brick image
- [x] Remove misleading claims (award-winning, creative director)
- [x] Update copy to be honest and accurate

---

## 🔴 HIGH PRIORITY - ✅ COMPLETED!

### 1. Add dimensions + decoding to monitor images (index.html)
**Lines 241-254**

- [x] design.webp - add `width="1920" height="1080" decoding="async"`
- [x] web.webp - add `width="1920" height="1080" decoding="async"`
- [x] genai.webp - add `width="1920" height="1080" decoding="async"`
- [x] photo-1.webp - add `width="1920" height="1080" decoding="async"`
- [x] photo-2.webp - add `width="1920" height="1080" decoding="async"`
- [x] photo-3.webp - add `width="1920" height="1080" decoding="async"`

### 2. Add dimensions + decoding to about image (index.html)
**Line 299**

- [x] about.webp - add `width="1920" height="1080" decoding="async"`

### 3. Add dimensions + decoding to hero sign images (index.html)
**Lines ~103-105**

- [x] hero-sign-fg-off.webp - add `width="1920" height="1080"`
- [x] hero-sign-fg-on.webp - add `width="1920" height="1080"`

### 4. Add dimensions + decoding to ALL brand logos (index.html)
**Lines 332-387** (~52 logo images, duplicated in marquee)

- [x] Add `width="120" height="60" decoding="async"` to all 52 logo `<img>` tags

### 5. Improve alt text on images
**Current generic alt text needs to be more descriptive:**

- [x] Monitor images: Add specific descriptions
- [x] About image: Make more descriptive
- [x] Logo images: Change from just "Brand" to "Brand - Client logo"

### 6. Add H1 text for SEO & accessibility
**Both index.html and work.html**

- [x] Add `<span class="sr-only">` text inside `<h1>` tags
- [x] Add `.sr-only` CSS class to stylesheet

### 7. Add hero sign images dimensions (index.html)
**Lines ~103-105**

- [x] Add width/height to both sign images

---

## 🟠 MEDIUM PRIORITY

### 8. Add BreadcrumbList schema to work.html
- [x] Add schema markup before closing `</head>` tag

### 9. Add VideoObject schema (if showreels are embedded)
- [x] Checked - No embedded videos found (JavaScript-loaded gallery)
- [ ] SKIP - Not applicable

### 10. Expand About section content
**Current: ~400 words, Target: 600+**

- [ ] Add specific tools/software list
- [ ] Add creative process description
- [ ] Add notable project outcomes
- [ ] Consider adding FAQ section

### 11. Optimize work.html gallery images
- [x] Checked - Gallery is JavaScript-loaded, no static HTML images to optimize
- [ ] SKIP - Not applicable in current implementation

---

## 🟢 LOW PRIORITY (Future)

### 12. Content expansion
- [ ] Create blog section
- [ ] Write case studies for major projects
- [ ] Add testimonials section
- [ ] Create services/process page

### 13. Technical enhancements
- [ ] Set up Google Search Console
- [ ] Submit sitemap to GSC
- [ ] Monitor Core Web Vitals
- [ ] Create video sitemap
- [ ] Consider IndexNow for Bing

---

## Next Steps

We'll work through HIGH PRIORITY items first, then move to MEDIUM.

**Current focus:** Image optimization (items 1-5)

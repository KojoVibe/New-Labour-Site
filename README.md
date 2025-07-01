# Labour Department of Ghana - Official Website

This is the official website for the Labour Department of Ghana, designed to provide comprehensive information about labour services, laws, and resources for workers, employers, and the general public.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Layout**: Clean, government-appropriate design using Ghana's national colors
- **Comprehensive Sections**:
  - About the Department
  - Services offered (Employment, Labour Inspection, Industrial Relations, etc.)
  - Labour Laws & Regulations
  - Forms & Applications (downloadable PDFs)
  - Regional Offices directory with search functionality
  - Latest News & Updates
  - Contact Information
- **Interactive Elements**: Smooth scrolling, animated counters, form validation
- **Accessibility**: Keyboard navigation support and proper ARIA labels

## Getting Started

### Prerequisites
- A modern web browser
- Web server (for local development)

### Installation

1. Clone or download the repository
2. Add the Labour Department logo to the `assets/` folder as `labour-department-logo.png`
3. Open `index.html` in a web browser or serve via a local web server

### Quick Setup

```bash
# If you have Python installed
python -m http.server 8000

# If you have Node.js installed
npx http-server

# Then visit http://localhost:8000
```

## File Structure

```
/
├── index.html              # Main homepage
├── forms.html              # Forms & Applications page
├── regional-offices.html   # Regional Offices directory
├── styles.css              # Complete styling and layout
├── script.js               # Interactive functionality
├── sitemap.xml             # SEO sitemap
├── assets/                 # Images and media files
│   ├── README.md           # Instructions for image placement
│   └── labour-department-logo.png  # Department logo
└── README.md               # This documentation
```

## Customization

### Adding the Logo
1. Save the official Labour Department logo as `labour-department-logo.png` in the `assets/` folder
2. Ensure the image is at least 200x200px and preferably has a transparent background

### Adding Images
- Replace placeholder image paths in `index.html` with actual images
- Follow the guidelines in `assets/README.md` for image specifications

### Updating Content
- Modify the HTML content in `index.html` to reflect current information
- Update contact details, statistics, and news items as needed
- Add or modify services in the Services section

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (basic functionality)

## Contact

For questions about this website, please contact the Labour Department of Ghana:
- Email: info@labour.gov.gh
- Phone: +233 30 266 5421

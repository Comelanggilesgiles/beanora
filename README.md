# Beanora

Good coffee brings better days: a warm, animated coffee shop landing page with a working order bag and table reservations.

## Description

Beanora is a single-page website for a neighborhood coffee shop. Visitors can browse signature drinks, customize and add them to a bag, check out for pickup, read the shop story, watch a short film, and request a table. Everything runs in the browser, so there is no backend to set up. Orders and reservations are demos and are saved only on the visitor's device.

## Key features

- Hero section with an animated entrance and a signature drinks menu
- Drink customizer: hot or iced, size, milk choice, and quantity, with live price updates
- Shopping bag drawer that remembers items between visits and supports pickup checkout with a confirmation receipt
- Table reservation form with date, time, and guest count validation
- Story modal and a "behind the counter" film modal
- Accessible by design: skip link, focus trapping in dialogs, keyboard support, and reduced-motion support
- Fully responsive from phones to wide desktops

## Screenshot

![Beanora landing page](/pic/beanora.png)


## Install and run (about 5 minutes)

You need [Node.js](https://nodejs.org) version 20 or newer (this includes npm).

1. Clone the repository:
   ```
   git clone https://github.com/Comelanggilesgiles/beanora.git
   ```
2. Move into the project folder:
   ```
   cd beanora
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open the address shown in the terminal (usually http://localhost:5173).

## Usage

- Click **Order my favorite** on a drink, choose your options, then **Add to my bag**.
- Open the bag icon in the header to change quantities and check out for pickup.
- Scroll to **Book Your Cozy Spot** to request a table.

Build for production:

```
npm run build
npm run preview
```

The build output is written to `dist/`.

## Customize

- Drinks and prices: `src/data.ts`
- Page content and sections: `src/App.tsx`
- Order bag and drink options: `src/components/Ordering.tsx`
- Reservation form: `src/components/ReservationForm.tsx`
- Styles and colors: `src/index.css`
- Images: `public/images/`

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion (animations)
- Lucide React (icons)
- Google Fonts: DM Sans, DM Serif Display, Dancing Script

## Project structure

```
beanora/
  index.html
  package.json
  vite.config.ts
  public/
    favicon.svg
    images/
  src/
    App.tsx
    data.ts
    index.css
    main.tsx
    components/
      Modal.tsx
      Ordering.tsx
      ReservationForm.tsx
    utils/
      cn.ts
```

## Notes

- Checkout and reservations are demos. No payment is taken and no email is sent.
- The behind-the-scenes film is streamed from Pexels and needs an internet connection.

## License

Add a `LICENSE` file (for example MIT) before sharing the project publicly.

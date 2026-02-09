# HTTP-TO
Online HTTP request converter.

Convert raw `HTTP` requests into executable client code. Paste a request on the left and get a ready-to-run snippet on the right.

## Demo
Try it here: [https://alfredosalzillo.me/http-to/](https://alfredosalzillo.me/http-to/)

## Features
- Live conversion as you type
- Syntax highlighting with CodeMirror
- One-click copy button
- Error feedback for invalid HTTP input
- Persistent last conversion (stored locally in your browser)

## Supported output
- JavaScript `fetch`

> Roadmap: more targets (e.g., Dart `http`, Node libraries, curl) — contributions welcome!

## Tech stack
- Next.js (App Router)
- React 19
- Material UI (MUI)
- CodeMirror 6
- TypeScript
- Biome (lint/format)

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000
3. Build for production:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

## Project structure
- `app/` — Next.js App Router pages and layout
- `components/` — UI components (e.g., converter, copy button)
- `plugins/` — CodeMirror language definitions and HTTP converters
- `hooks/` — Reusable hooks (e.g., localStorage state)
- `lib/` — Shared utilities (reserved)

## Contributing
Issues and pull requests are welcome. If you plan a larger change (like adding a new converter), please open an issue first to discuss scope and approach.

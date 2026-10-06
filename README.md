# JalDrishti AI

### Geospatial Intelligence for Smarter Watershed Development

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026_Prototype-blue.svg)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem_ID-SIH26015-orange.svg)](https://www.sih.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-Rural_Development_(DoLR)-emerald.svg)](https://rural.nic.in/)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Gemini_3.8_Flash-indigo.svg)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-React_19_+_Express_TypeScript-blue.svg)](https://react.dev/)

---

## 1. Project Overview

**JalDrishti AI** is a geospatial intelligence decision-support platform engineered for **Smart India Hackathon 2026** under Problem Statement **SIH26015**. Developed for the **Department of Land Resources (DoLR)**, **Ministry of Rural Development**, the platform interprets geo-coded multi-spectral imagery to visualize, analyze, and monitor watershed conditions—empowering watershed planners, Project Implementing Agencies (PIA), and rural development officers to plan Ridge-to-Valley interventions effectively.

> **Important Hackathon Disclaimer:**  
> JalDrishti AI is a prototype decision-support tool. It does **not** replace statutory physical ground surveys mandated under the Common Guidelines for Watershed Development Projects. All remote-sensing datasets, satellite indices, and health scores demonstrated are simulated for evaluation.

---

## 2. SIH 2026 Problem Statement Details

- **Problem Statement ID:** SIH26015
- **Problem Statement Title:** Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes
- **Organization:** Ministry of Rural Development
- **Department:** Department of Land Resources (DoLR)
- **Category:** Software
- **Theme:** Agriculture, FoodTech & Rural Development
- **Tagline:** *"See the Watershed. Understand the Change. Plan Better."*

---

## 3. The Problem

Watershed development is essential for the sustainable management of land, water, soil, and biomass in rainfed and semi-arid regions of India. However, traditional monitoring faces critical challenges:
- High resource requirements and slow cycle times for physical field visits across rugged topography
- Limited spatial visibility across upper ridges, steep escarpments, and ephemeral drainage networks
- Inability to quickly detect multi-temporal changes (e.g. drying water bodies, silt chokes, or biomass degradation)
- Difficulty synthesizing complex remote-sensing indicators into clear, prioritized engineering interventions for field teams

---

## 4. Proposed Solution & Architecture

JalDrishti AI creates an automated, user-friendly geospatial pipeline:

```
GEO-CODED SATELLITE RASTER
           ↓
IMAGE PROCESSING & CALIBRATION (GSD 10m, WGS84)
           ↓
GIS ANALYSIS (LULC, NDVI, NDWI, D-8 HYDROLOGY)
           ↓
LAND / WATER / VEGETATION DETECTION
           ↓
WATERSHED HEALTH SCORING (72/100 Composite Index)
           ↓
MULTI-TEMPORAL CHANGE DETECTION (2024 vs 2026)
           ↓
ISSUE & RISK IDENTIFICATION (Gully Erosion, Siltation)
           ↓
AI-ASSISTED INSIGHTS (Google Gemini 3.8 Flash via Backend)
           ↓
RIDGE-TO-VALLEY RECOMMENDATIONS
           ↓
OFFICIAL DoLR ASSESSMENT REPORT (PDF / Print Ready)
```

---

## 5. Key Implemented Features

### 1. Dashboard
- Monitored basins counter (12 pilot watersheds), detected water bodies (38 units), average vegetation coverage (64%), and high-priority attention zones (7 areas)
- 5-stage interactive workflow pipeline
- Overview metrics for selected basin (Area, Elevation, Drainage Density, Health Score)

### 2. Watershed Selection
- Multi-tier administrative selection: **State → District → Block → Watershed ID**
- Authentic Indian demo basins across 4 agro-climatic zones:
  - **WS-MH-001 (Indrayani Upper Catchment, Pune, Maharashtra)**: High relief basalt plateau
  - **WS-RJ-004 (Aravalli Foothills, Udaipur, Rajasthan)**: Semi-arid, seasonal water stress
  - **WS-MP-007 (Narmada Sub-basin, Dhar, Madhya Pradesh)**: Vertisols, intense agriculture
  - **WS-KA-012 (Palar-Pennar Micro-Catchment, Kolar, Karnataka)**: Tank cascade system

### 3. Geo-Coded Image Inspector
- Displays spatial metadata: Sensor (Sentinel-2B / Resourcesat-2A), Resolution (10m GSD), Bounding box coordinates, Projection (EPSG:4326)
- Spectral Band Composite toggle: Natural Color (RGB), False Color Infrared (CIR/NIR) showing chlorophyll reflection, and NDVI Map
- Zoom and pan controls with simulated GeoTIFF upload validation (MIME check, size limit <= 10MB)

### 4. GIS Feature Extraction & Hydrology
- **Land Use / Land Cover (LULC):** 7-category breakdown (Agriculture 42%, Forest 22%, Grassland 11%, Barren 10%, Water 8%, Built-up 5%, Other 2%)
- **Vegetation Health & NDVI:** Categorized into Healthy (42%), Moderate (16%), Low (6%), and Stress (8%) with plain-language NDVI explanation
- **Water Body Inventory:** Lists lakes, ponds, percolation tanks, and reservoirs with storage condition (Full, Moderate, Low, Dry)
- **Drainage Analysis:** 42.4 km network length, 1.71 km/km² stream density, and 3 siltation bottlenecks flagged
- **Soil Moisture Proxy:** High (32%), Moderate (44%), and Low (24%) with field-assessment caveats
- **Composite Health Score:** 72 / 100 with "Improving" trajectory across 4 sub-indices

### 5. Multi-Temporal Change Detection
- Interactive Before / After satellite swipe slider (March 2024 Baseline vs March 2026 Current)
- Synchronized side-by-side mode
- Quantitative delta metrics: Vegetation (+6.0%), Surface Water (+8.3%), Built-up (+0.8%), Barren (-4.5%)

### 6. Watershed Issues & Development Recommendations
- Priority classification: High (3 areas), Medium (5 areas), Low (9 areas)
- Issue cards with location, affected hectares, confidence percentage, and suggested DoLR action
- Ridge-to-Valley framework: Continuous Contour Trenches (CCT), Loose Boulder Check Dams (LBCD), Gabions, and Afforestation

### 7. AI Watershed Insights (Google Gemini)
- Integrated on server-side via `@google/genai` using model `gemini-3.8-flash`
- Generates structured decision support:
  - Executive Assessment
  - What Changed
  - Where It Changed
  - Why It Matters
  - Field Officer Ground Verification Checklist
  - Prioritized Ridge-to-Valley Actions
- Interactive query input ("Ask JalDrishti AI about this watershed")
- Zero API key exposure to browser

### 8. Official Assessment Report
- DoLR-formatted printable Watershed Assessment Report
- Contains geomorphology, LULC tables, hydrological summary, multi-temporal deltas, and sign-off blocks
- One-click print / PDF export

### 9. 1-Click Interactive SIH Demo Walkthrough
- Dedicated "RUN SIH DEMO" tour guiding evaluators through the 13-stage journey in under 60 seconds

---

## 6. Implemented Backend REST APIs

| HTTP Method | Route | Description |
|---|---|---|
| `GET` | `/api/watersheds` | List all monitored watersheds |
| `GET` | `/api/watersheds/:id` | Get details and boundary coordinates for a watershed |
| `GET` | `/api/images/:watershedId` | Get geo-coded raster metadata and spectral assets |
| `POST` | `/api/analysis/start` | Trigger automated 7-stage GIS processing pipeline |
| `GET` | `/api/land-use/:watershedId` | Fetch LULC classification metrics |
| `GET` | `/api/vegetation/:watershedId` | Fetch NDVI canopy and health distribution |
| `GET` | `/api/water-bodies/:watershedId` | Fetch water bodies inventory and retention levels |
| `GET` | `/api/drainage/:watershedId` | Fetch drainage features, density, and stream lines |
| `GET` | `/api/soil-moisture/:watershedId` | Fetch estimated soil moisture categories |
| `GET` | `/api/changes/:watershedId` | Fetch multi-temporal change detection metrics |
| `GET` | `/api/issues/:watershedId` | Fetch detected spatial issues and priority ratings |
| `POST` | `/api/ai/insights` | Run server-side Gemini 3.8 Flash model for spatial reasoning |
| `POST` | `/api/reports` | Compile official DoLR Watershed Assessment Report |
| `POST` | `/api/images/upload` | Secure image upload validation (MIME, size, filename sanitization) |
| `GET` | `/api/health` | Service health status and environment check |

---

## 7. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Leaflet (interactive maps)
- **Backend:** Node.js, Express, tsx
- **AI / LLM:** `@google/genai` TypeScript SDK with `gemini-3.8-flash` (strictly server-side)
- **Build Tool:** Vite 8

---

## 8. Environment Setup & Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# GEMINI_API_KEY: Injected automatically by AI Studio or set manually
GEMINI_API_KEY="your_api_key_here"

# PORT: Defaults to 3000
PORT=3000
```

### Running Locally

```bash
# Install dependencies
npm install

# Start full-stack development server (Express + Vite)
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Security & Safety Measures

1. **Server-Side API Key Protection:** The Gemini API key is accessed exclusively via `process.env.GEMINI_API_KEY` on the Node.js backend. No API keys are leaked to the client bundle.
2. **File Upload Hardening:** Strict MIME type whitelist (`image/tiff`, `image/png`, `image/jpeg`, `image/webp`), 10MB size ceiling, and filename sanitization to eliminate directory traversal.
3. **Statutory Integrity:** Prominent labels and disclaimers on every view declaring simulated demo data for decision-support prototyping.

---

*Developed for Smart India Hackathon 2026 • Ministry of Rural Development, Department of Land Resources (DoLR)*

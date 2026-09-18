# 🏟️ Tiqora Event Details Page — Master Architecture & Phased Roadmap

This document defines the architecture, domain models, UX specifications, and step-by-step phased execution plan for the **Tiqora Event Details Page** (`/events/details/[slug]`).

The design draws inspiration from the provided reference mockups for sports/football matches, adapts polymorphically for general events (concerts, theater, festivals), and outlines an incremental, chunk-by-chunk engineering rollout.

---

## 📑 Table of Contents

1. [Visual References Breakdown](#1-visual-references-breakdown)
2. [Domain Distinction: Sports / Football vs. Other Categories](#2-domain-distinction-sports--football-vs-other-categories)
3. [The Staged Chunk-by-Chunk Strategy](#3-the-staged-chunk-by-chunk-strategy)
4. [Overview Tab: The H2H & Matchday Countdown Combo](#4-overview-tab-the-h2h--matchday-countdown-combo)
5. [Seating Architecture: From 2.5D Interactive Map to Full 3D Stadium](#5-seating-architecture-from-25d-interactive-map-to-full-3d-stadium)
6. [Schedule & Fixtures: Static First &rarr; External API Adapter](#6-schedule--fixtures-static-first--external-api-adapter)
7. [Database Schema (Supabase) for Sports & Venues](#7-database-schema-supabase-for-sports--venues)
8. [Component Hierarchy & Directory Structure](#8-component-hierarchy--directory-structure)
9. [Detailed Execution Phases (Chunks 1–6)](#9-detailed-execution-phases-chunks-16)

---

## 1. Visual References Breakdown

### Image 1: Match Schedule & Fixtures Tab
- **Match Hero**:
  - Live status indicator: `● LIVE` red badge with pulse animation.
  - Match title: `Liverpool vs Arsenal` with league subtitle (`Premier League 2025/26`).
  - Metadata badges: Kickoff time (`Aug 16, 2025 · 8:00 PM`), Stadium & city (`Anfield Stadium · Liverpool, UK`), League & round (`Premier League · Round 1`).
  - Match summary narrative.
  - Team matchup cards: Home crest + "Liverpool" (Home) `VS` Away crest + "Arsenal" (Away).
  - Atmospheric dark stadium night banner with floodlights and pitch overlay.
- **Schedule Content (2-Column Layout)**:
  - **Left (~70%)**: Date-range dropdown selector, matches grouped by date (`Saturday, Aug 16, 2025`, `Saturday, Aug 23, 2025`), fixture rows with time, live status, team crests, and `View Details >` action.
  - **Right (~30%)**: `Filter Matches` card (Competition, Team, Date Range, `Apply Filters` button) and `Premier League` promo card with link `View All Matches →`.

### Image 2: Overview & Ticket Selection Tab
- **Overview Left Column (~65%)**:
  - **Featured Media**: Replaced with the **H2H Rivalry & Matchday Countdown Command Center** (see Section 4).
  - **About the Event**: Atmospheric narrative describing the rivalry, stakes, and stadium energy.
  - **Quick Amenity Badges (4-grid)**:
    - ⏱ `Full match` — 90 minutes
    - 🍴 `Food & drinks` — Available
    - 🛡 `Security` — On site
    - 🅿 `Parking` — Nearby
  - **Venue Summary Card**: Stadium name, full address, and `View on Map >` action.
  - **Urgency Alert Banner**: *"Don't miss out! This is a high-demand match. Tickets are selling fast"* with `🔥 Limited Availability` badge.
- **Right Column (~35%) — Ticket Selection Drawer**:
  - **Perforated Ticket Cards** with ticket-stub cuts, barcode aesthetics, and `AVAILABLE` stamps:
    - `VIP PASS` ($459/person): Red header accent, premium seats, lounge access, food & beverage included.
    - `GROUP PASS` ($796/person): 4+ people, shared access benefits, sections 12–15.
    - `MATCH / CATEGORY PASS` ($249/person): General admission / category seating.
    - `DAY PASS` ($89/person): Standard entry access.
  - **Checkout Action Bar**:
    - Quantity stepper: `[-] 1 [+]`
    - High-emphasis CTA: `🎟 Reserve Ticket` (Red primary button)
    - Guarantee badge: *"Free cancellation up to 24 hours before the event."*

### Image 3: Seats & Venue Tab (Interactive Stadium Map)
- **Left Column (~68%) — Stadium Map**:
  - `Select Your Seats`: "Choose the area and pick your seats on the map."
  - **Interactive Football Stadium SVG Pitch & Seating Bowl**:
    - Stand orientation markers: `NORTH STAND`, `SOUTH STAND`, `EAST STAND`, `WEST STAND`.
    - Authentic football pitch markings: center circle, penalty boxes, goalposts, corner flags.
    - Tiered color-coded stand sections with section numbers (e.g., 101–108 VIP, 201–208 Cat 2, 115–120 Cat 1, 215–220 Cat 4, 122–126 Cat 3).
    - Legend with color dots, tier names, and price points.
    - Prompt: *"Click on a section to view available seats and select your preferred ones."*
- **Right Column (~32%) — Venue & Policy Cards**:
  - **Venue Details**:
    - Exterior night photo of Anfield Stadium.
    - Full address: `Anfield Rd, Liverpool L4 0TH, UK`.
    - Key metrics: Capacity (`53,394`), Parking (`Available`), Transport (`Nearby`), Accessibility (`Yes`).
    - `View on Map >` link.
  - **Important Information**:
    - Gates open 2 hours before the match.
    - All bags are subject to security checks.
    - No outside food or drinks allowed.
    - Re-entry is not permitted.

---

## 2. Domain Distinction: Sports / Football vs. Other Categories

Football matches have specialized requirements that do not fit a generic concert or conference template:

| Feature / Section | ⚽ Football / Sports Matches | 🎵 Concerts & Music Festivals | 🎭 Theater & Performing Arts | 💼 Conferences & Workshops |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Identity** | **Matchup**: Team A vs Team B, Home/Away indicator, League/Competition & Round, Live match clock | **Headliner**: Artist or Band name, World Tour title, Supporting acts, Genre tags | **Production**: Show name, Playwright/Director, Performing company, Cast | **Summit**: Conference name, Host organization, Theme / Industry track |
| **Venue & Seating** | **Stadium Seating Bowl**: 4 Stands (North, South, East, West) encircling a football pitch with tiered sections | **Auditorium / Arena / Lawn**: Front of Stage (Golden Circle), GA Floor, Seated Risers, VIP Terrace | **Theater Hall**: Orchestra / Stalls, Royal Circle, Upper Circle, Balcony, Private Boxes | **Convention Hall**: Main Stage GA, Breakout Workshop Rooms, VIP Networking area |
| **Schedule / Agenda Tab** | **League Fixtures**: Match calendar for the competition, opponent fixtures, filter by team/gameweek | **Festival Timetable / Set Times**: Stage 1 vs Stage 2 lineups with artist performance times | **Show Dates & Matinees**: Performance calendar (Evening vs Matinee shows), cast dates | **Program Agenda**: Multi-day schedule, Keynote tracks, Panel discussions, Coffee breaks |
| **Amenity Highlights** | 90 min regulation match, stadium parking, bag policy, gate opening times, fan zones | Sound level warning, age restriction (e.g. 18+), cashless wristbands, camping passes | Intermission length (e.g. 20 min), formal dress code, cloakroom, late seating policy | CPE/CPD credits, WiFi included, lunch & catering, slide deck & recording access |
| **Ticket Passes** | VIP Hospitality Lounge, Cat 1 (Longside Central), Cat 2 (Longside Upper), Cat 3 (Shortside) | VIP Meet & Greet, Early Entry Standing, General Admission Lawn, Reserved Seated | Box Seat, Premium Stalls, Circle, Upper Tier | Early Bird, All-Access Pass, Student Pass, Workshop-only add-on |

---

## 3. The Staged Chunk-by-Chunk Strategy

To deliver a high-quality product without getting blocked by external dependencies, we follow this prioritized sequence:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     CHUNK-BY-CHUNK ROADMAP                             │
└────────────────────────────────────────────────────────────────────────┘
                                 │
     [CHUNK 1] Database & Type Foundation (Supabase + TypeScript)
     • Define tables: venues, sports_events, ticket_tiers, stadium_stands
     • Establish mock datasets for Liverpool vs Arsenal & concerts
                                 │
                                 ▼
     [CHUNK 2] Core Event Details UI & Hero Section
     • Dynamic route: /events/details/[slug]
     • Sports Match Hero (Team A vs Team B, live badge, stadium banner)
     • Fallback Standard Event Hero for non-sports
                                 │
                                 ▼
     [CHUNK 3] Overview Tab: H2H + Countdown Command Center
     • Replace video with combined H2H stats & Matchday Countdown
     • 4-grid amenities, venue address, and urgency alert
     • Ticket Selection Drawer (perforated stub cards, quantity stepper)
                                 │
                                 ▼
     [CHUNK 4] Schedule & Fixtures Tab (Static First)
     • Date-grouped fixtures list, team crests, status badges
     • Sidebar filter card (Competition, Team, Date Range)
     • Clean abstraction ready for external football API injection
                                 │
                                 ▼
     [CHUNK 5] Interactive Stadium Seating (2.5D SVG First)
     • North/South/East/West stands around green pitch
     • Section tooltips, color-coded tiers, selection sync with tickets
     • Anfield stadium details & matchday rules card
                                 │
                                 ▼
     [CHUNK 6] Advanced Evolution: 3D Stadium & External Live API
     • 3D Stadium WebGL viewport (Three.js / React Three Fiber)
     • Stand zoom camera animation & individual row/seat booking grid
     • Plug in live external Football API for real-time fixtures
```

---

## 4. Overview Tab: The H2H & Matchday Countdown Combo

Instead of a generic video placeholder, the Overview tab features a dedicated **Matchday Command Center**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MATCHDAY COMMAND CENTER                              │
├────────────────────────────────────────────────────────────────────────┤
│  ⏱ COUNTDOWN TO KICKOFF                                                │
│  [ 03 Days ]  :  [ 14 Hours ]  :  [ 25 Mins ]  :  [ 10 Secs ]          │
│                                                                        │
│  📅 MATCHDAY RUN-OF-PLAY                                               │
│  16:00 Fan Zone Opens ➔ 18:00 Gates Open ➔ 19:15 Warmups ➔ 20:00 Kickoff│
├────────────────────────────────────────────────────────────────────────┤
│  ⚔️ HEAD-TO-HEAD (LAST 5 MEETINGS)                                      │
│  • Liverpool  2 - 1  Arsenal  [Aug 2024]                               │
│  • Arsenal    3 - 1  Liverpool  [Feb 2024]                             │
│  • Liverpool  1 - 1  Arsenal  [Dec 2023]                               │
│                                                                        │
│  📈 CURRENT FORM                                                       │
│  Liverpool: [W] [W] [D] [W] [W]      Arsenal: [W] [W] [W] [D] [W]     │
│                                                                        │
│  ⭐ KEY PLAYER SPOTLIGHT                                               │
│  Mohamed Salah (14 Goals, 8 Ast)  VS  Bukayo Saka (11 Goals, 10 Ast)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Seating Architecture: From 2.5D Interactive Map to Full 3D Stadium

### The 2-Level Level-of-Detail (LOD) Pattern
Anfield has **54,000 seats**. Rendering all 54,000 individual 3D seat meshes simultaneously would crash web browsers and mobile phones. The industry standard (used by Ticketmaster & FIFA) uses a **2-Level approach**:

1. **Macro Level (Stadium Bowl)**:
   - In Chunk 5: High-precision SVG interactive stadium map with 4 stands, tiered color sections, hover highlights, and section pricing.
   - In Chunk 6: Upgrades to interactive 3D WebGL model (`.glb`) with Three.js orbit controls, floodlight shaders, and stand glow on hover.
2. **Micro Level (Section Seat Grid)**:
   - When the fan clicks "Kop Stand — Section 104", the view focuses into the specific section's seat grid:
   - Rows A through J, Seats 1 through 24.
   - 🟢 Available (`#10B981`), 🔴 Reserved/Sold (`#EF4444`), 🔵 Selected (`#2563EB`).
   - "View from Seat" modal showing a realistic pitch-perspective photo.

---

## 6. Schedule & Fixtures: Static First &rarr; External API Adapter

### Architecture for Plug-and-Play Integration
The schedule tab will be backed by a clean TypeScript adapter interface:

```typescript
export interface IFootballScheduleProvider {
  getFixtures(teamId?: string, competitionId?: string): Promise<MatchFixture[]>;
}
```

- **In Chunk 4**: Backed by `StaticFootballScheduleProvider` reading from rich mock data.
- **In Chunk 6**: Backed by `ApiFootballScheduleProvider` (Server Action / Route Handler calling external endpoints like `https://v3.football.api-sports.io/fixtures`).
- The UI component (`sports-fixtures-tab.tsx`) consumes the interface and requires zero redesign when switching from mock to live API!

---

## 7. Database Schema (Supabase) for Sports & Venues

To store real venue, stand, and ticket data in Supabase:

```sql
-- 1. Venues Table
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                  -- e.g. 'Anfield Stadium'
    slug TEXT UNIQUE NOT NULL,           -- e.g. 'anfield-stadium'
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    capacity INT NOT NULL,               -- e.g. 53394
    parking_info TEXT DEFAULT 'Available nearby',
    public_transport TEXT DEFAULT 'Buses & Sandhills station',
    accessibility BOOLEAN DEFAULT true,
    image_url TEXT,
    model_3d_url TEXT,                   -- URL to stadium.glb file
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sports Events Extension Table
CREATE TABLE public.sports_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE RESTRICT,
    competition TEXT NOT NULL,           -- e.g. 'Premier League'
    season TEXT NOT NULL,                -- e.g. '2025/26'
    round TEXT NOT NULL,                 -- e.g. 'Round 1'
    home_team_name TEXT NOT NULL,
    home_team_logo TEXT NOT NULL,
    away_team_name TEXT NOT NULL,
    away_team_logo TEXT NOT NULL,
    kickoff_time TIMESTAMPTZ NOT NULL,
    is_live BOOLEAN DEFAULT false,
    h2h_data JSONB,                      -- Past meetings and form stats
    timeline_milestones JSONB            -- Gate open, warmup, kickoff times
);

-- 3. Stadium Stands & Sections Table
CREATE TABLE public.stadium_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    stand_name TEXT NOT NULL,            -- 'North Stand', 'South Kop', etc.
    section_code TEXT NOT NULL,          -- '101', '102', '204'
    tier_category TEXT NOT NULL,         -- 'VIP', 'CAT_1', 'CAT_2', 'CAT_3', 'CAT_4'
    color_hex TEXT NOT NULL,             -- '#EF4444', '#3B82F6', etc.
    base_price NUMERIC(10, 2) NOT NULL,
    total_seats INT NOT NULL DEFAULT 100,
    available_seats INT NOT NULL DEFAULT 100,
    mesh_identifier TEXT                 -- Matches 3D glTF mesh name
);

-- 4. Ticket Tiers Table
CREATE TABLE public.ticket_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                  -- 'VIP PASS', 'GROUP PASS', etc.
    badge_text TEXT,
    price NUMERIC(10, 2) NOT NULL,
    perks JSONB NOT NULL DEFAULT '[]',
    section_info TEXT,
    status TEXT NOT NULL DEFAULT 'available'
);
```

---

## 8. Component Hierarchy & Directory Structure

```
src/
├── app/
│   └── events/
│       ├── [category]/
│       │   └── page.tsx                              # Category listing explorer (e.g. /events/sports)
│       └── details/
│           └── [slug]/
│               ├── page.tsx                          # Dynamic Event Details Route (RSC)
│               └── loading.tsx                       # Shimmer skeleton loader
│
├── components/
│   └── event-details/
│       ├── event-details-shell.tsx                   # Client orchestrator (tab switching, ticket state)
│       │
│       ├── hero/
│       │   ├── sports-match-hero.tsx                 # Team A vs Team B, live badge, stadium photo
│       │   └── standard-event-hero.tsx               # Performer/Tour poster, category tag, date/venue
│       │
│       ├── tabs/
│       │   ├── event-tab-navigation.tsx              # Overview | Seats & Venue | Schedule | FAQ
│       │   │
│       │   ├── overview/
│       │   │   ├── event-overview-tab.tsx            # Left column wrapper
│       │   │   ├── matchday-command-center.tsx       # Countdown + Milestones + H2H Stats + Form
│       │   │   ├── event-amenities-grid.tsx          # 4-card quick amenities grid
│       │   │   ├── event-venue-preview-card.tsx      # Venue address & quick map CTA
│       │   │   └── event-scarcity-alert.tsx          # High-demand urgency banner
│       │   │
│       │   ├── venue/
│       │   │   ├── sports-stadium-map.tsx            # Interactive SVG Football pitch & 4 stands
│       │   │   ├── venue-metrics-card.tsx            # Capacity, parking, transport, accessibility
│       │   │   ├── venue-policies-card.tsx           # Gates open, bag checks, re-entry rules
│       │   │   └── stadium-3d-viewport.tsx           # Three.js 3D WebGL stadium (Chunk 6)
│       │   │
│       │   ├── schedule/
│       │   │   ├── sports-fixtures-tab.tsx           # Match fixtures grouped by date
│       │   │   ├── sports-fixtures-filter.tsx        # Competition, Team, and Date filter card
│       │   │   ├── league-promo-card.tsx             # League standings / promo widget
│       │   │   └── event-agenda-tab.tsx              # Timetable / Lineup for concerts & conferences
│       │   │
│       │   └── faq/
│       │       └── event-faq-tab.tsx                 # Accordion FAQ & ticketing terms
│       │
│       └── checkout/
│           ├── ticket-pass-card.tsx                  # Ticket stub with perforated border & barcode
│           ├── ticket-quantity-stepper.tsx           # [-] count [+]
│           └── ticket-checkout-sidebar.tsx           # Right column sticky checkout card
```

---

## 9. Detailed Execution Phases (Chunks 1–6)

### Chunk 1: Database & Type Foundation (In Progress)
- [ ] Add extended TypeScript interfaces (`EventDetail`, `TicketTier`, `StadiumSection`, `MatchFixture`, `H2HData`, `MatchMilestone`) in `src/types/events.ts`.
- [ ] Populate rich mock data in `src/lib/events-data.ts` for:
  - `liverpool-vs-arsenal` (full football match, stadium stands, ticket tiers, H2H, countdown, fixtures).
  - A comparison music event (e.g. `the-weeknd-after-hours`).
- [ ] Create route `src/app/events/details/[slug]/page.tsx` with skeleton `loading.tsx`.

### Chunk 2: Sports Match Hero & Global Navigation
- [ ] Build `sports-match-hero.tsx` (Liverpool vs Arsenal crests, `● LIVE` badge, kickoff clock, Anfield floodlight backdrop).
- [ ] Build `standard-event-hero.tsx` for non-sports events.
- [ ] Build `event-tab-navigation.tsx` (`Overview`, `Seats & Venue`, `Schedule`, `FAQ`).

### Chunk 3: Overview Tab (H2H + Countdown Command Center) & Ticket Sidebar
- [ ] Build `matchday-command-center.tsx` combining:
  - Live countdown timer (`03d : 14h : 25m : 10s`).
  - Matchday timeline milestones (Fan Zone &rarr; Gates Open &rarr; Warmups &rarr; Kickoff).
  - Head-to-Head past 5 meetings + Form indicators + Player spotlight.
- [ ] Build `event-amenities-grid.tsx` (90 mins, food, security, parking) and scarcity banner.
- [ ] Build `ticket-checkout-sidebar.tsx` with perforated ticket-stub cards, quantity stepper, and red `Reserve Ticket` button.

### Chunk 4: Schedule / Fixtures Tab (Static with API-Ready Architecture)
- [ ] Build `sports-fixtures-tab.tsx` displaying date-grouped matches with kickoff times and status badges.
- [ ] Build `sports-fixtures-filter.tsx` (Competition, Team, Date Range) and `league-promo-card.tsx`.
- [ ] Provide adapter abstraction ready for external football API integration.

### Chunk 5: Interactive Stadium Seating Map (2.5D SVG + Venue Details)
- [ ] Implement `sports-stadium-map.tsx`: SVG pitch with North/South/East/West stands, tiered color-coded sections, hover tooltips, and ticket sync.
- [ ] Implement `venue-metrics-card.tsx` and `venue-policies-card.tsx`.

### Chunk 6: Advanced Upgrades (Full 3D Stadium & External Live API)
- [ ] Integrate Three.js / React Three Fiber for 3D stadium bowl (.glb) with camera orbit and stand fly-in.
- [ ] Interactive 2D Seat Grid for row/seat booking.
- [ ] Connect external Football API for live scores and fixtures.

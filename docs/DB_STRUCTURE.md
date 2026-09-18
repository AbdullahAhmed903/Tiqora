# 🗄️ Tiqora Database Structure & Relational Diagrams

This document serves as the official, living schema reference and relational diagram repository for the **Tiqora** database (PostgreSQL on Supabase).

> [!NOTE]
> **Schema Management Policy**: Database schemas and tables are managed directly in the Supabase Console. This document tracks current tables, relational integrity, data types, constraints, and planned schema expansions.

---

## 📑 Table of Contents

1. [Visual Relationships & Cardinality Diagram](#-visual-relationships--cardinality-diagram)
2. [Relational Rules: Cardinality & Participation Explained](#-relational-rules-cardinality--participation-explained)
3. [Relational Integrity Matrix](#-relational-integrity-matrix)
4. [Entity-Relationship Diagram (ERD)](#-entity-relationship-diagram-erd)
5. [High-Level Domain Architecture](#-high-level-domain-architecture)
6. [Tables Data Dictionary](#-tables-data-dictionary)
   - [auth.users (Supabase Managed)](#1-authusers-supabase-auth)
   - [public.profiles (User Accounts)](#2-publicprofiles-user-accounts)
   - [public.categories (Event Categories)](#3-publiccategories-event-categories)
   - [public.subcategories (Sub-categories)](#4-publicsubcategories-sub-categories)
   - [storage.buckets (category-images)](#5-storagebuckets-category-images)
   - [public.organizer_permissions](#6-publicorganizer_permissions)
   - [public.admin_audit_logs](#7-publicadmin_audit_logs)
7. [Custom Enums & Types](#-custom-enums--types)
8. [Planned Schema Roadmap](#-planned-schema-roadmap-upcoming-tables)
9. [Update Procedure](#-how-to-update-this-document)

---

## 🔗 Visual Relationships & Cardinality Diagram

The diagram below specifically illustrates **Cardinality** (`1:1`, `1:N`, `M:N`) and **Participation Constraints** (**Total / Mandatory** vs. **Partial / Optional**) using graphical entity shapes (rectangles), relational actions (diamonds), and double/dashed connector lines:

<div align="center">
  <img src="./db-diagram.svg" alt="Tiqora Database Relational Diagram" width="100%" />
</div>

<br/>

> [!TIP]
> You can also open the raw vector graphic directly: [db-diagram.svg](./db-diagram.svg).

<details>
<summary><b>Click to view Markdown Mermaid Code</b></summary>

```mermaid
flowchart LR
    subgraph AuthLayer ["🔐 Authentication & Core Profile"]
        direction TB
        AU["<b>auth.users</b><br/><i>(Supabase Auth Base)</i><br/>PK: id"]
        P["<b>public.profiles</b><br/><i>(Users Table)</i><br/>PK: id<br/>FK: id &rarr; auth.users.id"]
    end

    subgraph GovernanceLayer ["🛡️ Permissions & Governance"]
        direction TB
        OP["<b>public.organizer_permissions</b><br/>PK: id<br/>FK: user_id &rarr; profiles.id"]
        AL["<b>public.admin_audit_logs</b><br/>PK: id<br/>FK: admin_id &rarr; profiles.id<br/>FK: target_user_id &rarr; profiles.id"]
    end

    subgraph CatalogLayer ["🎪 Event Catalog"]
        direction TB
        C["<b>public.categories</b><br/>PK: id<br/>name, slug, pic, icon,<br/>small_description"]
        SC["<b>public.subcategories</b><br/>PK: id<br/>FK: category_id &rarr; categories.id<br/>name, slug, icon, is_published"]
        E["<b>public.events</b><br/><i>(Planned Table)</i><br/>PK: id<br/>FK: category_id &rarr; categories.id<br/>FK: subcategory_id &rarr; subcategories.id<br/>FK: organizer_id &rarr; profiles.id"]
    end

    %% Active Relations with Detailed Labels
    AU ===|"<b>1 : 1</b><br/><b>Total Participation (Mandatory)</b><br/>Both entities must exist<br/>ON DELETE CASCADE"| P

    P -.->|"<b>1 : N</b><br/><b>Partial Participation (Optional)</b><br/>A profile has 0..N permissions<br/>FK: user_id | CASCADE"| OP

    P -.->|"<b>1 : N</b><br/><b>Partial Participation (Optional)</b><br/>An admin performs 0..N audit logs<br/>FK: admin_id | CASCADE"| AL

    P -.->|"<b>0..1 : N</b><br/><b>Partial Participation (Optional)</b><br/>User may be targeted in 0..N logs<br/>FK: target_user_id | SET NULL"| AL

    %% Subcategory Relation
    C -.->|"<b>1 : N</b><br/><b>Partial on Category, Total on Subcategory</b><br/>Category has 0..N subcategories<br/>FK: category_id | CASCADE"| SC

    %% Planned Relation to Category & Subcategory
    C -.->|"<b>1 : N</b><br/><b>Partial on Category, Total on Event</b><br/>Category has 0..N events<br/>Event must have 1 category"| E
    SC -.->|"<b>0..1 : N</b><br/><b>Partial Participation (Optional)</b><br/>Subcategory has 0..N events"| E
    P -.->|"<b>1 : N</b><br/><b>Partial Participation (Optional)</b><br/>Organizer organizes 0..N events"| E

    %% Styling
    classDef core fill:#1d4ed8,stroke:#60a5fa,stroke-width:2px,color:#ffffff;
    classDef secondary fill:#047857,stroke:#34d399,stroke-width:2px,color:#ffffff;
    classDef subcatalog fill:#0d9488,stroke:#2dd4bf,stroke-width:2px,color:#ffffff;
    classDef auxiliary fill:#27272a,stroke:#71717a,stroke-width:1.5px,color:#f4f4f5;
    classDef planned fill:#18181b,stroke:#a1a1aa,stroke-dasharray: 4 4,stroke-width:1.5px,color:#d4d4d8;

    class AU,P core;
    class C secondary;
    class SC subcatalog;
    class OP,AL auxiliary;
    class E planned;
```
</details>

---

## 📐 Relational Rules: Cardinality & Participation Explained

In relational database modeling, relationships have two primary dimensions: **Cardinality Ratio** and **Participation Modality**.

### 1. `1 : 1` Total Participation (Mandatory &harr; Mandatory)
* **Entities**: `auth.users` &harr; `public.profiles`
* **Rule**:
  - Every authenticated user in `auth.users` **must** have exactly one corresponding row in `public.profiles`.
  - A profile cannot exist without a valid `auth.users` record (`profiles.id` is both a Primary Key and Foreign Key referencing `auth.users(id)`).
  - Deleting the auth account triggers an `ON DELETE CASCADE`, deleting the profile automatically.

### 2. `1 : N` Partial Participation (Optional &rarr; Mandatory)
* **Entities**: `public.profiles` &rarr; `public.organizer_permissions`
* **Rule**:
  - **Parent (`profiles`) is Partial / Optional**: A normal fan (`role = 'user'`) has `0` rows in `organizer_permissions`. Only organizers have rows.
  - **Child (`organizer_permissions`) is Total / Mandatory**: An organizer permission record **must** belong to an existing user (`user_id NOT NULL`).

### 3. `1 : N` Partial Participation with `SET NULL`
* **Entities**: `public.profiles` &rarr; `public.admin_audit_logs` (`target_user_id`)
* **Rule**:
  - A profile may be targeted `0` times (regular compliant user) or many times.
  - An audit log does not always target an account (e.g. system configuration change where `target_user_id IS NULL`).
  - If a targeted user profile is ever deleted, the audit log remains for compliance with `target_user_id` set to `NULL` (`ON DELETE SET NULL`).

### 4. `1 : N` Category to Subcategories (Active Structure)
* **Entities**: `public.categories` &rarr; `public.subcategories`
* **Rule**:
  - **Parent (`categories`) is Partial / Optional**: A parent category can exist without any subcategories (`0..N`).
  - **Child (`subcategories`) is Total / Mandatory**: Every subcategory **must** belong to an existing parent category (`category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE`).
  - **Cascading Deletion**: Deleting a parent category automatically deletes all associated subcategories (`ON DELETE CASCADE`).
  - **Scoped Slugs**: Slugs are unique per parent category via `CONSTRAINT subcategories_category_slug_unique UNIQUE (category_id, slug)`.

### 5. `1 : N` Category to Events (Planned Structure)
* **Entities**: `public.categories` &rarr; `public.events`
* **Rule**:
  - **Category is Partial / Optional**: A new category (e.g. "Theatre") can be created before any events are scheduled (`0` events initially).
  - **Event is Total / Mandatory**: Every event created in the system **must** belong to exactly `1` category (`category_id UUID NOT NULL REFERENCES categories(id)`).

---

## 📋 Relational Integrity Matrix

| Parent Table | Child Table | Relationship Type | Parent Participation | Child Participation | Foreign Key Column | On Delete Action | Business Semantics |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `auth.users` | `public.profiles` | **1 : 1** | **Total** (Mandatory) | **Total** (Mandatory) | `profiles.id` &rarr; `auth.users(id)` | `CASCADE` | Extends auth accounts with profile bio, role, and avatar. |
| `public.profiles` | `public.organizer_permissions` | **1 : N** | **Partial** (0..N) | **Total** (1..1) | `organizer_permissions.user_id` &rarr; `profiles.id` | `CASCADE` | Users have 0 or many role-scoped permissions. |
| `public.profiles` | `public.organizer_permissions` | **1 : N** | **Partial** (0..N) | **Partial** (0..1) | `organizer_permissions.granted_by` &rarr; `profiles.id` | `SET NULL` | Admin who granted permission. Retained if admin is removed. |
| `public.profiles` | `public.admin_audit_logs` | **1 : N** | **Partial** (0..N) | **Total** (1..1) | `admin_audit_logs.admin_id` &rarr; `profiles.id` | `CASCADE` | Administrator responsible for performing the logged action. |
| `public.profiles` | `public.admin_audit_logs` | **1 : N** | **Partial** (0..N) | **Partial** (0..1) | `admin_audit_logs.target_user_id` &rarr; `profiles.id` | `SET NULL` | User affected by admin action; nullable for general actions. |
| `public.categories` | `public.subcategories` | **1 : N** | **Partial** (0..N) | **Total** (1..1) | `subcategories.category_id` &rarr; `categories.id` | `CASCADE` | Subdivides parent category into niche genres or leagues (e.g. Football &rarr; Premier League). Cascades on parent deletion. |
| `public.categories` | `public.events` *(Planned)* | **1 : N** | **Partial** (0..N) | **Total** (1..1) | `events.category_id` &rarr; `categories.id` | `RESTRICT` | Category has 0 or more events. An event must have 1 category. |
| `public.subcategories` | `public.events` *(Planned)* | **1 : N** | **Partial** (0..N) | **Partial** (0..1) | `events.subcategory_id` &rarr; `subcategories.id` | `SET NULL` | Optional subcategory assignment for fine-grained filtering. |

---

## 📊 Entity-Relationship Diagram (ERD)

The following Mermaid ER diagram maps table columns, primary keys (`PK`), foreign keys (`FK`), and unique constraints (`UK`):

```mermaid
erDiagram
    %% Crow's Foot Notation:
    %% ||--|| : Exactly 1 to Exactly 1 (1:1 Mandatory)
    %% ||--o{ : 1 Mandatory to 0..N Optional (1:N Partial)
    %% |o--o{ : 0..1 Optional to 0..N Optional

    AUTH_USERS ||--|| PROFILES : "1:1 (Mandatory)"
    PROFILES ||--o{ ORGANIZER_PERMISSIONS : "1:N (0..N permissions)"
    PROFILES ||--o{ ADMIN_AUDIT_LOGS : "1:N (Admin performs 0..N logs)"
    PROFILES |o--o{ ADMIN_AUDIT_LOGS : "0..1:N (Targeted in 0..N logs)"
    CATEGORIES ||--o{ SUBCATEGORIES : "1:N (0..N subcategories)"

    AUTH_USERS {
        uuid id PK "Supabase internal user ID"
        varchar email "User primary email"
        timestamptz created_at "Registration timestamp"
    }

    PROFILES {
        uuid id PK,FK "References auth.users(id) ON DELETE CASCADE"
        text username UK "Unique handle (min 3 chars, lowercase idx)"
        text email "User contact email"
        text full_name "Full legal or display name"
        text phone_number "Contact telephone number"
        text avatar_url "Profile avatar image URL"
        date date_of_birth "Birth date for verification"
        user_role role "user | organizer | admin"
        user_status status "active | suspended"
        timestamptz created_at "Account creation timestamp"
        timestamptz updated_at "Last profile update timestamp"
    }

    CATEGORIES {
        uuid id PK "Primary key (gen_random_uuid())"
        text name "Category display name (e.g. Football)"
        text slug UK "URL-friendly slug (e.g. football)"
        text pic "Cover/Hero image URL"
        text icon "Lucide icon identifier or SVG path"
        text small_description "Brief summary of category"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Last update timestamp"
    }

    SUBCATEGORIES {
        uuid id PK "Primary key (gen_random_uuid())"
        uuid category_id FK "References public.categories(id) ON DELETE CASCADE"
        text name "Subcategory display name (e.g. Premier League)"
        text slug "URL-friendly slug (scoped unique per category)"
        text icon "Lucide icon identifier (default 'Tag')"
        boolean is_published "Visibility toggle (draft / published)"
        integer display_order "Ordering priority within parent"
        timestamptz created_at "Creation timestamp"
        timestamptz updated_at "Last update timestamp"
    }

    ORGANIZER_PERMISSIONS {
        uuid id PK "Primary key"
        uuid user_id FK "References public.profiles(id)"
        permission_section section "events | venues | tickets | bookings | coupons | analytics | support"
        access_level access_level "read | write"
        uuid granted_by FK "References public.profiles(id)"
        timestamptz created_at "Permission timestamp"
        timestamptz updated_at "Update timestamp"
    }

    ADMIN_AUDIT_LOGS {
        uuid id PK "Primary key"
        uuid admin_id FK "References public.profiles(id)"
        uuid target_user_id FK "References public.profiles(id) NULLABLE"
        text action "Action description"
        jsonb metadata "Event payload & change details"
        timestamptz created_at "Audit timestamp"
    }
```

---

## 🏛️ High-Level Domain Architecture

```mermaid
graph TD
    subgraph Auth_Identity ["🔐 Identity & Access Layer"]
        AU["auth.users (Supabase)"] -->|1:1 Total Mandatory| P["public.profiles (Users)"]
        P -->|1:N Partial Optional| OP["public.organizer_permissions"]
        P -->|1:N Governance Trail| AL["public.admin_audit_logs"]
    end

    subgraph Catalog ["🎪 Event Catalog Layer"]
        C["public.categories"]
        SC["public.subcategories"]
        C -->|1:N Cascading| SC
        E["public.events (Planned)"] -.->|1:N Partial on Category| C
        E -.->|0..1:N Partial on Subcategory| SC
        E -.->|1:N Organized by| P
    end

    subgraph Operations ["🎟️ Commerce & Bookings (Planned)"]
        T["public.tickets (Planned)"] -.->|1:N Belongs to| E
        B["public.bookings (Planned)"] -.->|1:N Purchased by| P
        B -.->|M:N Reserves via Items| T
    end

    classDef active fill:#2563EB,stroke:#1D4ED8,stroke-width:2px,color:#fff;
    classDef planned fill:#18181B,stroke:#3F3F46,stroke-width:2px,stroke-dasharray: 5 5,color:#A1A1AA;
    
    class AU,P,OP,AL,C,SC active;
    class E,T,B planned;
```

---

## 📖 Tables Data Dictionary

### 1. `auth.users` (Supabase Auth)
Managed natively by Supabase GoTrue authentication engine. Handles encrypted passwords, JWTs, OAuth tokens, and email confirmations.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | Unique identifier generated by Supabase Auth |
| `email` | `VARCHAR` | **UNIQUE** | User login email address |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | Account creation timestamp |

---

### 2. `public.profiles` (User Accounts)
Public-schema profile table linked `1:1` with `auth.users`. Stores application-specific metadata, roles, and status.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK**, **FK** &rarr; `auth.users(id)` | None | References auth user with `ON DELETE CASCADE` |
| `username` | `TEXT` | **UNIQUE**, `NOT NULL` | None | Unique alphanumeric handle (min length: 3) |
| `email` | `TEXT` | None | `NULL` | Mirror of user contact email |
| `full_name` | `TEXT` | None | `NULL` | Full display or legal name |
| `phone_number` | `TEXT` | None | `NULL` | International format phone number |
| `avatar_url` | `TEXT` | None | `NULL` | Cloud storage public URL for avatar |
| `date_of_birth` | `DATE` | None | `NULL` | Date of birth for age verification |
| `role` | `public.user_role` | `NOT NULL` | `'user'` | Role: `user` (fan), `organizer`, `admin` |
| `status` | `public.user_status`| `NOT NULL` | `'active'` | Status: `active`, `suspended` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `timezone('utc', now())` | Registration timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `timezone('utc', now())` | Last profile update timestamp |

**Indexes & Constraints**:
- `profiles_username_lower_idx`: Unique functional index on `LOWER(username)`.
- `idx_profiles_staff_roles`: Partial index on `(role)` where role is `organizer` or `admin`.
- `idx_profiles_suspended`: Partial index on `(status)` where status is `suspended`.
- `CHECK`: `char_length(username) >= 3`
- `CHECK`: `username ~ '^[a-zA-Z0-9_]+$'`

---

### 3. `public.categories` (Event Categories)
Categorization taxonomy for sporting events, football leagues, concerts, festivals, theatre, and workshops.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | `gen_random_uuid()` | Unique category identifier |
| `name` | `TEXT` | `NOT NULL` | None | Display name (e.g., `"Football"`, `"Music"`) |
| `slug` | `TEXT` | **UNIQUE**, `NOT NULL` | None | URL slug (e.g., `"football"`, `"music"`) |
| `pic` | `TEXT` | None | `NULL` | Public image URL in `category-images` bucket |
| `small_description` | `TEXT` | None | `NULL` | Brief summary displayed on cards & headers |
| `icon` | `TEXT` | None | `NULL` | Lucide icon identifier (e.g. `Trophy`, `Music`) |
| `is_popular` | `BOOLEAN` | `NOT NULL` | `false` | Featured flag for homepage & popular categories row |
| `is_active` | `BOOLEAN` | `NOT NULL` | `true` | Visibility toggle (soft-delete / draft control) |
| `display_order` | `INTEGER` | `NOT NULL` | `0` | Order priority (1-4 navbar, others in "More") |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `timezone('utc', now())` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `timezone('utc', now())` | Last update timestamp (auto-trigger) |

**Indexes & Constraints**:
- `CONSTRAINT category_name_not_empty`: `CHECK (char_length(trim(name)) > 0)`
- `CONSTRAINT category_slug_valid`: `CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')`
- `categories_slug_lower_idx`: Unique functional index on `LOWER(slug)` for dynamic routing.
- `idx_categories_popular_display`: Partial index on `(display_order) WHERE is_popular = true;`
- `idx_categories_active_display`: Partial index on `(display_order) WHERE is_active = true;`
- **Trigger**: `trigger_categories_updated_at` executing `public.set_categories_updated_at()` before update.
- **Row Level Security**:
  - `SELECT`: Viewable by everyone (`is_active = true OR public.is_admin(auth.uid())`).
  - `INSERT`, `UPDATE`, `DELETE`: Restricted to administrators (`public.is_admin(auth.uid())`).

### 4. `public.subcategories` (Sub-categories)
Granular categorization taxonomy that sub-divides parent categories into niche disciplines, leagues, and genres (e.g., Football &rarr; Premier League, La Liga, Champions League; Music &rarr; Rock, Jazz).

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | `gen_random_uuid()` | Unique subcategory identifier |
| `category_id` | `UUID` | **FK** &rarr; `categories(id)` | None | Parent category ID (`ON DELETE CASCADE`) |
| `name` | `TEXT` | `NOT NULL` | None | Subcategory display name (e.g. `"Premier League"`) |
| `slug` | `TEXT` | `NOT NULL` | None | Scoped URL slug (unique per parent category) |
| `icon` | `TEXT` | None | `'Tag'` | Lucide icon identifier (e.g. `Trophy`, `Tag`) |
| `is_published` | `BOOLEAN` | `NOT NULL` | `true` | Visibility toggle (published / draft) |
| `display_order` | `INTEGER` | `NOT NULL` | `0` | Sequence priority within parent category |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `timezone('utc', now())` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `timezone('utc', now())` | Last update timestamp (auto-trigger) |

**Indexes & Constraints**:
- `CONSTRAINT subcategory_name_not_empty`: `CHECK (char_length(trim(name)) > 0)`
- `CONSTRAINT subcategory_slug_valid`: `CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')`
- `CONSTRAINT subcategories_category_slug_unique`: `UNIQUE (category_id, slug)`
- `idx_subcategories_category_id`: B-tree index on `(category_id)` for high-speed foreign key joins.
- `idx_subcategories_published`: Partial index on `(category_id) WHERE is_published = true;` for live catalog filtering.
- `idx_subcategories_slug`: Functional index on `(category_id, LOWER(slug))` for case-insensitive URL routing.
- **Trigger**: `trigger_subcategories_updated_at` executing `public.set_subcategories_updated_at()` before update.
- **Row Level Security**:
  - `SELECT`: Viewable by everyone if published or by admins (`is_published = true OR public.is_admin(auth.uid())`).
  - `INSERT`, `UPDATE`, `DELETE`: Restricted to administrators (`public.is_admin(auth.uid())`).

---

### 5. `storage.buckets` (`category-images`)
Public storage bucket for category preview photos and banner visuals.

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Bucket ID / Name** | `category-images` | Storage bucket identifier |
| **Public Access** | `true` | Publicly readable URL access |
| **File Size Limit** | `2097152` bytes | **2 MB** max image upload size |
| **Allowed MIME Types** | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `image/gif`, `image/avif` | Strict raster and vector image formats |
| **Storage RLS** | Public `SELECT`, Admin-only `INSERT`, `UPDATE`, `DELETE` | Managed via `storage.objects` policies |

---

### 6. `public.organizer_permissions`
Granular permission matrix for organizers to manage distinct sub-domains.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | `gen_random_uuid()` | Permission row identifier |
| `user_id` | `UUID` | **FK** &rarr; `profiles(id)` | None | Organizer user ID (`ON DELETE CASCADE`) |
| `section` | `permission_section` | `NOT NULL` | None | Scoped section (`events`, `tickets`, etc.) |
| `access_level` | `access_level` | `NOT NULL` | `'read'` | Permission level: `read` or `write` |
| `granted_by` | `UUID` | **FK** &rarr; `profiles(id)` | `NULL` | Admin profile that approved permissions |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` | Date granted |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` | Last modification |

**Unique Constraint**: `UNIQUE(user_id, section)`

---

### 7. `public.admin_audit_logs`
Immutable audit trail for compliance, role escalations, and moderation actions.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | `gen_random_uuid()` | Audit event identifier |
| `admin_id` | `UUID` | **FK** &rarr; `profiles(id)` | None | Administrator initiating action |
| `target_user_id` | `UUID` | **FK** &rarr; `profiles(id)` | `NULL` | Target affected user (nullable) |
| `action` | `TEXT` | `NOT NULL` | None | Audit action key (e.g. `USER_SUSPENDED`) |
| `metadata` | `JSONB` | `NOT NULL` | `'{}'` | Snapshot of parameters and payload |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` | Event occurrence timestamp |

---

## 🏷️ Custom Enums & Types

### `user_role`
```sql
CREATE TYPE public.user_role AS ENUM ('user', 'organizer', 'admin');
```

### `user_status`
```sql
CREATE TYPE public.user_status AS ENUM ('active', 'suspended');
```

### `permission_section`
```sql
CREATE TYPE public.permission_section AS ENUM (
    'events',
    'venues',
    'tickets',
    'bookings',
    'coupons',
    'analytics',
    'support'
);
```

### `access_level`
```sql
CREATE TYPE public.access_level AS ENUM ('read', 'write');
```

---

## 🔮 Planned Schema Roadmap (Upcoming Tables)

When new features are built and configured in the Supabase Console, this document will be updated with:

```mermaid
erDiagram
    CATEGORIES ||--o{ EVENTS : "1:N (Partial on Category, Mandatory on Event)"
    SUBCATEGORIES ||--o{ EVENTS : "0..1:N (Optional subcategory assignment)"
    PROFILES ||--o{ EVENTS : "1:N (Organizer creates 0..N events)"
    EVENTS ||--|{ TICKETS : "1:N (Event has 1..N ticket tiers)"
    VENUES ||--o{ EVENTS : "1:N (Venue hosts 0..N events)"
    PROFILES ||--o{ BOOKINGS : "1:N (User makes 0..N bookings)"
    BOOKINGS ||--|{ BOOKING_ITEMS : "1:N (Booking has 1..N items)"
    TICKETS ||--o{ BOOKING_ITEMS : "1:N (Ticket reserved in 0..N orders)"
    PROFILES ||--o{ FAVORITES : "1:N (User saves 0..N events)"
    EVENTS ||--o{ FAVORITES : "1:N (Event favorited by 0..N users)"

    EVENTS {
        uuid id PK
        uuid category_id FK "NOT NULL -> categories.id"
        uuid subcategory_id FK "NULLABLE -> subcategories.id"
        uuid organizer_id FK "NOT NULL -> profiles.id"
        uuid venue_id FK "NULLABLE -> venues.id"
        text title
        text slug UK
        text description
        timestamptz start_time
        timestamptz end_time
        text status
    }

    VENUES {
        uuid id PK
        text name
        text city
        text country
        text address
        integer capacity
    }

    TICKETS {
        uuid id PK
        uuid event_id FK "NOT NULL -> events.id"
        text tier_name
        numeric price
        integer total_quantity
        integer remaining_quantity
    }

    BOOKINGS {
        uuid id PK
        uuid user_id FK "NOT NULL -> profiles.id"
        text status
        numeric total_amount
        text stripe_payment_intent_id
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK "NOT NULL -> profiles.id"
        uuid event_id FK "NOT NULL -> events.id"
    }
```

---

## 🔄 How to Update This Document

When creating new tables in the Supabase Console:
1. **Notify the Agent**: Instruct the agent with your table name, column definitions, data types, and foreign key relations (e.g., *"I created the events table with id, category_id FK, title, price..."*).
2. **ERD & Relationship Diagram Update**: The Mermaid relational flowchart and ER diagram will be refreshed with the exact cardinality (`1:1`, `1:N`, `M:N`) and participation constraints (Total vs Partial).
3. **Relational Matrix Update**: A new row will be added to the Relational Integrity Matrix.
4. **Data Dictionary Update**: A detailed table specification will be appended to Section 6 with constraints and indexing strategies.

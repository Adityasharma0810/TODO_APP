# Daily Consistency Tracker

A 100% offline Windows desktop app for tracking daily recurring tasks with streak tracking and visualizations. Built with Tauri v2, React, TypeScript, and SQLite.

## Features

- **Today page** — Drag-and-drop task list with animated checkboxes, inline renaming, and a progress card showing daily completion
- **Statistics page** — Current and best streaks, overall completion %, daily/monthly/task-specific charts (Recharts)
- **Calendar page** — Color-coded heatmap grid (green = perfect, amber = partial, red = missed), day detail panel with editable completions
- **Settings page** — Task management (add/rename/archive/restore), theme toggle (dark/light/system), accent color picker, JSON and SQLite backup/restore, danger zone (reset all data)
- **Automatic rollover** — Midnight rollover backfills missed dates with 0% completions
- **Daylight saving safe** — All dates are computed in local JavaScript time, never via SQLite `date('now')`
- **100% offline** — No cloud, no authentication, no AI, no internet dependency

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Tauri v2](https://v2.tauri.app/) (Rust) |
| Frontend | React 18, TypeScript 5, Vite 6 |
| Styling | Tailwind CSS v4 (`@theme` design tokens) |
| State | Zustand 5 |
| Database | SQLite via `@tauri-apps/plugin-sql` |
| Charts | Recharts 2 |
| Calendar | Custom grid heatmap |
| Drag & drop | dnd-kit |
| Animations | Motion (formerly Framer Motion) |
| Icons | Lucide React |
| Font | Inter (locally bundled via `@fontsource/inter`) |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Tauri Shell                    │
│  ┌───────────────────────────────────────────┐  │
│  │            React Frontend                 │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │ Zustand │ │  Pages   │ │Components │  │  │
│  │  │ Stores  │ │ (4)      │ │ (25+)     │  │  │
│  │  └────┬────┘ └──────────┘ └───────────┘  │  │
│  │       │                                    │  │
│  │  ┌────▼────┐                               │  │
│  │  │   DB    │  Repository Pattern           │  │
│  │  │ Modules │ (6 modules, 1 client)         │  │
│  │  └────┬────┘                               │  │
│  └───────┼───────────────────────────────────┘  │
│          │ Tauri IPC (plugin bridge)            │
│  ┌───────▼───────────────────────────────────┐  │
│  │         SQLite (local .db file)           │  │
│  │  4 tables: tasks, daily_records,          │  │
│  │  task_completions, app_settings           │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- Windows 11 (developed and tested on Windows; Tauri v2 supports macOS and Linux as well)

### Windows-specific toolchain

The project uses the `x86_64-pc-windows-gnu` Rust target with LLVM-MinGW (UCRT):

```powershell
# Install LLVM-MinGW (UCRT)
winget install --id MartinStorsjo.LLVM-MinGW.UCRT

# Set the Rust default toolchain
rustup default stable-x86_64-pc-windows-gnu
```

A `.cargo/config.toml` is pre-configured with the correct linker.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/daily-consistency-tracker.git
cd daily-consistency-tracker

# Install frontend dependencies
npm install

# Run in development mode (Vite dev server + Tauri window)
npm run tauri dev
```

The Vite dev server starts on `http://localhost:1420` with HMR on port 1421.

## Building for Production

```bash
npm run tauri build
```

The bundled installer will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
src/
├── animations/        # Motion animation variants (fadeIn, slideUp, stagger, scale)
├── components/
│   ├── calendar/      # HeatmapCalendar, DayCell, DayDetailPanel, CalendarNav, MonthSummaryCard
│   ├── charts/        # DailyCompletionLineChart, MonthlyCompletionBarChart, TaskCompletionBarChart
│   ├── layout/        # AppShell, Sidebar
│   ├── settings/      # TaskManager, ThemeSection, BackupSection, DangerZone, AboutSection
│   ├── statistics/    # StatCard, StatCardGrid
│   ├── today/         # GreetingHeader, ProgressCard, AddTaskInput, TaskList, TaskRow
│   └── ui/            # Button, Card, Checkbox, ProgressBar, Modal, ConfirmDialog, Toast, EmptyState
├── db/                # Repository layer (client, tasks, dailyRecords, taskCompletions, settings, backup)
├── hooks/             # useTheme, useMidnightRollover, useReducedMotion
├── pages/             # TodayPage, StatisticsPage, CalendarPage, SettingsPage
├── state/             # Zustand stores (useTaskStore, useDailyRecordStore, useSettingsStore, useUIStore)
├── types/             # TypeScript interfaces (Task, DailyRecord, AppSettings, StatisticsSummary, etc.)
├── utils/             # date helpers, statistics, streaks, validation, cn (clsx+tailwind-merge)
├── App.tsx
├── index.css          # Tailwind v4 theme tokens, light theme overrides, scrollbar styles
└── main.tsx

src-tauri/
├── capabilities/      # Tauri v2 capability permissions (SQL, dialog, filesystem)
├── migrations/        # SQLite schema (0001_init.sql)
├── src/               # Rust backend (main, lib)
├── build.rs
├── Cargo.toml
└── tauri.conf.json    # Window config (1200x780, CSP, dev/prod URLs)
```

## Data Model

### `tasks`
| Column | Type | Description |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| name | TEXT | Task name |
| display_order | INTEGER | Sort order |
| active | INTEGER (bool) | 1 = active, 0 = archived |
| created_at | TEXT | ISO date created |
| archived_at | TEXT? | ISO date archived (NULL if active) |

### `daily_records`
| Column | Type | Description |
|---|---|---|
| date | TEXT PK | Date string (yyyy-MM-dd) |
| total_tasks | INTEGER | Tasks active on this date |
| completed_tasks | INTEGER | Tasks completed |
| completion_percentage | REAL | 0–100 |
| is_locked | INTEGER (bool) | Edits prevented |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

### `task_completions`
| Column | Type | Description |
|---|---|---|
| task_id | INTEGER PK | FK → tasks.id |
| date | TEXT PK | FK → daily_records.date |
| completed_at | TEXT | ISO timestamp |

### `app_settings`
| Column | Type | Description |
|---|---|---|
| key | TEXT PK | Setting key |
| value | TEXT | Setting value |

## Theming

The app uses Tailwind v4's CSS-first `@theme` directive with custom design tokens. Dark mode is the default. Light mode is activated via `data-theme="light"` on `<html>`.

Design tokens cover:
- Background (`bg`, `surface`, `surface-elevated`, `inset`)
- Text (`text-primary`, `text-secondary`, `text-tertiary`, `text-muted`, `text-disabled`, `text-placeholder`)
- Borders (`border`)
- Accent (`accent` — user-configurable via settings)
- Border radius (`sm`, `md`, `lg`, `xl`)

Components use these tokens as Tailwind utility classes (e.g., `bg-surface`, `text-text-primary`, `border-border`).

## Key Design Decisions

- **No path aliases** — All imports use relative paths (`../../`)
- **cn() utility** — `clsx` + `tailwind-merge` for className composition
- **Local date only** — "Today" is computed in JS local time to avoid UTC off-by-one errors
- **Toggle write path** — `toggleTaskCompletion` inserts if not exists, deletes if exists (single write path)
- **Soft delete** — Tasks are archived (active=false, archived_at set) to preserve completion history
- **Streak logic** — Today counts only at 100%; earlier days break streak on any miss; current streak counts backwards from yesterday

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server only |
| `npm run build` | TypeScript check + production Vite build |
| `npm run preview` | Preview production build |
| `npm run tauri dev` | Start Vite + launch Tauri window (development) |
| `npm run tauri build` | Build production installer |

## License

MIT

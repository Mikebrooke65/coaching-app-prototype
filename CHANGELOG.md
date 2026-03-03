# Changelog

All notable changes to the football coaching app prototype will be documented in this file.

## [Unreleased]

### Added
- Created CLUB-QUESTIONS.md document for requirements gathering
- Added 10 question sections covering:
  - Skills terminology and structure
  - Team structure and tagging system
  - Friendly Manager API integration
  - Data synchronization and edit management
  - Player and team feedback management
  - Feedback model and framework
  - AI-powered session builder
  - AI session adaptation and rewriting
  - Adding caregivers and players user management
  - Game scheduling and communication

## [2026-03-02] - Netlify Deployment Setup

### Changed
- Updated `vite.config.ts`: Changed base path from `/coaching-app-prototype/` to `/` for Netlify compatibility
- Updated `index.html`: Replaced hard-coded built asset references with source entry point `/src/main.tsx`

### Fixed
- Fixed Vite build failures on Netlify caused by GitHub Pages configuration
- Fixed asset resolution issues during production build

### Deployment
- Successfully deployed to Netlify
- Repository: https://github.com/Mikebrooke65/coaching-app-prototype
- Branch: main
- Build command: `npm run build`
- Publish directory: `dist`

---

## Instructions for Maintaining This File

When making updates:
1. Add new entries under `[Unreleased]` section
2. When deploying, move unreleased items to a new dated section
3. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
4. Include commit hashes when relevant

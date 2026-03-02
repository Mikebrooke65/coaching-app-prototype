# Conversation History

This document maintains a record of all conversations, decisions, and context for the football coaching app project.

---

## Session: March 2, 2026 - Netlify Deployment

### Context
- User working on deploying football coaching app prototype to Netlify
- App was originally designed in Figma and converted to React/TypeScript code
- User has two laptops - one with issues, working from the "good laptop"

### Discussion Points

1. **Initial Setup**
   - User opened Netlify on working laptop
   - Needed to deploy the prototype app that was set up in GitHub

2. **Repository Connection**
   - Initially connected to wrong repository (Urrah-coaching-app)
   - Identified correct repository: coaching-app-prototype
   - Local branch: prototype
   - Remote branch: main

3. **Build Failures - Issue #1: Base Path**
   - Problem: Vite config had `base: '/coaching-app-prototype/'` (GitHub Pages config)
   - Error: Vite couldn't resolve assets with absolute paths during build
   - Solution: Changed base to `'/'` in vite.config.ts
   - Commit: 52e0b16 - "Fix base path for Netlify deployment"

4. **Build Failures - Issue #2: Hard-coded Assets**
   - Problem: index.html referenced pre-built assets instead of source entry
   - Had hard-coded paths: `/coaching-app-prototype/assets/index-BET_XB_P.js`
   - Error: Vite couldn't find these files during build process
   - Solution: Changed to reference source entry point `/src/main.tsx`
   - Commit: 7e20edc - "Fix index.html to reference source entry point"

5. **Successful Deployment**
   - Build succeeded after fixes
   - App deployed and accessible via Netlify URL
   - User tested in full screen, asked about mobile view
   - Advised to use browser dev tools (F12 + device toolbar) for mobile preview

6. **Next Steps Discussion**
   - User plans to gather feedback from others
   - Confirmed that code changes can be made directly (no longer tied to Figma)
   - Explained workflow: make changes → commit → push → auto-deploy via Netlify

7. **Documentation Request**
   - User's colleague (also uses Kiro) requested:
     - Changelog document tracking all Git updates with notes
     - Conversation history document capturing all discussions and context
   - Both documents to be maintained in Git repository

### Technical Details
- Repository: https://github.com/Mikebrooke65/coaching-app-prototype
- Build tool: Vite
- Framework: React with TypeScript
- Styling: Tailwind CSS
- Deployment: Netlify (auto-deploy on push to main)
- Build command: `npm run build`
- Output directory: `dist`

### Decisions Made
- Use Netlify for hosting (instead of GitHub Pages)
- Base path set to `/` for root-level serving
- Auto-deployment enabled via GitHub integration
- Mobile-first approach for user testing

### Questions Asked
- How to view in mobile phone size? → Use browser dev tools
- How to get Netlify URL? → Visible on site dashboard
- Can changes be made after Figma export? → Yes, full code control
- Will Kiro work on Windows 11 Snapdragon? → Need to check official docs

---

## Instructions for Maintaining This File

After each conversation session:
1. Add a new session header with date and topic
2. Document context, discussion points, technical details
3. Record decisions made and their rationale
4. Note any questions asked and answers provided
5. Include relevant links, commit hashes, and technical specifications
6. Keep chronological order (newest at top after this entry)

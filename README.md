# AgentCoach

AgentCoach is the first public landing page for a premium AI agent workflow company. The page positions AgentCoach as a marketplace for reusable AI agent recipes that transform fragmented professional data into repeatable decision workflows, with a long-term path toward enterprise deployment and local/private AI agent solutions.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    landing/
      LandingPage.tsx
      OrbitalNetwork.tsx
      SectionReveal.tsx
      TopNavigation.tsx
      WaitlistForm.tsx
  lib/
    landing-data.ts
```

## Deployment

This project is ready for Vercel or any platform that supports Next.js.

For Vercel:

1. Import the GitHub repository.
2. Keep the default build command: `npm run build`.
3. Keep the default output settings for Next.js.
4. Deploy.

The waitlist form is a static UI in version 1. Connect it to a backend, form provider, or CRM when AgentCoach is ready to collect signups.

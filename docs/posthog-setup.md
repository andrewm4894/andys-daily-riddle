# Setting Up PostHog Analytics

This guide explains how to set up PostHog analytics for the Daily Riddle application.

## Prerequisites

Before setting up PostHog, you'll need:
- A PostHog account (create one at [posthog.com](https://posthog.com))
- A PostHog project and API key

## Setup Steps

1. **Get your PostHog API Key**:
   - Log in to your PostHog account
   - Navigate to "Project Settings" > "Project API Keys"
   - Copy your API key (it should start with `phc_`)

2. **Add the API Key as an Environment Variable**:
   - Add the API key as `VITE_POSTHOG_API_KEY` to your environment variables
   - In Replit, this can be done through the Secrets tab in the Tools panel

3. **Verify the Integration**:
   - Start the application
   - Perform some tracked actions (view pages, flip riddle cards, etc.)
   - Visit your PostHog dashboard to verify events are being captured

## Configuration Options

The PostHog configuration can be modified in `client/src/lib/posthog.ts`. Some key options include:

- `debug`: Set to `true` for development environments to see PostHog logs in the console
- `disable_session_recording`: Set to `true` to disable session recording
- `capture_pageview`: Set to `false` to disable automatic page view tracking

## Troubleshooting

If events are not being tracked:

1. Check the browser console for any PostHog-related errors
2. Verify that the API key is correctly set in the environment variables
3. Ensure the PostHog provider is correctly wrapping the application in `client/src/App.tsx`
4. Check for any ad-blockers or privacy extensions that might be blocking PostHog

## Extending Analytics

See the [analytics.md](./analytics.md) documentation for information on the existing tracked events and how to add new ones.
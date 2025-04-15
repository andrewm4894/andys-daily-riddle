# PostHog Analytics Use Cases

This document outlines common use cases and examples of how to use the PostHog analytics data for the Daily Riddle application.

## Analyzing User Engagement

### Riddle Interaction Rates

Track how users engage with riddles by analyzing:
- How many users view the answers (tracked by `riddle_card_flipped` events)
- How frequently users rate riddles (tracked by `riddle_rated` events)
- Which riddles are most frequently copied (tracked by `riddle_question_copied` events)

Example PostHog insights:
- Create a breakdown chart of `riddle_card_flipped` events by `riddle_id` to see which riddles generate the most interest
- Track the average rating value from `riddle_rated` events to gauge quality

### Generation Patterns

Understand riddle generation patterns:
- Track free vs. paid generation rates
- Monitor rate limit hits
- Analyze peak usage times

Example PostHog insights:
- Compare `riddle_generation_started` and `riddle_generation_success` events to understand completion rate
- Create a funnel from `checkout_started` to successful paid riddle generation

## Improving User Experience

### Identifying Pain Points

Use analytics to identify potential UX issues:
- High bounce rates on specific pages
- Low engagement with certain features
- Error patterns in user interactions

Example PostHog queries:
- Track `riddle_copy_failed` events to identify browser compatibility issues
- Monitor `riddle_generation_error` events to detect API issues

### Feature Adoption

Track the adoption of features:
- Riddle shuffling (via `riddles_shuffle` events)
- Riddle rating (via `riddle_rated` events)
- Copy functionality (via `riddle_question_copied` events)

Example PostHog dashboard:
- Create a dashboard with charts showing feature usage over time
- Set up retention analysis based on feature adoption

## Business Metrics

### Conversion Tracking

Monitor key conversion points:
- Track free-to-paid conversions
- Analyze time between first visit and first paid riddle generation

Example PostHog insights:
- Create a funnel from first visit to `checkout_started` to paid riddle generation
- Track the average time between first `$pageview` and first `checkout_started` event

### Content Quality Assessment

Use analytics to assess content quality:
- Track average ratings by time period
- Identify patterns in highly-rated vs. poorly-rated riddles

Example PostHog analysis:
- Create a trends report showing average ratings from `riddle_rated` events over time
- Use correlation analysis to identify factors common to highly-rated riddles

## Setting Up Custom Dashboards

For Daily Riddle, consider creating these PostHog dashboards:

1. **User Engagement Dashboard**
   - Daily/weekly active users
   - Average riddles viewed per session
   - Card flip rate (% of riddles where users view the answer)

2. **Content Quality Dashboard**
   - Average riddle ratings over time
   - Distribution of ratings (1-5 stars)
   - Most copied riddles

3. **Business Performance Dashboard**
   - Free-to-paid conversion rate
   - Paid riddle generation volume
   - Rate limit hits (potential lost conversions)

## Next Steps for Analytics Enhancement

Consider these future enhancements:
1. Implement user identification to track individual user journeys
2. Add cohort analysis based on registration date
3. Set up A/B testing for new features using PostHog experiments
4. Create automated reports for key metrics
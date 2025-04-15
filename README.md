# The Daily Riddle

A fun and engaging web application that delivers a fresh riddle every day! Challenge your mind with clever puzzles, rate your favorites, and even generate custom riddles on demand.

## About The App

The Daily Riddle brings the joy of brain teasers to your daily routine. Each day, a new AI-generated riddle appears at the top of your collection. Tap cards to reveal answers, rate the ones you love, and build your personal riddle library over time.

## Features

### For Riddle Enthusiasts
- **New Riddle Every Day**: Enjoy a fresh, intelligent riddle daily
- **Simple Card Interface**: Tap to flip cards and reveal answers
- **Personal Rating System**: Rate riddles from 1-5 stars
- **Easy Sharing**: Copy any riddle with one click to share with friends
- **Collection Management**: Browse your entire riddle history with infinite scroll
- **Shuffle Option**: Mix up your collection for variety while keeping new riddles at the top

### For Riddle Creators
- **Premium Generation**: Create your own custom riddles anytime ($1 per riddle)
- **AI-Powered Content**: Each riddle is uniquely crafted using advanced AI technology

## How to Use

### Exploring Riddles
1. **Browse Your Collection**: Scroll through all your riddles, newest first
2. **Reveal Answers**: Tap any card to flip it and see the answer
3. **Mix Things Up**: Use the shuffle button to randomly reorder your collection
4. **Share Favorites**: Use the copy button to easily share riddles with friends

### Rating System
1. **Rate After Viewing**: After flipping a card, rate the riddle with 1-5 stars
2. **View Community Ratings**: See the average rating on each riddle card

### Creating New Riddles
1. **Generate On Demand**: Click the "Generate Riddle" button 
2. **Quick Payment**: Complete the simple $1 payment process
3. **Instant Creation**: Your new custom riddle appears immediately at the top of your collection

## Technical Requirements

To run this application, you need:

- OpenAI API key (for riddle generation)
- Stripe API keys (for payment processing)
- PostgreSQL database (for storing riddles and ratings)

## Setting Up

1. Add your API keys to the environment variables
2. Start the application with `npm run dev`
3. Visit the application in your browser

## About the Technology

The Daily Riddle uses modern web technologies including React, TypeScript, and Tailwind CSS for the frontend, with an Express.js backend and PostgreSQL database. Riddles are generated using OpenAI's API, and payments are processed through Stripe.
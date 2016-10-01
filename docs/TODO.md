# TODO

## Critical
- handle deployment with active games
  - stop accepting new games
  - delay deploy until active games are complete (max 30 minutes)
- handle archived game display
  - display last game state for now
- client side error handling

## Stats Bar
- players online
- active games

## User Features
- account settings
- gameplay settings tester
- password change
- email
- email confirmation
- user page

## Mobile Support
- improve mobile design (layout)
- improve mobile performance

## Add Index Features
- filtering
- sorting
- searching
- private games

## Game Features
- rematch
- start new game

## About Page
- Getting started
- How to play
- Advanced mechanics

## Onboarding
- improve onboard experience

## Style
- component transitions

## Gameplay Options
- Settings store
- Hide available moves
- Hide opponent piece timers
- Timer color
- Move selection color

## Player ranks
- Store player stats
- [internal ranking package](https://www.npmjs.com/package/glicko2)
- External rank badges

## Archived Games
- Allow joining archived games
- Add replay feature

## Competitive Matchmaking
- Matchmaking for competitive games
- Add competitive game mode

## Chat
- live in game chat

## Friends
- live private chat with friends

## Game Modes
- chess Z(OMBIES)

# KNOWN BUGS
- enter key doesn't work on game settings modal (fires on window)
- reservations don't work for multiple pieces
  - potential issue if 2 knights of different color reserve the same position
  - solution: different reservations for each color
- joining mid-game will set timers to full
  - do not want to track timer progress, too slow
  - maybe show empty instead?

# TODO

## Critical
- handle deployment with active games
  - stop accepting new games
  - delay deploy until active games are complete (max 30 minutes)

## Monitoring
- server memory usage
- db memory usage
- redis memory usage
- in-game performance
- db performance

## Errors
- catch and log thrown errors

## Stats Bar
- active games count

## User Features
- account settings
- gameplay settings tester
- make searchable
- google and facebook auth
- JWT auth

## Add Index Features
- searching
- private games

## Game Features
- rematch
- start new game
- single player

## Gameplay Options
- Settings store
- Hide available moves
- Hide opponent piece timers
- Timer color
- Move selection color

## Player ranks
- Store player stats
- [internal ranking package](https://www.npmjs.com/package/elo-rating)
- External rank badges

## Competitive Matchmaking
- Add competitive game mode
- Matchmaking for competitive games

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

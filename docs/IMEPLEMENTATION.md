# Implementation
## Game State
Need to store current game state while the game is being played.
###### Motivation:
- Spectators may join mid-game
- Validate moves server-side
- Keep client-side game state in sync
- Store move history without round-trips to server

###### Server Memory
- Pros
  - It's MUCH faster than redis
  - Don't need to worry about asynchronous writes based on stale game state
- Cons
  - Memory limits: if this limit is reached, there will likely be other performance issues
  - Volatile: use redis to backup current game state in case of a crash

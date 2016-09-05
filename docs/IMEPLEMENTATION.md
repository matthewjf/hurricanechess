# Implementation
## Game State
Need to store current game state while the game is being played.
###### Motivation:
- Spectators may join mid-game
- Validate moves server-side
- Keep client game states in sync
- Store move history without round-trips to server

Chose to use Redis to handle this. Redis is fast. How to represent game state?

###### Position List:
- State is stored as a list of **positions** containing each piece
- Fairly similar performance to storing a list of pieces with their positions
- Storing a list of positions **and** pieces is slow
- Why choose positions as the key over pieces?
  - Sequence: client1 read, client2 read, client1 write, client2 write
  - On client2 write, client2 has old data and may delete a piece that already moved
  - Using positions, we overwrite pieces instead of deleting

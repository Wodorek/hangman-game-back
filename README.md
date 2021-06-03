# hangman-game-back 

The backend part of [hangman-game](https://github.com/Wodorek/hangman-game)

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)

## General info

A backed part of my two player version of the classic word guessing game hangman.

This is a websockets server, meant for playing in real time.
It takes care of game logic events, as well as, allowing entrance and joining rooms.

## Technologies used

- [Typescript](https://github.com/microsoft/TypeScript) v4.2.4
- [Socket.io](https://github.com/socketio/socket.io) v4.1.1

## Setup

To run this project locally, clone it and install using npm:

```
$cd ../hangman-back
$npm install
```

then, you will need to create a **nodemon.json** file, containing **"env"** object with following properties:

- "URL": A frontend URL, for CORS

Finally, run it using npm:

```
$npm run startdev
```

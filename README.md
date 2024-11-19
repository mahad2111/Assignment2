# Yatzy Game with Node.js and Express

This project enhances the classic Yatzy game by integrating server-side functionalities using Node.js and Express. The server manages the game state, scoring logic, and dice rolling, while the client provides an interactive and responsive UI.

----------

## Table of Contents

-   [Setup](#setup)
-   [Features](#features)
-   [File Structure](#file-structure)
-   [API Endpoints](#api-endpoints)
-   [How to Play](#how-to-play)
-   [Testing](#testing)
-   [License](#license)

----------

## Setup

1.  **Install Node.js and npm**: Ensure [Node.js](https://nodejs.org/) and npm are installed.
    
2.  **Clone the Repository**:
    
    bash
    
    `git clone <repository-url>
    cd yatzy` 
    
3.  **Install Dependencies**:

     bash
    
    `npm install` 
    
5.  **Start the Server**:
    
    bash
    
    `node server.js` 
    
    
6.  **Launch the Game**: Open `http://localhost:3000` in your web browser.
    

----------

## Features

1.  **Server-Side Integration**:
    
    -   Node.js and Express handle all game logic and state management.
    -   Game calculations such as scoring, dice rolling, and turn tracking are server-controlled.
2.  **Client-Server Communication**:
    
    -   Uses the Fetch API for dynamic updates between the server and client.
3.  **Interactive UI**:
    
    -   User-friendly and visually appealing game interface built with HTML, CSS, and JavaScript.
4.  **API Endpoints**:
    
    -   Robust endpoints for game interactions like rolling dice, holding dice, and scoring.
5.  **Modular Codebase**:
    
    -   Separation of concerns with reusable modules for dice rolling and scoring.

----------

## File Structure

-   **Server Files**:
    
    -   `server.js`: Main server file managing routes and API endpoints.
    -   `yatzygame.js`, `yatzyengine.js`, `dice.js`: Game logic modules for handling dice, scoring, and overall game state.
      
-   **Client Files**:
    
    -   `index.html`: Main HTML file for the UI.
    -   `style.css`: Stylesheet for the game's design.
    -   `main.js`: Client-side JavaScript for game interactions.
-   **Dependencies**:
    
    -   `package.json`: Lists the dependencies required for the project, such as `express` for server setup.
    -   `package-lock.json`: Locks the versions of the dependencies for consistency across environments.
-   **Node Modules**:
    
    -   The `node_modules` folder contains all the third-party packages and their dependencies required for the project. These packages are automatically installed using `npm install` based on the dependencies listed in `package.json`.
    -   This folder includes packages like:
        -   `express`: A lightweight web application framework for Node.js.
        -   Other nested dependencies required by `express` and other packages.
    
    ⚠️ **Note**: The `node_modules` directory is not tracked in version control systems (e.g., Git) due to its size and regenerability. It is automatically created by running `npm install`.
    

----------

## API Endpoints

### 1. **Roll Dice**

-   **URL**: `/roll`
-   **Method**: `POST`
-   **Description**: Rolls all unheld dice.
-   **Response**:
    
    json
    
    `{
      "diceValues": [1, 2, 3, 4, 5],
      "rollsLeft": 2,
      "possibleScores": { "ones": 1, "twos": 4 }
    }` 
    

### 2. **Hold Dice**

-   **URL**: `/hold/:index`
-   **Method**: `PUT`
-   **Description**: Toggles the hold state of a die by index.
-   **Response**:
    
    json
    
    `{
      "heldDice": [true, false, true, false, false]
    }` 
    

### 3. **Score a Category**

-   **URL**: `/score/:category`
-   **Method**: `POST`
-   **Description**: Scores the current dice values for a selected category.
-   **Response**:
    
    json
    
    `{
      "scores": { "ones": 3, "twos": null },
      "totalScore": 3
    }` 
    

### 4. **Get Game State**

-   **URL**: `/state`
-   **Method**: `GET`
-   **Description**: Fetches the current game state.
-   **Response**:
    
    json
    
    
    `{
      "diceValues": [0, 0, 0, 0, 0],
      "heldDice": [false, false, false, false, false],
      "rollsLeft": 3,
      "scores": { "ones": null, "twos": null },
      "totalScore": 0,
      "possibleScores": {}
    }` 
    

----------

## How to Play

1.  **Start a New Game**: Refresh the browser to reset the game state.
    
2.  **Roll Dice**: Click the "Roll Dice" button to roll unheld dice. You have up to 3 rolls per turn.
    
3.  **Hold Dice**: Click a die to hold or release it.
    
4.  **Score Categories**: Click a category on the scorecard to score the current dice values.
    
5.  **Game Progress**: The game automatically updates the UI based on server responses.
    

----------

## Testing

1.  **Functional Testing**: Use tools like Postman or CURL to verify API responses.
    
2.  **UI Testing**: Ensure the dice animations, score updates, and button interactions work as expected.
    
3.  **Error Handling**: Test edge cases like rolling dice with no rolls left or scoring already selected categories.
    

----------

## License

This project is open-source and available under the MIT License.

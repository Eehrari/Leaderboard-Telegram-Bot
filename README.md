# Telegram Quiz Leaderboard Bot
This Telegram bot is designed to enhance engagement and competition among students by providing quizzes and maintaining a leaderboard based on their performance. The bot allows students to participate in quizzes, tracks their scores, and ranks them on the leaderboard.

**Features**
* Quiz Bot: This bot presents quizzes to individual students within a specified time frame. Once a student completes a quiz, the results are stored in a MongoDB database.
* Leaderboard Bot: This bot utilizes the quiz scores to create a leaderboard. Students earn gems for achieving a score of 18 or higher (out of 20) in each quiz. The leaderboard ranks students based on gems, total score, and completion time.

**Prerequisites**
* Node.js: Make sure you have Node.js installed on your machine.
* MongoDB: Set up a MongoDB database and obtain the connection URI.
* Telegram Bot Token: Generate a Telegram Bot Token using the BotFather on Telegram.

**Installation**
1. Clone the repository:
   ``` git clone https://github.com/your/repository.git ```
2. Navigate to the project directory:
   ``` cd repository ```
3. Install the dependencies:
   ``` npm install ```
4. Configure Environment Variables:
   * Create a .env file in the project root directory.
   * Set the following environment variables in the .env file:
   ``` MONGODB_URI=your_mongodb_uri
       PORT=3000
       BOT_TOKEN=your_telegram_bot_token
    ```
**Usage**
1. Start the application:
   ``` npm start ```
The server will start running on the specified port (default: 3000) and establish a connection to the MongoDB database.
2. Interact with the bot:
   * Start the Quiz Bot by adding it to your Telegram group or chatting with it directly using the bot username or ID.
   * Use the /start command to initiate the quiz and view the leaderboard.
   * The Leaderboard Bot will display the leaderboard, including the top three performers and their scores.
   * Students will receive gems for achieving high scores, and the bot will update the leaderboard accordingly.
     
**Contributions**
Contributions to this project are welcome! If you find any issues or have suggestions for improvements, feel free to submit a pull request or create an issue on GitHub.

**License**
This project is licensed under the terms of the MIT license. See the LICENSE file for more details.

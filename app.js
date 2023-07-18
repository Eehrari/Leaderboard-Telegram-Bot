require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

const bot = new Telegraf('Your BOT Id'); // Replace with your bot token



mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        const db = mongoose.connection;
        const userQuizCollection = db.collection('userQuiz');
        app.get('/', (req, res) => {
            res.send('Hello, Heroku!' + db);
        });

        bot.command('start', async (ctx) => {
            const userNameWithIds = [
                { userId: 2075736184, username: 'Test', gems: 0 },
            ];
            const uniqueUserIds = await userQuizCollection.aggregate([
                { $group: { _id: '$userId', quizIds: { $addToSet: '$quizId' } } }
            ]).toArray();
            const userIdsArray = uniqueUserIds.map((item) => item._id);
            if (uniqueUserIds.length === 0) {
                await ctx.reply('No users found in the database.');
                return;
            }

            const leaderboard = await Promise.all(
                userIdsArray.map(async (userId) => {
                    const userScores = await userQuizCollection.aggregate([
                        { $match: { userId } },
                        {
                            $group: {
                                _id: '$userId',
                                userText: { $first: '$userText' },
                                quizIds: { $addToSet: '$quizId' },
                                scores: { $push: '$score' },
                            },
                        },
                    ]).toArray();

                    const user = userNameWithIds.find((item) => item.userId === userId);
                    const username = user?.username || 'Unknown';
                    const scores = userScores[0]?.scores || [];
                    const gems = scores.filter((score) => score > 17).length;
                    const totalScore = scores.reduce((a, b) => a + b, 0);
                    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
                    const averageScoreText = averageScore % 1 === 0 ? `Score: ${averageScore}` : `Score: ${averageScore.toFixed(2)}`;
                    return { userId, username, score: totalScore, gems, averageScoreText };
                })
            );




            leaderboard.sort((a, b) => {
                // Sort by the number of gems first
                if (b.gems !== a.gems) {
                    return b.gems - a.gems; // Sort in descending order of gems
                }

                // If the number of gems is the same, sort by the score
                if (b.score !== a.score) {
                    return b.score - a.score; // Sort in descending order of score
                }

                // If the score is also the same, sort by username
                return a.username.localeCompare(b.username); // Sort in ascending order of username
            });

            const winnerButton = Markup.button.callback(`🥇${leaderboard[0].username} - ${leaderboard[0].averageScoreText} - (${leaderboard[0].gems}) ${leaderboard[0].gems > 0 ? '💎' : ''}`, 'disabled')
            const secondButton = Markup.button.callback(`🥈${leaderboard[1].username} - ${leaderboard[1].averageScoreText} - (${leaderboard[1].gems}) ${leaderboard[1].gems > 0 ? '💎' : ''}`, 'disabled')
            const thirdButton = Markup.button.callback(`🥉${leaderboard[2].username} - ${leaderboard[2].averageScoreText} - (${leaderboard[2].gems}) ${leaderboard[2].gems > 0 ? '💎' : ''}`, 'disabled')

            const buttons = leaderboard.slice(3).map((user) => {
                const gemsEmoji = user.gems > 0 ? '💎' : '';
                const buttonLabel = `${user.username} - ${user.averageScoreText} - (${user.gems}) ${gemsEmoji}`;
                return Markup.button.callback(buttonLabel, 'disabled');
            });


            const keyboard = Markup.inlineKeyboard([winnerButton, secondButton, thirdButton, ...buttons], { columns: 1 });

            const title = 'Leaderboard';
            const fullWidthSpace = '\u2005\u2005'; // Unicode characters for empty space (adjust the number of characters for desired width)
            const centerTitle = `*${fullWidthSpace}${title}${fullWidthSpace}*`;

            const replyMarkup = Markup.keyboard([]);
            replyMarkup.resize().oneTime();

            await ctx.replyWithMarkdownV2(centerTitle, replyMarkup);
            await ctx.reply('Earn 50 💎 to become the Winner 🏆', keyboard);
        });
        bot.action('disabled', (ctx) => {
            ctx.answerCbQuery('This button is disabled.');
        });
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });



bot.launch();
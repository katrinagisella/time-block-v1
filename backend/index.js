require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());  

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/schedule', async (req, res) => {
    const { tasks } = req.body;

    const scheduledTasks = [];

    try {
        for (const task of tasks) {
            const chatCompletion = await getGroqTaskPrediction(task.title);
            const prediction = chatCompletion.choices[0]?.message?.content || "N/A";

            console.log("Prediction from Groq API:", prediction);

            const cleanedPrediction = cleanPrediction(prediction);
            const { estimatedDuration, bestTimeToDo, reason } = cleanedPrediction;

            scheduledTasks.push({
                title: task.title,
                difficulty: task.difficulty,
                importance: task.importance,
                urgency: task.urgency,
                estimatedDuration: estimatedDuration || "N/A",
                bestTimeToDo: bestTimeToDo || "N/A",
                reason: reason || "No reason provided",
            });
        }

        res.json({ schedule: scheduledTasks });
    } catch (error) {
        console.error('Error generating task schedule:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate task schedule.' });
    }
});

async function getGroqTaskPrediction(taskDescription) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `For the task "${taskDescription}", predict the time needed to complete it and the best time of day to perform it. Return response in the following format:
                Estimated Duration: x hours y minutes
                Best Time To Complete Task: z a.m./p.m.
                Why: (Explanation of why this is the best time)`,
            },
        ],
        model: "llama3-8b-8192",
    });
}

function cleanPrediction(prediction) {
    const durationRegex = /Estimated Duration: (\d+ hours? \d+ minutes?)/i;
    const timeRegex = /Best Time To Complete Task: ([\d]+(:\d+)? ?[APap]\.?[Mm]\.?)/i;
    const reasonRegex = /Why: ([\s\S]+)/i;  

    const estimatedDuration = prediction.match(durationRegex)?.[1] || "N/A";
    const bestTimeToDo = prediction.match(timeRegex)?.[1] || "N/A";
    const reason = prediction.match(reasonRegex)?.[1] || "No reason provided";

    return {
        estimatedDuration,
        bestTimeToDo,
        reason,
    };
}

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});

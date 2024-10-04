# TimeBlock

## Overview

 **TimeBlock** is a productivity tool designed to help users efficiently plan and manage their tasks by leveraging artificial intelligence (AI). The AI predicts the best time to complete a task based on the task's difficulty, importance, and urgency, alongside the title of the task. It also provides a detailed reason explaining why a specific time is recommended for each task, enabling users to understand why the AI model has recommended the time and allocation. These recommendations are then placed on the Calendar in the form of cards called **Blocks**. 

### Problem It Addresses

Managing multiple tasks efficiently is a challenge, especially when users need to balance competing priorities, deadlines, and personal preferences. Manually estimating how long tasks will take and when to complete them often leads to poor time management. 

This tool solves the problem by using AI to **predict optimal times** for task completion, providing an explanation for the recommendations and allowing users to drag and drop tasks on a calendar to suit their preferences. Additionally, having time allocated to each task we need to complete makes it easier for us to visualize the task we need to do. 

### Solution

TimeBlock allows users to:
- **Add tasks** with attributes like title, difficulty, importance, and urgency.
- **Receive AI-based suggestions** on how long tasks will take and the best time to do them.
- **Use a drag-and-drop calendar** to organize and adjust tasks.
- **View AI explanations** for task recommendations to optimize time management.
- **Modify schedules on the fly** by dragging and dropping tasks.

### Impact

By providing **AI-driven recommendations**, the tool helps users improve their productivity, reduces the cognitive load of manual scheduling, and encourages users to focus on important tasks at optimal times. This leads to better task completion, higher efficiency, and improved time management. 

---

## Features

- **AI-Powered Task Scheduling**: Automatically generates time and duration suggestions for tasks based on input parameters.
- **Interactive Calendar**: A weekly view calendar where users can drag and drop tasks.
- **Task Details with AI Insight**: Clicking on a task in the calendar shows AI-provided details, including the recommended time and reason for that suggestion.
- **Responsive Design**: A user-friendly interface with modern, responsive design.

---

## Setup and Usage Instructions

### Prerequisites

To run the project locally, you will need:
- **Groq** account and key
- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

Check if Node.js and npm are installed by running:

```bash
node -v
npm -v
```

### Installation
1. Clone the repository
```
git clone https://github.com/katrinagisella/time-block-v1.git
cd time-block-v1
```

2. Install dependencies
    - for frontend
    ```
    cd frontend
    npm install
    ```
    - for backend
    ``` 
    cd backend
    npm install
    ```
3. Set up environment
Create a ```.env``` file at the at the backend file and insert your Groq key.
```
GROQ_API_KEY=your-api-key-here
```

4. Run the application
To use TimeBlock, you need to run both the backend and the frontend at the same time
    - Backend
        ```
        cd backend
        node index.js
        ```
    - Frontend
        ```
        cd frontend
        npm start
        ```

5. View and use the application
The TimeBlock app will be available to use at ```http://localhost:3000```

### Use TimeBlock!

1. Enter the title of the task: Make sure that it accurately reflects the tasks that you are going to complete. This helps the AI model preedict how much time you should block for this task.
2. Enter difficulty, importance, and urgency levels: Enter each level to help the AI model accurately block your time, helping you prioritize tasks and get all you to-dos done.
3. Drag and drop your Blocks: Once the AI model has finished predicting how much time you should spend on each task and the optimal time to do so, customize your schedule by dragging and dropping each Block. You can also view the reasonings behind why the model's suggestions. 









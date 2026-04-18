# Evently - Serverless Event Planner

A premium Event Planner application built with a **Full-Stack Serverless** architecture using **AWS Amplify Gen 2**.

## 🚀 Architecture
- **Frontend**: React (Vite)
- **API**: AWS AppSync (GraphQL)
- **Database**: Amazon DynamoDB
- **Hosting**: AWS Amplify Hosting

## 🛠️ Local Development

### 1. Prerequisites
- Node.js installed.
- AWS Account and CLI configured.

### 2. Startup
1. **Infrastructure**: In the root directory, run the Amplify sandbox to provision your cloud backend:
   ```bash
   npx ampx sandbox
   ```
   *This will generate `amplify_outputs.json` which the frontend needs.*

2. **Frontend**: In a separate terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ☁️ Continuous Deployment to AWS

Since your code is already on GitHub, Amplify will automatically detect the Gen 2 backend:

1. Go to the **[AWS Amplify Console](https://console.aws.amazon.com/amplify/home)**.
2. Select your repository: **`PradeeprajSimon/csm_rec`**.
3. Amplify will detect the `amplify/` folder and deploy:
   - The DynamoDB tables.
   - The AppSync API.
   - The React Frontend.
4. No further configuration is needed! The app is now fully serverless and scales automatically.

---

### Key Features
- **Serverless CRUD**: Uses Amplify's type-safe data client.
- **Glassmorphic Design**: Professional UI with premium aesthetics.
- **CI/CD**: Automatic deployments on every `git push`.

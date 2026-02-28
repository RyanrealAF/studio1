# VOCAL SURGEON

A high-precision, lyrics-anchored vocal stem clarity engine built with Next.js, Firebase, and Genkit.

## GitHub Deployment Instructions

To push this project to your GitHub repository, run these commands in your terminal:

1. **Initialize Git**:
   ```bash
   git init
   ```

2. **Add Files**:
   ```bash
   git add .
   ```

3. **Commit Changes**:
   ```bash
   git commit -m "Initial commit: Vocal Surgeon Clinical Console"
   ```

4. **Create a Repository on GitHub**:
   Go to [github.com/new](https://github.com/new) and create a repository named `vocal-surgeon`.

5. **Link and Push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vocal-surgeon.git
   git branch -M main
   git push -u origin main
   ```

## Firebase App Hosting (CI/CD)

This application is optimized for **Firebase App Hosting**. Once your code is on GitHub:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select **App Hosting** from the sidebar.
3. Click **Get Started** and link the GitHub repository you just created.
4. Follow the setup wizard (it will detect Next.js automatically).
5. Every time you `git push`, Firebase will automatically build and deploy your surgical theater.

## Core Features

- **Operating Room**: Input ground truth lyrics and upload dry vocal stems for spectral analysis.
- **Forced Alignment**: Precise word-level synchronization using Gemini-powered Genkit flows.
- **Spectral Scoring**: Automated clarity assessment to identify "ghosted" words.
- **Surgical EQ**: Dedicated 4-band control tuned for clinical audio precision.
- **Project Archives**: Persistent storage of projects and analysis history via Firestore.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Firestore (Hierarchical user-ownership model)
- **Auth**: Firebase Google Operator Sign-in
- **AI**: Genkit with Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS + ShadCN UI (Ink/Bone/Blood aesthetic)
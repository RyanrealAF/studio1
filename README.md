# VOCAL SURGEON

A lyrics-anchored, word-level vocal stem clarity engine built with Next.js, Firebase, and Genkit.

## Getting Started

1.  **Operator Login**: Sign in with your Google account via the sidebar.
2.  **New Incision**: Navigate to the **Surgery Room** to start a new project.
3.  **Setup**: Provide the ground truth lyrics and upload your dry vocal stem (WAV/FLAC).
4.  **Analysis**: Run the spectral mapping engine to identify "ghosted" words.
5.  **Surgery**: Inspect word-level clarity scores and apply surgical fixes or EQ profiles.

## Deployment to GitHub

To deploy this project to GitHub:

1.  **Initialize Git**: `git init`
2.  **Add Files**: `git add .`
3.  **Commit**: `git commit -m "Initial commit: Vocal Surgeon Clinical Console"`
4.  **Create Repository**: Create a new repository on GitHub.
5.  **Push**:
    ```bash
    git remote add origin <your-repo-url>
    git branch -M main
    git push -u origin main
    ```

## Firebase App Hosting

This app is optimized for **Firebase App Hosting**. Once your repository is pushed to GitHub:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select **App Hosting** from the sidebar.
3.  Click **Get Started** and link your GitHub repository.
4.  Follow the configuration steps (Next.js is detected automatically).
5.  Deployments will trigger automatically on every push to your main branch.

## Tech Stack

- **Next.js 15 (App Router)**: Functional Clinical UI.
- **Firebase Auth**: Google Operator Sign-in.
- **Firestore**: Real-time project and token persistence.
- **Genkit AI**: Forced alignment and spectral confidence scoring.
- **ShadCN UI + Tailwind**: Cinematic "Ink/Bone/Blood" professional aesthetic.

# Instructions
Step-by-step for creating a react front end and deploying it to AWS S3 (Static Site Hosting)

## Buid React App
1. Start projectIn terminal:
   ```bash
   npm create vite@latest my-demo-frontend -- --template react
   cd my-demo-frontend
   npm install
   npm run dev
   ```
2. Talk to backend:
   - Create .env file in main folder
   - Set backend URL in .env file:
     ```bash
     VITE_API_URL=http://localhost:8080/api
     ```
  - In app, connect to endpoint: 
     ```bash
     fetch(`${import.meta.env.VITE_API_URL}/your-endpoint`)
     ```

3. Build for production
  Create a dist/ folder — the static files to upload to S3.
   ```bash
   npm run build
   ```

## Deploy to AWS S3 (Static Site Hosting)
Create an S3 bucket
Enable static website hosting
Upload contents of dist/
(Optional) Point a domain using Route 53
Set the right bucket policy for public read access


1. Set up your S3 bucket
  - Go to the AWS Console > S3
  - Create a bucket
  - Name: my-demo-frontend (or whatever)
  - Uncheck “Block all public access”
  - Enable Static Website Hosting
  - Set index document: index.html

2. Upload site
  - Drag the contents of the dist/ folder (not the folder itself!) into the bucket.
  - Then, go to the “Permissions” tab and add a bucket policy like:
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowPublicRead",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::<S3-bucket-name>/*"
        }
      ]
    }
    ```

3. Access site
Go to the Static Website Hosting URL (something like http://my-demo-frontend.s3-website-us-east-1.amazonaws.com) and test it.


# Original Readme: React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

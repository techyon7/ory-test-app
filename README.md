# ory-test-app

## Getting started

1. Create an account on Ory Network

   https://console.ory.sh/registration
   
2. Install Ory CLI
   ```bash
   brew install ory/tap/cli
   ```
   
3. Create a new Ory project
   ```bash
   ory create project --name "Example"
   ```

4. Create a tunnel for local development (You can find the project slug in the Ory Console)
   ```bash
   ory tunnel --dev --project={project.id-or-project.slug} http://localhost:3000
   ```

5. Clone the project.

   ```bash
   git clone https://github.com/techyonic/ory-test-app
   ```

6. Access the project directory.

   ```bash
   cd ory-test-app
   ```

7. Install dependencies.

   ```bash
   npm install
   ```

8. Start server at [http://localhost:3000](http://localhost:3000).

   ```bash
   npm run start
   ```

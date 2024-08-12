# Secretary Main Project

## Overview

The Secretary Main project is a full-stack application designed to manage and organize tasks efficiently. It consists of a client-side interface and a server-side backend, allowing for seamless task management, user interaction, and data handling.

## Features

- **Client-Side Interface**: Built with modern web technologies, providing a responsive and intuitive user experience.
- **Server-Side Backend**: Manages data processing, storage, and API endpoints.
- **User Management**: Supports user authentication and personalized task management.
- **Task Automation**: Includes scripts and tools for automating routine tasks.
- **Data Security**: Ensures that user data is securely handled and stored.

## Project Structure

```plaintext
secretary-main/
├── client/               # Client-side code (frontend)
├── server/               # Server-side code (backend)
├── .gitignore            # Files and directories ignored by Git
├── CONTRIBUTING.md       # Guidelines for contributing to the project
├── LICENSE.md            # Licensing information
├── Pipfile               # Python dependencies
├── Pipfile.lock          # Locked Python dependencies
├── README.md             # Project documentation
├── package.json          # Node.js project metadata and dependencies
├── run_client.sh         # Script to run the client
├── run_server.sh         # Script to run the server
└── user_secrets.txt      # User secrets and sensitive information
```

## Prerequisites

- **Python**: Required for running the server-side code.
- **Node.js**: Required for running the client-side code.
- **Pipenv**: Used for managing Python dependencies.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/secretary-main.git
   cd secretary-main
   ```

2. **Install Python Dependencies**

   Use `Pipenv` to install the required Python dependencies:

   ```bash
   pipenv install
   ```

3. **Install Node.js Dependencies**

   Navigate to the `client` directory and install the Node.js dependencies:

   ```bash
   cd client
   npm install
   ```

## Running the Project

1. **Run the Server**

   Use the provided script to start the server:

   ```bash
   ./run_server.sh
   ```

   Alternatively, you can manually run the server using `Pipenv`:

   ```bash
   pipenv run python server/app.py
   ```

2. **Run the Client**

   Use the provided script to start the client:

   ```bash
   ./run_client.sh
   ```

   Alternatively, you can manually start the client using `npm`:

   ```bash
   cd client
   npm start
   ```

## Configuration

- **Environment Variables**: Environment variables in the `user_secrets.txt` are reandomly generated populated data login information.
- **Sign in yourself**: Create a new user on the login page to generate your own data.

## Known Issues

- **Access to all clients**: Every user has access to every client. This is a security risk but, is not within the scope of what I was accomplishing with this tool. Patching data modifies data for all users.
- **Access to all services**: Every user has access to every service. This is a security risk but, is not within the scope of what I was accomplishing with this tool. Patching data modifies data for all users.
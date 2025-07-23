## 🚀 How to Run the Project
project/
├── frontend/   ← React (Vite)
└── backend/    ← Node.js (native)

### 🧪 General Preparation

Make sure you have installed:

- [Node.js (v18+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- PostgreSQL (if used in the backend)

---

## 📦 Backend Setup

1. Navigate to the backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Copy the environment file:

    ```bash
    cp .env-example .env
    ```

4. Run the database (optional, if there is a script):

    ```bash
    ./entrypoint.sh
    ```

5. Start the server:

    ```bash
    npm run dev
    ```

---

## 💻 Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Copy the environment file:

    ```bash
    cp .env-example .env
    ```

4. Start the frontend:

    ```bash
    npm run dev
    ```

5. Open in your browser:

    [http://localhost:5173](http://localhost:5173)

---

## 📁 Documentation for Each Part

For more detailed documentation, refer to the README file in each folder:

- [`frontend/README.md`](./frontend/README.md)
- [`backend/README.md`](./backend/README.md)

---

## 📝 License

The license is tailored to the needs of this project.

# BlogSphere: Frontend & Backend

A modern blogging platform where creativity meets community. Built with React for the frontend and Django for the backend, BlogSphere empowers users to share stories, connect with readers, and engage with fellow writers.

## 📂 Project Structure

The repository is organized into two main folders:

- **Frontend**: Built with React and Vite, located in the `frontend` folder.
- **Backend**: Developed with Django, located in the `backend` folder.

Navigate to the respective folder for detailed setup and instructions.

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **pip**
- **Mysql**

### Setting Up the Project

#### Frontend Setup

1. **Navigate to the frontend folder**:

   ```bash
   cd blogsphere/frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the app**:
   Open your browser and visit `http://localhost:5173`.

#### Backend Setup

1. **Navigate to the backend folder**:

   ```bash
   cd blogsphere/backend
   ```

2. **Set up a virtual environment**:

   ```bash
   python -m venv env
   source env/bin/activate # For Windows: env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations**:

   ```bash
   python manage.py migrate
   ```

5. **Start the development server**:

   ```bash
   python manage.py runserver
   ```

6. **Access the backend**:
   Visit `http://127.0.0.1:8000` to interact with the API.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**:
  - Tailwind CSS
  - CSS Modules
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **API Integration**: Axios
- **Code Quality**:
  - ESLint
  - Prettier
  - Husky (pre-commit hooks)

### Backend

- **Framework**: Django 4
- **Database**: MySQL 8.0 (Default)
- **Authentication**: Django REST Framework (DRF) with JWT
- **API**: RESTful API with DRF

---

## 🎯 Features

### User Interface

- Responsive design for all devices
- Modern and clean UI with smooth animations
- Loading states and error handling
- Toast notifications for user feedback

### Authentication

- User registration and login
- Protected routes for authorized access

### Blog Features

- Create, edit, and delete posts
- Rich text editor with markdown support
- Image upload and management
- categories for posts

### Social Features

- comment on posts
- User profiles with detailed statistics

---

## 📫 Contact

For questions or suggestions, reach out to us:

- **Email**: [amardeep10as@gmail.com](mailto:amardeep10as@gmail.com)

# CineVision

## 🎬 General Description

**CineVision** is a full-stack web application that allows users to manage and explore movies through a modern, interactive interface. It features:

- A **Node.js / Express / Sequelize** backend connected to an **Oracle database**.
- A **modular Angular / Bootstrap** frontend with a responsive and user-friendly design.
- A **role-based system** (Admin and User) with dynamic filtering and an interactive movie rating system.

👉 For detailed documentation and setup instructions, refer to the specific `README.md` files in each subdirectory:

- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)  
![SQL](https://img.shields.io/badge/SQL-4479A1?logo=postgresql&logoColor=white)  
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)  
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)  
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)  
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)  
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white)  
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=white)  
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)  
![Oracle](https://img.shields.io/badge/Oracle-FF0000?logo=oracle&logoColor=white)  

---

## 🌟 Main Features

### Backend

- RESTful API to manage movies, genres, production countries, production companies, and users.
- Automatic API documentation using **Swagger**.
- Database synchronization using **Sequelize**.
- Secure authentication with **JWT** (JSON Web Tokens):
  - Token creation and validation.
  - Browser-safe storage and automatic injection in API calls.
  - Session expiration management.
- Robust error handling and data validation.
- Optimized OracleDB access via connection pool and parameterized queries.

### Frontend

- **Admin Role**:
  - Full CRUD access to movies, genres, production countries, and companies.
- **User Role**:
  - Browse, filter (by title/genre), and view detailed movie info.
  - Rate movies (1 to 10), with real-time updates to the backend.
- Responsive UI using **Bootstrap**.
- Multilingual support via Angular localization.
- Secure login and registration flow with form validation.

---

## 🧱 Technical Architecture

- **Backend**: Node.js, Express, Sequelize, Swagger, OracleDB
- **Frontend**: Angular, TypeScript, Bootstrap
- **Database**:
  - Based on *The Movies Dataset* from Kaggle
  - Relational schema with over 10 interconnected tables
  - Preprocessing done with Python and Pandas

---

## 🔑 Key Functionalities

- ✅ Role-based authentication and secure operations
- 🔍 Dynamic movie filtering (title, genre)
- ⭐ Interactive movie rating system
- 🧩 Scalable and modular architecture
- 🌐 Multilingual and responsive user interface

---

## 🛠️ Work Overview and Contributions

### 📊 Data Preparation

- Retrieved and cleaned data from *The Movies Dataset* using Python/Pandas.
- Designed relational schema (with primary/foreign keys) for OracleDB.
- Restructured and imported CSV data into the Oracle database (using SQLLoader and SQL Developer).
- Verified and ensured data integrity post-import.

### 🔧 Backend

- Built a complete REST API with Express and Sequelize.
- Implemented JWT-based authentication and route protection.
- Developed CRUD endpoints for all entities.
- Connected backend to Oracle with secure and efficient queries.
- Integrated Swagger for API documentation.

### 💻 Frontend

- Created a responsive UI with Angular and Bootstrap.
- Developed admin and user role-based views.
- Built dynamic filtering and real-time rating systems.
- Handled Angular form validations.
- Integrated Angular localization for multi-language support.

---

## 👥 Contributors

- **Ilan Zini** — Data preparation, relational schema design, Oracle DB import, backend API.
- **Prosper Wang** — Data preparation, relational schema design, Oracle DB import.
- **Lisa Naccache** — Oracle DB import, backend API, Frontend development, role-based UI, rating system, filtering.
- **Antoine Vansieleghem** — JWT authentication, route protection, OracleDB connection, backend API.

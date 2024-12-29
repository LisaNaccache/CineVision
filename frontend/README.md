# App Frontend

This project is the frontend part of a web application designed to manage and display information about movies. The project was built using Angular and follows strict TypeScript conventions. It includes features for user registration, login, and managing movie data.

## Project Structure

- **src/app**: Main directory containing the application modules and components.
  - **Admin**: Components for administrative functionalities.
  - **Cinema, Film, Genre**: Modules and components to manage cinema, films, and genres.
  - **SessionFilm**: Manages sessions and related data.
  - **Review**: Components for handling user reviews.
  - **Models**: TypeScript models defining the structure of data objects.
  - **guards**: Contains route guards (`auth.guard.ts`) for protecting specific routes.
  - **connection**: Handles connection-related functionalities.
  - **login, register, inscription**: Modules for user authentication and registration.

## Features

1. **User Registration and Login**:
  - Components:
    - `register.component.ts`: Handles user registration.
    - `login.component.ts`: Manages user login.
  - Backend integration via REST APIs.

2. **Movie Management**:
  - Create, Read, Update, Delete (CRUD) operations for films, genres, and production companies.

3. **Frontend Libraries**:
  - **Bootstrap**: For responsive design.
  - **AG-Grid**: Used for displaying movie data in a grid format.
  - **HighCharts**: Integrated for data visualization.

4. **Localization**:
  - Multi-language support using Angular’s localization features.


## Getting Started

### Prerequisites
- **Node.js**: Install the latest version of Node.js.
- **Angular CLI**: Install Angular CLI using the command: `npm install -g @angular/cli`.

### Installation Steps

## 1. Prepare the Environment
- Navigate to the frontend directory.
- Install all necessary dependencies.

## 2. Running the Application
- Start the development server.
- Access the application via your browser.

## 3. Building the Application
- Build the project for production.

## 4. Testing the Application
- Run unit tests.
- Execute end-to-end tests.

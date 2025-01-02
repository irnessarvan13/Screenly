
# Screenly 🎥✨

**Screenly** is a feature-rich movie search and management app built with React. This project allows users to discover movies, manage a personal watched list, and rate them interactively. It utilizes the OMDB API to fetch movie details and integrates a custom-built star rating system for a seamless user experience.

## Project Highlights 🚀

### What I Built

This project was designed and implemented to enhance my understanding of React, JavaScript, and managing component state effectively. Here's a breakdown of the core functionalities:

- **Dynamic Movie Search**: 
  - Users can search for movies using a keyword.
  - The app fetches real-time data from the OMDB API and displays movie suggestions.

- **Watched List Management**:
  - A personal watched list lets users keep track of the movies they’ve watched.
  - Users can add movies to the watched list and remove them if needed.
  - Persistent data storage is implemented using `localStorage`.

- **Star Rating Component**:
  - A custom, reusable `StarRating` component allows users to rate movies.
  - The component dynamically adapts to different rating scales and sizes.

- **Error Handling & Loading Indicators**:
  - Gracefully handles API errors with user-friendly messages.
  - Displays loading spinners while fetching data from the API.

- **Interactive User Experience**:
  - Components update dynamically based on user actions, providing a responsive and interactive experience.

---

## Features 🎬

- **Search for Movies**: Powered by the OMDB API, the app fetches movie data based on user queries.
- **Interactive Star Ratings**: Users can rate movies directly in the app, with visually appealing feedback.
- **Watched List**: Add, view, and remove movies from a persistent watched list stored in `localStorage`.
- **Error Handling**: User-friendly error messages in case of API failures or invalid queries.
- **Responsive Design**: The app is styled to look great across devices.

---

## Core Technologies 🛠️

- **React**: Component-based UI development.
- **OMDB API**: Movie data provider.
- **CSS**: Styling with responsive design principles.
- **JavaScript**: Logic and dynamic functionality.

---

## How I Solved Challenges 💡

- **State Management**:
  - Used `useState` to manage component-level states like `query`, `movies`, `watched`, and `rating`.
  - Leveraged `useEffect` to handle side effects like fetching API data and updating `localStorage`.

- **Error Handling**:
  - Wrapped API calls in `try...catch` blocks to handle errors gracefully.
  - Displayed meaningful messages to users when movies weren’t found or network errors occurred.

- **Custom Components**:
  - Built a reusable `StarRating` component that adapts based on props like `maxRating`, `size`, and `color`.
  - Incorporated hover effects and visual feedback for interactive usability.



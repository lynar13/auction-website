# Auction House Project

## Overview
The **Auction House Project** is a web application that allows users to create, manage, and participate in online auctions. The app is built with **Vite**, styled using **Bootstrap** and **SASS/SCSS**, and deployed using **GitHub Pages**. The project features user authentication, listing creation, bidding functionality, and search capabilities.

---

## Features

### User Stories
1. **Registration**
   - A user with a `stud.noroff.no` email may register.
2. **Login**
   - A registered user may log in to the application.
3. **Logout**
   - A registered user may log out of their account.
4. **Profile Management**
   - A registered user may update their avatar.
   - A registered user may view their total credits.
5. **Listing Management**
   - A registered user may create a listing with:
     - Title
     - Deadline date
     - Media gallery
     - Description
   - A registered user may view bids made on their listings.
6. **Bidding**
   - A registered user may add a bid to another user's listing.
7. **Search**
   - An unregistered user may search through all available listings.

---

## Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) - Fast build tool and development server.
- **Styling**: [Bootstrap](https://getbootstrap.com/) and [SASS/SCSS](https://sass-lang.com/) for responsive and customizable design.
- **Deployment**: [GitHub Pages](https://pages.github.com/) for hosting and deployment.
- **Testing**: Test the app locally using `npm run dev`.

---

## Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/auction-house.git
   cd auction-house

2. **Install Dependencies**
   ```bash
   npm install

3. **Run the app**
    ```bash
    npm run dev

4. **Build for production**
    ```bash
    npm run build

5. **Preview Production builds**
    ```bash
    npm run preview

## Deployment to GitHub Pages

1. **Build the app for production**
    ```bash
    npm run build

2. **Deploy to Netlify
    - Set the base option in vite.config.js to the repository name:
    ```javascript
    export default {
        base: '/aution-website/',
    }
    ```
    - Commit and push the changes to GitHub Pages
    ```bash
    git add .
    git commit -m "Configured GitHub Pages deployment"
    git push origin

3. **Activate to GitHub Pages**
    - Navigate to your repository on GitHub.
    - Go to Settings > Pages.
    - Select the branch(gh-pages) and directory where the build files are located (usually /dist).
    - Save your settings, and the app will be deployed to https://your-username.github.io/auction-website.

## Styling with SASS/SCSS
- Variables: Manage colors, fonts, and spacing globally in _variables.scss.
- Mixins: Create reusable CSS rules in _mixins.scss:
- Bootstrap Integration:
    - Customize Bootstrap using SASS variables.
    - Example:
    ```scss
    @import "bootstrap/scss/bootstrap";
    $primary: #007bff;
    $secondary: #6c757d;

## Testing the Application

1. **Run the app in development mode:**
    ```bash
    npm run dev

2. **Test core functionality:**

    - User registration and login.
    - Listing creation and bidding.
    - Viewing and searching for listings.

## Future Enhancements

- Add real-time bid updates using WebSockets.
- Implement advanced search filters (e.g., price range, category).
- Add notifications for bid activity.

## License
This project is licensed under the MIT License.

## Contributors
- Lyn Resell - Project Lead

## Acknowledgements

- Noroff School of Technology for the project requirements.
- Bootstrap for responsive design framework.
- SASS for enhanced CSS capabilities.
- Vite for fast development and build tooling.


This README file includes:
- An overview of the project.
- A description of the user stories.
- Setup and deployment instructions.
- Technical details about the project, including styling, framework, and testing information.


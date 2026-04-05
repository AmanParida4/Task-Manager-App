# 📝 Premium Task Management App

[Live Demo](https://task-manager-app-two-sooty.vercel.app?_vercel_share=AmfUWrwS1Qk5pWyemVKJYqyZ4lWak4Xk) 

Hey there! Welcome to my Task Management application. 

I built this project as a frontend assessment, with a heavy focus on delivering a premium, production-ready user interface and robust client-side state management. Instead of just checking boxes, my goal was to build an app that actually feels good to use—incorporating smooth micro-interactions, responsive design, and a clean architectural approach.

##  Key Features & Highlights

###  Premium UI/UX
* **Custom Dark/Light Theme:** Fully integrated theme toggling using a sleek, icon-based UI. The dark mode uses deep space colors (`#0f1115`) rather than generic grays for a modern SaaS feel.
* **Custom React Modals:** Replaced jarring browser native alerts (`window.confirm`) with beautifully animated, backdrop-blurred custom React modals for destructive actions (like deleting a task).
* **Slide-Out Task Form:** Instead of a cluttered single-page view, the task creation form smoothly slides in from the right side, seamlessly reflowing the main task list without breaking the layout.
* **Micro-interactions:** Custom CSS hover states, floating cards, and button press animations to give the app a tactile, satisfying feel.

###  Core Functionality
* **Mock Multi-Tenant Authentication:** Built a pseudo-auth flow that partitions data. If "User A" logs in, they only see their tasks. If they log out and "User B" logs in, it dynamically generates a new, isolated LocalStorage bucket for them.
* **Native Drag & Drop:** Implemented HTML5 native drag-and-drop allowing users to manually reorder tasks.
* **Advanced Filtering & Sorting:** Users can instantly search by title, filter by Priority/Status, and sort by Due Date, Priority, or their custom Drag & Drop order.
* **API Integration:** On a user's first login, the app fetches initial placeholder tasks from the JSONPlaceholder API, seamlessly parsing the Latin text into professional task titles to demonstrate asynchronous data fetching.

##  Tech Stack
* **Framework:** React.js (Vite)
* **Styling:** Bootstrap 5.3 + Custom CSS (for animations, glassmorphism, and overrides)
* **Typography:** Plus Jakarta Sans (Google Fonts)
* **State Management:** React Hooks (`useState`, `useEffect`) + Browser LocalStorage
* **Icons:** Bootstrap Icons

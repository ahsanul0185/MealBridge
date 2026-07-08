# MealBridge Food Waste Donation Platform

**Full-stack restaurant-to-NGO food donation web app**

| | |
|---|---|
| **Brand** | MealBridge |
| **Output** | One local full-stack web application with Restaurant and NGO roles |
| **Primary goal** | Build a working platform where restaurants can post extra food and NGOs can claim it before expiry |

## 1. Project Overview

MealBridge needs a full-stack web application that connects restaurants with NGOs for extra food donation. Restaurants should be able to post extra food with quantity, pickup location, food type, prepared time, safe-until time and image. NGOs should be able to view available food posts, filter them, claim food, update pickup status and mark the food as picked up.

The project must include both frontend and backend. The final app must run locally. The app must have only two roles: Restaurant and NGO. An admin role is not part of this project.

## 2. Company Details

MealBridge is a food donation coordination platform focused on reducing food waste. It helps restaurants share extra food with NGOs so the food can be collected and distributed before it expires.

## 3. Purpose

The purpose of this project is to create a simple donation workflow. A restaurant should be able to post extra food in a few steps. An NGO should be able to find available food, check expiry time, claim the food and complete pickup.

## 4. User Roles

| Role | What the role can do |
|---|---|
| **Restaurant** | Register, login, create food posts, upload one food image, view own donations, cancel a post before pickup, view claimed NGO details, view pickup status, mark food as handed over and view donation summary. |
| **NGO** | Register, login, view available food posts, filter by area and food type, open food details, claim available food, view claimed food, update pickup status, mark food as picked up and view pickup summary. |

## 5. Required Features

| Feature | Required note |
|---|---|
| User authentication | The app must support registration and login for Restaurant and NGO roles. |
| Role-based dashboard | Restaurants and NGOs must see different dashboards after login. |
| Food donation post | Restaurants must be able to create food posts with required details and one image. |
| Available food listing | NGOs must be able to view food posts with Available status. |
| Food detail page | NGOs must be able to open a food post and review full details before claiming. |
| Food claim flow | NGOs must be able to claim only Available food posts. |
| Pickup tracking | Claimed food must support pickup status updates. |
| Expiry countdown | Each food post must show the time left before safe_until_time. |
| Expired food handling | Expired food must not be claimable. |
| Restaurant history | Restaurants must see all food posts created by them. |
| NGO claim history | NGOs must see all food posts claimed by them. |
| Impact summary | Dashboards must show counts such as total donations, plates, claims and completed pickups. |

## 6. Food Donation Post Fields

- Food type values must be **Veg** and **Non-Veg**.
- Status values must be **Available, Claimed, On the way, Picked up, Expired** and **Cancelled**.

Fields:
- `food_name`
- `food_type`
- `quantity`
- `pickup_address`
- `area`
- `prepared_time`
- `safe_until_time`
- `image_url`
- `note`
- `status`
- `restaurant_id`
- `claimed_by`

## 7. Main Screens

| Screen | Required note |
|---|---|
| Landing Page | Shows project purpose and buttons for Restaurant signup, NGO signup and login. |
| Register Page | Lets users register as Restaurant or NGO. |
| Login Page | Lets existing users login. |
| Restaurant Dashboard | Shows restaurant donation summary and recent posts. |
| Add Food Donation Page | Lets restaurant create a food donation post. |
| My Donations Page | Shows all food posts created by the restaurant. |
| NGO Dashboard | Shows available food summary and claimed pickup summary. |
| Available Food Page | Shows available food posts for NGOs. |
| Food Detail Page | Shows full food details and claim button. |
| My Claims Page | Shows food posts claimed by the NGO. |
| Pickup Status Page | Lets NGO update pickup status. |

## 8. Functional Requirements

- A restaurant can create a food post only after login.
- An NGO can claim food only after login.
- An NGO can claim only food posts with Available status.
- Expired food posts must not show an active claim button.
- When an NGO claims food, the food post status must change from Available to Claimed.
- A claimed food post must store the NGO ID and claim time.
- The NGO can update pickup status to On the way.
- The NGO can mark the post as Picked up.
- The restaurant can view the pickup status for its own food posts.
- The restaurant can mark food as handed over.
- The restaurant can cancel a post only before it is picked up.
- The app must show an expiry countdown using safe_until_time.
- The app must show a safe pickup message such as "Pickup before 30 minutes of expiry."
- The app must hide or disable claim action for expired food.
- Both dashboards must show donation and pickup counts.

## 9. Expiry Logic and Safe Pickup Rules

- Each food post must have `prepared_time` and `safe_until_time`.
- `safe_until_time` must be later than `prepared_time`.
- The frontend must show an expiry countdown such as "Expires in 1 hour 25 minutes."
- If `safe_until_time` has passed, the post must be treated as Expired.
- Expired posts must not be claimable by NGOs.
- The food detail page must show the message "Pickup before 30 minutes of expiry."
- Expired food can be hidden from the Available Food page or shown with a disabled claim button.

## 10. Dashboard Requirements

| Dashboard | Required summary items |
|---|---|
| Restaurant Dashboard | Total food posts, Available posts, Claimed posts, Picked up posts, Expired posts and total plates donated. |
| NGO Dashboard | Available food count, Claimed pickups, On the way pickups, Completed pickups and total plates collected. |

## 11. Backend API Requirements

| Group | API routes |
|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile` |
| Restaurant | `POST /api/food`, `GET /api/food/my-posts`, `PUT /api/food/:id`, `PUT /api/food/:id/cancel`, `GET /api/food/:id/claim-info`, `PUT /api/food/:id/handed-over` |
| NGO | `GET /api/food/available`, `GET /api/food/:id`, `POST /api/food/:id/claim`, `GET /api/claims/my-claims`, `PUT /api/claims/:id/status`, `PUT /api/claims/:id/picked-up` |
| Dashboard | `GET /api/dashboard/restaurant`, `GET /api/dashboard/ngo` |

## 12. Database Requirements

Create these models or tables. Field names may use snake_case or camelCase, but the meaning must stay the same.

| Model/Table | Fields |
|---|---|
| **User** | id, name, email, password, phone, role, address, area, created_at. Role must be `restaurant` or `ngo`. |
| **FoodPost** | id, restaurant_id, food_name, food_type, quantity, pickup_address, area, prepared_time, safe_until_time, image_url, note, status, claimed_by, created_at, updated_at. |
| **Claim** | id, food_post_id, ngo_id, claim_time, pickup_status, picked_up_time, created_at, updated_at. |

## 13. Frontend Requirements

- Use React.js for the frontend.
- Use React Router for page navigation.
- Use Axios or fetch for API calls.
- Use CSS or Tailwind CSS for styling.
- The UI must be responsive for desktop screens.
- The UI must include food cards, status badges, expiry countdown, role-based dashboards, forms, filters and empty state messages.

## 14. Backend Requirements

- Use Node.js and Express.js for the backend.
- Use MongoDB for the database.
- Use JWT authentication for login sessions.
- Use bcrypt or an equivalent password hashing method before storing passwords.
- Use Multer, local upload handling or Cloudinary for one food image upload.
- The backend must stop NGOs from claiming expired or already claimed food posts.
- The backend must apply role checks for Restaurant and NGO routes.

## 15. Validation Requirements

- User name is required.
- Email is required and must be valid.
- Password is required.
- Role is required and must be Restaurant or NGO.
- Food name is required.
- Quantity is required and must be greater than 0.
- Pickup address is required.
- Area is required.
- Prepared time is required.
- Safe until time is required.
- Safe until time must be after prepared time.
- Food type must be Veg or Non-Veg.
- Food status must use the allowed status values only.

## 16. Design Requirements

The UI should be simple and easy to use.

- Background: light warm white
- Primary color: green
- Accent color: orange
- Text color: dark gray
- Use readable fonts and enough spacing.
- Use simple forms and card layouts.
- Do not use paid UI templates.

## 17. Required Folder Structure

Deliver the project in this folder structure:

```
MealBridge_FoodDonation_Platform/
MealBridge_FoodDonation_Platform/frontend/
MealBridge_FoodDonation_Platform/backend/
MealBridge_FoodDonation_Platform/screenshots/
MealBridge_FoodDonation_Platform/README.md
MealBridge_FoodDonation_Platform/API_Documentation.md
MealBridge_FoodDonation_Platform/.env.example
MealBridge_FoodDonation_Platform/demo_data.json
```

## 18. Deliverables

| # | Deliverable | Format |
|---|---|---|
| 1 | Frontend source code folder | — |
| 2 | Backend source code folder | — |
| 3 | Database schema or model files | `.js` |
| 4 | README file | `.md` |
| 5 | Environment sample file | `.env.example` |
| 6 | Screenshots folder | `.png` images |
| 7 | API documentation | `.md` |
| 8 | Demo data file | `.json` |

## 19. File Naming Convention

Use this naming pattern for main files and folders: `MealBridge_[Descriptor]_v[N]`

- `MealBridge_Frontend_v1`
- `MealBridge_Backend_v1`
- `MealBridge_API_Documentation_v1.md`
- `MealBridge_DemoData_v1.json`
- `MealBridge_Screenshots_v1`

## 20. README Requirements

- Project overview
- Features
- Tech stack
- Folder structure
- Frontend setup steps
- Backend setup steps
- Environment variables
- How to run the project
- Demo user details
- API documentation reference

## 21. API Documentation Requirements

- API name
- HTTP method
- Route
- Request body
- Response example
- Allowed role for the API

## 22. Screenshots Required

- Landing page
- Restaurant dashboard
- Add food donation page
- NGO available food page
- Food detail page
- My claims page

## 23. Demo Data Requirements

- At least 2 restaurant users
- At least 2 NGO users
- At least 6 food donation posts
- At least 2 claimed food posts
- At least 1 expired food post

## 24. Environment Variables

`.env.example` must include placeholders for required variables.

- `PORT`
- `DATABASE_URL` or `MONGO_URI`
- `JWT_SECRET`
- `UPLOAD_FOLDER` or Cloudinary settings if used

## 25. Scope Boundaries — DO

- Build one full-stack food donation platform.
- Include only Restaurant and NGO roles.
- Include login and registration.
- Include food posting, claiming and pickup tracking.
- Include expiry countdown.
- Include one image upload per food post.
- Include dashboard summary for both roles.
- Include local setup instructions.

## 26. Not Allowed

- Admin role
- Payment system
- Subscription feature
- Delivery partner role
- Mobile app
- Live chat
- Paid plugin dependency
- Complex AI feature
- External paid service as a required dependency
- NGO verification workflow

## 27. Acceptance Checklist

- [ ] Restaurant can register and login.
- [ ] NGO can register and login.
- [ ] Restaurant can create a food donation post.
- [ ] Restaurant can upload one food image.
- [ ] NGO can view available food posts.
- [ ] NGO can filter food posts by area and food type.
- [ ] NGO can open a food detail page.
- [ ] NGO can claim available food.
- [ ] Claimed food changes status from Available to Claimed.
- [ ] NGO can update pickup status to On the way.
- [ ] NGO can mark food as Picked up.
- [ ] Restaurant can view claimed NGO details.
- [ ] Restaurant can view pickup status.
- [ ] Restaurant can cancel a post before pickup.
- [ ] Expired food cannot be claimed.
- [ ] Expiry countdown is shown on food cards.
- [ ] Safe pickup message is shown on food detail page.
- [ ] Restaurant can view donation history.
- [ ] NGO can view claim history.
- [ ] Dashboard summary is shown for both roles.
- [ ] README explains setup and run steps.
- [ ] Backend APIs are documented.
- [ ] Demo data is included.
- [ ] Screenshots are included.

## 28. Final Goal

The final package should present a working full-stack food donation platform. A restaurant should be able to post extra food, and an NGO should be able to claim and pick it up before expiry. The app should be easy to run locally and simple to understand from the source code and README.
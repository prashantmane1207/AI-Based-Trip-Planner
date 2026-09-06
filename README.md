# ✈️ Waypoint — AI Trip Planner

Waypoint is a full-stack AI-powered trip planning application that generates personalized travel itineraries based on the user's destination, budget, trip duration, and travel preferences.

## 🌐 Live Demo

[View Live Demo](https://ai-based-trip-planner-blush.vercel.app/)

## 📂 Source Code

[View on GitHub](https://github.com/prashantmane1207/AI-Based-Trip-Planner)

---

## ✨ Features

* 🤖 AI-powered trip itinerary generation using OpenRouter and Llama 3.3
* 🗺️ Personalized travel planning
* 📅 Day-wise itinerary with hotels and activities
* 💰 Budget-based trip planning
* 👤 User signup and login
* 💾 Trip storage using MongoDB
* 🔗 REST API communication between React.js and Spring Boot
* 📍 Interactive map display
* 📱 Responsive user interface

---

## 🛠️ Tech Stack

| Category        | Technologies                                       |
| --------------- | -------------------------------------------------- |
| Frontend        | React.js, JavaScript, HTML5, CSS3, Tailwind CSS    |
| Maps            | Leaflet, React Leaflet, Google Maps JavaScript SDK |
| Backend         | Java 17, Spring Boot 3.2, Spring Web               |
| Database        | MongoDB                                            |
| Database Access | Spring Data MongoDB                                |
| AI              | OpenRouter, Llama 3.3 70B Instruct                 |
| Build Tool      | Maven                                              |
| API Testing     | Postman                                            |
| Development     | IntelliJ IDEA, VS Code                             |
| Version Control | Git, GitHub                                        |

---

## 🏗️ System Architecture

```mermaid
flowchart LR
    U[👤 User] --> F[⚛️ React.js Frontend]

    F -->|REST API / JSON| B[☕ Spring Boot Backend]

    B --> C[Controller Layer]
    C --> S[Service Layer]

    S --> AI[🤖 OpenRouter<br/>Llama 3.3]
    S --> DB[(🍃 MongoDB)]

    AI --> S
    DB --> S

    S --> C
    C --> F

    F --> R[📅 Personalized<br/>Trip Itinerary]
```

---

## 🔄 Application Workflow

```mermaid
flowchart TD
    A[👤 User] --> B[Enter Trip Details]

    B --> C[⚛️ React.js Frontend]

    C -->|POST Request| D[☕ Spring Boot Backend]

    D --> E[Process Trip Request]

    E --> F[Build AI Prompt]

    F --> G[🤖 OpenRouter API]

    G --> H[Generate AI Itinerary]

    H --> I[Parse AI Response]

    I --> J[Return Itinerary JSON]

    J --> C

    C --> K[📅 Display Personalized Trip]

    K --> L{Save Trip?}

    L -->|Yes| M[POST /api/trips/save]
    M --> N[(🍃 MongoDB)]

    L -->|No| O[End]
```

---

## ☕ Backend Architecture

```mermaid
flowchart TD
    F[⚛️ React.js Frontend]
        -->|HTTP Request| C[Controller]

    C --> S[AiTripService]

    S --> P[Build AI Prompt]

    P --> A[🤖 OpenRouter API]

    A --> R[AI Response]

    R --> J[Parse JSON]

    J --> I[Itinerary Object]

    I --> C

    C --> UR[UserRepository]
    C --> TR[TripRepository]

    UR --> DB[(🍃 MongoDB)]
    TR --> DB

    C --> F
```

---

## 🔁 API Request Flow

```mermaid
sequenceDiagram
    actor User
    participant React as React.js
    participant Controller as Spring Boot Controller
    participant Service as AiTripService
    participant AI as OpenRouter
    participant DB as MongoDB

    User->>React: Enter trip preferences

    React->>Controller: POST /api/trips/generate

    Controller->>Service: Generate trip

    Service->>AI: Send itinerary prompt

    AI-->>Service: AI itinerary response

    Service->>Service: Parse JSON response

    Service-->>Controller: Itinerary object

    Controller-->>React: JSON response

    React-->>User: Display itinerary

    User->>React: Save trip

    React->>Controller: POST /api/trips/save

    Controller->>DB: Save trip

    DB-->>Controller: Saved successfully

    Controller-->>React: Confirmation
```

---

## 📁 Project Structure

```text
AI-Based-Trip-Planner/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlanTrip
│   │   │   ├── TripResult
│   │   │   ├── MapSection
│   │   │   ├── MapComponent
│   │   │   ├── Home
│   │   │   ├── Login
│   │   │   ├── Signup
│   │   │   └── MyTrips
│   │   │
│   │   ├── service/
│   │   │   └── api.js
│   │   │
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/aitrip/backend/
│   │   │   │       ├── AiTripApplication.java
│   │   │   │       ├── config/
│   │   │   │       │   └── WebConfig.java
│   │   │   │       ├── controller/
│   │   │   │       │   └── AiTripController.java
│   │   │   │       ├── service/
│   │   │   │       │   └── AiTripService.java
│   │   │   │       ├── model/
│   │   │   │       │   ├── User.java
│   │   │   │       │   ├── Trip.java
│   │   │   │       │   └── Itinerary.java
│   │   │   │       └── repository/
│   │   │   │           ├── UserRepository.java
│   │   │   │           ├── TripRepository.java
│   │   │   │           └── ItineraryRepository.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── Home.png
├── Output1.png
├── Output2.png
├── Output3.png
└── README.md
```

---

## 👨‍💻 My Contribution

This project was developed as a team project. My primary responsibility was the **Java/Spring Boot backend and frontend integration**.

### Backend Development

* Developed REST APIs using Spring Boot
* Implemented trip generation, saving, and retrieval
* Developed trip-planning business logic
* Built prompts for AI itinerary generation
* Integrated OpenRouter API with Llama 3.3
* Implemented MongoDB operations using Spring Data MongoDB
* Configured CORS
* Implemented basic exception handling
* Tested REST APIs using Postman

### Frontend Integration

* Connected React.js frontend with Spring Boot REST APIs
* Implemented JSON request and response handling
* Integrated frontend trip-planning functionality with backend APIs

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js
* npm
* MongoDB
* Git

### 1. Clone Repository

```bash
git clone https://github.com/prashantmane1207/AI-Based-Trip-Planner.git
cd AI-Based-Trip-Planner
```

### 2. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend:

```text
http://localhost:8081
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Configuration

Configure the following properties in:

```text
backend/src/main/resources/application.properties
```

```properties
openrouter.api-key=YOUR_OPENROUTER_API_KEY
server.port=8081
spring.data.mongodb.uri=mongodb://localhost:27017/aitrip
```

> Never commit real API keys or database credentials to GitHub.

---

## 🧪 REST API Endpoints

| Endpoint                   | Method | Description            |
| -------------------------- | ------ | ---------------------- |
| `/api/auth/signup`         | POST   | Create a new user      |
| `/api/auth/login`          | POST   | User login             |
| `/api/trips/generate`      | POST   | Generate AI itinerary  |
| `/api/trips/save`          | POST   | Save a trip            |
| `/api/trips/user/{userId}` | GET    | Get user's saved trips |

### Example API Flow

```text
React.js
    │
    ▼
REST API Request
    │
    ▼
Spring Boot Controller
    │
    ▼
AiTripService
    │
    ├──────────────► OpenRouter API
    │                      │
    │                      ▼
    │               AI Itinerary
    │
    └──────────────► MongoDB
                           │
                           ▼
                     Saved Trip
    │
    ▼
JSON Response
    │
    ▼
React.js
```

---

## 📚 Learning Outcomes

* Java backend development with Spring Boot
* REST API development
* AI API integration
* JSON request and response handling
* MongoDB database operations
* React.js and Spring Boot integration
* Postman API testing
* Git and GitHub
* Team-based software development

---

## 👨‍💻 Developer

### Prashant Mane

**Aspiring Software Developer**

`Java` · `Spring Boot` · `React.js` · `MongoDB` · `REST APIs`

📧 [prashantmane1207@gmail.com](mailto:prashantmane1207@gmail.com)

💻 [GitHub](https://github.com/prashantmane1207)

🔗 [LinkedIn](https://www.linkedin.com/in/prashant-mane-0b125b31b/)



# 📬 Communicator – Backend

The backend of a **text communicator** built using **NestJS**, handling user registration, login, real-time message delivery, and notifications for new messages. Data is stored in a **PostgreSQL** database using **TypeORM**.

The project is **in development** – it aims to eventually support private and group chats, media sharing, and video calls.

## 🚀 Features

- ✅ User registration and login with password hashing (bcrypt)
- 🔒 Authentication and authorization using JWT
- 📤 User logout functionality
- 🧾 Exception handling with Exception Filters
- 🛡️ Guards protecting resource access
- 📡 Real-time communication via WebSockets
- 📥 Storing and retrieving messages from a PostgreSQL database
- 📢 Real-time notifications for new messages
- 📄 Pagination for retrieving messages
- 👤 Ability to change the nickname
- ❌ Account deletion
- 📑 Full API documentation via Swagger
- 📦 Use of DTO for data validation and organization

---

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/MarekNowy/Text-Comunicator---Backend-NestJS.git
cd Text-Comunicator---Backend-NestJS

# 2. Install dependencies
npm install
```
create .env file

In the `.env` file, define the following variables:

- `JWT_SECRET` – secret key for signing JWT tokens  
- `ACCESS_EXPIRES` – access token expiration time  
- `REFRESH_EXPIRES` – refresh token expiration time  

---

## 🛠️ PostgreSQL Configuration

In the `app.module.ts` file, specify the port and credentials for your PostgreSQL database instance.

Example configuration:

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432, // <- adjust according to your setup
  username: 'postgres',
  password: 'your_password',
  database: 'Users',
  autoLoadEntities: true,
  synchronize: true, // only for development use
}),
```

---

## 🏃 Running the application

```bash
npm run start:dev
```

---

## 📚 API Documentation

After running the application, the REST API documentation is available at:

```
http://localhost:3000/api
```

The documentation was generated using **Swagger**.

---

## 🧩 Future Plans

- 💬 Group chat support  
- 🗑️ Deleting individual messages  
- 🖼️ Image and media file sharing  
- 🎥 Video chat support  




# 📱 💻 Fuel Receipts Manager

A comprehensive application featuring a **Spring Boot** backend, a **Next.js** web dashboard, and a **React Native (Expo)** mobile application. The system focuses on fuel expense tracking, data visualization, and secure authentication.

---

## 🛠️ Tech Stack & Versions

### 🔙 Backend
* **Framework:** Spring Boot 4.0
* **Language:** Java 25
* **Database:** PostgreSQL
* **Build Tool:** Maven

### 🌐 Frontend Web
* **Runtime:** Node.js 24+
* **Framework:** Next.js 16+

### 📱 Frontend Mobile
* **Runtime:** Node.js 24+ (required for Expo CLI & Metro Bundler)
* **Framework:** React Native (via Expo SDK 50+)

---


## 📥 Setup

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
```bash
cd fuel.receipt.manager
```
2. Database Configuration:
- Create a PostgreSQL database (e.g., named fuel_receipts_manager).
- Open `src/main/resources/application.properties`
- Update the database credentials (spring.datasource.url, username, password) to match your local PostgreSQL setup.
3. JWT Configuration:
- Open `src/main/resources/application.properties`
- Update the jwt settings (application.security.jwt.secret-key).
4. Install Dependencies & Run:
```bash
# Linux/Mac
./mvnw clean install
./mvnw spring-boot:run

# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

Server should start on http://localhost:8081.

### Web Frontend Setup (Next.js)

1. Navigate to the web directory:
```bash
cd fuel-receipt-manager
```
2. Environment Variables:
- Create a file named `.env` in the root of the web folder.
- Add the backend URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:PORT/api/v1 (e.g. PORT=8081)
```
3. Install & Run:
```bash
npm install
npm run dev
```

Access the application at http://localhost:3000.

### Mobile App Setup (Expo)

⚠️ Important: The mobile app cannot access localhost (since it runs on a physical device/emulator). You must use your computer's Local IP address.
1. Navigate to the mobile directory:
```bash
cd fuel-receipt-manager-mobile
```
2.Configure API URL:
- Find your PC's IP address:
  - Windows: Run `ipconfig` (Look for IPv4 Address).
  - Mac/Linux: Run `ifconfig`.
- Create a file named `.env` in the root of the mobile folder.
- Add the backend URL:
```bash
EXPO_PUBLIC_API_URL=http://IP:PORT/api/v1 (e.g. IP=192.0.2.1, PORT=8081)
```
3. Install & Run:
```bash
npm install
npx expo start -c
```
4. Test on Device:
- On the phone:
  - Install Expo Go on your phone.
  - Ensure your phone is on the same Wi-Fi as your PC.
  - Scan the QR code displayed in the terminal.
- On the emulator:
  - Press *a* in the terminal window where Expo is running.
  * **Troubleshooting:** If you see an error about missing `ANDROID_HOME`:
    1.  Stop the server (Ctrl + C).
    2.  Run the following command in your terminal (PowerShell) to set the environment variable:
            ```
            $env:ANDROID_HOME = "C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk"
            ```
            *(Note: Replace `YOUR_USERNAME` with your actual Windows user, or adjust the path to your SDK location).*
    3.  Start the server again: `npx expo start -c`
    4.  Press **`a`** again.

# 📱 Pillba App (iOS)

A cross-platform mobile application built using React Native and Expo, optimized heavily for the iOS ecosystem while remaining adaptable for Android.

---

## 🚀 Quick Start

Get your development environment up and running in less than two minutes.

### 1. Prerequisites

Before getting started, make sure you have the following installed on your machine:

- Node.js v18 or higher recommended
- macOS required to run the native iOS Simulator
- Xcode via the Mac App Store
- CocoaPods using sudo gem install cocoapods

### 2. Installation

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/jermachong/pillba-app.git
cd pillba-app/mobile-app
npm install
```

Alternatively, use yarn install, pnpm install, or bun install depending on your package manager.

### 3. Running the App

Start the Metro bundler server:

```bash
npx expo start
```

Once the Metro server loads in your terminal, use these keyboard shortcuts to preview the app:

- Press i to automatically launch the iOS Simulator.
- Scan the displayed QR code using your physical device's camera to test instantly via the Expo Go app.

---

## 🛠️ iOS Development Workflows

Depending on your project's native dependencies, you can run the app in two distinct configurations:

### Workflow A: Expo Go (Sandboxed)

Best for rapid prototyping, UI styling, and JavaScript-only changes.

1. Download Expo Go from the iOS App Store.
2. Run npx expo start.
3. Scan the terminal QR code with your iPhone's camera.

### Workflow B: Native Development Builds (Recommended)

Required if the project introduces custom native modules, configuration plugins, or Swift-reliant code.

```bash
# Generate the native /ios folder and run directly on your simulator
npx expo run:ios
```

Note: the native /ios folder is automatically handled by Expo Continuous Native Generation (CNG) and is excluded from git by default. Modify native properties inside app.json rather than editing Xcode files directly.

---

## 📦 Building & Distribution (EAS)

Expo Application Services (EAS) is the recommended path for iOS builds, signing credentials, and App Store distribution. This repository does not currently include an EAS config file, so set that up before using the commands below.

### Local Prerequisites

Ensure you have the EAS CLI globally available and are logged into your Expo account:

```bash
npm install -g eas-cli
eas login
```

### Triggering an iOS Build

To generate a production-ready .ipa file or a TestFlight-compatible build:

```bash
# Build for internal TestFlight testing
eas build --platform ios --profile preview

# Build for official App Store production submission
eas build --platform ios --profile production
```

### Over-The-Air (OTA) Updates

Push code changes and asset updates straight to users without waiting for an App Store review:

```bash
eas update --branch production --message "Fix styling and update copy"
```

---

## 📂 Project Structure

This repository keeps the Expo app and the preserved Figma reference separately:

```text
├── design-reference/     # Preserved Figma-derived UI kit and styling reference
├── mobile-app/           # Expo React Native application
│   ├── App.tsx           # Main app entry point and screen composition
│   ├── app.json          # Expo configuration and native metadata
│   ├── assets/           # App icons and images
│   ├── package.json      # App dependencies and scripts
│   └── tsconfig.json     # TypeScript compiler configuration
└── README.md             # Repository overview and setup guide
```

---

## 📜 Available Scripts

Run these scripts from the mobile-app directory using your preferred terminal:

| Script          | Description                                          |
| :-------------- | :--------------------------------------------------- |
| npm run start   | Boots up the local Metro bundler.                    |
| npm run ios     | Starts Metro and forces the iOS Simulator to open.   |
| npm run android | Starts Metro and forces an Android emulator to open. |
| npm run web     | Starts Expo for browser-based preview.               |

---

## 🤝 Contributing

1. Fork this repository.
2. Create your feature branch using git checkout -b feature/AmazingFeature.
3. Commit your modifications with a clear message.
4. Push the branch to your fork.
5. Open a Pull Request targeting the main branch.

# Food Inventory Pro Backend

Welcome to the Food Inventory Pro backend repository!
<br/>There is a Client App too. [Check the App](https://github.com/LB-Brandon/FoodInventoryPro)

## Back-end Architecture
![image](https://github.com/LB-Brandon/FoodInventoryServer/assets/84883277/2010d6ba-6a09-4079-955c-dd6702ee2b40)

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)
- [Features](#features)

## Introduction

Food Inventory Pro backend provides a comprehensive API for managing food items, generating recipes, and handling images. It integrates user authentication, OpenAI's recipe generation API, and S3 storage for images.

## Installation

Follow these steps to set up the backend server locally:

1. Clone this repository: `git clone https://github.com/your-username/food-inventory-pro-backend.git`.
2. Navigate to the project directory: `cd food-inventory-pro-backend`.
3. Install dependencies: `npm install`.
4. Set up environment variables: Create a `.env` file based on the `.env.example` template.
5. Start the server: `npm start`.

## API Documentation

For detailed information on the available API endpoints and how to use them, refer to the [API Documentation](API_DOCS.md) file.

## Technologies Used

- Node.js with Express.js for building the server.
- MongoDB for storing food item and user data.
- OpenAI API for automatic recipe generation.
- Image scraping with S3 with bypassing Web Scraping Protection.
- ...

## Features

- User authentication and authorization for secure access.
- Integration with OpenAI API for automatic recipe generation based on food items.
- Convert Base64 to Image and scraping for specified recipes and uploading to S3 storage.
- Bypassing Web Scraping Protection
- ...

## Contributing

Contributions are welcome! If you find a bug or have a feature suggestion, please [open an issue](https://github.com/your-username/food-inventory-pro-backend/issues). To contribute code, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

# README.md for NY Times Most Popular Articles Project

# NY Times Most Popular Articles

This project is a React application that interacts with the NY Times Most Popular Articles API. It displays a list of articles and provides details on each article when selected.

## Features

- Fetches and displays the most popular articles from the NY Times API.
- Allows users to view details of each article.
- Responsive design for a better user experience.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ny-times-articles.git
   cd ny-times-articles
   ```

2. Install the dependencies:
   ```bash
   yarn install
   ```
   OR
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

OR

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

OR

```bash
yarn build
```

### Linting

To run the linter, use:

```bash
npm run lint
```

### Testing

This project includes unit tests and E2E tests using Vitest and React Testing Library.

#### Running Unit Tests

To run the unit tests:

```bash
yarn test
```

To run tests in watch mode:

```bash
yarn test:coverage
```

This will create a coverage report in both the terminal and an HTML format. The HTML report can be found in the coverage directory.

The coverage report includes:

Line coverage
Function coverage
Branch coverage
Statement coverage

## License

This project is licensed under the MIT License.

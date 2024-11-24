const scanner = require("sonarqube-scanner").default;
require("dotenv").config();
scanner(
  {
    serverUrl: "http://localhost:9000",
    login: "admin",
    token: process.env.REACT_APP_TOKEN,
    options: {
      "sonar.sources": "./src"
    },
  },
  () => process.exit()
);
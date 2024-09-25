const { PrismaClient } = require("@prisma/client");
// Create a new Prisma client
const db = new PrismaClient();

// Seed the database
async function main() {
  try {
    // Create categories
    await db.skill.createMany({
      data: [
        { name: "JavaScript" },
        { name: "React" },
        { name: "Node.js" },
        { name: "TypeScript" },
        { name: "Python" },
        { name: "Java" },
        { name: "C#" },
        { name: "Ruby" },
        { name: "Go" },
        { name: "Swift" },
        { name: "Kotlin" },
        { name: "Dart" },
        { name: "PHP" },
        { name: "SQL" },
        { name: "NoSQL" },
        { name: "HTML" },
        { name: "CSS" },
        { name: "SASS" },
        { name: "LESS" },
        { name: "Tailwind CSS" },
        { name: "Bootstrap" },
        { name: "Material-UI" },
        { name: "Chakra UI" },
        { name: "Ant Design" },
        { name: "Styled Components" },
        { name: "Jest" },
        { name: "Mocha" },
        { name: "Cypress" },
        { name: "React Testing Library" },
        { name: "Jasmine" },
        { name: "Enzyme" },
        { name: "Puppeteer" },
        { name: "Playwright" },
        { name: "Nightwatch.js" },
        { name: "Selenium" },
        { name: "Appium" },
        { name: "Detox" },
        { name: "XCTest" },
        { name: "JUnit" },
        { name: "TestNG" },
        { name: "NUnit" },
        { name: "Pytest" },
        { name: "RSpec" },
        { name: "Minitest" },
        { name: "JUnit" },
        { name: "Jasmine" },
        { name: "Karma" },
        { name: "Protractor" },
        { name: "Cucumber" },
        { name: "Behave" },
        { name: "SpecFlow" },
        { name: "JBehave" },
        { name: "Gauge" },
        { name: "Robot Framework" },
        { name: "Selenium" },
        { name: "Appium" },
        { name: "Cypress" },
        { name: "Playwright" },
        { name: "TestCafe" },
        { name: "Puppeteer" },
        { name: "Nightwatch.js" },
        { name: "XCTest" },
        { name: "JUnit" },
        { name: "TestNG" },
        { name: "NUnit" },
        { name: "Pytest" },
        { name: "RSpec" },
        { name: "Minitest" },
        { name: "JUnit" },
        { name: "Jasmine" },
        { name: "Karma" },
        { name: "Protractor" },
        { name: "Cucumber" },
      ],
    }),
      console.log("Skills created successfully");
  } catch (error) {
    // Log and rethrow the error
    console.error("ERROR SEEDING THE DATABASE", error);
  } finally {
    // Disconnect the client
    await db.$disconnect();
  }
}

main();

CV-CLI - Console Application for Creating CVs
This console application, CV-CLI, is designed to assist in creating a CV using various commands. Here is a breakdown of its functionalities:
Commands:
    • define-template: Allows specifying a template file for the CV.
    • add-personal: Adds personal data to the CV (name, surname, email).
    • add-about: Adds a general description of yourself. Accepts a path to a text file.
    • add-edu: Adds education information. Works similar to the add-about command, accepting a file path.
    • add-skills: Adds descriptions of your skills. Accepts command-line arguments along with their rating from 1 to 5. The rating is used to generate filled or empty stars.
    • add-image: Adds an image specified by the given URL to the CV.
    • clear: Deletes all saved data.
    • send: Allows sending messages from your LinkedIn account to recruiters. Accepts a list of emails as an argument.
Readme Description:
Challenges Faced:
The major challenge encountered while developing this CLI application was handling asynchronous file operations and ensuring proper data handling between various commands. Specifically, managing the read and write operations on JSON files, handling different data structures, and ensuring smooth interactions between the various commands posed challenges during development.
Lessons Learned:
    1. Asynchronous Operations: Dealing with asynchronous file operations in Node.js was a significant learning point. Understanding callbacks, promises, and async/await techniques for reading and writing files was crucial.
    2. Error Handling: Enhancing error handling and gracefully managing exceptions, especially in file I/O operations, was essential for maintaining the stability of the application.
    3. Modularization and Code Organization: Breaking down functionality into reusable functions, understanding the importance of modularization, and organizing code efficiently became apparent for scalability and maintainability.
    4. CLI Interaction: Learning to use libraries like yargs for creating interactive command-line interfaces, handling arguments, and options was beneficial.

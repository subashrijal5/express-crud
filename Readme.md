# User CRUD With JWT Authentication

## Requirements

- Docker and Docker Compose

## Installation and Run

1. Clone the repository.
2. Navigate to the project directory:

    ```bash
    cd /path-to-project
    ```

3. Run the following command to view the list of available commands:

    ```bash
    bash run.sh
    ```

4. You will be presented with options. To run the project:

    - Type 1 and press Enter.

5. To run end-to-end (E2E) tests:

    - Follow the steps above to run the project.
    - Type 3 and press Enter. (Note: Ensure that you have already run the project before running the tests.)

6. To stop the containers:

    - Follow the steps above to run the project.
    - Type 2 and press Enter.

7. To build the project:

    - Follow the steps above to run the project.
    - Press 4 and press Enter.

8. To exit from the shell command:

    - Press 5 and press Enter.

## API Documentation

You can find the Postman collection in the root directory of the project.

### To run the Postman collection:

1. Import the collection into Postman.
2. Run the project (refer to the [Installation and Run](#installation-and-run) section for the guide).

3. To login:

    - Call the `/api/auth` endpoint, which will set the auth token for all request headers.
    - Default Email and password to login:
    
        ```json
        {
            "email": "john@example.com",
            "password": "password"
        }
        ```

## TODO

- Write More conditions in E2E tests
- Write Unit tests

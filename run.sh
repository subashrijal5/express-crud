#!/bin/bash

while true; do
    echo "Choose an option:"
    echo "1. run project"
    echo "2. stop project"
    echo "3. run test"
    echo "4. run build"
    echo "5. exit"

    read -p "Enter the number of the desired option: " choice

    case $choice in
        1)
            docker-compose up -d
            break
            ;;
        2)
            docker-compose down -v
            break
            ;;
        3)
        # Running Install `Docker volume may not find jest module`
            docker exec  node-app npm install
            docker exec  node-app npm test
            exit 0
            break
            ;;
        4)
            docker exec node-app npm run build
            exit 0
            break
            ;;
        5)
            exit 0
            break
            ;;
        *)
            echo "Invalid option. Please enter a valid number."
            ;;
    esac
done

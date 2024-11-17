# ZOA Web Builder

This repo contains the AI model for code generation, the api and web builder interface that uses this model.

## API Layer

This layer is written in Python. It contains AI model training and an API that serves an external service using the trained model

## UI Layer

Here is a web interface written in React. In this interface, the user describes the web page they want to create and the interface created with artificial intelligence is created through the API. The next page shows the generated code and its preview.
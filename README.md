# oblichat

A horizontally scaling chat server.
Please run npm install before running the chat.

Client:
 - A simple, static html page
 - Socket.io for communication with the server
 
Server:
 - A stateless chat server
 - Messages are published through redis pub/sub
 - Allows horizontal scaling by relying on a redis server for syncronization between chat servers.

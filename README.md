# Shop For Home

Welcome to Shop For Home! This is a full-stack e-commerce web application developed in the summer of 2024 as a means to utilize a wide variety of technology and development tools I spent time learning over the past year.

## General Information

Shop For Home is a full-stack e-commerce web application designed for customers to browse and purchase home decor items. It includes a seamless shopping experience, allowing users to view products and place orders. The platform also incorporates admin functionalities, enabling administrators to perform CRUD operations on both users and products, ensuring efficient management of the store's offerings and customer base.

## Technologies and Tools

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- Angular
- TypeScript
- HTML/CSS
- Maven

## Features

Shop For Home consists of a secure login page, an interface for customers to shop, and a separate interface for administrator functionalities.

### Login

The login page validates login credentials for both users and administrators. If customers don't have an account, they're able to register as a new user by providing their name, email, and a password.

### Customer

Upon successful login, a customer is able to:
- View all available products in a list view
- View each individual product in a more detailed product view page
- Add and remove products to their cart
- Add and remove products to their wish list
- View current cart and make adjustments
- Apply available coupons to orders
- Place orders

### Administrator

Upon successful login, an administrator can:
- View and edit current products
- Add new products
- Remove products
- View and edit current users
- Add new users
- Remove users
- Assign a coupon to each user
- Pull a sales report for specified date ranges

## Implementation

I began by designing a relational database schema with tables for users, products, orders, and other related entities. This schema was then implemented in `MySQL Workbench` on my local machine. I created a new `Spring Boot` project to manage the back end, connecting it to the `MySQL` database via `MySQL Connector`. Utilizing `Spring Data JPA`, I facilitated seamless database interaction through entity management, repositories, and service classes. I developed various REST API controllers to serve as endpoints for the front end and implemented secure token-based authentication using `Spring Security` and a `JSON Web Token (JWT)` system.

For the front end, I initiated an `Angular 18` project and developed login and user registration pages. After extensive trial and error, I successfully integrated `JWT` token authentication. The front end submits user credentials to an API endpoint on the back end, where they are validated. Upon successful validation, a JWT token is returned to the front end and used to fetch unique user information. This token is stored on the front end and attached to the header of all relevant HTTP requests via an interceptor.

I implemented role-based authorization on the back end to restrict access to certain APIs and applied authorization guards on the front end for user and administrator portals. `Angular` routes and components were employed to create distinct pages for both customer and admin views. Additionally, I developed model classes that correspond to the back-end entities and service classes to communicate with the back end, allowing the retrieval of user, product, and order information.

## Future

While the base for this project is complete, I have plans to implement further functionality in the future.

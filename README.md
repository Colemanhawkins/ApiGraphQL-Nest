<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

He desarrollado un proyecto backend utilizando NestJS, GraphQL, y Postgres, enfocándome en la integración eficiente, la seguridad, y la gestión avanzada de datos. A continuación, se detallan las características clave:

# Base de Datos y CRUD:

Postgres y TypeORM fueron utilizados para manejar la persistencia de datos.
Las entidades fueron definidas con GraphQL Object Types, proporcionando un esquema claro y bien documentado.
Implementé un conjunto completo de operaciones CRUD para interactuar con los ítems, incluyendo queries y mutations.

# Autenticación y Autorización:

Se estableció un sistema de autenticación utilizando JWT, que protege las queries y mutations de la API.
La creación de usuarios, inicio de sesión y revalidación de tokens se manejan directamente a través de GraphQL.

# Gestión Avanzada de Usuarios:

Se implementaron relaciones ManyToOne dentro de la misma tabla para manejar usuarios y sus datos de manera eficiente.
Se incluyeron funcionalidades para la actualización y bloqueo de usuarios, así como la protección del esquema GraphQL.
Utilicé módulos asíncronos y factory functions para mantener la lógica modular y escalable, permitiendo la gestión de roles y actualizaciones de usuarios.

# Relaciones y Propiedad de Datos:

Las relaciones entre usuarios e ítems fueron diseñadas para garantizar que cada usuario controle su propia porción de datos.
Se implementaron validaciones, consultas específicas por usuario, y LazyRelationships para optimizar el acceso a la información.

# Estructuración de la Base de Datos:

Creé un proceso de seeding para poblar la base de datos con información útil para el desarrollo.
Se aplicaron conceptos de relaciones maestro-detalle, constraints, filtros, paginación, y conteo para manejar listas y sus ítems asociados.

# Búsquedas y Paginación:

Se desarrollaron funcionalidades avanzadas para búsquedas y paginación simultáneas, aplicables a ítems dentro de los usuarios.
Estas operaciones aseguran que los filtros y el conteo de datos sean precisos y eficientes.
El proyecto está completamente documentado y accesible a través del endpoint GraphQL en localhost:3000/graphql, donde se puede visualizar el esquema con todos los tipos, queries, y mutaciones.

## Installation

1. Clone proyect from github.

2. Copy `env.template` y rename to `env`

3. execute

```bash
$ npm install
```

4. Up docker-compose

```bash
$ docker-compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Seed

5. Ejecutar la "mutation" executeSeed, para poblar la DB.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

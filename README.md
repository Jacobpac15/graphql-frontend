# Taller GraphQL – Énfasis

Este taller consiste en un sistema completo con **frontend en React + Apollo Client** y **backend GraphQL con Apollo Server**, desplegados en la nube con **Render**.

##  Despliegue

- **Frontend:** [https://graphql-frontend-35ee.onrender.com](https://graphql-frontend-xxxx.onrender.com)
- **Backend:** [https://graphql-backend-h107.onrender.com](https://graphql-backend-h107.onrender.com)

##  Descripción

El backend expone dos queries principales:

```graphql
# Consultar razas de gatos (recibe un ID)
query {
  catBreed(id: "abys") {
    id
    name
    origin
    description
  }
}

# Consultar todos los estudiantes
query {
  students {
    id
    firstName
    lastName
    age
    email
  }
}

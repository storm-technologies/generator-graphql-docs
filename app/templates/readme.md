# <%= getName() %>

|   |   |
|---|---|
|Database | *<%= getVersion('database') %>* |
|ORM| *<%= getVersion('ormGenerator') %>* |
|Web API| *<%= getVersion('webAPI') %>* |
|Manager| *<%= getVersion('managers') %>* |

## Entities

As ORM generated base on database table names each entity has a unique generate list of queries, muations and subscriptions.

<details>
<summary> View Entities</summary>
 
<%_ entities.forEach(value => { _%>
  - [<%= value.name %>](./entities/<%= value.name %>.md) 
<%_ }) _%>

</details>

<br>

## Managers

Storm generate business logic on managers that can create queries, mutations and subscriptions.

> Mutations are more likely to exists on managers.

<details>

<summary> View Managers</summary>

<%_ managers.forEach(value => { _%>
  - [<%= value.name %>](./managers/<%= value.name %>.md) 
<%_ }) _%>

</details>

<br>

## Objects

GraphQL includes by default scalar types Int, Float, String, Boolean, and ID. Although these scalars cover the majority of use cases, to support other atomic data types our generator and managers define custom scalar types and objects.

<details>
<summary> View Objects</summary>

<%_ objectTypes.forEach(value => { _%>
  - [<%= value.name %>](./objects/<%= value.name %>.md) 
<%_ }) _%>

</details>

<br>

## Inputs

The GraphQL type system includes input objects as a way to pass complex values to fields. Input objects are often defined as mutation variables, because they give you a compact way to pass in objects to be created.

<details>
<summary> View Input Objects</summary>

<%_ inputs.forEach(value => { _%>
  - [<%= value.name %>](./inputs/<%= value.name %>.md)
<%_ }) _%>

</details>

<br>

## Enums

Enumeration types are a special kind of scalar that is restricted to a particular set of allowed values that allow back end to validate that any arguments of this type are one of the allowed values and communicate through the type system that a field will always be one of a finite set of values.

<details>
<summary> View ENUMS</summary>

<%_ enums.forEach(value => { _%>
  - [<%= value.name %>](./enums/<%= value.name %>.md) 
<%_ }) _%>

</details>

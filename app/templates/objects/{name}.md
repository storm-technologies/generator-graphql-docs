# <%= objectType.name %>

## TYPE DETAILS

```type``` **<%= objectType.name %>** 
   <%_ if (objectType.kind == "SCALAR") { _%>
   The <%= objectType.name %> scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
   <%_ } else { _%>
   { <%_ objectType.fields.forEach(field => { _%>
   - <%= field.name %> : <%= getType(field.type) %> <%= field.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- field.isDeprecated && field.deprecationReason ?  ' *```' + field.deprecationReason + '```*' : '' %>
   <%_ }) _%>

}
   <%_ } _%>

   
<br>

[Back](../readme.md)

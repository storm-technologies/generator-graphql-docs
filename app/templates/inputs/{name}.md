# Input : <%= input.name %>

## TYPE DETAILS

```type``` **<%= input.name %>** 
  { <%_ input.inputFields.forEach(field => { _%>
   - <%= field.name %> : <%= getType(field.type) %>  <%= field.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- field.isDeprecated && field.deprecationReason ?  ' *```' + field.deprecationReason + '```*' : '' %>
   <%_ }) _%>

}

<br>

[Back](../readme.md)

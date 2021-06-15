# Enum : <%= input.name %>

## TYPE DETAILS

```type``` **<%= input.name %>** { 
  
    <%_ input.enumValues.forEach(value => { _%>
   - <%= value.name %> 
   <%_ }) _%>

}


<br>

[Back](../readme.md)

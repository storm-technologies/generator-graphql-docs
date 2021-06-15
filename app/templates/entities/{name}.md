# <%= entity.name %> Entity
<%# GETTER #%>
<%_ if (entity.get !== undefined) { _%>
- *<%= entity.get.name %>* <%= getType(entity.get.type) %> <%= entity.get.description %> <%= entity.get.description %> <%= entity.get.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- entity.get.isDeprecated && entity.get.deprecationReason ?  ' *```' + entity.get.deprecationReason + '```*' : '' %>
<%_ entity.get.args.forEach(argument => { _%>
  - <%= getArgument(argument) %>
        <%_ }); 
    }
_%>
<%# SEARCH #%>
<%_ if (entity.search !== undefined) { _%>
- *<%= entity.search.name %>* <%= getType(entity.search.type) %> <%= entity.search.description %> <%= entity.search.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- entity.search.isDeprecated && entity.search.deprecationReason ?  ' *```' + entity.search.deprecationReason + '```*' : '' %>
<%_ entity.search.args.forEach(argument => { _%>
  - <%= getArgument(argument) %>
        <%_ }); 
    }
_%>

<br>

[Back](../readme.md)
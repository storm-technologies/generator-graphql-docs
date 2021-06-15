# <%= manager.name %>
<%_ if (manager.queries && manager.queries.length > 0) { _%>
## Queries
<%_ manager.queries.forEach(query => { _%>
<%_ if (query.description && query.description.length > 0) { _%>

*```<%= query.description %>```*

<%_ } _%>
   - *<%= query.name %>*(
<%_ query.args.forEach(argument => { _%>
     - <%= getArgument(argument) %>
<%_ }); _%>
   ) <%= getType(query.type) %> <%= query.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- query.isDeprecated && query.deprecationReason ?  ' *```' + query.deprecationReason + '```*' : '' %>
<%_ }); _%>
<%_ } _%>


<%_ if (manager.mutations && manager.mutations.length > 0) { _%>
## Mutations
<%_ manager.mutations.forEach(query => { _%>
<%_ if (query.description && query.description.length > 0) { _%>

*```<%= query.description %>```*

<%_ } _%>
   - *<%= query.name %>*(
<%_ query.args.forEach(argument => { _%>
     - <%= getArgument(argument) %>
<%_ }); _%>
   ) <%= getType(query.type) %> <%= query.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- query.isDeprecated && query.deprecationReason ?  ' *```' + query.deprecationReason + '```*' : '' %>
<%_ }); _%>
<%_ } _%>



<%_ if (manager.subscriptions && manager.subscriptions.length > 0) { _%>
## Subscriptions
<%_ manager.subscriptions.forEach(query => { _%>
<%_ if (query.description && query.description.length > 0) { _%>

*```<%= query.description %>```*

<%_ } _%>
   - *<%= query.name %>*(
<%_ query.args.forEach(argument => { _%>
     - <%= getArgument(argument) %>
<%_ }); _%>
   ) <%= getType(query.type) %> <%= query.isDeprecated ?  ' ⚠️ Deprecated' : '' %> <%- query.isDeprecated && query.deprecationReason ?  ' *```' + query.deprecationReason + '```*' : '' %>
<%_ }); _%>
<%_ } _%>


<br>

[Back](../readme.md)

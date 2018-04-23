$.ajax(
  {
    url: "/commandList",
    success: function(result) {
      $("#commandList").append(function() {
        let listString = "<ul>";

        for (var propName in result) {
          listString += `<li>${propName}</li>`;
        }
        
        listString += "</ul>"

        return listString;
      });
    }
  }
);
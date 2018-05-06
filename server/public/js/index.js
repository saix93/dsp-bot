'use strict';
let config = {};

$.ajax(
  {
    url: "/config",
    success: getConfig
  }
);

function getConfig(result) {
  config = result;

  $.ajax(
    {
      url: "/commandList",
      success: function(result) {
        $("#commandList").append(function() {
          let listString = "<h3>Command list:</h3><ul>";
  
          for (var propName in result) {
            listString += `<li><a href="#${propName}">${propName}</a></li>`;
          }
  
          listString += "</ul>"
  
          return listString;
        });
  
        for (var propName in result) {
          let properties = result[propName].properties;
          $("#commandList").append(createCommandBlock(properties.name, properties.description));
        }
      }
    }
  );
}

function createCommandBlock(name, description) {
  let command = "<hr></hr>";
  command += `<h3 id="${name}">${config.settings.prefix}${name}</h3>`;
  command += `${description}`;

  return command;
}
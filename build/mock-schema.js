export const schema = {
  "type": "object",
  "properties": {
    "member": {
      "type": "object",
      "properties": {
        "loginName": {
          "type": "string",
          "faker": "name.firstName"
        }
      },
      "required": ["loginName"]
    },
    "elements": {
      "type": "array",
      "minItems": 1,
      "maxItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "unique": true,
            "minimum": 1
          },
          "formId": {
            "$ref": "#/definitions/name"
          }
        },
        "required": ["id", "formId"]
      }
    },
    "element-types": {
      "type": "array",
      "minItems": 15,
      "maxItems": 15,
      "uniqueItems": true,
      "items": {
        "enum": [
          {
            "id": 1,
            "builder": "label",
            "caption": "Label"
          },
          {
            "id": 2,
            "builder": "text",
            "caption": "Text"
          },
          {
            "id": 3,
            "builder": "number",
            "caption": "Number"
          },
          {
            "id": 4,
            "builder": "date",
            "caption": "Date"
          },
          {
            "id": 5,
            "builder": "formula",
            "caption": "Formula"
          },
          {
            "id": 6,
            "builder": "yesno",
            "caption": "Yes/No"
          },
          {
            "id": 7,
            "builder": "options",
            "caption": "Options"
          },
          {
            "id": 8,
            "builder": "list",
            "caption": "List"
          },
          {
            "id": 9,
            "builder": "link",
            "caption": "Link"
          },
          {
            "id": 10,
            "builder": "subform",
            "caption": "Sub-form"
          },
          {
            "id": 11,
            "builder": "table",
            "caption": "Small Table"
          },
          {
            "id": 12,
            "builder": "grid",
            "caption": "Grid"
          },
          {
            "id": 13,
            "builder": "tabs",
            "caption": "Tabs"
          },
          {
            "id": 14,
            "builder": "title",
            "caption": "Main Title"
          },
          {
            "id": 15,
            "builder": "header",
            "caption": "Section Header"
          }
        ]
      }
    },
    "forms": {
      "type": "array",
      "minItems": 5,
      "maxItems": 10,
      "items": {
        "type": "object",
        "properties": {
          "files": {
            "type": "array",
            "minItems": 6,
            "maxItems": 6,
            "uniqueItems": true,
            "items": {
              "enum": [
                {
                  "name": "allforms",
                  "lastComment": "the last comment in all the forms",
                  "lastEditInDays": 30,
                  "icon": "folder",
                  "priority": 1
                },
                {
                  "name": "view",
                  "lastComment": "i edited the data on the form",
                  "lastEditInDays": 20,
                  "icon": "eye",
                  "priority": 2
                },
                {
                  "name": "design",
                  "lastComment": "why i made a design change goes here",
                  "lastEditInDays": 10,
                  "icon": "magic",
                  "priority": 3
                },
                {
                  "name": "lookups",
                  "lastComment": "i added a new lookup table",
                  "lastEditInDays": 50,
                  "icon": "database",
                  "priority": 4
                },
                {
                  "name": "users",
                  "lastComment": "removed an unauth user now",
                  "lastEditInDays": 60,
                  "icon": "file-text-o",
                  "priority": 5
                },
                {
                  "name": "history",
                  "lastComment": "the last comment on anything",
                  "lastEditInDays": 2,
                  "icon": "file-text-o",
                  "priority": 6
                }
              ]
            }
          },
          "name": {
            "$ref": "#/definitions/name"
          },
          "summary": {
            "$ref": "#/definitions/summary"
          },
          "revision": {
            "type": "number",
            "minimum": 0,
            "maximum": 10
          },
          "locked": {
            "type": "boolean"
          },
          "lastComment": {
            "type": "string",
            "faker": "lorem.sentence"
          },
          "lastEditInDays": {
            "type": "number",
            "minimum": 0,
            "maximum": 90
          }
        },
        "required": ["files", "name", "revision", "locked", "lastEditInDays"]
      }
    }
  },
  "required": ["forms", "member", "elements", "element-types"],
  "definitions": {
    "name": {
      "type": "string",
      "faker": "lorem.word",
      "unique": true
    },
    "active": {
      "type": "boolean"
    },
    "group": {
      "type": "string",
      //"pattern": "[a-zA-Z]+(\/[a-zA-Z]+)?",
      "enum": [
        "Main",
        "Material",
        "Molding",
        "Part"
      ]
    },
    "position": {
      "type": "number",
      "minimum": 80,
      "maximum": 1920
    },
    "summary": {
      "type": "string",
      "faker": "lorem.sentence"
    }
  }
};

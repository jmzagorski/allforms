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
    "templates": {
      "type": "array",
      "minItems": 1,
      "maxItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "faker": "lorem.word",
            "unique": true
          },
          "html": {
            "type": "string",
            "enum": [""]
          },
        },
        "required": [ "name", "html" ]
      }
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
          "name": {
            "type": "string",
            "unique": true
          },
          "formId": {
            "type": "string",
            "faker": "lorem.word",
            "unique": true
          }
        },
        "required": ["id", "name", "formId"]
      }
    },
    "element-types": {
      "type": "array",
      "minItems": 12,
      "maxItems": 12,
      "uniqueItems": true,
      "items": {
        "enum": [
          {
            "name": 1,
            "builder": "label",
            "caption": "Label"
          },
          {
            "name": 2,
            "builder": "text",
            "caption": "Text"
          },
          {
            "name": 3,
            "builder": "number",
            "caption": "Number"
          },
          {
            "name": 4,
            "builder": "date",
            "caption": "Date"
          },
          {
            "name": 5,
            "builder": "checkbox",
            "caption": "Yes/No"
          },
          {
            "name": 6,
            "builder": "radio",
            "caption": "Options"
          },
          {
            "name": 7,
            "builder": "select",
            "caption": "List"
          },
          {
            "name": 8,
            "builder": "link",
            "caption": "Link"
          },
          {
            "name": 9,
            "builder": "iframe",
            "caption": "Sub-form"
          },
          {
            "name": 10,
            "builder": "attachments",
            "caption": "File"
          },
          {
            "name": 11,
            "builder": "tabs",
            "caption": "Tabs"
          },
          {
            "name": 12,
            "builder": "header",
            "caption": "Header"
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
          "name": {
            "type": "string",
            "faker": "lorem.word",
            "unique": true
          },
          "summary": {
            "$ref": "#/definitions/summary"
          },
          "style": {
            "type": "string",
            "enum": [
              "bootstrap"
            ]
          },
          "snapshot": {
            "type": "string",
            "faker": "date.past"
          },
          "lastComment": {
            "type": "string",
            "faker": "lorem.sentence"
          },
          "lastEditInDays": {
            "type": "number",
            "minimum": 0,
            "maximum": 90
          },
          "files": {
            "type": "array",
            "minItems": 8,
            "maxItems": 8,
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
                  "name": "snapshots",
                  "lastComment": "took a snapshot of something",
                  "lastEditInDays": 60,
                  "icon": "camera-retro",
                  "priority": 6
                },
                {
                  "name": "users",
                  "lastComment": "removed an unauth user now",
                  "lastEditInDays": 60,
                  "icon": "file-text-o",
                  "priority": 7
                },
                {
                  "name": "history",
                  "lastComment": "the last comment on anything",
                  "lastEditInDays": 2,
                  "icon": "file-text-o",
                  "priority": 8
                }
              ]
            }
          }
        },
        "required": ["name", "style", "lastEditInDays", "files" ]
      }
    }
  },
  "required": [ "forms", "member", "templates", "elements", "element-types" ],
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

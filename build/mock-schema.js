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
          "id": {
            "type": "string",
            "faker": "lorem.word",
            "unique": true
          },
          "html": {
            "type": "string",
            "enum": [""]
          }
        },
        "required": [ "id", "html" ]
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
        "required": [ "id", "formId" ]
      }
    },
    "element-types": {
      "type": "array",
      "minItems": 14,
      "maxItems": 14,
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
            "builder": "checkbox",
            "caption": "Yes/No"
          },
          {
            "id": 6,
            "builder": "radio",
            "caption": "Options"
          },
          {
            "id": 7,
            "builder": "select",
            "caption": "List"
          },
          {
            "id": 8,
            "builder": "link",
            "caption": "Link"
          },
          {
            "id": 9,
            "builder": "iframe",
            "caption": "Sub-form"
          },
          {
            "id": 10,
            "builder": "attachments",
            "caption": "Attachment"
          },
          {
            "id": 11,
            "builder": "tab",
            "caption": "Tabs"
          },
          {
            "id": 12,
            "builder": "header",
            "caption": "Header"
          },
          {
            "id": 13,
            "builder": "formula",
            "caption": "Formula"
          },
          {
            "id": 14,
            "builder": "textarea",
            "caption": "Text-Resize"
          }
        ]
      }
    },
    "form-data": {
      "type": "array",
      "minItems": 9,
      "maxItems": 9,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "unique": true
          },
          "name": {
            "type": "string",
            "faker": "lorem.word",
            "unique": true
          },
          "lastEdit": {
            "type": "string",
            "faker": "date.past"
          },
          "memberName": {
            "type": "string",
            "faker": "name.firstName"
          },
          "formId": {
            "type": "string"
          }
        },
        "required": [ "id", "name", "lastEdit", "memberName", "formId" ]
      }
    },
    "form-settings": {
      "type": "object",
      "properties": {
        "namePattern": {
          "type": "string",
          "faker": "random.uuid"
        },
        "api": {
          "type": "string",
          "faker": "internet.url"
        }
      }
    },
    "forms": {
      "type": "array",
      "minItems": 5,
      "maxItems": 10,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "faker": "lorem.word",
            "unique": true
          },
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
          "lastComment": {
            "type": "string",
            "faker": "lorem.sentence"
          },
          "lastEditInDays": {
            "type": "number",
            "minimum": 0,
            "maximum": 90
          },
          "html": {
            "type": "string"
          },
          "api": {
            "type": "string",
            "enum": [ "/api/form-data" ]
          },
          "files": {
            "type": "array",
            "minItems": 9,
            "maxItems": 9,
            "uniqueItems": true,
            "items": {
              "enum": [
                {
                  "name": "data",
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
                  "name": "contributors",
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
                },
                {
                  "name": "settings",
                  "lastComment": "changed form setting",
                  "lastEditInDays": 9,
                  "icon": "cog",
                  "priority": 9
                }
              ]
            }
          }
        },
        "required": ["id", "name", "summary", "style", "lastEditInDays", "api", "files" ]
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

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
      "minItems": 2,
      "maxItems": 20,
      "items": {
        "type": "object",
        "properties": {
          "active": {
             "$ref": "#/definitions/active"
          },
          "mandatory": {
            "type": "boolean"
          },
          "type": {
            "type": "string",
            "enum":[
              "text",
              "checkbox",
              "radio",
              "textarea",
              "select",
              "label",
              "a",
              "table",
              "grid",
              "section"
            ]
          },
          "typeLength": {
            "type": "number",
            "minimum": 1,
            "maximum": 100
          },
          "name": {
            "$ref": "#/definitions/name"
          },
          "summary": {
            "$ref": "#/definitions/summary"
          },
          "group": {
            "$ref": "#/definitions/group"
          },
          "top": {
            "$ref": "#/definitions/position"
          },
          "left": {
            "$ref": "#/definitions/position"
          },
          "bottom": {
            "$ref": "#/definitions/position"
          },
          "right": {
            "$ref": "#/definitions/position"
          }
        },
        "required": ["active", "mandatory", "type", "typeLength", "name", "top", "left", "bottom", "right"]
      }
    },
    "forms": {
      "type": "array",
      "minItems": 5,
      "maxItems": 10,
      "items": {
        "type": "object",
        "properties": {
          "elements": {
            "type": "array",
            "minItems": 3,
            "maxItems": 20,
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "$ref": "#/definitions/name"
                },
                "active": {
                   "$ref": "#/definitions/active"
                },
                "group": {
                  "$ref": "#/definitions/group"
                },
                "top": {
                  "$ref": "#/definitions/position"
                },
                "left": {
                  "$ref": "#/definitions/position"
                },
                "bottom": {
                  "$ref": "#/definitions/position"
                },
                "right": {
                  "$ref": "#/definitions/position"
                }
              },
              "required": ["active", "name", "group", "top", "left", "bottom", "right"]
            }
          },
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
          "id": {
            "type": "string",
            "$ref": "#/definitions/name"
          },
          "name": {
            "type": "string",
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
          "masterId": {
            "type": "number",
            "minimum": 1,
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
        "required": ["id", "name", "revision", "masterId", "locked", "lastEditInDays", "files", "elements"]
      }
    }
  },
  "required": ["forms", "member", "elements"],
  "definitions": {
    "name": {
      "type": "string",
      "faker": "lorem.word"
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

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
      "required": [ "loginName" ]
    },
    "lookups": {
      "type": "array",
      "minItems": 10,
      "maxItems": 10,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "unique": true,
            "faker": "lorem.word"
          },
          "value": {
            "type": "object",
            "properties": {
              "a": {
                "type": "string"
              }
            },
            "required": [ "a" ]
          }
        },
        "required": [ "id", "value" ]
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
          },
          "template": {
            "type": "string",
            "enum": [ null ]
          },
        },
        "required": [ "id", "formId", "template" ]
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
    "snapshots": {
      "type": "array",
      "minItems": 1,
      "maxItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "minimum": 0,
            "unique": true
          },
          "saved": {
            "type": "string",
            "faker": "date.past"
          },
          "data": {
            "type": "object"
          },
          "formDataId": {
            "type": "number",
            "minimum": 0
          }
        },
        "required": [ "id", "saved", "formDataId" ]
      }
    },
    "form-data": {
      "type": "array",
      "minItems": 1,
      "maxItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "minimum": 0,
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
          "template": {
            "type": "string",
            "enum": [ null ]
          },
          "api": {
            "type": "string",
            "enum": [ "http://localhost:9001/api/form-data" ]
          }
        },
        "required": ["id", "template", "name", "summary", "style", "lastEditInDays", "api" ]
      }
    }
  },
  "required": [ "lookups", "form-data", "forms", "member", "elements", "element-types", "snapshots" ],
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

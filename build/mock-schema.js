export const schema = {
  'type': 'object',
  'properties': {
    'member': {
      'type': 'object',
      'properties': {
        'loginName': {
          'type': 'string',
          'faker': 'name.firstName'
        }
      },
      'required': ['loginName']
    },
    'forms': {
      'type': 'array',
      'minItems': 3,
      'maxItems': 9,
      'items': {
        'type': 'object',
        'properties': {
          'files': {
            'type': 'array',
            'minItems': 6,
            'maxItems': 6,
            'uniqueItems': true,
            'items': {
              'enum': [
                {
                  'name': 'allforms',
                  'lastComment': 'the last comment in all the forms',
                  'lastEditInDays': 30,
                  'icon': 'folder',
                  'priority': 1
                },
                {
                  'name': 'view',
                  'lastComment': 'i edited the data on the form',
                  'lastEditInDays': 20,
                  'icon': 'eye',
                  'priority': 2
                },
                {
                  'name': 'design',
                  'lastComment': 'why i made a design change goes here',
                  'lastEditInDays': 10,
                  'icon': 'magic',
                  'priority': 3
                },
                {
                  'name': 'lookups',
                  'lastComment': 'i added a new lookup table',
                  'lastEditInDays': 50,
                  'icon': 'database',
                  'priority': 4
                },
                {
                  'name': 'users',
                  'lastComment': 'removed an unauth user now',
                  'lastEditInDays': 60,
                  'icon': 'file-text-o',
                  'priority': 5
                },
                {
                  'name': 'history',
                  'lastComment': 'the last comment on anything',
                  'lastEditInDays': 2,
                  'icon': 'file-text-o',
                  'priority': 6
                }
              ]
            }
          },
          'id': {
            'type': 'string',
            '$ref': '#/definitions/name'
          },
          'name': {
            'type': 'string',
            '$ref': '#/definitions/name'
          },
          'summary': {
            'type': 'string',
            'faker': 'lorem.sentence'
          },
          'revision': {
            'type': 'number',
            'minimum': 0,
            'maximum': 10
          },
          'masterId': {
            'type': 'number',
            'minimum': 1,
            'maximum': 10
          },
          'locked': {
            'type': 'boolean'
          },
          'lastComment': {
            'type': 'string',
            'faker': 'lorem.sentence'
          },
          'lastEditInDays': {
            'type': 'number',
            'minimum': 0,
            'maximum': 90
          }
        },
        'required': ['id', 'name', 'revision', 'masterId', 'locked', 'lastEditInDays', 'files']
      }
    }
  },
  'required': ['forms', 'member'],
  'definitions': {
    'name': {
      'type': 'string',
      'faker': 'lorem.word'
    }
  }
};

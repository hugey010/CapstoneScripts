import json
from pprint import pprint
json_data=open('final_result.json')

data = json.load(json_data)
#pprint(data)

# parse old structure into new two tiered format

better_json = {}
better_json['structure'] = data
better_json['messages'] = []

#pprint(better_json)

def removeMessagesAndInsertIntoBetter(item):
  if item['type'] == 'category':
    for subitem in item['list']:
      removeMessagesAndInsertIntoBetter(subitem)
  else:
    # add message to messages list if not already contained
    foundtitle = 0
    for message in better_json['messages']:
      if message['title'] == item['title']:
        foundtitle = 1
        break

    if foundtitle == 0:
      copyitem = item.copy()
      del copyitem['type']
      better_json['messages'].append(copyitem)

    # delete all fiends from structure except id and type
    del item['message']
    del item['title']
    del item['todo']

removeMessagesAndInsertIntoBetter(better_json['structure'])

json_string = json.dumps(better_json, ensure_ascii=False).encode('utf8')
print(json_string)

json_data.close()

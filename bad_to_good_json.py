# Python script to convert the bad JSON output from javascript
# to smaller and more database friendly JSON.
#
# Author: Tyler Hugenberg
# Team: Clean & Sober Toolbox
# 2/28/2014

import json
from pprint import pprint
json_data=open('final_result.json')

data = json.load(json_data)
#pprint(data)

# parse old structure into new two tiered format

better_json = {}
better_json['structure'] = data
better_json['messages'] = []

def removeMessagesAndInsertIntoBetter(item):
  if item['type'] == 'category':
    for subitem in item['list']:
      removeMessagesAndInsertIntoBetter(subitem)
  else:
    # add message to messages list if not already contained
    foundtitle = 0
    foundidentifier = 0
    for message in better_json['messages']:
      if message['title'] == item['title']:
        foundtitle = 1
        foundidentifier = message['identifier']
        break

    if foundtitle == 0:
      copyitem = item.copy()
      del copyitem['type']
      better_json['messages'].append(copyitem)
    else:
      #found the message. alter identifier for item
      item['identifier'] = foundidentifier

    # delete all fiends from structure except id and type
    del item['message']
    del item['title']
    del item['todo']

removeMessagesAndInsertIntoBetter(better_json['structure'])
#find top level dictionary with 'meditation'
meditationMap = better_json['structure']['list'][0]
for topitem in better_json['structure']['list']:
  if topitem['title'] == 'Do you need a daily meditation':
    meditationMap = topitem
    break

#print(meditationMap['list'])

# put all messages into category with 'meditation'
for m in better_json['messages']:
  mCopy = m.copy()
  del mCopy['message']
  del mCopy['title']
  del mCopy['todo']
  mCopy['type'] = 'content'
  meditationMap['list'].append(mCopy)

# output JSON to stdout
json_string = json.dumps(better_json, ensure_ascii=False).encode('utf8')
print(json_string)

json_data.close()

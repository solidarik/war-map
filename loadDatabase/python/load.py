import pymongo
import helper
import filehelper

client = pymongo.MongoClient('mongodb://localhost:27017/')
database = client['app']
chronos_coll = database['chronos']

root_folder = helper.get_full_path('out_chronos')
print(root_folder)

files = filehelper.get
for filename in files:
    print(filename)
    break

for post in chronos_coll.find({}):
    print(post)
    break
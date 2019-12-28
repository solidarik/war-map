import xlrd
import sys
import os
from urllib.request import urlopen
import helper
print(sys.stdout.encoding)

root_folder = 'out_chronos'

col_place, col_startDate, col_brief, col_url = tuple(range(0, 4, 1))


def get_sheet_value(row, col):
    v = scheet.cell(row, col).value
    return v.replace('"', '\\"').rstrip().rstrip(',')


def get_sheet_value_date(row, col):
    date_excel = scheet.cell(row, col).value
    if type(date_excel) == float:
        date_excel = int(date_excel)
    date_excel = str(date_excel).strip()
    is_only_year = False
    d = 1
    m = 1

    if len(date_excel) == 4:
        y = int(date_excel)
        is_only_year = True
    else:
        date_groups = helper.get_search_groups_in_regexp(
            '(\d*)[,]\s*(\d+)\s*(\S+)', date_excel)
        y = int(date_groups[0])
        d = int(date_groups[1])
        m = int(helper.get_month_num(date_groups[2]))

    return '{:02d}.{:02d}.{}'.format(d, m, y), is_only_year


def get_sheet_value_arr(row, col, split_char=';'):
    val = scheet.cell(row, col).value
    if ('' == val):
        return []
    return val.split(split_char)


filedata = urlopen('http://www.historian.by/ww2/chrono.xlsx')
datatowrite = filedata.read()
filename = os.path.dirname(
    os.path.abspath(__file__)) + os.path.sep + 'Хронология.xlsx'

with open(filename, 'wb') as f:
    f.write(datatowrite)

book = xlrd.open_workbook(filename, encoding_override="cp1251")

scheet = book.sheet_by_index(0)
START_ROW = 1
END_ROW = scheet.nrows
entities = []
for row in range(START_ROW, END_ROW):
    chrono = {}
    chrono['place'] = get_sheet_value(row, col_place)
    chrono['startDate'], chrono['isOnlyYear'] = get_sheet_value_date(
        row, col_startDate)
    chrono['brief'] = get_sheet_value(row, col_brief)
    chrono['url'] = get_sheet_value(row, col_url)

    entities.append(chrono)

i = 0

helper.clear_folder(helper.get_full_path(root_folder))
helper.create_folder(helper.get_full_path(root_folder))

while i < len(entities):
    agreement = entities[i]
    i += 1

    filename = 'file{}.json'.format(i)
    filename = helper.get_full_path(os.path.join(root_folder, filename))
    file = open(filename, 'w', encoding='utf-8')
    file.write('[{')
    file.write('\n')
    try:
        list_items = agreement.items()

        # define last key
        for key, value in list_items:
            if (isinstance(value, list)):
                if (0 < len(', '.join(value))):
                    last_key = key
            elif (value != ''):
                last_key = key

        for key, value in list_items:
            text = ''
            if (isinstance(value, list)):
                if (0 < len(', '.join(value))):
                    text = '"{}": [{}]'.format(
                        key,
                        ', '.join(list(map(lambda x: '"' + x + '"', value))))
            elif (value != ''):
                text = '"{}": "{}"'.format(key, value)

            if ('' != text):
                if (key != last_key): text = '{},'.format(text)
                text = text.replace('\n', ' ')
                file.write('\t{}\n'.format(text))
    except Exception as e:
        print('{}: {}'.format(i, text))
        raise Exception(e)

    file.write('}]')
    file.close()

print("Completed")
exit(0)

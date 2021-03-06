import xlrd
import sys
import os
from urllib.request import urlopen
import helper
print(sys.stdout.encoding)

root_folder = 'out_chronos'

col_place, col_startDate, col_brief, col_url, col_remark, col_priority, col_comment = tuple(
    range(0, 7, 1))


def is_empty_value(row, col):
    v = scheet.cell(row, col).value
    return (v == '')


def get_sheet_value(row, col, isSimple=False):
    cell_value = scheet.cell(row, col).value
    if (isSimple and isinstance(cell_value, float)):
        v = str(int(round(cell_value, 0)))
    else:
        v = str(cell_value)
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
            '(\d*)\s*[,]\s*(\d+)\s*(\S+)', date_excel)
        y = int(date_groups[0])
        d = int(date_groups[1])
        m = int(helper.get_month_num(date_groups[2]))

    return '{:02d}.{:02d}.{}'.format(d, m, y), is_only_year


def capitalizeFirst(input):
    if (len(input) < 1 or input[0].isupper()):
        return input
    return input[0].upper() + input[1:]


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
print(f"Input count lines from Excel: {END_ROW}")
entities = []
for row in range(START_ROW, END_ROW):
    try:
        chrono = {}
        if is_empty_value(row, col_place) and is_empty_value(
                row, col_startDate) and is_empty_value(
                    row, col_brief) and is_empty_value(row, col_url):
            print(f'Empty line {row}')
            continue

        chrono['place'] = get_sheet_value(row, col_place)
        chrono['startDateStr'] = get_sheet_value(row, col_startDate, True)
        chrono['startDate'], chrono['isOnlyYear'] = get_sheet_value_date(
            row, col_startDate)
        chrono['brief'] = capitalizeFirst(get_sheet_value(row, col_brief))
        chrono['srcUrl'] = get_sheet_value(row, col_url)
        chrono['remark'] = capitalizeFirst(get_sheet_value(row, col_remark))
        chrono['priority'] = get_sheet_value(row, col_priority, True)
        chrono['comment'] = capitalizeFirst(get_sheet_value(row, col_comment))

        entities.append(chrono)
    except Exception as e:
        print(f'Exception input line in row {row}: {chrono}')
        raise Exception(e)

i = 0

helper.clear_folder(helper.get_full_path(root_folder))
helper.create_folder(helper.get_full_path(root_folder))

while i < len(entities):
    item = entities[i]
    i += 1

    filename = 'file{}.json'.format(i)
    filename = helper.get_full_path(os.path.join(root_folder, filename))
    file = open(filename, 'w', encoding='utf-8')
    file.write('[{')
    file.write('\n')
    try:
        list_items = item.items()

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

print("Completed read to json files")
exit(0)

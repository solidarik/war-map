import xlrd
import sys
import os
import datetime
from urllib.request import urlopen
import helper
print(sys.stdout.encoding)

root_folder = 'out_chronos_religion'

col_place = 0
col_startDateYear, col_endDate, col_startDate = tuple(range(1, 4, 1))
col_shortBrief, col_longBrief, col_url, col_remark = tuple(range(4, 8, 1))
col_priority, col_comment = tuple(range(8, 10, 1))


def IsEmptyValue(row, col):
    v = scheet.cell(row, col).value
    return (v == '')


def GetSheetValue(row, col, isSimple=False):
    cell_value = scheet.cell(row, col).value
    if (isSimple and isinstance(cell_value, float)):
        v = str(int(round(cell_value, 0)))
    else:
        v = str(cell_value)
    return v.replace('"', '\\"').rstrip().rstrip(',')


def GetSheetValueDate(row, col):
    dateExcel = scheet.cell(row, col).value
    return helper.get_date_from_input(dateExcel)


def capitalizeFirst(input):
    if (len(input) < 1 or input[0].isupper()):
        return input
    return input[0].upper() + input[1:]


def GetSheetValue_arr(row, col, split_char=';'):
    val = scheet.cell(row, col).value
    if ('' == val):
        return []
    return val.split(split_char)


filename = os.path.abspath(__file__)
filename += os.path.sep + '..' + os.path.sep + '..' + os.path.sep
filename += 'religion' + os.path.sep + 'файл Ильи.xlsx'
book = xlrd.open_workbook(filename, encoding_override="cp1251")

scheet = book.sheet_by_index(0)
START_ROW = 1
END_ROW = scheet.nrows

print(f"Input count lines from Excel: {END_ROW}")

entities = []
for row in range(START_ROW, END_ROW):
    chrono = {}
    try:

        if IsEmptyValue(row, col_place) and IsEmptyValue(
                row, col_startDate) and IsEmptyValue(
                    row, col_shortBrief) and IsEmptyValue(row, col_url):
            print(f'Empty line {row}')
            continue

        startDateStr = GetSheetValue(row, col_startDate, True)
        if ('' == startDateStr):
            startDateStr = GetSheetValue(row, col_startDateYear, True)
            col_startDate = col_startDateYear

        chrono['place'] = GetSheetValue(row, col_place)
        chrono['startDateStr'] = startDateStr
        if ('' != startDateStr):
            res = GetSheetValueDate(row, col_startDate)
            chrono["startYear"] = res["ymd"][0]
            chrono["startMonth"] = res["ymd"][1]
            chrono["startDay"] = res["ymd"][2]
            chrono["startDateStr"] = res["outputStr"]
            chrono["startIsOnlyYear"] = res["isOnlyYear"]

        chrono['endDateStr'] = GetSheetValue(row, col_endDate)
        if ('' != chrono['endDateStr']):
            res = GetSheetValueDate(row, col_endDate)
            chrono["endYear"] = res["ymd"][0]
            chrono["endMonth"] = res["ymd"][1]
            chrono["endDay"] = res["ymd"][2]
            chrono["endDateStr"] = res["outputStr"]
            chrono["endIsOnlyYear"] = res["isOnlyYear"]

        chrono['shortBrief'] = capitalizeFirst(
            GetSheetValue(row, col_shortBrief))
        chrono['longBrief'] = capitalizeFirst(GetSheetValue(
            row, col_longBrief))

        chrono['srcUrl'] = GetSheetValue(row, col_url)
        chrono['remark'] = capitalizeFirst(GetSheetValue(row, col_remark))
        chrono['priority'] = GetSheetValue(row, col_priority, True)
        chrono['comment'] = capitalizeFirst(GetSheetValue(row, col_comment))

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
    last_key = ''
    text = ''
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

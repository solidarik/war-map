import xlrd
import sys
import os
import helper
print(sys.stdout.encoding)

root_folder = 'out_agreements'
helper.clear_folder(root_folder)

col_kind, col_place, col_startDate, col_endDate = tuple(range(0, 4, 1))
col_player1, col_player2 = tuple(range(4, 6, 1))
col_results, col_source, col_img = tuple(range(6, 9, 1))

def get_sheet_value(row, col):
    return scheet.cell(row, col).value


def get_sheet_value_date(row, col):
    date_excel = scheet.cell(row, col).value
    y, m, d, _, _, _ = xlrd.xldate_as_tuple(date_excel, 0)
    return '{:02d}.{:02d}.{}'.format(d, m, y)


def get_sheet_value_arr(row, col, split_char = ';'):
    val = scheet.cell(row, col).value
    if ('' == val):
        return []
    return val.split(split_char)

filename = os.path.dirname(os.path.abspath(__file__)) + '/Международные отношения 2-0.xlsx'
book = xlrd.open_workbook(filename, encoding_override="cp1251")

scheet = book.sheet_by_index(0)
START_ROW = 1
END_ROW = scheet.nrows
entities = []
for row in range(START_ROW, END_ROW):
    agreement = {}
    agreement['kind'] = get_sheet_value(row, col_kind)
    agreement['place'] = get_sheet_value(row, col_place)
    agreement['startDate'] = get_sheet_value_date(row, col_startDate)
    agreement['endDate'] = get_sheet_value_date(row, col_endDate)
    agreement['player1'] = get_sheet_value(row, col_player1)
    agreement['player2'] = get_sheet_value(row, col_player2)
    agreement['results'] = get_sheet_value(row, col_results)
    agreement['source'] = get_sheet_value(row, col_source)
    agreement['img'] = get_sheet_value(row, col_img)

    entities.append(agreement)

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
                    text = '"{}": [{}]'.format(key, ', '.join(list(map(lambda x: '"' + x + '"', value))))
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


# try: value = str(int(value))
        # except: pass

exit(0)

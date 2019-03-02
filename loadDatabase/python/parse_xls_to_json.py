import xlrd
import sys
import os
import helper
print(sys.stdout.encoding)

# text = '123;1234;134'
# print(text.split(';'))
# raise Exception('soli')

root_folder = 'out_battles'
helper.clear_folder(root_folder)

col_features, col_name, col_startDate, col_endDate = tuple(range(0, 4, 1))
col_allies, col_enemies = tuple(range(4, 6, 1))

col_ally_troops = 6
col_ally_tanks_cnt, col_ally_airplans_cnt, col_ally_ships_cnt, col_ally_submarines_cnt = tuple(range(7, 11, 1))
col_ally_losses, col_ally_deads, col_ally_prisoners, col_ally_woundeds, col_ally_missing = tuple(range(11, 16, 1))
col_ally_tanks_lost, col_ally_airplans_lost, col_ally_ships_lost, col_ally_submarines_lost = tuple(range(16, 20, 1))

col_enem_troops = 20
col_enem_tanks_cnt, col_enem_airplans_cnt, col_enem_ships_cnt, col_enem_submarines_cnt = tuple(range(21, 25, 1))
col_enem_losses, col_enem_deads, col_enem_prisoners, col_enem_woundeds, col_enem_missing = tuple(range(25, 30, 1))
col_enem_tanks_lost, col_enem_airplans_lost, col_enem_ships_lost, col_enem_submarines_lost = tuple(range(30, 34, 1))

col_winner = 34
col_comment = 35
col_detailing = 36
col_source_url = 37
col_imgUrl = 38

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

filename = os.path.dirname(os.path.abspath(__file__)) + '/Битвы 3-8.xlsx'
book = xlrd.open_workbook(filename, encoding_override="cp1251")
scheet = book.sheet_by_index(0)
START_ROW = 1
END_ROW = scheet.nrows
entities = []
for row in range(START_ROW, END_ROW):
    battle = {}
    battle['features'] = get_sheet_value_arr(row, col_features)
    if ('geojson' not in ', '.join(battle['features'])):
        battle['features'] = list(map(lambda x: x + '.geojson', battle['features']))
    battle['name'] = get_sheet_value(row, col_name)
    battle['startDate'] = get_sheet_value_date(row, col_startDate)
    battle['endDate'] = get_sheet_value_date(row, col_endDate)
    battle['allies'] = get_sheet_value(row, col_allies)
    battle['enemies'] = get_sheet_value(row, col_enemies)
    battle['ally_troops'] = get_sheet_value(row, col_ally_troops)
    battle['ally_tanks_cnt'] = get_sheet_value(row, col_ally_tanks_cnt)
    battle['ally_airplans_cnt'] = get_sheet_value(row, col_ally_airplans_cnt)
    battle['ally_ships_cnt'] = get_sheet_value(row, col_ally_ships_cnt)
    battle['ally_submarines_cnt'] = get_sheet_value(row, col_ally_submarines_cnt)
    battle['ally_losses'] = get_sheet_value(row, col_ally_losses)
    battle['ally_deads'] = get_sheet_value(row, col_ally_deads)
    battle['ally_prisoners'] = get_sheet_value(row, col_ally_prisoners)
    battle['ally_woundeds'] = get_sheet_value(row, col_ally_woundeds)
    battle['ally_missing'] = get_sheet_value(row, col_ally_missing)
    battle['ally_tanks_lost'] = get_sheet_value(row, col_ally_tanks_lost)
    battle['ally_airplans_lost'] = get_sheet_value(row, col_ally_airplans_lost)
    battle['ally_ships_lost'] = get_sheet_value(row, col_ally_ships_lost)
    battle['ally_submarines_lost'] = get_sheet_value(row, col_ally_submarines_lost)
    battle['enem_troops'] = get_sheet_value(row, col_enem_troops)
    battle['enem_tanks_cnt'] = get_sheet_value(row, col_enem_tanks_cnt)
    battle['enem_airplans_cnt'] = get_sheet_value(row, col_enem_airplans_cnt)
    battle['enem_ships_cnt'] = get_sheet_value(row, col_enem_ships_cnt)
    battle['enem_submarines_cnt'] = get_sheet_value(row, col_enem_submarines_cnt)
    battle['enem_losses'] = get_sheet_value(row, col_enem_losses)
    battle['enem_deads'] = get_sheet_value(row, col_enem_deads)
    battle['enem_prisoners'] = get_sheet_value(row, col_enem_prisoners)
    battle['enem_woundeds'] = get_sheet_value(row, col_enem_woundeds)
    battle['enem_missing'] = get_sheet_value(row, col_enem_missing)
    battle['enem_tanks_lost'] = get_sheet_value(row, col_enem_tanks_lost)
    battle['enem_airplans_lost'] = get_sheet_value(row, col_enem_airplans_lost)
    battle['enem_ships_lost'] = get_sheet_value(row, col_enem_ships_lost)
    battle['enem_submarines_lost'] = get_sheet_value(row, col_enem_submarines_lost)
    battle['winner'] = get_sheet_value(row, col_winner)
    battle['comment'] = get_sheet_value(row, col_comment)
    battle['detailing'] = get_sheet_value(row, col_detailing)
    battle['source_url'] = get_sheet_value(row, col_source_url)
    battle['imgUrl'] = get_sheet_value(row, col_imgUrl)
    entities.append(battle)

i = 0

helper.clear_folder(helper.get_full_path(root_folder))
helper.create_folder(helper.get_full_path(root_folder))

while i < len(entities):
    battle = entities[i]
    i += 1
    if ('' == battle['name'] or 0 == len(battle['features'])): continue

    filename = 'file{}.json'.format(i)
    filename = helper.get_full_path(os.path.join(root_folder, filename))
    file = open(filename, 'w', encoding='utf-8')
    file.write('[{')
    file.write('\n')
    try:
        list_items = battle.items()

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

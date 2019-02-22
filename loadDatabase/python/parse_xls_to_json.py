import xlrd
import sys
import os
print(sys.stdout.encoding)

# constants
filename = os.path.dirname(os.path.abspath(__file__)) + '\\Битвы 3-8.xlsx'
START_ROW = 1


book = xlrd.open_workbook(filename, encoding_override="cp1251")
scheet = book.sheet_by_index(0)

print(scheet.cell(0, 0).value)
print(scheet.nrows, scheet.ncols)

col_geojson, col_name, col_start_date, col_end_date = tuple(range(0, 4, 1))
col_allies, col_enemies = tuple(range(4, 6, 1))
col_ally_troops, col_ally_tanks, col_ally_airplans, col_ally_ships, col_ally_submarines = tuple(range(6, 11, 1))
col_ally_losses, col_ally_deads, col_ally_prisoners, col_ally_woundeds, col_ally_missing = tuple(range(12, 17, 1))

print(col_name)

values = []
for row in range(START_ROW, scheet.nrows):
    battle = []
    battle.append(scheet.cell(row, 2).value)
    battle.append(scheet.cell(row, 1).value)
    battle.append(scheet.cell(row, 13).value)

    values.append(battle)
    if row > 30:
        break

i = 0
while i < len(values):
    print(values)
    i += 1

# try: value = str(int(value))
        # except: pass

exit(0)

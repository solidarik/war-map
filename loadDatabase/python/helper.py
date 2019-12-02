# region importing libs
import re
import datetime
import os
from os import walk
import errno
import ntpath
ntpath.basename("a/b/c")
import shutil
import configparser
import codecs
import subprocess
import difflib
import logging
# endregion


def create_logging(logfile, is_rewrite=True):
    logFormatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S')
    rootLogger = logging.getLogger()
    rootLogger.setLevel(logging.DEBUG)

    fileHandler = logging.FileHandler(logfile, mode='w' if is_rewrite else 'a')
    fileHandler.setFormatter(logFormatter)
    rootLogger.addHandler(fileHandler)

    consoleHandler = logging.StreamHandler()
    consoleHandler.setFormatter(logFormatter)
    rootLogger.addHandler(consoleHandler)
    return rootLogger


def get_full_path(file_name):
    return os.path.join(os.path.dirname(os.path.realpath(__file__)), file_name)


config_file = get_full_path('defaults.cfg')

if os.path.isfile(config_file):
    config = configparser.RawConfigParser()
    config.readfp(codecs.open(config_file, 'r', 'utf8'))

__all__ = [
    'get_config', 'get_full_path', 'get_year_month_of_prev_month',
    'get_month_text_of_date', 'get_text_of_month', 'get_month_num',
    'tuples_to_str', 'utf8_to_cp1251', 'path_leaf', 'get_date_from_filename',
    'clear_folder', 'create_folder', 'get_files_by_folder', 'extract_archives',
    'keep_files_by_template', 'sortlist_by_length', 'sync_files_by_dest',
    'leave_fresh_files', 'remove_items_from_tuples', 'add_prefix_to_array',
    'merge_tuples', 'check_exist_english', 'remove_spaces'
]

# region CONFIG FUNCTIONS


def get_config(root, param):
    return config.get(root, param)


# endregion

# region DATETIME FUNCTIONS


def get_year_month_of_prev_month():
    today = datetime.date.today()
    first = today.replace(day=1)
    lastMonth = first - datetime.timedelta(days=1)
    return lastMonth.year, lastMonth.month


def get_month_text_of_date(dt):
    return get_text_of_month(dt.month)


def get_month_num(input):
    months = [
        'янв', 'февр', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентяб',
        'октяб', 'нояб', 'декаб'
    ]

    num = 1
    for month in months:
        if month in input:
            return num
        num = num + 1

    return -1


def get_text_of_month(num):

    assert (1 <= num and num <= 12)
    months = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август',
        'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ]
    return months[num - 1]


# endregion

# region CONVERT FUNCTIONS


def remove_items_from_tuples(src_tuples, remove_tuples):
    res_tuples = []
    for t in src_tuples:
        is_remove = False
        for r in remove_tuples:
            if t.lower() == r.lower():
                is_remove = True
                break
        if not is_remove:
            res_tuples.append(t)
    return res_tuples


def add_prefix_to_array(prefix, tuples):
    res = []
    for t in tuples:
        res.append(prefix + t)
    return res
    #tuples.map(lambda x: prefix + x, tuples)


def merge_tuples(tuples1, tuples2):
    for t in tuples1:
        if t not in tuples2:
            tuples2.append(t)
    return tuples2


def tuples_to_str(a_tuple, a_delim=''):

    if (0 == len(a_tuple)):
        return '<пусто>'

    res = []
    for item in a_tuple:
        if isinstance(item, tuple):
            res.append(tuples_to_str(item, ', ') + '\n')
        else:
            #res.append(str(item).decode('utf8').encode('cp1251'))
            res.append(str(item))

    return (a_delim.join(res))


def utf8_to_cp1251(input):
    return input
    #return input.encode('cp1251').decode('utf8')


# endregion

# region FILE FUNCTIONS


def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)


def get_date_from_filename(filename):

    err = None
    filename = path_leaf(filename).lower()

    now = datetime.datetime.now()
    year = now.year

    m = re.search('^.*([0-9]{4}).*$', filename)
    if m:
        year = m.group(1)
        # get filename before year
        fln = re.search('^(.+)[0-9]{4}.*$', filename)
        if fln: filename = fln.group(1)

    months = [
        'янв', 'февр', 'март', 'апрель', 'май', 'июнь', 'июль', 'август',
        'сентяб', 'октяб', 'нояб', 'декаб'
    ]
    sort_months = sortlist_by_length(months[:])

    is_exist_month = None
    for month in sort_months:
        if month in filename:
            is_exist_month = True
            break

    if is_exist_month is None:
        err = 'Не удалось определить месяц из имени файла'
        return None, err

    month_index = months.index(month) + 1

    res = "01.%02d.%d" % (int(month_index), int(year))

    return res, err


def delete_file(file_path):
    if os.path.isfile(file_path):
        os.unlink(file_path)


def clear_folder(folder, is_recreate=True, is_verbose=False):

    if (is_recreate) and (not os.path.exists(folder)):
        create_folder(folder)

    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
                if is_verbose:
                    print('Deleted folder %s' % file_path)
        except Exception as e:
            print("Error deleting files in folder: {}".format(e))


def create_folder(folder):
    try:
        os.makedirs(folder)
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise


def walklevel(some_dir, level=0):
    some_dir = some_dir.rstrip(os.path.sep)
    assert os.path.isdir(some_dir)
    num_sep = some_dir.count(os.path.sep)
    for root, dirs, files in os.walk(some_dir):
        yield root, dirs, files
        num_sep_this = root.count(os.path.sep)
        if num_sep + level <= num_sep_this:
            del dirs[:]


def get_files_by_folder(folder, ext=None, level=0):

    if not os.path.isdir(folder):
        print("Нет обнаружены файлы или директории в папке {}".format(folder))
        return None

    for path, _, files in walklevel(folder, level):
        for name in files:
            if ext is None:
                yield os.path.join(path, name)
            else:
                _, file_extension = os.path.splitext(name)
                if (ext == file_extension):
                    yield os.path.join(path, name)


def extract_archives(folder):
    res = True
    cmd = '"{}" x "$filename$" -aoa -y -bd -o"{}"'.format(
        get_config('Environment', '7zip'), folder)
    FNULL = open(os.devnull, 'w')
    for filename in get_files_by_folder(folder, '.7z'):
        spec_cmd = cmd.replace('$filename$', filename)
        res = res and 0 == subprocess.call(
            spec_cmd, stdout=FNULL, stderr=subprocess.STDOUT)
    return res


def get_files_by_template(folder, template):
    files = []
    pattern = re.compile(template, re.IGNORECASE)
    for filename in get_files_by_folder(folder, None, 10):
        if pattern.search(filename):
            files.append(filename)
    return files


def keep_files_by_template(folder, template):
    pattern = re.compile(template, re.IGNORECASE)
    for filename in get_files_by_folder(folder, None, 10):
        if not pattern.search(filename):
            os.unlink(filename)
    return True


def print_first_lines(filepath, max_count=100):
    cnt = 0
    with open(filepath) as fr:
        line = fr.readline()
        while (line) and (cnt < max_count):
            print(line.rstrip())
            line = fr.readline()
            cnt += 1


def get_line_count(filepath):
    return sum(1 for line in open(filepath))


def sync_files_by_dest(src_folder, dest_folder, copy_folder=None):

    if copy_folder is None:
        copy_folder = dest_folder

    for dest_file_path in get_files_by_folder(dest_folder):
        file_name = path_leaf(dest_file_path)
        src_file_path = os.path.join(src_folder, file_name)
        copy_file_path = os.path.join(copy_folder, file_name)
        if os.path.isfile(src_file_path):
            try:
                if os.path.isfile(copy_file_path):
                    os.unlink(copy_file_path)
                shutil.copy2(src_file_path, copy_file_path)
                print('Successfull copied file: %s' % file_name)
            except shutil.Error as e:
                print('Error by copied file %s: %s' % (file_name, e))
                # eg. source or destination doesn't exist
            except IOError as e:
                print('Error by copied file %s: %s' % (file_name, e.strerror))


def leave_fresh_files(folder, days=7):
    for dest_file_path in get_files_by_folder(folder):
        now_time = datetime.datetime.now()
        mod_time = datetime.datetime.fromtimestamp(
            os.path.getmtime(dest_file_path))
        diff_time = now_time - mod_time
        diff_day = diff_time.days

        if (days < diff_day) and os.path.isfile(dest_file_path):
            os.unlink(dest_file_path)
            print('Deleted file: %s, day diff: %d' %
                  (dest_file_path, diff_day))


# endregion

# region SORTING FUNCTIONS


def sortlist_by_length(a):
    return sorted(a, key=len)


# endregion

# region Read SqlDbList


def get_connections_by_region():

    res = []
    filename = get_full_path(get_config('Connections', 'DBLIST_FILE'))
    if not os.path.exists(filename):
        print("File not found: " + filename)
        return res

    lines = [
        line.rstrip('\n').strip()
        for line in open(filename, 'r', encoding='windows-1251')
    ]

    home_region = get_config('Connections', 'region')
    region_pattern = re.compile(r'^\[(.*)\]$')
    conn_pattern = re.compile(r'^([^=]*)[=]([^;]*)[;]?.*?$')

    isRegionFinded = False
    for line in lines:
        if ('' == line):
            continue

        region_search = region_pattern.search(line)
        if region_search:

            if isRegionFinded:
                return res

            if (home_region == region_search.group(1)):
                isRegionFinded = True
                continue

        if isRegionFinded:
            if conn_pattern.search(line):
                res.append(line)

    return res


def get_filtered_connections(conns, filter_str=''):

    res = []

    filter_str = filter_str.replace(',', ' ').replace(';', '')
    conn_pattern = re.compile(
        r'^([^=]*)[=]([^:]*)[:](\d*)[:]sn=([^;]*)[;]?.*?$')
    filters = filter_str.split(' ')
    for conn in conns:
        conn_search = conn_pattern.search(conn)
        if conn_search:
            name = conn_search.group(1)
            host = conn_search.group(2)
            port = conn_search.group(3)
            service = conn_search.group(4)

            for filter in filters:
                if ('' == filter_str) or (name.lower() == filter.lower()):
                    res.append({
                        'name': name,
                        'host': host,
                        'port': port,
                        'service': service
                    })

    return res


# endregion


# region STRING FUNCTIONS
def trim_left_spaces(str):
    res = ''
    delim = ''
    lines = str.splitlines()
    if (2 > len(lines)):
        return str.lstrip()

    min_left_space_count = 1000
    start_line = 0
    if (0 < len(lines)) and ('' == lines[0].strip()):
        start_line = 1
    for i in range(start_line, len(lines) - 1):
        line = lines[i]
        left_space_count = len(line) - len(line.lstrip())
        if min_left_space_count > left_space_count:
            min_left_space_count = left_space_count
            if (0 == min_left_space_count):
                return str  # return without changes

    for line in lines:
        if ('' == line[min_left_space_count:]):
            continue
        res = res + delim + line[min_left_space_count:]
        delim = '\n'

    return res


def get_diff_of_strings(str1, str2):
    for i, s in enumerate(difflib.ndiff(str1, str2)):
        if s[0] == ' ': continue
        elif s[0] == '-':
            print(u'Delete "{}" from position {}'.format(s[-1], i))
        elif s[0] == '+':
            print(u'Add "{}" to position {}'.format(s[-1], i))


def get_perc_string(current, count):
    perc = current / count * 100
    return '{}%, {} из {} '.format(round(perc), current, count)


def check_exist_english(string):
    return True if re.search(r"[A-Za-z]+", string) else False


def remove_spaces(s):
    return "".join(s.split())


def get_search_in_regexp(regexp, search_str):
    m = re.search(regexp, search_str)
    try:
        if m:
            return m.group(1)
    except:
        pass
    return ''


def get_search_groups_in_regexp(regexp, search_str):
    m = re.search(regexp, search_str)
    try:
        if m:
            return m.groups()
    except:
        pass
    return ''


def remove_new_lines(s):
    return s.replace("  ", " ").replace("\n", " ").replace("\r", " ")


# endregion
"""Тесты для хелпера"""

import pytest
import os
import sys
lib_folder = os.path.dirname(__file__) + '/../loadDatabase/python/'.replace(
    '/', os.path.sep)
sys.path.insert(1, lib_folder)

import helper


class TestHelper:
    """Тесты для даты"""
    def test_date(self):
        """Тест получения даты из различных форматов"""
        func = helper.get_date_from_input

        res = func('286')
        assert res["ymd"][0] == 286
        assert res["ymd"][1] == -1
        assert res["ymd"][2] == -1
        assert res["outputStr"] == '286'
        assert res["isOnlyYear"] == True

        res = func('07.08.0626')
        assert res["ymd"][0] == 626
        assert res["ymd"][1] == 8
        assert res["ymd"][2] == 7

        res = func('15 августа 1219 года')
        assert res["ymd"][0] == 1219
        assert res["ymd"][1] == 8
        assert res["ymd"][2] == 15

        res = func('24 июля 1330')
        assert res["ymd"][0] == 1330
        assert res["ymd"][1] == 7
        assert res["ymd"][2] == 24
        assert res["outputStr"] == '24.07.1330'

        res = func('19/02/1878')
        assert res["ymd"][0] == 1878
        assert res["ymd"][1] == 2
        assert res["ymd"][2] == 19
        assert res["outputStr"] == '19.02.1878'

        res = func('1924')
        assert res["ymd"][0] == 1924
        assert res["ymd"][1] == -1
        assert res["ymd"][2] == -1
        assert res["outputStr"] == '1924'
        assert res["isOnlyYear"] == True

        res = func(7723.0)
        assert res["ymd"][0] == 1921
        assert res["ymd"][1] == 2
        assert res["ymd"][2] == 21
        assert res["outputStr"] == '21.02.1921'

        res = func('100 до н.э.     ')
        assert res["ymd"][0] == -100
        assert res["ymd"][1] == -1
        assert res["ymd"][2] == -1
        assert res["isOnlyYear"] == True
        assert res["isUserText"] == True
        assert res["outputStr"] == '100 до н.э.'

        # assert  ==
        # assert func(10, '123') == '123       '
        # assert func(10, '123', '4567', '0') == '1230004567'
        # assert func(8, '123', '', '0') == '12300000'
        # assert func(7, '', '123', '0') == '0000123'

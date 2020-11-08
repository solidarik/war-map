"""Настройки и предварительная подготовка для тестов pytest"""
import time
import pytest


@pytest.fixture(scope='class')
def test_reader(request):
    """Настройки для запуска тестов, связанных с ГРАДом"""
    # print("\n> Suite setup client grad")
    test_str = 'Hello world'
    request.cls.test_str = test_str
    yield
    # print("\n> Suite teardown client grad")
    del test_str


@pytest.fixture(scope='function')
def case_data():
    """Настройки для запуска функции"""
    # print("   > Case setup")
    yield time.time()
    # print("\n   > Case teardown")

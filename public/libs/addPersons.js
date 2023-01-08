/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/addPersons.js":
/*!******************************!*\
  !*** ./public/addPersons.js ***!
  \******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n\n\nfunction _instanceof(left, right) {\n  if (right != null && typeof Symbol !== \"undefined\" && right[Symbol.hasInstance]) {\n    return !!right[Symbol.hasInstance](left);\n  } else {\n    return left instanceof right;\n  }\n}\nfunction _classCallCheck(instance, Constructor) {\n  if (!_instanceof(instance, Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\nfunction _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\nvar addPersons = /*#__PURE__*/\nfunction () {\n  function addPersons(idTable, fileUrl) {\n    _classCallCheck(this, addPersons);\n    this.idTable = idTable;\n    this.fileUrl = fileUrl;\n    this.data = null;\n  }\n  _createClass(addPersons, [{\n    key: \"clearTable\",\n    value: function clearTable() {\n      //console.log(\"clearTable\");\n      var dvTable = $(\"#\" + this.idTable);\n      dvTable.html(\"\");\n    }\n  }, {\n    key: \"rowTableClickHandler\",\n    value: function rowTableClickHandler(thisThis, thisTr) {\n      //console.log(\"clicked \" + $(thisTr).attr('id'));\n      var id = parseInt($(thisTr).attr(\"id\"));\n      $('#FIO').html(thisThis.data[id].Surname + \" \" + thisThis.data[id].Name + \" \" + thisThis.data[id].MiddleName);\n      $('#LifeTime').html(\"Дата и место рождения - \" + thisThis.data[id].DateBirth + \" \" + thisThis.data[id].PlaceBirth);\n      $('#AchievementPlace').html(\"Место активности - \" + thisThis.data[id].PlaceAchievement);\n      $('#DeathTime').html(\"Дата и место смерти - \" + thisThis.data[id].DateDeath + \" \" + thisThis.data[id].PlaceDeath);\n      $('#imgPerson').src = thisThis.data[id].PhotoUrl;\n      $('#imgPerson').attr('src', thisThis.data[id].PhotoUrl);\n      $('#description').html(thisThis.data[id].Description + \" <a target='_blank' rel='noopener noreferrer' href='\" + thisThis.data[id].Source + \"'>\" + \"Подробнее...</a>\");\n      $('#fullDescription').html(thisThis.data[id].FullDescription + \" <a target='_blank' rel='noopener noreferrer' href='\" + thisThis.data[id].Link + \"'>\" + \"Подробнее...</a>\");\n      $(thisTr).addClass(\"event-active-row\");\n      $(thisTr).siblings().removeClass(\"event-active-row\");\n    }\n  }, {\n    key: \"addDataToTable\",\n    value: function addDataToTable() {\n      //console.log(\"addDataTotable\");\n      var obj = this.data;\n      this.clearTable();\n      var table = $(\"#\" + this.idTable); //table[0].border = \"1\";\n\n      var columns = Object.keys(obj[0]);\n      var columnCount = columns.length;\n      var row = $(table[0].insertRow(-1));\n      for (var i = 0; i < columnCount; i++) {\n        if (i == 1 || i == 2 || i == 3 || i == 6) {\n          var headerCell = $(\"<th />\");\n          if (columns[i] == 'Surname') {\n            headerCell.html('Фамилия');\n          } else if (columns[i] == 'Name') {\n            headerCell.html('Имя');\n          } else if (columns[i] == 'MiddleName') {\n            headerCell.html('Отчество');\n          } else if (columns[i] == 'FieldActivity') {\n            headerCell.html('Сфера деятельности');\n          } else {\n            headerCell.html('N/A');\n          }\n          row.append(headerCell);\n        }\n      }\n      for (var i = 0; i < obj.length; i++) {\n        row = $(table[0].insertRow(-1));\n        row.addClass(\"hand-cursor\");\n        row.attr(\"id\", i);\n        for (var j = 0; j < columnCount; j++) {\n          if (j == 1 || j == 2 || j == 3 || j == 6) {\n            var cell = $(\"<td />\");\n            cell.html(obj[i][columns[j]]);\n            row.append(cell);\n          }\n        }\n      }\n      var getCellValue = function (tr, idx) {\n        return tr.children[idx].innerText || tr.children[idx].textContent;\n      };\n      var comparer = function (idx, asc) {\n        return function (a, b) {\n          return function (v1, v2) {\n            return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);\n          }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));\n        };\n      };\n\n      // do the work...\n      Array.prototype.slice.call(document.querySelectorAll('th')).forEach(function (th) {\n        th.addEventListener('click', function () {\n          var table = th.parentNode;\n          while (table.tagName.toUpperCase() != 'TABLE') table = table.parentNode;\n          Array.prototype.slice.call(table.querySelectorAll('tr:nth-child(n+2)')).sort(comparer(Array.prototype.slice.call(th.parentNode.children).indexOf(th), this.asc = !this.asc)).forEach(function (tr) {\n            table.appendChild(tr);\n          });\n        });\n      });\n      var thisThis = this;\n      document.querySelectorAll(\"#\" + this.idTable + \" tr\").forEach(function (e) {\n        return e.addEventListener(\"click\", function () {\n          thisThis.rowTableClickHandler(thisThis, this);\n        });\n      });\n      $(\"#persons-table tr:eq(0) td:first-child span\").click();\n      $('#0').trigger('click');\n    }\n  }, {\n    key: \"fillTable\",\n    value: function fillTable() {\n      //console.log(\"fillTable\");\n      if (this.data == null) {\n        var thisThis = this;\n        console.time(\"load persons\");\n        d3.json(this.fileUrl, function (error, persons) {\n          console.timeEnd(\"load persons\");\n          if (error) console.log(error);\n          thisThis.data = persons;\n          thisThis.addDataToTable();\n          /*var obj = persons;\r\n          thisThis.clearTable();\r\n          var table = $(\"#\" + thisThis.idTable);\r\n          //table[0].border = \"1\";\r\n          var columns = Object.keys(obj[0]);\r\n          var columnCount = columns.length;\r\n          var row = $(table[0].insertRow(-1));\r\n          for (var i = 0; i < columnCount; i++) {\r\n              if (i == 0 || i == 1 || i == 2 || i == 5) {\r\n                  var headerCell = $(\"<th />\");\r\n                  headerCell.html([columns[i]]);\r\n                  row.append(headerCell);\r\n              }\r\n          }\r\n               for (var i = 0; i < obj.length; i++) {\r\n              row = $(table[0].insertRow(-1));\r\n              row.addClass(\"hand-cursor\");\r\n              row.id = i;\r\n              for (var j = 0; j < columnCount; j++) {\r\n                  if (j == 0 || j == 1 || j == 2 || j == 5) {\r\n                      var cell = $(\"<td />\");\r\n                      cell.html(obj[i][columns[j]]);\r\n                      row.append(cell);\r\n                  }\r\n              }\r\n          }\r\n               document.querySelectorAll(\"#\" + thisThis.idTable + \" tr\")\r\n              .forEach(e => e.addEventListener(\"click\", thisThis.rowTableClickHandler));\r\n               //table.append(table);\r\n          */\n        });\n      } else {\n        this.addDataToTable();\n      }\n    }\n  }]);\n  return addPersons;\n}();\n\n//# sourceURL=webpack://war-map/./public/addPersons.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/addPersons.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
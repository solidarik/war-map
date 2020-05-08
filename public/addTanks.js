"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var addTanks = /*#__PURE__*/function () {
  function addTanks() {
    _classCallCheck(this, addTanks);
  }

  _createClass(addTanks, null, [{
    key: "addTank",
    value: function addTank(divId, tankData) {
      var div = document.getElementById(divId);
      div.innerHTML = "";
      var newNode = document.createElement('div');
      newNode.innerHTML = "<img class='image-center img-rounded resized-image' id='imgPerson' src='" + tankData.URL_Local_picture + "' alt=''>";
      newNode.classList.add("row");
      newNode.classList.add("img");
      newNode.classList.add("image-cont");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Тип - <p id='Type'>" + tankData.Type + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Вид - <p id='Kind'>" + tankData.Kind + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Название - <p id='Brand'>" + tankData.Brand + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Страна - <p id='Country'>" + tankData.Country + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Конструктор - <p id='Constructor'>" + tankData.Constructor + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Производитель - <p id='Manufacturer'>" + tankData.Manufacturer + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Дата создания - <p id='Year_creation'>" + tankData.Year_creation + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Принят на вооружение - <p id='Adopted'>" + tankData.Adopted + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Окончание производства - <p id='Production_end'>" + tankData.Production_end + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Количество - <p id='Number'>" + tankData.Number + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Вес, кг - <p id='Weight_kg'>" + tankData.Weight_kg + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Длина, м - <p id='Length_m'>" + tankData.Length_m + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Место производства - <p id='Production_place'>" + tankData.Production_place + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Начальная скорость снаряда, м/с - <p id='Initial_projectile_speed_m_s'>" + tankData.Initial_projectile_speed_m_s + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Толщина брони, мм - <p id='Armor_thickness_mm_board'>" + tankData.Armor_thickness_mm_board + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Основной каллибр, мм - <p id='Main_caliber_mm'>" + tankData.Main_caliber_mm + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Боекомплект - <p id='Ammunition'>" + tankData.Ammunition + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Скорострельность - <p id='Rate_of_fire'>" + tankData.Rate_of_fire + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Дальность стрельбы, км - <p id='Firing_range_km'>" + tankData.Firing_range_km + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Скорость, км/ч - <p id='Speed_km_h_or_knots'>" + tankData.Speed_km_h_or_knots + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Экипаж - <p id='Crew_person'>" + tankData.Crew_person + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Дальность полета, км - <p id='Cruising_range_km'>" + tankData.Cruising_range_km + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Мощность двигателя, л.с. - <p id='Engine_power_hp'>" + tankData.Engine_power_hp + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Вооружение - <p id='Armament'>" + tankData.Armament + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Практический потолок - <p id='Practical_ceiling'>" + tankData.Practical_ceiling + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Источник - <p id='Source'><a href='" + tankData.Source + "'>Ссылка</a></p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
      newNode = document.createElement('div');
      newNode.innerHTML = "Примечание - <p id='Note'>" + tankData.Note + "</p>";
      newNode.classList.add("row");
      div.appendChild(newNode);
    }
  }]);

  return addTanks;
}();
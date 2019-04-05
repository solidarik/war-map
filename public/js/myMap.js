
define([
        "dojo/_base/declare",
        "dojo/_base/connect",
        "dojo/dom",
        "dojo/dom-style",
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "esri/dijit/Measurement",
        "esri/units",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/on",
        "dojox/charting/Chart",
        "dojox/charting/themes/Dollar",
        "dojo/number",

          "dijit/layout/ContentPane",
          "dijit/layout/TabContainer",
          "dojox/charting/Chart2D",
          "dojox/charting/plot2d/Pie",
          "dojox/charting/action2d/Highlight",
          "dojox/charting/action2d/MoveSlice",
          "dojox/charting/action2d/Tooltip"
], function (
  declare,
  connect,
  dom,
  domStyle,
  Map,
  FeatureLayer,
  Popup,
  PopupTemplate,
  SimpleFillSymbol,
  Color,
  Measurement,
  Units,

  domClass,
  domConstruct,
  on,
  Chart,
  theme,
  number,

  ContentPane,
  TabContainer,
  Chart2D,
  Pie,
  Highlight,
  MoveSlice,
  Tooltip
) {
    var map;
    var _layer;
    var _template;
    function checkNull (variable) {
        locVariable = variable;
        if (locVariable === null) {
            locVariable = "Нет данных";
        }
        return locVariable;
    }

    return declare(null, {
        constructor: function(_map) {
            // this._makeMap();
            map = _map;
            return this;
        },

        _makeMap: function() {

            map = new Map("mapDiv", {
                basemap: "gray",
                center: [-98.57, 39.82],
                zoom: 4
            });
            return map;
        },

        _mapSetPopup: function(_map) {
            var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
            var popup = new Popup({
//                fillSymbol: fill,
                //     titleInBody: false
            
            }, domConstruct.create("div"));
            //Add the dark theme which is customized further in the <style> tag at the top of this page
            domClass.add(popup.domNode, "myTheme");
            _map.infoWindow = popup;
        },

        _addLayer: function(_map) {
            var template = new PopupTemplate({
                title: "Boston Marathon 2013",
                description: "{STATE_NAME}:  {Percent_Fi} of starters finished",
                fieldInfos: [
                    {
//define field infos so we can specify an alias
                        fieldName: "Number_Ent",
                        label: "Entrants"
                    }, {
                        fieldName: "Number_Sta",
                        label: "Starters"
                    }, {
                        fieldName: "Number_Fin",
                        label: "Finishers"
                    }
                ],
                mediaInfos: [
                    {
//define the bar chart
                        caption: "",
                        type: "barchart",
                        value: {
                            theme: "Dollar",
                            fields: ["Number_Ent", "Number_Sta", "Number_Fin"]
                        }
                    }
                ]
            });
            var featureLayer = new FeatureLayer("http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Boston_Marathon/FeatureServer/0", {
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"],
                infoTemplate: template
            });
            _map.addLayer(featureLayer);
        },

        addMeasurement: function(_map, _layer_, _template_) {

            var measurement = new Measurement({
                map: _map,
                defaultAreaUnit: Units.SQUARE_KILOMETERS,
                defaultLengthUnit: Units.KILOMETERS
            }, dom.byId("measurementDiv"));

            measurement.startup();
//        on(measurement, "hide", function () {
//            console.log("hide");
//        });
//        on(measurement, "show", function () {
//            console.log("show");
//        });
//        on(measurement, "show", function () {
//            console.log("show");
//        });
            connect.connect(measurement, "onMeasureEnd", function(activeTool, geometry) {
                //this.setTool(activeTool, false);
            });
            connect.connect(measurement, "onMeasureStart", function(activeTool, geometry) {
                //this.setTool(activeTool, true);
            });
            var measurementNode = dom.byId("measurementDiv");
            connect.connect(measurementNode, "onClick", function() {
                //this.setTool(activeTool, true);
            });
            _layer = _layer_;
            _template = _template_;
            var measurementNode = dom.byId("measurementDiv");
            on(measurementNode, "click", function() {
                var nodes = this.getElementsByTagName("span");
                var checked = false;

                for (var x = 0; x < nodes.length; x++) {
                    // only nodes with the class "progressIndicator":
                    //nodes[x].className === "esriButtonChecked"
                    if (domClass.contains(nodes[x], "esriButtonChecked")) {
                        // add to array:
                        checked = true;
                    }
                }
                if (!checked) {
                    _layer.setInfoTemplates({
                        2: { infoTemplate: _template }
                    });
                    console.log(domStyle.get("demoChart", "display"));
                    if (domStyle.get("demoChart", "display") === "none") {
                        //dojo.query("#demoChart").style("display", "block");  
                    }
                    console.log(domStyle.get("demoChart", "display"));
                } else {
                    _layer.setInfoTemplates({});
                    _map.infoWindow.hide();
                    dojo.query("#demoChart").style("display", "none");
                }
            });
        },

        getWindowContent: function(graphic) {
            // Make a tab container.
            var tc = new TabContainer({
                style: "width:100%;height:100%;"
            }, domConstruct.create("div"));

            // Display attribute information.
            var year = graphic.attributes.BAL_YEAR + 1; //graphic.attributes.BAL_DATE_LOAD;
            var cp1 = new ContentPane({
                title: "Баланса на " + year,
                content: "<ins>Год открытия:</ins><br> " +
                    checkNull(graphic.attributes.BAL_YEAR_OPEN) +
                    "<br><ins>Год ввода:</ins><br> " +
                    checkNull(graphic.attributes.BAL_YEAR_INPUT) +
                    "<br><ins>Остаточные балансовые запасы(A+B+C1):</ins><br> " +
                    checkNull(graphic.attributes.BAL_ABC1_BALRESEND) +
                    " тыс.т <br><ins>Остаточные извлекаемые запасы(A+B+C1):</ins><br>" +
                    checkNull(graphic.attributes.BAL_ABC1_EXTRRESEND) +
                    " тыс.т <br><ins>Балансовые запасы, ГКЗ(A+B+C1):</ins><br> " +
                    checkNull(graphic.attributes.BAL_ABC1_BALRESGKZ) +
                    " тыс.т <br><ins>Извлекаемые запасы, ГКЗ(A+B+C1):</ins><br>" +
                    checkNull(graphic.attributes.BAL_ABC1_EXTRRESGKZ) +
                    " тыс.т <br><ins>Название протокола:</ins><br>" +
                    checkNull(graphic.attributes.BAL_ABC1_PROTOCOLNAME) +
                    "<br><ins>Название лицензии:</ins><br>" +
                    checkNull(graphic.attributes.BAL_ABC1_LICENCENAME)
            });

            // Display a dojo pie chart for the male/female percentage.
            var cp2 = new ContentPane({
                title: "Добыча OIS"
            });

            var cp3 = new ContentPane({
                title: "Сервисы"
            });
            tc.addChild(cp1);
            tc.addChild(cp2);
            tc.addChild(cp3);

            // Create the chart that will display in the second tab.
            var c_ = domConstruct.create("div", { id: "demo" });
            var c_t = domConstruct.create("div", { id: "demoText" }, c_);
            var c_c = domConstruct.create("div", {
                id: "demoChart"
            }, c_);
            var chart = new Chart2D(c_c);
            domClass.add(chart, "chart");

            // Apply a color theme to the chart.
            chart.setTheme(theme);
            chart.addPlot("default", {
                type: "Pie",
                radius: 70,
                htmlLabels: true
            });
            tc.watch("selectedChildWidget", function(name, oldVal, newVal) {
                if (newVal.title === "Добыча OIS") {
                    chart.resize(180, 180);
                }
            });

            // Calculate percent male/female.
            var total = graphic.attributes.OIS_CUM_MINING_OIL + graphic.attributes.OIS_CUM_MINING_WATER;
            var oil = number.round(graphic.attributes.OIS_CUM_MINING_OIL / total * 100, 2);
            var water = number.round(graphic.attributes.OIS_CUM_MINING_WATER / total * 100, 2);
            chart.addSeries("Суммараная добыча", [
                {
                    y: oil,
                    tooltip: oil,
                    color: "#bf8040",
                    text: "Нефть"
                }, {
                    y: water,
                    tooltip: water,
                    color: "#99ccff",
                    text: "Вода"
                }
            ]);
            //highlight the chart and display tooltips when you mouse over a slice.
            new Highlight(chart, "default");
            new Tooltip(chart, "default");
            new MoveSlice(chart, "default");

            c_t.innerHTML =
                "Накопленная добыча нефти:" + checkNull(number.round(graphic.attributes.OIS_CUM_MINING_OIL / 1000, 2)) + "тыс.т</br>" +
                "Накопленная добыча воды:" + checkNull(number.round(graphic.attributes.OIS_CUM_MINING_WATER / 1000, 2)) + "тыс.т</br>";
            if (checkNull(graphic.attributes.OIS_CUM_MINING_OIL + graphic.attributes.OIS_CUM_MINING_WATER) != "0") {
                c_t.innerHTML = c_t.innerHTML +
                    "Обводненность:" + checkNull(number.round(graphic.attributes.OIS_CUM_MINING_WATER / (graphic.attributes.OIS_CUM_MINING_OIL + graphic.attributes.OIS_CUM_MINING_WATER) * 100, 2)) + "%</br>";
            } else {
                c_t.innerHTML = c_t.innerHTML +
                    "Обводненность: нет данных</br>";
            }
            c_t.innerHTML = c_t.innerHTML +
            "<a target='_blank' href='http://lar:8005/ois-viewer/#PRODUCTION?ois_oilfield_id=" + graphic.attributes.OIS_OILFIELD_CODE + "'>Подробная добыча OIS</a>";
        
        //console.log(chart.node);
        //cp2.set("content", chart.node);
        cp2.set("content", c_);
            //cp2.set("content", "<a target='_blank' href='http://lar:8005/ois-viewer?ois_oilfield_id=" + graphic.attributes.OIS_OILFIELD_CODE + "'>Добыча OIS</a>");

            // Create the chart that will display in the second tab.
        var c_serv = domConstruct.create("div", { id: "serv" });
        var c_t_serv = domConstruct.create("div", { id: "servText" }, c_serv);
        c_t_serv.innerHTML = c_t_serv.innerHTML + "Координаты:<br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML +
            "<a target='_blank' href='http://lar:8021/forarcgis?oilfieldName=" + graphic.attributes.OIS_OILFIELD_NAME + "&oilfieldCode=" + graphic.attributes.OIS_OILFIELD_CODE + "&serviceType=Coord'>Координаты скважин</a><br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML + "Каротаж:<br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML +
            "<a target='_blank' href='http://lar:8021/forarcgis?oilfieldName=" + graphic.attributes.OIS_OILFIELD_NAME + "&oilfieldCode=" + graphic.attributes.OIS_OILFIELD_CODE + "&serviceType=log'>Исследованные интервалы</a><br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML +
            "<a target='_blank' href='http://lar:8021/forarcgis?oilfieldName=" + graphic.attributes.OIS_OILFIELD_NAME + "&oilfieldCode=" + graphic.attributes.OIS_OILFIELD_CODE + "&serviceType=logno'>Не исследованные интервалы</a><br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML + "Кандидаты ГТМ:<br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML +
            "<a target='_blank' href='http://lar:8021/forarcgis?oilfieldName=" + graphic.attributes.OIS_OILFIELD_NAME + "&oilfieldCode=" + graphic.attributes.OIS_OILFIELD_CODE + "&serviceType=BotomholeCleaning'>Возможные кандидаты ОПЗ</a><br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML +
            "<a target='_blank' href='http://lar:8021/forarcgis?oilfieldName=" + graphic.attributes.OIS_OILFIELD_NAME + "&oilfieldCode=" + graphic.attributes.OIS_OILFIELD_CODE + "&serviceType=Recompletion'>Возможные кандидаты ПВЛГ/ПНЛГ или ликвидация</a><br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML + "Дополнительно:<br/>";
        c_t_serv.innerHTML = c_t_serv.innerHTML +
            "<a target='_blank' href='http://lar:8021:8021/forarcgis?oilfieldName=" + graphic.attributes.OIS_OILFIELD_NAME + "&oilfieldCode=" + graphic.attributes.OIS_OILFIELD_CODE + "&serviceType=FundFromGivingPlast'>Весь фонд по дающим с пластами и НСП</a><br/>";
        

        cp3.set("content", c_serv);

        dom.byId("CodKupol").value = graphic.attributes.OIS_OILFIELD_CODE;

        return tc.domNode;
        },
        getWindowContentRegion: function (graphic) {
            return "${Название}<br>" +
                    //"<a target='_blank' href='http://lar/MapUWS/MonitoringContracts/index.html?region=" + graphic.attribute.Сокр_англ_наимен + "'>Мониторинг договоров</a>" +
                    "<a target='_blank' href='http://lar:8021/MonitoringContractsPages/index.html'>Мониторинг договоров</a>" +
                     "";
        }

    });
});
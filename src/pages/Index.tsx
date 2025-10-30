import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type BuildingStatus = 'normal' | 'warning' | 'critical' | 'no-signal' | 'maintenance';

type Building = {
  id: string;
  name: string;
  address: string;
  status: BuildingStatus;
  sensors: number;
  activeSensors: number;
  lastCheck: string;
  alerts: number;
  lat: number;
  lng: number;
  maintenanceDue?: string;
  systems: {
    sprinkler: 'active' | 'inactive' | 'error';
    alarm: 'active' | 'inactive' | 'error';
    smoke: 'active' | 'inactive' | 'error';
    temperature: number;
  };
};

const mockBuildings: Building[] = [
  {
    id: '4',
    name: 'ТЦ Горизонт',
    address: 'Московское шоссе 18, Самара',
    status: 'critical',
    sensors: 78,
    activeSensors: 76,
    lastCheck: '2 мин назад',
    alerts: 1,
    lat: 53.2415,
    lng: 50.2212,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'error', temperature: 35 },
  },
  {
    id: '5',
    name: 'Офис Вектор',
    address: 'ул. Ново-Садовая 106, Самара',
    status: 'critical',
    sensors: 56,
    activeSensors: 52,
    lastCheck: '1 мин назад',
    alerts: 1,
    lat: 53.2001,
    lng: 50.1500,
    systems: { sprinkler: 'error', alarm: 'active', smoke: 'active', temperature: 32 },
  },
  {
    id: '2',
    name: 'Склад Техно',
    address: 'пр. Кирова 156, Самара',
    status: 'no-signal',
    sensors: 32,
    activeSensors: 28,
    lastCheck: '15 мин назад',
    alerts: 1,
    lat: 53.2280,
    lng: 50.1960,
    systems: { sprinkler: 'active', alarm: 'inactive', smoke: 'active', temperature: 20 },
  },
  {
    id: '3',
    name: 'БЦ Альфа',
    address: 'ул. Ленинградская 34, Самара',
    status: 'maintenance',
    sensors: 45,
    activeSensors: 45,
    lastCheck: '3 мин назад',
    alerts: 0,
    maintenanceDue: '3 дня',
    lat: 53.1959,
    lng: 50.1008,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 22 },
  },
  {
    id: '6',
    name: 'ТРК Космопорт',
    address: 'Московское шоссе 5, Самара',
    status: 'maintenance',
    sensors: 64,
    activeSensors: 64,
    lastCheck: '5 мин назад',
    alerts: 0,
    maintenanceDue: '5 дней',
    lat: 53.2107,
    lng: 50.2736,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 24 },
  },
  {
    id: '7',
    name: 'Бизнес-парк Волга',
    address: 'ул. Аэродромная 47А, Самара',
    status: 'maintenance',
    sensors: 38,
    activeSensors: 38,
    lastCheck: '4 мин назад',
    alerts: 0,
    maintenanceDue: '7 дней',
    lat: 53.2429,
    lng: 50.2214,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 21 },
  },
  {
    id: '1',
    name: 'Производственный цех №3',
    address: 'ул. Заводское шоссе 22, Самара',
    status: 'normal',
    sensors: 67,
    activeSensors: 67,
    lastCheck: '2 мин назад',
    alerts: 0,
    lat: 53.2307,
    lng: 50.3533,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 23 },
  },
  {
    id: '8',
    name: 'Гостиница Амакс',
    address: 'ул. Ново-Садовая 162, Самара',
    status: 'normal',
    sensors: 52,
    activeSensors: 52,
    lastCheck: '1 мин назад',
    alerts: 0,
    lat: 53.2050,
    lng: 50.1450,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 22 },
  },
];

const mockAlerts = [
  { id: '1', building: 'ТЦ Горизонт', type: 'critical', message: 'Задымление в зоне 2 (Фудкорт)', time: '2 мин назад' },
  { id: '2', building: 'Офис Вектор', type: 'critical', message: 'Сработка датчика дыма, этаж 4', time: '1 мин назад' },
  { id: '3', building: 'Склад Техно', type: 'warning', message: 'Потеря связи с датчиками', time: '15 мин назад' },
  { id: '4', building: 'БЦ Альфа', type: 'maintenance', message: 'Плановое ТО через 3 дня', time: '1 час назад' },
];

export default function Index() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [activeTab, setActiveTab] = useState('registry');

  const criticalCount = mockBuildings.filter(b => b.status === 'critical').length;
  const noSignalCount = mockBuildings.filter(b => b.status === 'no-signal').length;
  const maintenanceCount = mockBuildings.filter(b => b.status === 'maintenance').length;

  const getStatusColor = (status: BuildingStatus) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      case 'no-signal': return 'bg-orange-600';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: BuildingStatus) => {
    switch (status) {
      case 'normal': return 'Норма';
      case 'warning': return 'Внимание';
      case 'critical': return 'ТРЕВОГА';
      case 'no-signal': return 'Нет сигнала';
      case 'maintenance': return 'Требуется ТО';
      default: return status;
    }
  };

  const getPriorityOrder = (status: BuildingStatus): number => {
    switch (status) {
      case 'critical': return 1;
      case 'no-signal': return 2;
      case 'maintenance': return 3;
      case 'warning': return 4;
      case 'normal': return 5;
      default: return 6;
    }
  };

  const sortedBuildings = [...mockBuildings].sort((a, b) => {
    return getPriorityOrder(a.status) - getPriorityOrder(b.status);
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
    script.async = true;
    script.onload = () => {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map('yandex-map', {
            center: [53.2001, 50.15],
            zoom: 12,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
          });

          mockBuildings.forEach(building => {
            const placemark = new window.ymaps.Placemark(
              [building.lat, building.lng],
              {
                balloonContent: `
                  <div style="padding: 10px;">
                    <strong>${building.name}</strong><br/>
                    ${building.address}<br/>
                    Статус: <span style="color: ${building.status === 'critical' ? 'red' : building.status === 'no-signal' ? 'orange' : building.status === 'maintenance' ? '#eab308' : 'green'}">${getStatusText(building.status)}</span><br/>
                    Датчики: ${building.activeSensors}/${building.sensors}
                  </div>
                `,
                hintContent: building.name
              },
              {
                preset: building.status === 'critical' ? 'islands#redIcon' : 
                        building.status === 'no-signal' ? 'islands#orangeIcon' : 
                        building.status === 'maintenance' ? 'islands#yellowIcon' : 
                        'islands#greenIcon'
              }
            );

            placemark.events.add('click', () => {
              setSelectedBuilding(building);
            });

            map.geoObjects.add(placemark);
          });
        });
      }
    };
    if (activeTab === 'map') {
      document.body.appendChild(script);
    }
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Flame" size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-foreground">FireWatch</h1>
          </div>
          <p className="text-muted-foreground">Система мониторинга противопожарных систем</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="registry" className="gap-2">
              <Icon name="Building2" size={16} />
              Реестр объектов
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Icon name="Map" size={16} />
              Карта
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Icon name="AlertTriangle" size={16} />
              Оповещения
              {mockAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-1">{mockAlerts.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registry" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-6 border-2 border-red-500 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">ТРЕВОГА</p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">{criticalCount} объекта</p>
                  </div>
                  <Icon name="Siren" size={40} className="text-red-600 dark:text-red-400" />
                </div>
              </Card>

              <Card className="p-6 border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">НЕТ СИГНАЛА</p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{noSignalCount} объект</p>
                  </div>
                  <Icon name="SignalLow" size={40} className="text-orange-600 dark:text-orange-400" />
                </div>
              </Card>

              <Card className="p-6 border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">ТРЕБУЕТСЯ ТО</p>
                    <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{maintenanceCount} объекта</p>
                  </div>
                  <Icon name="Wrench" size={40} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </Card>
            </div>

            <div className="grid gap-4">
              {sortedBuildings.map((building) => (
                <Card
                  key={building.id}
                  className={`p-6 hover:bg-secondary/50 transition-all cursor-pointer border-2 ${
                    building.status === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' : 
                    building.status === 'no-signal' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-500' : 
                    building.status === 'maintenance' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' : 
                    'border-border'
                  }`}
                  onClick={() => setSelectedBuilding(building)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(building.status)} ${building.status === 'critical' ? 'animate-pulse' : ''}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{building.name}</h3>
                          <Badge 
                            variant={building.status === 'critical' ? 'destructive' : building.status === 'no-signal' ? 'default' : building.status === 'maintenance' ? 'secondary' : 'secondary'}
                            className={building.status === 'critical' ? 'animate-pulse' : ''}
                          >
                            {getStatusText(building.status)}
                          </Badge>
                          {building.status === 'maintenance' && building.maintenanceDue && (
                            <span className="text-sm text-yellow-600 dark:text-yellow-400">через {building.maintenanceDue}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Icon name="MapPin" size={14} />
                          {building.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground">Датчики</div>
                        <div className="text-xl font-bold">{building.activeSensors}/{building.sensors}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Тревоги</div>
                        <div className={`text-xl font-bold ${building.alerts > 0 ? 'text-destructive' : 'text-green-500'}`}>
                          {building.alerts}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Проверка</div>
                        <div className="text-sm">{building.lastCheck}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Объекты на карте Самары</h2>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Тревога</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Нет сигнала</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>ТО</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Норма</span>
                  </div>
                </div>
              </div>
              <div id="yandex-map" className="w-full h-[600px] bg-secondary/20 rounded-lg"></div>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="grid gap-4">
              {mockAlerts.map((alert) => (
                <Card key={alert.id} className={`p-6 border-l-4 ${alert.type === 'critical' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' : alert.type === 'warning' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Icon 
                        name={alert.type === 'critical' ? 'AlertCircle' : alert.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                        size={24} 
                        className={alert.type === 'critical' ? 'text-red-600 dark:text-red-400' : alert.type === 'warning' ? 'text-orange-600 dark:text-orange-400' : 'text-yellow-600 dark:text-yellow-400'} 
                      />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{alert.building}</h3>
                        <p className="text-sm mb-2">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    {alert.type === 'critical' && (
                      <Button variant="destructive" size="sm">
                        <Icon name="Phone" size={16} className="mr-2" />
                        Связь с МЧС
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedBuilding} onOpenChange={() => setSelectedBuilding(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedBuilding && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedBuilding.status)} ${selectedBuilding.status === 'critical' ? 'animate-pulse' : ''}`} />
                    {selectedBuilding.name}
                  </DialogTitle>
                </DialogHeader>

                {selectedBuilding.status === 'critical' && (
                  <div className="bg-red-100 dark:bg-red-950 border-2 border-red-500 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name="Siren" size={24} className="text-red-600 animate-pulse" />
                        <div>
                          <p className="font-bold text-red-700 dark:text-red-300">ТРЕВОГА!</p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {mockAlerts.find(a => a.building === selectedBuilding.name)?.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Связь с МЧС
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Volume2" size={16} className="mr-2" />
                          Отключить сирену
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Tabs defaultValue="info" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="info">Общая информация</TabsTrigger>
                    <TabsTrigger value="systems">Системы</TabsTrigger>
                    <TabsTrigger value="sensors">Датчики</TabsTrigger>
                    <TabsTrigger value="history">История</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon name="MapPin" size={20} className="text-primary" />
                          <h4 className="font-semibold">Адрес</h4>
                        </div>
                        <p className="text-sm">{selectedBuilding.address}</p>
                      </Card>

                      <Card className={`p-4 ${selectedBuilding.status === 'critical' ? 'bg-red-50 dark:bg-red-950/20' : selectedBuilding.status === 'no-signal' ? 'bg-orange-50 dark:bg-orange-950/20' : selectedBuilding.status === 'maintenance' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-green-50 dark:bg-green-950/20'}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Icon name="Shield" size={20} className="text-primary" />
                          <h4 className="font-semibold">Статус защиты</h4>
                        </div>
                        <p className={`text-lg font-bold ${selectedBuilding.status === 'critical' ? 'text-red-600' : selectedBuilding.status === 'no-signal' ? 'text-orange-600' : selectedBuilding.status === 'maintenance' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {getStatusText(selectedBuilding.status)}
                        </p>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon name="Radio" size={20} className="text-primary" />
                          <h4 className="font-semibold">Датчики</h4>
                        </div>
                        <p className="text-2xl font-bold">{selectedBuilding.activeSensors}/{selectedBuilding.sensors}</p>
                        <p className="text-xs text-muted-foreground mt-1">Активных датчиков</p>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon name="Clock" size={20} className="text-primary" />
                          <h4 className="font-semibold">Последняя проверка</h4>
                        </div>
                        <p className="text-lg">{selectedBuilding.lastCheck}</p>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="systems" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className={`p-4 ${selectedBuilding.systems.sprinkler === 'error' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' : 'bg-green-50 dark:bg-green-950/20'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon name="Droplets" size={20} />
                            <h4 className="font-semibold">Спринклерная система</h4>
                          </div>
                          <Badge variant={selectedBuilding.systems.sprinkler === 'active' ? 'secondary' : 'destructive'}>
                            {selectedBuilding.systems.sprinkler === 'active' ? 'Активна' : 'Ошибка'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">12 зон покрытия</p>
                      </Card>

                      <Card className={`p-4 ${selectedBuilding.systems.alarm === 'error' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' : 'bg-green-50 dark:bg-green-950/20'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon name="Bell" size={20} />
                            <h4 className="font-semibold">Пожарная сигнализация</h4>
                          </div>
                          <Badge variant={selectedBuilding.systems.alarm === 'active' ? 'secondary' : 'destructive'}>
                            {selectedBuilding.systems.alarm === 'active' ? 'Активна' : 'Ошибка'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedBuilding.sensors} датчиков</p>
                      </Card>

                      <Card className={`p-4 ${selectedBuilding.systems.smoke === 'error' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' : 'bg-green-50 dark:bg-green-950/20'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon name="Cloud" size={20} />
                            <h4 className="font-semibold">Дымоудаление</h4>
                          </div>
                          <Badge variant={selectedBuilding.systems.smoke === 'active' ? 'secondary' : 'destructive'}>
                            {selectedBuilding.systems.smoke === 'active' ? 'Активна' : 'Ошибка'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">8 вентиляционных каналов</p>
                      </Card>

                      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon name="Thermometer" size={20} />
                            <h4 className="font-semibold">Температура</h4>
                          </div>
                          <Badge variant="secondary">Мониторинг</Badge>
                        </div>
                        <p className="text-2xl font-bold">{selectedBuilding.systems.temperature}°C</p>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="sensors" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">Подробная информация о датчиках и их расположении</p>
                    <div className="h-96 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Icon name="Radio" size={48} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">План размещения датчиков</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {mockAlerts.filter(a => a.building === selectedBuilding.name).map((alert) => (
                        <Card key={alert.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon 
                              name={alert.type === 'critical' ? 'AlertCircle' : 'Info'} 
                              size={20} 
                              className={alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'} 
                            />
                            <div className="flex-1">
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-sm text-muted-foreground">{alert.time}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {mockAlerts.filter(a => a.building === selectedBuilding.name).length === 0 && (
                        <p className="text-center text-muted-foreground py-8">События отсутствуют</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ymaps: any;
  }
}

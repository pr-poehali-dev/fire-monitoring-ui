import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type BuildingStatus = 'normal' | 'warning' | 'critical' | 'no-signal' | 'maintenance';

type OperatorAction = {
  id: string;
  timestamp: string;
  action: string;
  building: string;
  operator: string;
};

type BuildingHistory = {
  id: string;
  date: string;
  event: string;
  details: string;
};

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
  alarmConfirmed?: boolean;
  fireSystem: string;
  lastMaintenance: string;
  history: BuildingHistory[];
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
    fireSystem: 'Автоматическая система пожаротушения + Дымоудаление',
    lastMaintenance: '15.09.2024',
    history: [
      { id: '1', date: '30.10.2024 14:32', event: 'Тревога', details: 'Задымление в зоне 2 (Фудкорт)' },
      { id: '2', date: '15.09.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
      { id: '3', date: '10.08.2024', event: 'Тревога', details: 'Ложное срабатывание датчика дыма' },
    ],
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
    fireSystem: 'Спринклерная система пожаротушения',
    lastMaintenance: '20.08.2024',
    history: [
      { id: '1', date: '30.10.2024 14:34', event: 'Тревога', details: 'Сработка датчика дыма, этаж 4' },
      { id: '2', date: '20.08.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
    fireSystem: 'Газовая система пожаротушения',
    lastMaintenance: '05.10.2024',
    history: [
      { id: '1', date: '30.10.2024 14:15', event: 'Потеря связи', details: 'Потеря связи с датчиками' },
      { id: '2', date: '05.10.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
    fireSystem: 'Автоматическая система пожаротушения',
    lastMaintenance: '25.07.2024',
    history: [
      { id: '1', date: '25.07.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
      { id: '2', date: '15.05.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
    fireSystem: 'Автоматическая система пожаротушения + Дымоудаление',
    lastMaintenance: '22.07.2024',
    history: [
      { id: '1', date: '22.07.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
    fireSystem: 'Спринклерная система пожаротушения',
    lastMaintenance: '18.07.2024',
    history: [
      { id: '1', date: '18.07.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
    fireSystem: 'Порошковая система пожаротушения',
    lastMaintenance: '01.10.2024',
    history: [
      { id: '1', date: '01.10.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
    fireSystem: 'Автоматическая система пожаротушения',
    lastMaintenance: '12.10.2024',
    history: [
      { id: '1', date: '12.10.2024', event: 'ТО', details: 'Проведено плановое техническое обслуживание' },
    ],
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
  const [statusFilter, setStatusFilter] = useState<BuildingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [operatorActions, setOperatorActions] = useState<OperatorAction[]>([]);

  const criticalCount = buildings.filter(b => b.status === 'critical').length;
  const noSignalCount = buildings.filter(b => b.status === 'no-signal').length;
  const maintenanceCount = buildings.filter(b => b.status === 'maintenance').length;

  const confirmAlarm = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;

    setBuildings(prevBuildings =>
      prevBuildings.map(b =>
        b.id === buildingId ? { ...b, alarmConfirmed: true } : b
      )
    );
    
    const now = new Date();
    const timeString = now.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setOperatorActions(prev => [{
      id: Date.now().toString(),
      timestamp: timeString,
      action: 'Подтверждение тревоги',
      building: building.name,
      operator: 'Оператор 1'
    }, ...prev]);

    if (selectedBuilding?.id === buildingId) {
      setSelectedBuilding({ ...selectedBuilding, alarmConfirmed: true });
    }
  };

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

  const filteredBuildings = buildings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => 
      searchQuery === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedBuildings = [...filteredBuildings].sort((a, b) => {
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

          buildings.forEach(building => {
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
            <TabsTrigger value="actions" className="gap-2">
              <Icon name="FileText" size={16} />
              Журнал действий
              {operatorActions.length > 0 && (
                <Badge variant="secondary" className="ml-1">{operatorActions.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registry" className="space-y-4">
            <div className="relative mb-4">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по названию или адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Все объекты ({mockBuildings.length})
                </Button>
                <Button 
                  variant={statusFilter === 'critical' ? 'destructive' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('critical')}
                  className={statusFilter === 'critical' ? '' : 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'}
                >
                  <Icon name="Siren" size={16} className="mr-2" />
                  Тревоги ({criticalCount})
                </Button>
                <Button 
                  variant={statusFilter === 'no-signal' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('no-signal')}
                  className={statusFilter === 'no-signal' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20'}
                >
                  <Icon name="SignalLow" size={16} className="mr-2" />
                  Нет сигнала ({noSignalCount})
                </Button>
                <Button 
                  variant={statusFilter === 'maintenance' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('maintenance')}
                  className={statusFilter === 'maintenance' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/20'}
                >
                  <Icon name="Wrench" size={16} className="mr-2" />
                  Требуется ТО ({maintenanceCount})
                </Button>
                <Button 
                  variant={statusFilter === 'normal' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter('normal')}
                  className={statusFilter === 'normal' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'}
                >
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Норма ({buildings.filter(b => b.status === 'normal').length})
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {sortedBuildings.length === 0 ? (
                <Card className="p-8 text-center">
                  <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">Ничего не найдено</p>
                  <p className="text-sm text-muted-foreground">Попробуйте изменить фильтры или запрос поиска</p>
                </Card>
              ) : (
                sortedBuildings.map((building) => (
                <Card
                  key={building.id}
                  className={`p-4 hover:bg-secondary/50 transition-all border-l-4 ${
                    building.status === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-l-red-500' : 
                    building.status === 'no-signal' ? 'border-l-orange-500' :
                    building.status === 'maintenance' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(building.status)} ${building.status === 'critical' ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-semibold truncate">{building.name}</h3>
                          <Badge 
                            variant={building.status === 'critical' ? 'destructive' : building.status === 'no-signal' ? 'default' : building.status === 'maintenance' ? 'secondary' : 'secondary'}
                            className={`text-xs ${building.status === 'critical' ? 'animate-pulse' : ''}`}
                          >
                            {getStatusText(building.status)}
                            {building.status === 'maintenance' && building.maintenanceDue && (
                              <span className="ml-1">• через {building.maintenanceDue}</span>
                            )}
                          </Badge>
                          {building.status === 'critical' && building.alarmConfirmed && (
                            <Badge variant="outline" className="text-xs bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400">
                              <Icon name="CheckCircle2" size={12} className="mr-1" />
                              Подтверждена
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <Icon name="MapPin" size={12} />
                          {building.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {building.status === 'critical' && !building.alarmConfirmed && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmAlarm(building.id)}
                          className="animate-pulse"
                        >
                          <Icon name="Bell" size={16} className="mr-1" />
                          Подтвердить
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBuilding(building)}
                        className="flex-shrink-0"
                      >
                        <Icon name="ChevronRight" size={16} />
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
              )}
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

          <TabsContent value="actions" className="space-y-4">
            {operatorActions.length === 0 ? (
              <Card className="p-8 text-center">
                <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground mb-2">Нет записей</p>
                <p className="text-sm text-muted-foreground">Действия оператора будут отображаться здесь</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {operatorActions.map((action) => (
                  <Card key={action.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Icon name="UserCheck" size={20} className="text-blue-600 mt-1" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{action.action}</h3>
                            <Badge variant="outline">{action.operator}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{action.building}</p>
                          <p className="text-xs text-muted-foreground">{action.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedBuilding} onOpenChange={() => setSelectedBuilding(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedBuilding && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedBuilding.status)} ${selectedBuilding.status === 'critical' ? 'animate-pulse' : ''}`} />
                    {selectedBuilding.name}
                  </DialogTitle>
                </DialogHeader>

                {selectedBuilding.status === 'critical' && (
                  <div className={`border-2 p-4 rounded-lg mb-4 ${selectedBuilding.alarmConfirmed ? 'bg-red-50 dark:bg-red-950/50 border-red-400' : 'bg-red-100 dark:bg-red-950 border-red-500'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name="Siren" size={24} className={`text-red-600 ${!selectedBuilding.alarmConfirmed ? 'animate-pulse' : ''}`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-red-700 dark:text-red-300">ТРЕВОГА!</p>
                            {selectedBuilding.alarmConfirmed && (
                              <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400">
                                <Icon name="CheckCircle2" size={12} className="mr-1" />
                                Подтверждена
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {mockAlerts.find(a => a.building === selectedBuilding.name)?.message}
                          </p>
                        </div>
                      </div>
                      {!selectedBuilding.alarmConfirmed && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => confirmAlarm(selectedBuilding.id)}
                          className="animate-pulse"
                        >
                          <Icon name="Bell" size={16} className="mr-2" />
                          Подтвердить тревогу
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4 mt-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="MapPin" size={20} className="text-primary" />
                      <h4 className="font-semibold">Адрес</h4>
                    </div>
                    <p className="text-sm">{selectedBuilding.address}</p>
                  </Card>

                  <Card className={`p-4 ${selectedBuilding.status === 'critical' ? 'bg-red-50 dark:bg-red-950/20' : selectedBuilding.status === 'no-signal' ? 'bg-orange-50 dark:bg-orange-950/20' : selectedBuilding.status === 'maintenance' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-green-50 dark:bg-green-950/20'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Shield" size={20} className="text-primary" />
                      <h4 className="font-semibold">Статус</h4>
                    </div>
                    <p className={`text-lg font-bold ${selectedBuilding.status === 'critical' ? 'text-red-600' : selectedBuilding.status === 'no-signal' ? 'text-orange-600' : selectedBuilding.status === 'maintenance' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {getStatusText(selectedBuilding.status)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Flame" size={20} className="text-primary" />
                      <h4 className="font-semibold">Противопожарная система</h4>
                    </div>
                    <p className="text-sm">{selectedBuilding.fireSystem}</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Wrench" size={20} className="text-primary" />
                      <h4 className="font-semibold">Последнее ТО</h4>
                    </div>
                    <p className="text-sm">{selectedBuilding.lastMaintenance}</p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="History" size={20} className="text-primary" />
                      <h4 className="font-semibold">История объекта</h4>
                    </div>
                    <div className="space-y-3">
                      {selectedBuilding.history.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                          <div className="flex-shrink-0">
                            <Icon 
                              name={item.event === 'Тревога' ? 'AlertCircle' : 'CheckCircle'} 
                              size={16} 
                              className={item.event === 'Тревога' ? 'text-red-600' : 'text-green-600'} 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{item.event}</span>
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

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
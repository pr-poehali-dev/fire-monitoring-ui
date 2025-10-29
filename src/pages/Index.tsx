import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type Building = {
  id: string;
  name: string;
  address: string;
  status: 'normal' | 'warning' | 'critical';
  sensors: number;
  activeSensors: number;
  lastCheck: string;
  alerts: number;
  lat: number;
  lng: number;
  systems: {
    sprinkler: 'active' | 'inactive' | 'error';
    alarm: 'active' | 'inactive' | 'error';
    smoke: 'active' | 'inactive' | 'error';
    temperature: number;
  };
};

const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Бизнес-центр Альфа',
    address: 'ул. Тверская, 15',
    status: 'normal',
    sensors: 45,
    activeSensors: 45,
    lastCheck: '2 мин назад',
    alerts: 0,
    lat: 55.7626,
    lng: 37.6089,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 22 },
  },
  {
    id: '2',
    name: 'ТРЦ Горизонт',
    address: 'пр-т Мира, 120',
    status: 'warning',
    sensors: 78,
    activeSensors: 76,
    lastCheck: '5 мин назад',
    alerts: 2,
    lat: 55.7701,
    lng: 37.6367,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'error', temperature: 28 },
  },
  {
    id: '3',
    name: 'Складской комплекс Бета',
    address: 'ул. Промышленная, 8',
    status: 'normal',
    sensors: 32,
    activeSensors: 32,
    lastCheck: '1 мин назад',
    alerts: 0,
    lat: 55.7558,
    lng: 37.5820,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 20 },
  },
  {
    id: '4',
    name: 'Офисный центр Омега',
    address: 'Ленинский пр-т, 45',
    status: 'critical',
    sensors: 56,
    activeSensors: 52,
    lastCheck: '30 сек назад',
    alerts: 4,
    lat: 55.7090,
    lng: 37.5919,
    systems: { sprinkler: 'error', alarm: 'active', smoke: 'active', temperature: 35 },
  },
  {
    id: '5',
    name: 'Производственный цех №3',
    address: 'ул. Заводская, 22',
    status: 'normal',
    sensors: 64,
    activeSensors: 64,
    lastCheck: '3 мин назад',
    alerts: 0,
    lat: 55.7419,
    lng: 37.6520,
    systems: { sprinkler: 'active', alarm: 'active', smoke: 'active', temperature: 24 },
  },
];

const mockAlerts = [
  { id: '1', building: 'ТРЦ Горизонт', type: 'warning', message: 'Датчик дыма №23 не отвечает', time: '5 мин назад' },
  { id: '2', building: 'Офисный центр Омега', type: 'critical', message: 'Критическая температура в зоне А', time: '30 сек назад' },
  { id: '3', building: 'Офисный центр Омега', type: 'critical', message: 'Система пожаротушения не активна', time: '1 мин назад' },
  { id: '4', building: 'ТРЦ Горизонт', type: 'warning', message: 'Потеря связи с датчиком №45', time: '10 мин назад' },
];

export default function Index() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [activeTab, setActiveTab] = useState('registry');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Норма';
      case 'warning': return 'Внимание';
      case 'critical': return 'Тревога';
      default: return status;
    }
  };

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
            <div className="grid gap-4">
              {mockBuildings.map((building) => (
                <Card
                  key={building.id}
                  className="p-6 hover:bg-secondary/50 transition-all cursor-pointer border-border"
                  onClick={() => setSelectedBuilding(building)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(building.status)} animate-pulse`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{building.name}</h3>
                          <Badge variant={building.status === 'critical' ? 'destructive' : building.status === 'warning' ? 'default' : 'secondary'}>
                            {getStatusText(building.status)}
                          </Badge>
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
              <div className="relative w-full h-[600px] bg-secondary/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Icon name="Map" size={48} className="mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Интерактивная карта объектов</p>
                    <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
                      {mockBuildings.map((building) => (
                        <div
                          key={building.id}
                          className="bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-all"
                          onClick={() => setSelectedBuilding(building)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(building.status)}`} />
                            <span className="text-sm font-semibold">{building.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {building.lat.toFixed(4)}, {building.lng.toFixed(4)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {mockAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`p-6 border-l-4 ${alert.type === 'critical' ? 'border-l-destructive' : 'border-l-orange-500'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Icon
                      name={alert.type === 'critical' ? 'AlertCircle' : 'AlertTriangle'}
                      size={24}
                      className={alert.type === 'critical' ? 'text-destructive' : 'text-orange-500'}
                    />
                    <div>
                      <h3 className="font-semibold mb-1">{alert.building}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Проверить
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedBuilding} onOpenChange={() => setSelectedBuilding(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Icon name="Building2" size={24} />
              {selectedBuilding?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBuilding && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" size={20} className="text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Адрес</div>
                      <div className="text-sm font-medium">{selectedBuilding.address}</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedBuilding.status)} animate-pulse`} />
                    <div>
                      <div className="text-xs text-muted-foreground">Статус</div>
                      <div className="text-sm font-medium">{getStatusText(selectedBuilding.status)}</div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Датчики</span>
                    <Icon name="Radio" size={18} className="text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{selectedBuilding.activeSensors}/{selectedBuilding.sensors}</div>
                  <div className="text-xs text-muted-foreground mt-1">Активных датчиков</div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Тревоги</span>
                    <Icon name="AlertTriangle" size={18} className={selectedBuilding.alerts > 0 ? 'text-destructive' : 'text-green-500'} />
                  </div>
                  <div className={`text-2xl font-bold ${selectedBuilding.alerts > 0 ? 'text-destructive' : 'text-green-500'}`}>
                    {selectedBuilding.alerts}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Активных тревог</div>
                </Card>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Состояние систем</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Droplets" size={18} />
                        <span className="text-sm">Спринклерная система</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedBuilding.systems.sprinkler)}`} />
                    </div>
                  </Card>
                  <Card className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Bell" size={18} />
                        <span className="text-sm">Система оповещения</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedBuilding.systems.alarm)}`} />
                    </div>
                  </Card>
                  <Card className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Wind" size={18} />
                        <span className="text-sm">Датчики дыма</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedBuilding.systems.smoke)}`} />
                    </div>
                  </Card>
                  <Card className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Thermometer" size={18} />
                        <span className="text-sm">Температура</span>
                      </div>
                      <span className="text-sm font-bold">{selectedBuilding.systems.temperature}°C</span>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedBuilding(null)}>
                  Закрыть
                </Button>
                <Button className="gap-2">
                  <Icon name="FileText" size={16} />
                  Полный отчет
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

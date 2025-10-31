import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState<number | null>(null);

  const rooms = [
    { id: 1, name: 'Ночной сеанс', viewers: 8, movie: 'Интерстеллар', status: 'active' },
    { id: 2, name: 'Комедийный вечер', viewers: 5, movie: 'Гранд Будапешт', status: 'active' },
    { id: 3, name: 'Ужастики', viewers: 3, movie: 'Очень страшное кино', status: 'active' },
  ];

  const friends = [
    { id: 1, name: 'Александр', status: 'online', avatar: '🎬', watching: 'Интерстеллар' },
    { id: 2, name: 'Мария', status: 'online', avatar: '🍿', watching: 'Гранд Будапешт' },
    { id: 3, name: 'Дмитрий', status: 'offline', avatar: '🎥', watching: null },
    { id: 4, name: 'Анна', status: 'online', avatar: '🎪', watching: null },
  ];

  const movies = [
    { id: 1, title: 'Интерстеллар', genre: 'Sci-Fi', duration: '169 мин', rating: 8.6, poster: '🚀' },
    { id: 2, title: 'Гранд Будапешт', genre: 'Комедия', duration: '99 мин', rating: 8.1, poster: '🏨' },
    { id: 3, title: 'Начало', genre: 'Триллер', duration: '148 мин', rating: 8.8, poster: '🌀' },
    { id: 4, title: 'Зелёная миля', genre: 'Драма', duration: '189 мин', rating: 8.6, poster: '💚' },
    { id: 5, title: 'Форрест Гамп', genre: 'Драма', duration: '142 мин', rating: 8.8, poster: '🏃' },
    { id: 6, title: 'Матрица', genre: 'Sci-Fi', duration: '136 мин', rating: 8.7, poster: '🔴' },
  ];

  const chatMessages = [
    { id: 1, user: 'Александр', message: 'Этот момент просто невероятный!', time: '21:34', avatar: '🎬' },
    { id: 2, user: 'Мария', message: 'Согласна! Музыка Циммера 😍', time: '21:35', avatar: '🍿' },
    { id: 3, user: 'Дмитрий', message: 'Кто-то включите русские субтитры?', time: '21:36', avatar: '🎥' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎬</div>
            <h1 className="text-2xl font-bold text-foreground">CineParty</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="animate-fade-in border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Icon name="Play" size={24} className="text-primary" />
                  Активные комнаты
                </CardTitle>
                <CardDescription className="text-muted-foreground">Присоединяйся к просмотру с друзьями</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className="hover:border-primary transition-all cursor-pointer hover:scale-105 duration-200 bg-muted/30"
                    onClick={() => setActiveRoom(room.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-foreground">{room.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{room.movie}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <Icon name="Users" size={14} className="mr-1" />
                          {room.viewers}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Icon name="PlayCircle" size={18} className="mr-2" />
                        Присоединиться
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Tabs defaultValue="catalog" className="animate-fade-in">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="catalog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Film" size={18} className="mr-2" />
                  Каталог фильмов
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="MessageCircle" size={18} className="mr-2" />
                  Чат комнаты
                </TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="space-y-4">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Популярные фильмы</CardTitle>
                    <CardDescription className="text-muted-foreground">Выберите фильм для совместного просмотра</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {movies.map((movie) => (
                        <Card key={movie.id} className="hover:border-primary transition-all cursor-pointer hover:scale-105 duration-200 bg-muted/30">
                          <CardContent className="p-4">
                            <div className="text-6xl mb-3 text-center">{movie.poster}</div>
                            <h3 className="font-semibold mb-2 text-foreground">{movie.title}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center justify-between">
                                <span>{movie.genre}</span>
                                <Badge variant="outline" className="text-xs">⭐ {movie.rating}</Badge>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Icon name="Clock" size={14} />
                                {movie.duration}
                              </div>
                            </div>
                            <Button size="sm" className="w-full mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                              Смотреть
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Чат комнаты</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {activeRoom ? `Общайтесь во время просмотра` : 'Выберите комнату для начала общения'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] mb-4 rounded-lg border border-border bg-muted/20 p-4">
                      <div className="space-y-4">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className="flex gap-3 animate-fade-in">
                            <div className="text-2xl">{msg.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm text-foreground">{msg.user}</span>
                                <span className="text-xs text-muted-foreground">{msg.time}</span>
                              </div>
                              <p className="text-sm text-foreground mt-1">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Напишите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Icon name="Send" size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="animate-fade-in border-border bg-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Icon name="Users" size={20} className="text-primary" />
                  Друзья онлайн
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <div className="text-2xl">{friend.avatar}</div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                              friend.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{friend.name}</p>
                          {friend.watching ? (
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <Icon name="Eye" size={12} />
                              {friend.watching}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">Не смотрит</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

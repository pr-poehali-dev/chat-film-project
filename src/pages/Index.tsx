import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URLS = {
  rooms: 'https://functions.poehali.dev/c7428702-bdca-49b0-ae81-f7ca62332da5',
  movies: 'https://functions.poehali.dev/b2a499ee-69eb-4c96-8448-f18639e1580a',
  users: 'https://functions.poehali.dev/0746ed4e-c280-4894-9483-eb1f61b081f5',
  messages: 'https://functions.poehali.dev/6806f8c6-18af-41cb-8f34-c2d36457d65c',
};

interface Room {
  id: number;
  name: string;
  status: string;
  movie_title: string;
  poster_emoji: string;
  viewers: number;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  poster_emoji: string;
}

interface User {
  id: number;
  name: string;
  avatar_emoji: string;
  status: string;
  watching_movie: string | null;
}

interface Message {
  id: number;
  message: string;
  user_name: string;
  avatar_emoji: string;
  created_at: string;
}

const Index = () => {
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
    fetchMovies();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom);
    }
  }, [activeRoom]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(API_URLS.rooms);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки комнат',
        description: 'Не удалось загрузить список комнат',
        variant: 'destructive',
      });
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URLS.movies);
      const data = await response.json();
      setMovies(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки фильмов',
        description: 'Не удалось загрузить каталог фильмов',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URLS.users);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки друзей',
        description: 'Не удалось загрузить список друзей',
        variant: 'destructive',
      });
    }
  };

  const fetchMessages = async (roomId: number) => {
    try {
      const response = await fetch(`${API_URLS.messages}?room_id=${roomId}`);
      const data = await response.json();
      setMessages(data.reverse());
    } catch (error) {
      toast({
        title: 'Ошибка загрузки сообщений',
        description: 'Не удалось загрузить чат',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeRoom) return;

    try {
      const response = await fetch(API_URLS.messages, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: activeRoom,
          user_id: 1,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        setMessage('');
        fetchMessages(activeRoom);
        toast({
          title: 'Сообщение отправлено',
          description: 'Ваше сообщение успешно отправлено',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка отправки',
        description: 'Не удалось отправить сообщение',
        variant: 'destructive',
      });
    }
  };

  const handleRoomClick = (roomId: number) => {
    setActiveRoom(roomId);
  };

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
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Загрузка...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <Card className="animate-fade-in border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Icon name="Play" size={24} className="text-primary" />
                    Активные комнаты
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Присоединяйся к просмотру с друзьями
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className="hover:border-primary transition-all cursor-pointer hover:scale-105 duration-200 bg-muted/30"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-foreground">{room.name}</CardTitle>
                            <CardDescription className="text-muted-foreground flex items-center gap-2">
                              <span className="text-2xl">{room.poster_emoji}</span>
                              {room.movie_title}
                            </CardDescription>
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
                  <TabsTrigger
                    value="catalog"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon name="Film" size={18} className="mr-2" />
                    Каталог фильмов
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Чат комнаты
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="catalog" className="space-y-4">
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Популярные фильмы</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Выберите фильм для совместного просмотра
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {movies.map((movie) => (
                          <Card
                            key={movie.id}
                            className="hover:border-primary transition-all cursor-pointer hover:scale-105 duration-200 bg-muted/30"
                          >
                            <CardContent className="p-4">
                              <div className="text-6xl mb-3 text-center">{movie.poster_emoji}</div>
                              <h3 className="font-semibold mb-2 text-foreground">{movie.title}</h3>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center justify-between">
                                  <span>{movie.genre}</span>
                                  <Badge variant="outline" className="text-xs">
                                    ⭐ {movie.rating}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Icon name="Clock" size={14} />
                                  {movie.duration}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                              >
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
                          {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                              {activeRoom ? 'Пока нет сообщений' : 'Выберите комнату для начала чата'}
                            </div>
                          ) : (
                            messages.map((msg) => (
                              <div key={msg.id} className="flex gap-3 animate-fade-in">
                                <div className="text-2xl">{msg.avatar_emoji}</div>
                                <div className="flex-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-sm text-foreground">{msg.user_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground mt-1">{msg.message}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Напишите сообщение..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          disabled={!activeRoom}
                          className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!activeRoom || !message.trim()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
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
                      {users.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="relative">
                            <div className="text-2xl">{friend.avatar_emoji}</div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                                friend.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{friend.name}</p>
                            {friend.watching_movie ? (
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <Icon name="Eye" size={12} />
                                {friend.watching_movie}
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
        )}
      </div>
    </div>
  );
};

export default Index;

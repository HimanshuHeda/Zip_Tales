import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNews } from './NewsContext';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  type: 'new_article' | 'topic_update' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { followedTopics, articles } = useNews();
  const { isAuthenticated } = useAuth();

  // Check for new articles from followed topics
  useEffect(() => {
    if (!isAuthenticated || followedTopics.length === 0) return;

    const checkForNewArticles = () => {
      const recentArticles = articles.filter(article => {
        const articleDate = new Date(article.publishedAt);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return articleDate > fiveMinutesAgo;
      });

      recentArticles.forEach(article => {
        const isFromFollowedTopic = followedTopics.some(topic => 
          article.tags.includes(topic) || 
          article.category.toLowerCase() === topic.toLowerCase()
        );

        if (isFromFollowedTopic) {
          const notificationExists = notifications.some(n => 
            n.type === 'new_article' && 
            n.title === `New article in ${article.category}`
          );

          if (!notificationExists) {
            addNotification({
              type: 'new_article',
              title: `New article in ${article.category}`,
              message: `${article.title} - ${article.summary.substring(0, 100)}...`
            });
          }
        }
      });
    };

    // Check every 30 seconds for new articles
    const interval = setInterval(checkForNewArticles, 30000);
    return () => clearInterval(interval);
  }, [articles, followedTopics, isAuthenticated, notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}; 
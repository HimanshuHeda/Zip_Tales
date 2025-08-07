import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationToast: React.FC = () => {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);

  // Show new notifications automatically
  useEffect(() => {
    const newNotifications = notifications.filter(n => !visibleNotifications.includes(n.id));
    if (newNotifications.length > 0) {
      setVisibleNotifications(prev => [...prev, ...newNotifications.map(n => n.id)]);
      
      // Auto-hide notifications after 5 seconds
      newNotifications.forEach(notification => {
        setTimeout(() => {
          setVisibleNotifications(prev => prev.filter(id => id !== notification.id));
        }, 5000);
      });
    }
  }, [notifications, visibleNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_article':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'topic_update':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_article':
        return 'border-green-200 bg-green-50';
      case 'topic_update':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const dismissNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(notificationId => notificationId !== id));
    markAsRead(id);
  };

  if (unreadCount === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="p-2">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border mb-2 transition-all duration-300 hover:shadow-md ${
                  getNotificationColor(notification.type)
                } ${notification.read ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {notifications
        .filter(n => visibleNotifications.includes(n.id) && !n.read)
        .slice(0, 3)
        .map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border shadow-lg transition-all duration-500 transform translate-x-0 ${
              getNotificationColor(notification.type)
            }`}
          >
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationToast; 
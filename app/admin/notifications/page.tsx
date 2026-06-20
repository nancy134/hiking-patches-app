'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/Header';
import { listAdminNotificationsCustom } from '@/graphql/custom-queries';
import {
  updateAdminNotificationRead,
  deleteAdminNotificationCustom,
} from '@/graphql/custom-mutations';

const client = generateClient();

type NotificationType = 'NEW_USER' | 'PATCH_PURCHASED' | 'OWNER_REQUEST';

type AdminNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  read: boolean;
  createdAt?: string;
};

const typeBadge: Record<NotificationType, { label: string; className: string }> = {
  NEW_USER: { label: 'New user', className: 'bg-blue-100 text-blue-800' },
  PATCH_PURCHASED: { label: 'Purchase', className: 'bg-green-100 text-green-800' },
  OWNER_REQUEST: { label: 'Owner request', className: 'bg-purple-100 text-purple-800' },
};

export default function AdminNotificationsPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await client.graphql({
        query: listAdminNotificationsCustom,
        variables: { limit: 1000 },
        authMode: 'userPool',
      });
      const list: AdminNotification[] =
        (res as any).data?.listAdminNotifications?.items ?? [];
      list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      setItems(list);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const setRead = async (n: AdminNotification, read: boolean) => {
    // Optimistic — revert on failure.
    setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read } : i)));
    try {
      await client.graphql({
        query: updateAdminNotificationRead,
        variables: { input: { id: n.id, read } },
        authMode: 'userPool',
      });
    } catch (err) {
      console.error('Error updating notification:', err);
      setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: !read } : i)));
    }
  };

  const markAllRead = async () => {
    const unread = items.filter((i) => !i.read);
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    await Promise.all(
      unread.map(async (n) => {
        try {
          await client.graphql({
            query: updateAdminNotificationRead,
            variables: { input: { id: n.id, read: true } },
            authMode: 'userPool',
          });
        } catch (err) {
          console.error('Error marking read:', err);
        }
      })
    );
  };

  const dismiss = async (n: AdminNotification) => {
    const prev = items;
    setItems((cur) => cur.filter((i) => i.id !== n.id));
    try {
      await client.graphql({
        query: deleteAdminNotificationCustom,
        variables: { input: { id: n.id } },
        authMode: 'userPool',
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      setItems(prev);
    }
  };

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Header />
        <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm font-semibold bg-red-600 text-white rounded-full px-2 py-0.5">
              {unreadCount} new
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => {
            const badge = typeBadge[n.type];
            return (
              <li
                key={n.id}
                className={`border p-4 rounded shadow-sm flex items-start justify-between gap-4 ${
                  n.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-blue-600" aria-label="unread" />}
                  </div>
                  <p className="font-medium">
                    {n.link ? (
                      <Link
                        href={n.link}
                        className="text-blue-700 hover:underline"
                        onClick={() => !n.read && setRead(n, true)}
                      >
                        {n.title}
                      </Link>
                    ) : (
                      n.title
                    )}
                  </p>
                  {n.body && <p className="text-sm text-gray-700 mt-0.5 break-words">{n.body}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => setRead(n, !n.read)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {n.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button
                    onClick={() => dismiss(n)}
                    className="text-xs text-gray-400 hover:text-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import styles from './orders.module.css'

interface Order {
  id: string
  stripeSessionId: string
  customerEmail: string
  customerName: string | null
  customerPhone: string | null
  shippingAddress: any
  orderItems: any[]
  totalAmount: number
  currency: string
  status: string
  paymentStatus: string
  notes: string | null
  trackingNumber: string | null
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted && isAuthenticated) {
      fetchOrders()
    }
  }, [mounted, isAuthenticated])

  if (!mounted || !isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending
      case 'processing': return styles.statusProcessing
      case 'completed': return styles.statusCompleted
      case 'shipped': return styles.statusShipped
      case 'delivered': return styles.statusDelivered
      case 'cancelled': return styles.statusCancelled
      default: return styles.statusDefault
    }
  }

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return styles.paymentPaid
      case 'unpaid': return styles.paymentUnpaid
      case 'refunded': return styles.paymentRefunded
      case 'failed': return styles.paymentFailed
      default: return styles.paymentDefault
    }
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/admin/dashboard" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
            <h1>Order Management</h1>
            <p>View and manage all customer orders</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{orders.length}</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className={styles.statLabel}>Pending</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <div className={styles.statLabel}>Processing</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {formatCurrency(
                orders.filter(o => o.paymentStatus === 'paid')
                  .reduce((sum, o) => sum + o.totalAmount, 0),
                'gbp'
              )}
            </div>
            <div className={styles.statLabel}>Total Revenue</div>
          </div>
        </div>

        <div className={styles.filters}>
          <label>Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.noOrders}>
            <p>No orders found</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderId}>
                      <span title={order.id}>
                        {order.id.substring(0, 8)}...
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>
                          {order.customerName || 'N/A'}
                        </div>
                        <div className={styles.customerEmail}>
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.itemCount}>
                        {order.orderItems.length} items
                      </span>
                    </td>
                    <td className={styles.amount}>
                      {formatCurrency(order.totalAmount, order.currency)}
                    </td>
                    <td>
                      <span className={getPaymentStatusBadgeClass(order.paymentStatus)}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={styles.viewButton}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

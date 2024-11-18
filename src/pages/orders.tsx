import { useState } from 'react';
import { Search, Filter, Printer, Eye } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { OrderPreview } from '../components/sales/order-preview';

// This would typically come from your backend
const orders = [
  {
    id: 'ORD001',
    date: new Date('2024-01-15'),
    customer: {
      id: 'C001',
      name: 'Ahmet Er Market',
      taxNumber: '1234567890',
      balance: 12500,
      address: 'Atatürk Cad. No:123 İstanbul',
      phone: '0212 345 67 89',
    },
    items: [
      { productId: 'CIK-001', quantity: 5 },
      { productId: 'BIS-001', quantity: 10 },
    ],
    discount: 10,
    orderNote: 'Acil teslimat',
    total: 1250.50,
  },
  // Add more sample orders...
];

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Siparişler</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Sipariş ara (sipariş no veya müşteri)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4">Sipariş No</th>
                <th className="text-left p-4">Tarih</th>
                <th className="text-left p-4">Müşteri</th>
                <th className="text-right p-4">Tutar</th>
                <th className="text-center p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.date.toLocaleDateString('tr-TR')}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td className="p-4 text-right">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Görüntüle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        title="Yazdır"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderPreview
          customer={selectedOrder.customer}
          items={selectedOrder.items}
          discount={selectedOrder.discount}
          orderNote={selectedOrder.orderNote}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
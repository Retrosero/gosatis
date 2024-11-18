import { X, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import { products } from '../../data/products';
import { useCart } from '../../hooks/use-cart';
import { useCustomer } from '../../hooks/use-customer';
import { useTransactions } from '../../hooks/use-transactions';
import { customers } from '../../data/customers';

interface OrderPreviewProps {
  customer: typeof customers[0];
  items: Array<{ productId: string; quantity: number; note?: string }>;
  discount: number;
  orderNote: string;
  onClose: () => void;
}

export function OrderPreview({ customer, items, discount, orderNote, onClose }: OrderPreviewProps) {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { setSelectedCustomer } = useCustomer();
  const { addTransaction } = useTransactions();

  const handlePrint = () => {
    const printContent = document.getElementById('order-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Satış Faturası</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { font-weight: bold; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-sm { font-size: 0.875rem; }
            .text-gray { color: #666; }
            @media print {
              body { padding: 0; margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div>
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const orderItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    return {
      ...item,
      name: product.name,
      price: product.price,
      total: product.price * item.quantity
    };
  }).filter(Boolean);

  const subtotal = orderItems.reduce((sum, item) => sum + (item?.total || 0), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const handleComplete = () => {
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || '',
        quantity: item.quantity,
        price: product?.price || 0,
        note: item.note,
      };
    });

    addTransaction({
      type: 'sale',
      description: 'Satış',
      customer: {
        id: customer.id,
        name: customer.name,
        taxNumber: customer.taxNumber,
        address: customer.address,
        phone: customer.phone,
      },
      amount: total,
      items: orderItems,
      discount,
      note: orderNote,
    });

    clearCart();
    setSelectedCustomer(null);
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">Satış Faturası</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div id="order-content" className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Müşteri Bilgileri</h3>
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.address}</p>
              <p className="text-sm text-gray-500">Tel: {customer.phone}</p>
              <p className="text-sm text-gray-500">VKN: {customer.taxNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tarih</p>
              <p className="font-medium">
                {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Ürün</th>
                <th className="text-right py-2">Birim Fiyat</th>
                <th className="text-right py-2">Miktar</th>
                <th className="text-right py-2">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2">
                    <div>
                      <p>{item?.name}</p>
                      {item?.note && (
                        <p className="text-sm text-gray-500 italic">Not: {item.note}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-right">{formatCurrency(item?.price || 0)}</td>
                  <td className="text-right">{item?.quantity}</td>
                  <td className="text-right">{formatCurrency(item?.total || 0)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={3} className="py-2 text-right">Ara Toplam</td>
                <td className="text-right">{formatCurrency(subtotal)}</td>
              </tr>
              {discount > 0 && (
                <tr className="border-b border-gray-200 dark:border-gray-700 text-green-600">
                  <td colSpan={3} className="py-2 text-right">İskonto ({discount}%)</td>
                  <td className="text-right">-{formatCurrency(discountAmount)}</td>
                </tr>
              )}
              <tr className="font-bold">
                <td colSpan={3} className="py-2 text-right">Toplam</td>
                <td className="text-right">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>

          {orderNote && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Sipariş Notu</h3>
              <p className="text-sm text-gray-500">{orderNote}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Tamamla
          </button>
        </div>
      </div>
    </div>
  );
}
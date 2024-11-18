import { X, Printer } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

type ReceiptPreviewProps = {
  data: {
    customer: any;
    date: string;
    payments: Array<{
      type: string;
      data: any;
    }>;
    note: string;
  };
  onClose: () => void;
  onComplete: () => void;
};

export function ReceiptPreview({ data, onClose, onComplete }: ReceiptPreviewProps) {
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ödeme Makbuzu</title>
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

  const total = data.payments.reduce((sum, payment) => sum + Number(payment.data.amount), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">Ödeme Makbuzu</h2>
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
        
        <div id="receipt-content" className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Müşteri Bilgileri</h3>
              <p className="font-medium">{data.customer.name}</p>
              <p className="text-sm text-gray-500">{data.customer.address}</p>
              <p className="text-sm text-gray-500">Tel: {data.customer.phone}</p>
              <p className="text-sm text-gray-500">VKN: {data.customer.taxNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tarih</p>
              <p className="font-medium">
                {new Date(data.date).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Ödeme Tipi</th>
                <th className="text-right py-2">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((payment, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 capitalize">{payment.type}</td>
                  <td className="text-right">{formatCurrency(Number(payment.data.amount))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="py-2">Toplam</td>
                <td className="text-right">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>

          {data.note && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Not</h3>
              <p className="text-sm text-gray-500">{data.note}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Tamamla
          </button>
        </div>
      </div>
    </div>
  );
}
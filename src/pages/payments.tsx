import { useState } from 'react';
import { Search, Calendar, Plus, Save, Edit } from 'lucide-react';
import { cn } from '../lib/utils';
import { customers } from '../data/customers';
import { PaymentRow } from '../components/payments/payment-row';
import { useTransactions } from '../hooks/use-transactions';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

type PaymentType = 'nakit' | 'cek' | 'senet' | 'krediKarti';

export function PaymentsPage() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const [selectedTab, setSelectedTab] = useState<'tahsilat' | 'tediye'>('tahsilat');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payments, setPayments] = useState<Array<{ type: PaymentType; data: any }>>([]);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(!selectedCustomer);

  const handleAddPayment = (type: PaymentType) => {
    const newPayment = {
      type,
      data: {
        amount: '',
        ...(type === 'cek' && {
          bank: '',
          branch: '',
          checkNumber: '',
          accountNumber: '',
          dueDate: '',
        }),
        ...(type === 'senet' && {
          debtorName: '',
          debtorId: '',
          bondNumber: '',
          issueDate: '',
          dueDate: '',
        }),
      },
    };
    setPayments([...payments, newPayment]);
  };

  const handleSave = () => {
    if (!selectedCustomer) {
      alert('Lütfen müşteri seçiniz');
      return;
    }
    if (payments.length === 0) {
      alert('Lütfen en az bir ödeme ekleyiniz');
      return;
    }

    const total = payments.reduce((sum, payment) => sum + Number(payment.data.amount), 0);

    addTransaction({
      type: selectedTab === 'tahsilat' ? 'payment' : 'expense',
      description: selectedTab === 'tahsilat' ? 'Tahsilat' : 'Tediye',
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        taxNumber: selectedCustomer.taxNumber,
        address: selectedCustomer.address,
        phone: selectedCustomer.phone,
      },
      amount: selectedTab === 'tahsilat' ? total : -total,
      paymentMethod: payments.map(p => p.type).join(', '),
      note,
    });

    // Reset form and navigate
    setSelectedCustomer(null);
    setPayments([]);
    setNote('');
    navigate('/dashboard');
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.taxNumber.includes(searchQuery)
  );

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedTab('tahsilat')}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg text-sm sm:text-base font-medium',
            selectedTab === 'tahsilat'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          )}
        >
          Tahsilat
        </button>
        <button
          onClick={() => setSelectedTab('tediye')}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg text-sm sm:text-base font-medium',
            selectedTab === 'tediye'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          )}
        >
          Tediye
        </button>
      </div>

      {/* Customer Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Müşteri Seçimi</h2>
        
        {showCustomerSearch ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Müşteri ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>
            <div className="mt-2 max-h-48 overflow-auto">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerSearch(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone} - Bakiye: {formatCurrency(customer.balance)}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : selectedCustomer && (
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{selectedCustomer.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{selectedCustomer.address}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tel: {selectedCustomer.phone}</div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bakiye</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(selectedCustomer.balance)}
                </p>
              </div>
              <button
                onClick={() => setShowCustomerSearch(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Müşteri Değiştir"
              >
                <Edit className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Ödeme Detayları</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Tarih</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          {payments.map((payment, index) => (
            <PaymentRow
              key={index}
              type={payment.type}
              data={payment.data}
              onChange={(data) => {
                const newPayments = [...payments];
                newPayments[index].data = data;
                setPayments(newPayments);
              }}
              onDelete={() => {
                const newPayments = [...payments];
                newPayments.splice(index, 1);
                setPayments(newPayments);
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleAddPayment('nakit')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Nakit
          </button>
          <button
            onClick={() => handleAddPayment('cek')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Çek
          </button>
          <button
            onClick={() => handleAddPayment('senet')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Senet
          </button>
          <button
            onClick={() => handleAddPayment('krediKarti')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Kredi Kartı
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Not</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ödeme notu..."
          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Save className="w-5 h-5" />
          Kaydet
        </button>
      </div>
    </div>
  );
}
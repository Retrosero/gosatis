import { useState } from 'react';
import { Search, Barcode, ShoppingCart, X, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../hooks/use-customer';
import { useCart } from '../hooks/use-cart';
import { CustomerSelector } from '../components/sales/customer-selector';
import { ProductFilters } from '../components/sales/product-filters';
import { Pagination } from '../components/sales/pagination';
import { QuantityInput } from '../components/sales/quantity-input';
import { ViewModeSelector } from '../components/sales/view-mode-selector';
import { OrderPreview } from '../components/sales/order-preview';
import { products } from '../data/products';

type ViewMode = 'grid' | 'list' | 'list-no-image';
type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc';

export function SalesPage() {
  const navigate = useNavigate();
  const { selectedCustomer, setSelectedCustomer } = useCustomer();
  const { 
    items: cart, 
    addItem, 
    updateQuantity, 
    removeItem, 
    discount, 
    setDiscount, 
    orderNote, 
    setOrderNote, 
    clearCart,
    getTotal 
  } = useCart();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showOrderNote, setShowOrderNote] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [showItemNote, setShowItemNote] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [showOrderPreview, setShowOrderPreview] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(!selectedCustomer);

  const handleCustomerSelect = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setShowCustomerSelector(false);
  };

  // Sort and filter products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'stock-asc':
        return a.stock - b.stock;
      case 'stock-desc':
        return b.stock - a.stock;
      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { subtotal, total } = getTotal();
  const discountAmount = subtotal - total;

  const handleCompleteOrder = () => {
    setShowOrderPreview(true);
    setShowCart(false);
  };

  if (showCustomerSelector) {
    return <CustomerSelector onSelect={handleCustomerSelect} />;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {/* Customer Info */}
          {selectedCustomer && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{selectedCustomer.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.address}</p>
                  <p className="text-sm text-gray-500">Tel: {selectedCustomer.phone}</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Bakiye</p>
                    <p className="text-lg font-bold">₺{selectedCustomer.balance}</p>
                  </div>
                  <button
                    onClick={() => setShowCustomerSelector(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <ProductFilters
              onSortChange={setSortOption}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPage={itemsPerPage}
            />
            <ViewModeSelector value={viewMode} onChange={setViewMode} />
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Product List */}
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {paginatedProducts.map((product) => {
              const cartItem = cart.find(item => item.productId === product.id);
              return (
                <div
                  key={product.id}
                  className={cn(
                    'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
                    viewMode !== 'grid' && 'flex'
                  )}
                >
                  {viewMode !== 'list-no-image' && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className={cn(
                        'object-cover',
                        viewMode === 'grid' ? 'w-full h-32 sm:h-48' : 'w-24 h-24'
                      )}
                    />
                  )}
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{product.name}</h3>
                      <span className="text-xs text-gray-500">{product.id}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                        <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                      </div>
                      <QuantityInput
                        value={cartItem?.quantity || 0}
                        onChange={(quantity) => {
                          if (quantity === 0) {
                            removeItem(product.id);
                          } else {
                            updateQuantity(product.id, quantity);
                          }
                        }}
                        max={product.stock}
                      />
                    </div>
                    {itemNotes[product.id] && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        Not: {itemNotes[product.id]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Cart Panel */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="w-full sm:w-96 bg-white dark:bg-gray-800 h-full overflow-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Sepet</h2>
                <p className="text-sm text-gray-500">
                  {cart.length} ürün ({cart.reduce((sum, item) => sum + item.quantity, 0)} adet)
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setShowClearCartConfirm(true)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
                  title="Sepeti Temizle"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {cart.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="mb-2 sm:mb-4 p-2 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(product.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowItemNote(item.productId)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(quantity) => updateQuantity(item.productId, quantity)}
                        max={product.stock}
                      />
                    </div>
                    {itemNotes[item.productId] && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        Not: {itemNotes[item.productId]}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    placeholder="İskonto %"
                    className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    onClick={() => setShowOrderNote(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>

                {orderNote && (
                  <p className="text-sm text-gray-500 italic">
                    Sipariş Notu: {orderNote}
                  </p>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Ara Toplam</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>İskonto ({discount}%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Toplam</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCompleteOrder}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Siparişi Tamamla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation */}
      {showClearCartConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Sepeti Temizle</h3>
            <p>Sepeti temizlemek istediğinize emin misiniz?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowClearCartConfirm(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearCartConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Note Modal */}
      {showOrderNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-4">
            <h3 className="text-lg font-bold mb-4">Sipariş Notu</h3>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 mb-4"
              rows={4}
              placeholder="Sipariş notunuzu girin..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOrderNote(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                İptal
              </button>
              <button
                onClick={() => setShowOrderNote(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Note Modal */}
      {showItemNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-4">
            <h3 className="text-lg font-bold mb-4">Ürün Notu</h3>
            <textarea
              value={itemNotes[showItemNote] || ''}
              onChange={(e) => setItemNotes({ ...itemNotes, [showItemNote]: e.target.value })}
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 mb-4"
              rows={4}
              placeholder="Ürün notunu girin..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowItemNote(null)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  setItemNotes({ ...itemNotes, [showItemNote]: itemNotes[showItemNote] || '' });
                  setShowItemNote(null);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Preview */}
      {showOrderPreview && (
        <OrderPreview
          customer={selectedCustomer!}
          items={cart}
          discount={discount}
          orderNote={orderNote}
          onClose={() => setShowOrderPreview(false)}
        />
      )}
    </div>
  );
}
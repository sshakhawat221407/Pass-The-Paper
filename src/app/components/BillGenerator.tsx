import { Download, FileText, Calendar, CreditCard, Building, User } from 'lucide-react';
import { useMockData, Purchase, Resource } from '../utils/MockDataContext';

interface BillGeneratorProps {
  purchaseId: string;
  onClose?: () => void;
}

export function BillGenerator({ purchaseId, onClose }: BillGeneratorProps) {
  const mockData = useMockData();
  const purchase = mockData.purchases.find(p => p.id === purchaseId);
  const resource = purchase ? mockData.resources.find(r => r.id === purchase.resourceId) : null;
  const user = mockData.currentUser;

  if (!purchase || !resource || !user) {
    return null;
  }

  const generateBillContent = () => {
    const billDate = new Date(purchase.purchasedAt);
    const billNumber = `PTF-${purchase.id.substring(0, 8).toUpperCase()}`;

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             PASS THE PAPER
        Academic Resource Marketplace
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INVOICE / PURCHASE RECEIPT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bill Number:    ${billNumber}
Date & Time:    ${billDate.toLocaleDateString()} ${billDate.toLocaleTimeString()}
Payment Method: ${purchase.paymentMethod || 'Wallet'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER INFORMATION

Name:           ${user.name}
Email:          ${user.email}
University:     ${user.university}
Student ID:     ${user.studentId || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PURCHASED ITEM

Title:          ${resource.title}
Category:       ${resource.category}
${resource.department ? `Department:     ${resource.department}` : ''}
${resource.course ? `Course:         ${resource.course}` : ''}
${resource.semester ? `Semester:       ${resource.semester}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT DETAILS

Item Price:     ${purchase.priceType === 'money' ? `৳${purchase.price} BDT` : `${purchase.price} Points`}
Service Fee:    ${purchase.priceType === 'money' ? '৳0.00 BDT' : '0 Points'}
Discount:       ${purchase.priceType === 'money' ? '৳0.00 BDT' : '0 Points'}

Total Paid:     ${purchase.priceType === 'money' ? `৳${purchase.price} BDT` : `${purchase.price} Points`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRANSACTION ID: ${purchase.id}

This is a system-generated invoice. No signature required.

For support, contact: support@passthepaper.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for using Pass The Paper!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
  };

  const downloadBill = () => {
    const billContent = generateBillContent();
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PassThePaper_Invoice_${purchase.id.substring(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Bill Preview */}
      <div className="bg-white rounded-lg border-2 border-gray-300 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b-2 border-gray-300">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E56E20' }}>
              <FileText size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#E56E20' }}>PASS THE PAPER</h1>
          <p className="text-gray-600">Academic Resource Marketplace</p>
          <p className="text-sm font-semibold mt-3" style={{ color: '#E56E20' }}>PURCHASE RECEIPT</p>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-300">
          <div>
            <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
            <p className="font-semibold">PTF-{purchase.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <p className="font-semibold">{new Date(purchase.purchasedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Time</p>
            <p className="font-semibold">{new Date(purchase.purchasedAt).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
            <p className="font-semibold">{purchase.paymentMethod || 'Wallet'}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6 pb-6 border-b border-gray-300">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <User size={18} />
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <span className="ml-2 font-medium">{user.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-500">University:</span>
              <span className="ml-2 font-medium">{user.university}</span>
            </div>
            <div>
              <span className="text-gray-500">Student ID:</span>
              <span className="ml-2 font-medium">{user.studentId || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="mb-6 pb-6 border-b border-gray-300">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} />
            Purchased Item
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-bold text-lg mb-2">{resource.title}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-medium">{resource.category}</span>
              </div>
              {resource.department && (
                <div>
                  <span className="text-gray-500">Department:</span>
                  <span className="ml-2 font-medium">{resource.department}</span>
                </div>
              )}
              {resource.course && (
                <div>
                  <span className="text-gray-500">Course:</span>
                  <span className="ml-2 font-medium">{resource.course}</span>
                </div>
              )}
              {resource.semester && (
                <div>
                  <span className="text-gray-500">Semester:</span>
                  <span className="ml-2 font-medium">{resource.semester}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard size={18} />
            Payment Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item Price:</span>
              <span className="font-medium">
                {purchase.priceType === 'money' ? `৳${purchase.price}` : `${purchase.price} Points`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee:</span>
              <span className="font-medium">
                {purchase.priceType === 'money' ? '৳0.00' : '0 Points'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium">
                {purchase.priceType === 'money' ? '৳0.00' : '0 Points'}
              </span>
            </div>
            <div className="pt-2 border-t-2 border-gray-300">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total Paid:</span>
                <span className="font-bold text-xl" style={{ color: '#E56E20' }}>
                  {purchase.priceType === 'money' ? `৳${purchase.price} BDT` : `${purchase.price} Points`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction ID */}
        <div className="text-center text-xs text-gray-500 mb-4">
          <p>Transaction ID: {purchase.id}</p>
          <p className="mt-1">This is a system-generated invoice. No signature required.</p>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-600">Thank you for using Pass The Paper!</p>
          <p className="text-xs text-gray-500 mt-1">For support: support@passthepaper.com</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
          onClick={downloadBill}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: '#E56E20' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C85E1A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E56E20';
          }}
        >
          <Download size={20} />
          Download Receipt
        </button>
      </div>
    </div>
  );
}

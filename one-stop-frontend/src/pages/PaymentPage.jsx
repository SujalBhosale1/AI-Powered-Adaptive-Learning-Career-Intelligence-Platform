import { CreditCard } from 'lucide-react';

const PaymentPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-500/30">
                <CreditCard size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-4">Payment Gateway</h1>
            <p className="text-indigo-200 max-w-md mx-auto">
                Secure payment integration for premium courses and consultancy is coming soon.
            </p>
        </div>
    );
};

export default PaymentPage;

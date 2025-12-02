'use client';
import Image from "next/image";
import visa from "../../../public/images/visa.png";
import meeza from "../../../public/images/meeza.png";
import mastercard from "../../../public/images/mastercard.png";
import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, Tag, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/app/component/authStore";
import toast from "react-hot-toast";

const States = [
  { "name": "Cairo", "shipping": 0 },
  { "name": "Giza", "shipping": 10 },
  { "name": "Alexandria", "shipping": 20 },
  { "name": "Port Said", "shipping": 25 },
  { "name": "Suez", "shipping": 20 },
  { "name": "Luxor", "shipping": 50 },
  { "name": "Aswan", "shipping": 60 },
  { "name": "Damietta", "shipping": 30 },
  { "name": "Mansoura", "shipping": 25 },
  { "name": "Tanta", "shipping": 15 },
  { "name": "Ismailia", "shipping": 20 },
  { "name": "Fayoum", "shipping": 15 },
  { "name": "Beni Suef", "shipping": 20 },
  { "name": "Minya", "shipping": 30 },
  { "name": "Assiut", "shipping": 40 },
  { "name": "Sohag", "shipping": 45 },
  { "name": "Qena", "shipping": 50 },
  { "name": "Hurghada", "shipping": 55 },
  { "name": "Sharm El-Sheikh", "shipping": 60 },
  { "name": "Kafr El Sheikh", "shipping": 25 },
  { "name": "Zagazig", "shipping": 15 },
  { "name": "Damanhour", "shipping": 25 },
  { "name": "Banha", "shipping": 10 },
  { "name": "Arish", "shipping": 40 },
  { "name": "Qalyub", "shipping": 10 }
];

export default function CheckoutForm() {
  const { user } = useAuthStore();
  const [cart, setCart] = useState([]);
  const [cartInfo, setCartInfo] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [online, setOnline] = useState(true);
  const [offline, setOffline] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    goverment: 'Cairo',
    city: '',
    postCode: '',
    apartment: '',
    phone: '',
    whatsapp: false,
    saveInfo: false,
    paymentMethod: 'pay-via'
  });

  // Phone validation function
  const validatePhone = (phone) => {
    // Remove any spaces or dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Check if it's only numbers
    const isNumeric = /^\d+$/.test(cleanPhone);
    
    if (!isNumeric) {
      return { isValid: false, message: 'Phone must contain only numbers' };
    }
    
    // Check if length is 11 and starts with valid prefix
    if (cleanPhone.length === 11) {
      const validPrefixes = ['010', '011', '012', '015'];
      const phonePrefix = cleanPhone.substring(0, 3);
      
      if (validPrefixes.includes(phonePrefix)) {
        return { isValid: true, message: 'Valid phone number' };
      } else {
        return { isValid: false, message: 'Phone must start with 010, 011, 012, or 015' };
      }
    }
    
    return { isValid: false, message: 'Phone must be 11 digits' };
  };

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/carts/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      
      setCart(data.items || []);
      setCartInfo(data?.orderinfo || []);
      
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      email: user?.email || '',
      firstName: cartInfo?.firstName || '',
      lastName: cartInfo?.lastName || '',
      goverment: cartInfo?.goverment || 'Cairo',
      city: cartInfo?.city || '',
      postCode: cartInfo?.postCode || '',
      apartment: cartInfo?.street || '',
      phone: cartInfo?.phone || '',
    }));
    console.log("cartInfo", cartInfo?.firstName);
  }, [cartInfo, user]);

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate shipping based on selected governorate
  const statesShipping = States.find(s => s.name === formData.goverment)?.shipping;
  const shippingCost = Math.floor(statesShipping + 90) || 90;

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === process.env.Discount) {
      setDiscountRate(0.3);
      toast.success("Promo code applied! 30% off");
    } else {
      setDiscountRate(0);
      toast.error("Invalid promo code");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = totalPrice - totalPrice * discountRate;
  const finalTotal = discountedTotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle phone input change with validation on blur
  const handlePhoneBlur = (e) => {
    const phone = e.target.value;
    if (phone) {
      const validation = validatePhone(phone);
      if (!validation.isValid) {
        toast.error(validation.message);
      }
    }
  };
  
  // Update user information in database
  const updateUserInfo = async () => {
    try {
      const res = await fetch(`/api/order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          postCode: formData.postCode,
          phone: formData.phone,
          goverment: formData.goverment,
          street: formData.apartment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user info");
      }

      console.log("data", data);
      toast.success("Information saved successfully!");
      
    } catch (err) {
      toast.error(err.message || "Failed to update information");
    }
  };

  // Handle save info checkbox
  const handleSaveInfoChange = (e) => {
    handleInputChange(e);
    if (e.target.checked) {
      updateUserInfo();
    }
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone before submitting
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.message);
      return;
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Continue with form submission
    setIsLoading(true);
    // Your submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex justify-around flex-col-reverse lg:flex-row bg-white py-8 px-2 sm:px-4 lg:px-6">
      <form className="p-2 lg:m-0 mt-20" onSubmit={handleSubmit}>
        {/* Contact Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium">Contact</h2>
            {!user && (
              <Link href="/signin" className="text-sm text-blue-600 hover:underline">
                Sign in
              </Link>
            )}
          </div>
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email or mobile phone number"
            className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <label className="flex items-center mt-4 w-fit cursor-pointer">
            <input
              type="checkbox"
              name="whatsapp"
              checked={formData.whatsapp}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm  text-gray-700">Get order updates on WhatsApp</span>
          </label>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-medium mb-4">Delivery</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="First name"
              className="px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Last name"
              className="px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select
              name="goverment"
              value={formData.goverment}
              onChange={handleInputChange}
              className="px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center'}}
            >
              {States.map((state) => (
                <option key={state.name} value={state.name}>{state.name}</option>
              ))}
            </select>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              placeholder="City"
              className="px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleInputChange}
              placeholder="Postal code (optional)"
              className="px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-1">Phone number for order updates</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center px-3 py-3 border border-gray-300 rounded bg-gray-50">
                <span className="text-xl mr-1">🇪🇬</span>
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handlePhoneBlur}
                required
                maxLength="11"
                placeholder="01XXXXXXXXX"
                className="flex-1 px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button type="button" className="p-3 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01"/>
                </svg>
              </button>
            </div>
          </div>
          <label className="flex items-center mb-3 w-fit cursor-pointer">
            <input
              type="checkbox"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleSaveInfoChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 ">Save this information for next time</span>
          </label>
        </div>

        {/* Shipping Method */}
        <div className="mb-10">
          <h2 className="text-2xl font-medium mb-4">Shipping method</h2>
          <div className="border border-gray-300 rounded p-4 flex justify-between items-center">
            <span className="text-sm">التوصيل حتى باب المنزل | Doorstep shipping</span>
            <span className="font-semibold">${shippingCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-medium mb-2">Payment</h2>
          <p className="text-xs text-gray-600 mb-4">All transactions are secure and encrypted.</p>

          <div className="border border-gray-300 rounded overflow-hidden">
            <label className="flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer bg-blue-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay-via"
                  checked={formData.paymentMethod === 'pay-via'}
                  onChange={(e) => {
                    handleInputChange(e);
                    setOnline(true);
                    setOffline(false);
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-sm">Pay via (Debit/Credit cards/Wallets/Installments)</span>
              </div>
              <div className="flex gap-2">
                <div className="w-13 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <Image src={mastercard} alt="mastercard" className="object-cover m-2 w-10 h-10" />
                </div>
                <div className="w-13 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <Image src={visa} alt="visa" className="object-cover m-2 w-10 h-5" />
                </div>
                <div className="w-13 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                  <Image src={meeza} alt="meeza" className="object-cover m-2 w-10 h-10" />
                </div>
              </div>
            </label>
            {formData.paymentMethod === 'pay-via' && (
              <div className="p-8 bg-gray-50 text-center border-b border-gray-300">
                <p className="text-sm text-gray-600 leading-relaxed">
                  After clicking "Pay now", you will be redirected to Pay via<br />
                  (Debit/Credit cards/Wallets/Installments) to complete<br />
                  your purchase securely.
                </p>
              </div>
            )}
            <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={(e) => {
                  handleInputChange(e);
                  setOnline(false);
                  setOffline(true);
                }}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-sm">Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        {online && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Pay now'}
          </button>
        )}
        {offline && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-4 px-6 rounded font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Complete Order'}
          </button>
        )}
      </form>

      {/* Order Summary */}
      <div className="md:col-span-1">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="bg-gray-200 p-2 rounded-xl max-h-96 overflow-y-auto">
              {cart.map((cart) => (
                <div key={cart._id} className="flex gap-2 p-2 bg-white rounded-lg mb-2">
                  <div className="relative bg-white rounded-xl p-3 w-20 h-20 flex-shrink-0 shadow-sm">
                    <img
                      className="object-contain w-full h-full"
                      src={cart.product.image}
                      alt={cart.product.title}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-sm text-gray-800 mb-1 line-clamp-2">
                        {cart.product.title}
                      </h3>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span>{cart.quantity}</span>
                          <span className="mx-1">×</span>
                          <span className="font-bold">
                            ${cart.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="font-bold">${(cart.price * cart.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 mb-6 mt-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</span>
              </div>
              
              {discountRate > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Discount
                  </span>
                  <span className="font-semibold">-${(totalPrice * discountRate).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping ({formData.goverment})</span>
                <span className={`font-semibold ${shippingCost === 0 ? 'text-green-500' : 'text-gray-800'}`}>
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-indigo-600" />
                <label className="text-sm font-semibold text-gray-700">Promo Code</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-3xl font-bold text-green-500">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500 text-right">Estimated delivery: 1-3 days</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
              <p className="font-medium mb-1">✓ Money-back guarantee</p>
              <p>30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
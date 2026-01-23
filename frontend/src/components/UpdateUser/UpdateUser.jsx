import api from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { MdEditNote } from "react-icons/md";

function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    indexNo: "",
    nic: "",
    name: "",
    phone: "",
    date: "",
    vehicleNumber: "",
    model: "",
    licenseDate: "",
    total: "",
    installment: "",
    period: "",
    customerType: "",
  });

  const [originalInputs, setOriginalInputs] = useState(null);
  const [hoverButton, setHoverButton] = useState("");
  const [hoverInput, setHoverInput] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = (message, type = "success", redirectPath = null) => {
    setAlert({ message, type });
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
    setTimeout(() => setAlert({ message: "", type: "" }), 3500);
    if (redirectPath) setTimeout(() => navigate(redirectPath), 1500);
  };

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setInputs(res.data.user);
        setOriginalInputs(res.data.user);
      } catch (err) {
        console.error(err);
        showAlert("Failed to fetch user data", "error");
      }
    };
    fetchHandler();
  }, [id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isChanged = () => {
    if (!originalInputs) return true;
    return Object.keys(inputs).some(key => {
      if (key === "date" || key === "licenseDate") {
        return inputs[key]?.substring(0, 10) !== originalInputs[key]?.substring(0, 10);
      }
      return inputs[key] !== originalInputs[key];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChanged()) {
      showAlert("No customer details updated", "error", `/user/${id}`);
      return;
    }
    try {
      await api.put(`/users/${id}`, {
        indexNo: String(inputs.indexNo),
        nic: String(inputs.nic),
        name: String(inputs.name),
        phone: String(inputs.phone),
        date: new Date(inputs.date),
        vehicleNumber: String(inputs.vehicleNumber),
        model: String(inputs.model),
        licenseDate: new Date(inputs.licenseDate),
        total: Number(inputs.total),
        installment: Number(inputs.installment),
        period: Number(inputs.period),
        customerType: inputs.customerType,
      });
      showAlert("Customer updated successfully!", "success", `/user/${id}`);
    } catch (err) {
      console.error(err);
      showAlert("Error: Could not update customer", "error");
    }
  };

  return (
    <div className="font-sans min-h-screen bg-linear-to-br from-blue-100 to-blue-200 p-5">

      {/* Floating Header */}
      <div className="max-w-3xl mx-auto mt-6 p-5 flex flex-col items-center bg-white bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-200 shadow-lg relative">
        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-blue-200 via-blue-100 to-blue-200 bg-size-[300%_300%] animate-[gradientBorder_6s_ease_infinite] z-[-1] filter blur-sm"></div>
        <div className="flex items-center gap-3 justify-center">
          <MdEditNote  className="text-2xl text-blue-700 size-10" />
          <h1 className="text-lg font-bold text-blue-700 m-0">Edit Customer Details</h1>
        </div>
        <p className="text-sm text-blue-700 opacity-70 mt-1">Update and manage customer information.</p>
      </div>

      {/* Alert */}
      {alert.message && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg font-medium text-center transition-all z-50
          ${alertVisible ? "opacity-100" : "opacity-0"}
          ${alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {alert.message}
        </div>
      )}

      {/* Form Container */}
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <section>
              <h2 className="border-t-2 border-blue-300 pt-4 text-xl font-semibold text-blue-800 mb-4">Personal Information</h2>
              <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                {[
                  { label: "Index No *", name: "indexNo", placeholder: "Enter index number" },
                  { label: "NIC *", name: "nic", placeholder: "Enter NIC number" },
                  { label: "Full Name *", name: "name", placeholder: "Enter full name" },
                  { label: "Phone Number *", name: "phone", placeholder: "07X XXX XXXX" },
                  { label: "Registration Date *", name: "date", type: "date" },
                ].map(({ label, name, placeholder, type }) => (
                  <div key={name}>
                    <label className="block mb-1 font-medium">{label}</label>
                    <input
                      type={type || "text"}
                      name={name}
                      value={inputs[name] ? (type === "date" ? inputs[name].substring(0,10) : inputs[name]) : ""}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className={`w-full p-3 rounded border transition-colors bg-blue-50 text-blue-900 outline-none
                        ${hoverInput === name ? "border-blue-500" : "border-blue-300"}
                      `}
                      onFocus={() => setHoverInput(name)}
                      onBlur={() => setHoverInput("")}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Vehicle Info */}
            <section>
              <h2 className="border-t-2 border-blue-300 pt-4 text-xl font-semibold text-blue-800 mb-4 mt-6">Vehicle Information</h2>
              <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                {[
                  { label: "Vehicle Number *", name: "vehicleNumber", placeholder: "ABC-1234" },
                  { label: "Model *", name: "model", placeholder: "Enter vehicle model" },
                  { label: "License Date *", name: "licenseDate", type: "date" },
                ].map(({ label, name, placeholder, type }) => (
                  <div key={name}>
                    <label className="block mb-1 font-medium">{label}</label>
                    <input
                      type={type || "text"}
                      name={name}
                      value={inputs[name] ? (type === "date" ? inputs[name].substring(0,10) : inputs[name]) : ""}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className={`w-full p-3 rounded border transition-colors bg-blue-50 text-blue-900 outline-none
                        ${hoverInput === name ? "border-blue-500" : "border-blue-300"}
                      `}
                      onFocus={() => setHoverInput(name)}
                      onBlur={() => setHoverInput("")}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Financial Info */}
            <section>
              <h2 className="border-t-2 border-blue-300 pt-4 text-xl font-semibold text-blue-800 mb-4 mt-6">Financial Details</h2>
              <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                {[
                  { label: "Total Amount *", name: "total", type: "number", placeholder: "Rs. 0.00" },
                  { label: "Monthly Installment *", name: "installment", type: "number", placeholder: "Rs. 0.00" },
                  { label: "Period (Months) *", name: "period", type: "number", placeholder: "0" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block mb-1 font-medium">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={inputs[name]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className={`w-full p-3 rounded border transition-colors bg-blue-50 text-blue-900 outline-none
                        ${hoverInput === name ? "border-blue-500" : "border-blue-300"}
                      `}
                      onFocus={() => setHoverInput(name)}
                      onBlur={() => setHoverInput("")}
                    />
                  </div>
                ))}
              </div>

              <label className="block mt-4 pt-4 font-medium">Choose Payment Method*</label>
              <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4 mt-2 mb-2`}>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="customerType"
                    value="INSTALLMENT"
                    checked={inputs.customerType === "INSTALLMENT"}
                    onChange={handleChange}
                  />
                  Installment (Regular Loan Payments)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="customerType"
                    value="INTEREST_ONLY"
                    checked={inputs.customerType === "INTEREST_ONLY"}
                    onChange={handleChange}
                  />
                  Interest Only (Interest Payments Only)
                </label>
              </div>
            </section>

            {/* Buttons */}
          <div className={`flex ${isMobile ? "flex-col-reverse items-center" : "flex-row justify-center"} gap-4 pt-6 border-t border-blue-300 mt-6`}>
            <button
              type="button"
              onClick={() => navigate(`/user/${id}`)}
              onMouseEnter={() => setHoverButton("cancel")}
              onMouseLeave={() => setHoverButton("")}
              className={`flex-1 max-w-xs px-7 py-3 rounded font-semibold transition-shadow border ${hoverButton === "cancel" ? "bg-gray-300" : "bg-gray-200"} border-gray-400 text-blue-900 text-center`}
            >
              Cancel
            </button>
            <button
              type="submit"
              onMouseEnter={() => setHoverButton("submit")}
              onMouseLeave={() => setHoverButton("")}
              className={`flex-1 max-w-xs px-9.5 py-3 rounded font-semibold transition-shadow text-white ${hoverButton === "submit" ? "bg-blue-700 shadow-lg" : "bg-blue-600 shadow-md"} text-center`}
            >
              Save
            </button>
          </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;

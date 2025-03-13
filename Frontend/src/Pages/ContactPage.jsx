import { PhoneCall, Mail } from "lucide-react"; // Importing icons

const ContactButtons = ({ phoneNumber, email }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-5">
      {/* Contact Now - Redirects to Phone Call */}
      <a
        href={`tel:${phoneNumber}`}
        className="bg-blue-600 text-white py-2 rounded-lg w-full md:w-40 flex items-center justify-center gap-2 hover:bg-blue-700 transition"
      >
        <PhoneCall size={18} /> {/* Call Icon */}
        {phoneNumber}
      </a>

      {/* Send Mail - Redirects to Email */}
      <a
        href={`mailto:${email}`}
        className="border border-blue-600 text-blue-600 py-2 rounded-lg w-full md:w-40 flex items-center justify-center gap-2 hover:bg-blue-100 transition"
      >
        <Mail size={18} /> {/* Mail Icon */}
        {email}
      </a>
    </div>
  );
};

export default ContactButtons;

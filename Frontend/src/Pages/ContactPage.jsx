import { PhoneCall, Mail } from 'lucide-react' // Importing icons

const ContactButtons = ({ phoneNumber, email }) => {
  return (
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-center">
      {/* Contact Now - Redirects to Phone Call */}
      <a
        href={`tel:${phoneNumber}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 sm:w-40 px-3"
      >
        <PhoneCall size={18} /> {/* Call Icon */}
        <span className="truncate">{phoneNumber}</span>
      </a>

      {/* Send Mail - Redirects to Email */}
      <a
        href={`mailto:${email}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 py-3 text-blue-600 transition hover:bg-blue-100 sm:w-40"
      >
        <Mail size={18} /> {/* Mail Icon */}
        <span className="truncate">{email}</span>
      </a>
    </div>
  )
}

export default ContactButtons
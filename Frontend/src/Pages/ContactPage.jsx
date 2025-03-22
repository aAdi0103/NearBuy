import { PhoneCall, Mail } from 'lucide-react' // Importing icons

const ContactButtons = ({ phoneNumber, email }) => {
  return (
    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-center">
      {/* Contact Now - Redirects to Phone Call */}
      <a
  href={`tel:${phoneNumber}`}
  className="flex w-full max-w-[80px] items-center justify-center rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 sm:w-40"
>
  <PhoneCall size={20} /> {/* Call Icon */}
</a>


      {/* Send Mail - Redirects to Email */}
      <a
  href={`mailto:${email}`}
  className="flex w-full max-w-[80px] items-center justify-center rounded-lg border border-blue-600 px-4 py-3 text-blue-600 transition hover:bg-blue-100 sm:w-44 sm:max-w-[80px]"
>
  <Mail size={20} /> {/* Mail Icon */}
</a>


    </div>
  )
}

export default ContactButtons
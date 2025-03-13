import { useState } from "react";

const EditContact = ({  userData, isOwnProfile, onSave}) => {
  const [phoneNumber, setPhoneNumber] = useState(userData?.Phone || "");

  const handleSave = () => {
    onSave({Phone:phoneNumber});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter your phone number"
        className="w-full p-2 border rounded-lg"
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  );
};

export default EditContact;

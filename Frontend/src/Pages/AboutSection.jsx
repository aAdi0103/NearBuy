import { useState } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
  const [about, setAbout] = useState(userData?.About || ""); // Ensuring it handles missing data

  const handleSave = () => {
    if (about.trim()) {
      onSave({ About: about });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">About</h2>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="w-full p-2 border rounded"
        rows="4"
        placeholder="Write something about yourself..."
      />
      <button
        onClick={handleSave}
        className="mt-2 bg-primary bg-blue-600 text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
      >
        Save
      </button>
    </div>
  );
};

export default AboutSection;

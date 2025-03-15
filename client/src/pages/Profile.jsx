import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import avatar from "../assets/avatar.png"; // Ensure correct path for avatar.png

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG).");
      return;
    }
  
    // Validate file size (Example: 2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert("File size should not exceed 2MB.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.readAsDataURL(file);
  
    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error("Image upload failed", error);
      }
    };
  
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
  };

  return (
    <div className="h-screen pt-20 overflow-auto"  >
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Card with a slightly lighter blue background */}
        <div className="rounded-xl p-6 shadow-lg space-y-8" >
          <div className="text-center">
            <h1 className="text-3xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || avatar} // Use avatar import here
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm mt-2">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Profile information */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <input
                type="text"
                value={authUser?.fullname}
                readOnly
                className="px-4 py-2.5 rounded-lg border w-full"
              />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <input
                type="email"
                value={authUser?.email}
                readOnly
                className="px-4 py-2.5 rounded-lg border w-full"
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;

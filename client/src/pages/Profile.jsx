import { useEffect, useState, useCallback} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function Profile() {
  const [resume, setResume] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    college: "",
    branch: "",
    cgpa: "",
  });

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://placement-portal-8sbz.onrender.com/api/user/${user.id}`
      );

      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        college: res.data.college || "",
        branch: res.data.branch || "",
        cgpa: res.data.cgpa || "",
      });
    } catch (error) {
      console.log(error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put(
        `https://placement-portal-8sbz.onrender.com/api/user/update-profile/${user.id}`,
        formData
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  const uploadResume = async () => {
  if (!resume) {
    toast.error("Select a file");
    return;
  }

  try {
    const data = new FormData();

    data.append("resume", resume);
    data.append("userId", user.id);

    const res = await axios.post(
      "https://placement-portal-8sbz.onrender.com/api/user/upload-resume",
      data
    );

    toast.success(res.data.message);

  } catch (error) {
    console.log(error);
    toast.error(
      error.response?.data?.message ||
      "Upload Failed"
    );
  }
};

  return (
    <>
    <Navbar />
    <div className="profile-container">
      <h2>Student Profile</h2>

      <input
        className="profile-input"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        className="profile-input"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        className="profile-input"
        name="college"
        placeholder="College"
        value={formData.college}
        onChange={handleChange}
      />

      <input
        className="profile-input"
        name="branch"
        placeholder="Branch"
        value={formData.branch}
        onChange={handleChange}
      />

      <input
        className="profile-input"
        name="cgpa"
        placeholder="CGPA"
        value={formData.cgpa}
        onChange={handleChange}
      />

      <button
        className="profile-btn-upload"
        onClick={saveProfile}
      >
        Save Profile
      </button>

      <hr />

      <h3>Upload Resume</h3>

      <input
        type="file"
        className="profile-input"
        onChange={(e) =>
          setResume(e.target.files[0])
        }
      />

      <button
        className="profile-btn-upload"
        onClick={uploadResume}
      >
        Upload Resume
      </button>
    </div>
    </>
  );
}

export default Profile;